"use strict";

/**
 * Render graph data as a self-contained HTML file with force-directed SVG.
 * Zero external dependencies — all JS is inlined.
 * @param {{ nodes: Object[], edges: Object[], domains: string[], stats: Object, colors: Object, edgeStyles: Object }} graph
 * @returns {string} Complete HTML document
 */
function renderHtml(graph) {
  const data = JSON.stringify({
    nodes: graph.nodes,
    edges: graph.edges,
    domains: graph.domains,
    stats: graph.stats,
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Skills Ontology Graph</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #e2e8f0; overflow: hidden; }
  #toolbar { position: fixed; top: 0; left: 0; right: 0; height: 48px; background: #1e293b; display: flex; align-items: center; padding: 0 16px; gap: 12px; z-index: 10; border-bottom: 1px solid #334155; }
  #toolbar h1 { font-size: 14px; font-weight: 600; color: #f8fafc; }
  #toolbar .stat { font-size: 12px; color: #94a3b8; }
  #toolbar .sep { width: 1px; height: 24px; background: #334155; }
  .btn { background: #334155; border: 1px solid #475569; color: #e2e8f0; padding: 4px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; }
  .btn:hover { background: #475569; }
  .btn.active { background: #3b82f6; border-color: #3b82f6; }
  #legend { position: fixed; bottom: 16px; left: 16px; background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 12px; font-size: 11px; z-index: 10; }
  #legend .item { display: flex; align-items: center; gap: 6px; margin: 3px 0; }
  #legend .dot { width: 10px; height: 10px; border-radius: 50%; }
  #legend .line { width: 20px; height: 0; border-top: 2px; }
  #detail { position: fixed; top: 48px; right: 0; width: 280px; background: #1e293b; border-left: 1px solid #334155; height: calc(100vh - 48px); padding: 16px; overflow-y: auto; z-index: 10; display: none; font-size: 13px; }
  #detail h2 { font-size: 16px; margin-bottom: 8px; color: #f8fafc; }
  #detail .field { margin: 6px 0; }
  #detail .label { color: #94a3b8; font-size: 11px; text-transform: uppercase; }
  #detail .value { color: #e2e8f0; }
  #detail .edge-item { padding: 4px 0; border-bottom: 1px solid #334155; }
  #detail .close { position: absolute; top: 12px; right: 12px; cursor: pointer; color: #94a3b8; }
  svg { position: fixed; top: 48px; left: 0; right: 0; bottom: 0; }
  .node-label { font-size: 10px; fill: #cbd5e1; pointer-events: none; text-anchor: middle; dominant-baseline: central; }
  .edge-label { font-size: 9px; fill: #64748b; pointer-events: none; text-anchor: middle; }
</style>
</head>
<body>
<div id="toolbar">
  <h1>Skills Ontology</h1>
  <div class="sep"></div>
  <span class="stat" id="stat-nodes"></span>
  <span class="stat" id="stat-edges"></span>
  <span class="stat" id="stat-domains"></span>
  <div class="sep"></div>
  <button class="btn" id="btn-reset" title="Reset zoom">Reset</button>
  <button class="btn" id="btn-save" title="Save as SVG">Save SVG</button>
</div>
<svg id="graph"></svg>
<div id="legend"></div>
<div id="detail">
  <span class="close" id="detail-close">&#x2715;</span>
  <div id="detail-content"></div>
</div>

<script>
(function() {
  "use strict";
  const DATA = ${data};
  const COLORS = ${JSON.stringify(graph.colors)};
  const EDGE_STYLES = ${JSON.stringify(graph.edgeStyles)};

  const svg = document.getElementById("graph");
  const ns = "http://www.w3.org/2000/svg";
  const W = window.innerWidth;
  const H = window.innerHeight - 48;

  // Stats
  document.getElementById("stat-nodes").textContent = DATA.stats.nodeCount + " skills";
  document.getElementById("stat-edges").textContent = DATA.stats.edgeCount + " edges";
  document.getElementById("stat-domains").textContent = DATA.stats.domainCount + " domains";

  // Legend
  const legend = document.getElementById("legend");
  let legendHtml = "<strong>Domains</strong>";
  for (const d of DATA.domains) {
    const c = (COLORS[d] || COLORS.general).hex;
    legendHtml += '<div class="item"><span class="dot" style="background:' + c + '"></span>' + d + "</div>";
  }
  legendHtml += "<br><strong>Edges</strong>";
  legendHtml += '<div class="item"><span style="display:inline-block;width:20px;border-top:2px solid #94a3b8"></span> prerequisite</div>';
  legendHtml += '<div class="item"><span style="display:inline-block;width:20px;border-top:2px dashed #94a3b8"></span> complementary</div>';
  legendHtml += '<div class="item"><span style="display:inline-block;width:20px;border-top:2px dotted #94a3b8"></span> other</div>';
  legend.innerHTML = legendHtml;

  // Initialize node positions — cluster by domain
  const domainCenters = {};
  const domainCount = DATA.domains.length || 1;
  DATA.domains.forEach(function(d, i) {
    const angle = (2 * Math.PI * i) / domainCount;
    domainCenters[d] = { x: W / 2 + Math.cos(angle) * Math.min(W, H) * 0.25, y: H / 2 + Math.sin(angle) * Math.min(W, H) * 0.25 };
  });

  const nodes = DATA.nodes.map(function(n) {
    const center = domainCenters[n.domain] || { x: W / 2, y: H / 2 };
    return Object.assign({}, n, {
      x: center.x + (Math.random() - 0.5) * 100,
      y: center.y + (Math.random() - 0.5) * 100,
      vx: 0, vy: 0,
    });
  });

  const nodeMap = {};
  nodes.forEach(function(n) { nodeMap[n.id] = n; });

  const edges = DATA.edges.filter(function(e) { return nodeMap[e.from] && nodeMap[e.to]; });

  // SVG groups
  svg.setAttribute("width", W);
  svg.setAttribute("height", H);

  var gEdges = document.createElementNS(ns, "g");
  var gNodes = document.createElementNS(ns, "g");
  var gLabels = document.createElementNS(ns, "g");
  svg.appendChild(gEdges);
  svg.appendChild(gNodes);
  svg.appendChild(gLabels);

  // Create edge elements
  var edgeEls = edges.map(function(e) {
    var line = document.createElementNS(ns, "line");
    var strokeWidth = Math.max(1, e.strength / 30);
    line.setAttribute("stroke", "#475569");
    line.setAttribute("stroke-width", strokeWidth);
    if (e.type === "complementary") line.setAttribute("stroke-dasharray", "5,5");
    else if (e.type !== "prerequisite") line.setAttribute("stroke-dasharray", "2,4");
    line.setAttribute("stroke-opacity", Math.max(0.2, e.strength / 100));
    gEdges.appendChild(line);
    return line;
  });

  // Create node elements
  var nodeEls = nodes.map(function(n) {
    var circle = document.createElementNS(ns, "circle");
    circle.setAttribute("r", n.radius);
    circle.setAttribute("fill", n.color);
    circle.setAttribute("stroke", "#1e293b");
    circle.setAttribute("stroke-width", 2);
    circle.setAttribute("cursor", "pointer");
    circle.setAttribute("data-id", n.id);
    gNodes.appendChild(circle);
    return circle;
  });

  // Create labels
  var labelEls = nodes.map(function(n) {
    var text = document.createElementNS(ns, "text");
    text.setAttribute("class", "node-label");
    text.setAttribute("dy", n.radius + 14);
    var name = n.id.length > 20 ? n.id.slice(0, 17) + "..." : n.id;
    text.textContent = name;
    gLabels.appendChild(text);
    return text;
  });

  // Pan and zoom
  var transform = { x: 0, y: 0, k: 1 };
  var isPanning = false;
  var panStart = { x: 0, y: 0 };

  svg.addEventListener("wheel", function(ev) {
    ev.preventDefault();
    var factor = ev.deltaY > 0 ? 0.9 : 1.1;
    var rect = svg.getBoundingClientRect();
    var mx = ev.clientX - rect.left;
    var my = ev.clientY - rect.top;
    transform.x = mx - (mx - transform.x) * factor;
    transform.y = my - (my - transform.y) * factor;
    transform.k *= factor;
    applyTransform();
  });

  svg.addEventListener("mousedown", function(ev) {
    if (ev.target.tagName === "circle") return;
    isPanning = true;
    panStart = { x: ev.clientX - transform.x, y: ev.clientY - transform.y };
  });

  window.addEventListener("mousemove", function(ev) {
    if (isPanning) {
      transform.x = ev.clientX - panStart.x;
      transform.y = ev.clientY - panStart.y;
      applyTransform();
    }
    if (dragNode) {
      var x = (ev.clientX - svg.getBoundingClientRect().left - transform.x) / transform.k;
      var y = (ev.clientY - svg.getBoundingClientRect().top - transform.y) / transform.k;
      dragNode.x = x;
      dragNode.y = y;
      dragNode.vx = 0;
      dragNode.vy = 0;
    }
  });

  window.addEventListener("mouseup", function() {
    isPanning = false;
    dragNode = null;
  });

  function applyTransform() {
    var g = [gEdges, gNodes, gLabels];
    for (var i = 0; i < g.length; i++) {
      g[i].setAttribute("transform", "translate(" + transform.x + "," + transform.y + ") scale(" + transform.k + ")");
    }
  }

  // Node drag
  var dragNode = null;
  gNodes.addEventListener("mousedown", function(ev) {
    if (ev.target.tagName === "circle") {
      ev.stopPropagation();
      var id = ev.target.getAttribute("data-id");
      dragNode = nodeMap[id];
    }
  });

  // Node click — show detail
  gNodes.addEventListener("click", function(ev) {
    if (ev.target.tagName === "circle") {
      var id = ev.target.getAttribute("data-id");
      showDetail(nodeMap[id]);
    }
  });

  // Detail panel
  var detailEl = document.getElementById("detail");
  var detailContent = document.getElementById("detail-content");
  document.getElementById("detail-close").addEventListener("click", function() {
    detailEl.style.display = "none";
    // Unhighlight
    nodeEls.forEach(function(el) { el.setAttribute("opacity", 1); });
    edgeEls.forEach(function(el) { el.setAttribute("stroke", "#475569"); });
  });

  function showDetail(node) {
    var connEdges = edges.filter(function(e) { return e.from === node.id || e.to === node.id; });
    var html = "<h2>" + node.id + "</h2>";
    html += '<div class="field"><span class="label">Domain</span><br><span class="value">' + node.domain + "</span></div>";
    html += '<div class="field"><span class="label">Phase</span><br><span class="value">' + node.phase + "</span></div>";
    html += '<div class="field"><span class="label">Version</span><br><span class="value">' + node.version + "</span></div>";
    html += '<div class="field"><span class="label">Token Estimate</span><br><span class="value">' + node.tokenEstimate + "</span></div>";
    html += '<div class="field"><span class="label">Connections (' + connEdges.length + ")</span></div>";
    for (var i = 0; i < connEdges.length; i++) {
      var e = connEdges[i];
      var other = e.from === node.id ? e.to : e.from;
      var dir = e.from === node.id ? "→" : "←";
      html += '<div class="edge-item">' + dir + " " + other + '<br><span class="label">' + e.type + " (strength: " + e.strength + ")</span>";
      if (e.note) html += '<br><span class="label">' + e.note + "</span>";
      html += "</div>";
    }
    detailContent.innerHTML = html;
    detailEl.style.display = "block";

    // Highlight connected nodes
    var connected = new Set();
    connected.add(node.id);
    connEdges.forEach(function(e) { connected.add(e.from); connected.add(e.to); });

    nodeEls.forEach(function(el, idx) {
      el.setAttribute("opacity", connected.has(nodes[idx].id) ? 1 : 0.15);
    });
    edgeEls.forEach(function(el, idx) {
      var e = edges[idx];
      if (e.from === node.id || e.to === node.id) {
        el.setAttribute("stroke", node.color);
        el.setAttribute("stroke-opacity", 1);
      } else {
        el.setAttribute("stroke", "#475569");
        el.setAttribute("stroke-opacity", 0.05);
      }
    });
  }

  // Force simulation
  var alpha = 1;
  var alphaDecay = 0.005;
  var repulsionStrength = 800;
  var attractionStrength = 0.005;
  var centerStrength = 0.01;
  var domainGravity = 0.03;

  function tick() {
    if (alpha < 0.001) { requestAnimationFrame(tick); render(); return; }
    alpha *= (1 - alphaDecay);

    // Repulsion between all nodes
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var dx = nodes[j].x - nodes[i].x;
        var dy = nodes[j].y - nodes[i].y;
        var dist = Math.sqrt(dx * dx + dy * dy) || 1;
        var force = repulsionStrength * alpha / (dist * dist);
        var fx = dx / dist * force;
        var fy = dy / dist * force;
        nodes[i].vx -= fx;
        nodes[i].vy -= fy;
        nodes[j].vx += fx;
        nodes[j].vy += fy;
      }
    }

    // Attraction along edges
    for (var i = 0; i < edges.length; i++) {
      var e = edges[i];
      var source = nodeMap[e.from];
      var target = nodeMap[e.to];
      if (!source || !target) continue;
      var dx = target.x - source.x;
      var dy = target.y - source.y;
      var dist = Math.sqrt(dx * dx + dy * dy) || 1;
      var idealDist = 150 - (e.strength || 50);
      var force = (dist - idealDist) * attractionStrength * alpha;
      var fx = dx / dist * force;
      var fy = dy / dist * force;
      source.vx += fx;
      source.vy += fy;
      target.vx -= fx;
      target.vy -= fy;
    }

    // Domain clustering gravity
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var center = domainCenters[n.domain];
      if (center) {
        n.vx += (center.x - n.x) * domainGravity * alpha;
        n.vy += (center.y - n.y) * domainGravity * alpha;
      }
    }

    // Center gravity
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].vx += (W / 2 - nodes[i].x) * centerStrength * alpha;
      nodes[i].vy += (H / 2 - nodes[i].y) * centerStrength * alpha;
    }

    // Apply velocity with damping
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i] === dragNode) continue;
      nodes[i].vx *= 0.6;
      nodes[i].vy *= 0.6;
      nodes[i].x += nodes[i].vx;
      nodes[i].y += nodes[i].vy;
    }

    render();
    requestAnimationFrame(tick);
  }

  function render() {
    for (var i = 0; i < edges.length; i++) {
      var e = edges[i];
      var s = nodeMap[e.from];
      var t = nodeMap[e.to];
      if (!s || !t) continue;
      edgeEls[i].setAttribute("x1", s.x);
      edgeEls[i].setAttribute("y1", s.y);
      edgeEls[i].setAttribute("x2", t.x);
      edgeEls[i].setAttribute("y2", t.y);
    }
    for (var i = 0; i < nodes.length; i++) {
      nodeEls[i].setAttribute("cx", nodes[i].x);
      nodeEls[i].setAttribute("cy", nodes[i].y);
      labelEls[i].setAttribute("x", nodes[i].x);
      labelEls[i].setAttribute("y", nodes[i].y);
    }
  }

  // Reset button
  document.getElementById("btn-reset").addEventListener("click", function() {
    transform = { x: 0, y: 0, k: 1 };
    applyTransform();
    alpha = 1; // re-simulate
  });

  // Save SVG
  document.getElementById("btn-save").addEventListener("click", function() {
    var clone = svg.cloneNode(true);
    clone.setAttribute("xmlns", ns);
    clone.setAttribute("style", "background:#0f172a");
    var blob = new Blob(['<?xml version="1.0"?>' + clone.outerHTML], { type: "image/svg+xml" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "skills-ontology-graph.svg";
    a.click();
    URL.revokeObjectURL(url);
  });

  // Window resize
  window.addEventListener("resize", function() {
    svg.setAttribute("width", window.innerWidth);
    svg.setAttribute("height", window.innerHeight - 48);
  });

  tick();
})();
</script>
</body>
</html>`;
}

module.exports = { renderHtml };
