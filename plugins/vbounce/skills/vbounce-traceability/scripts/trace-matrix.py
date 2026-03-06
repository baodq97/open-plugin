#!/usr/bin/env python3
"""
V-Bounce Traceability Matrix Generator/Updater

Generates or updates a traceability matrix from V-Bounce YAML artifacts.
Detects orphans and calculates coverage.

Usage:
    uv run trace-matrix.py init --requirements <req.yaml>
    uv run trace-matrix.py update --matrix <matrix.yaml> --phase design --artifacts <design.yaml>
    uv run trace-matrix.py validate --matrix <matrix.yaml>
    uv run trace-matrix.py impact --matrix <matrix.yaml> --changed REQ-001,REQ-003
"""
# /// script
# requires-python = ">=3.11"
# dependencies = ["pyyaml>=6.0"]
# ///

import argparse
import sys
from datetime import datetime, timezone
from pathlib import Path

import yaml


def load_yaml(path: str) -> dict:
    with open(path) as f:
        return yaml.safe_load(f) or {}


def save_yaml(data: dict, path: str) -> None:
    with open(path, "w") as f:
        yaml.dump(data, f, default_flow_style=False, sort_keys=False, allow_unicode=True)


def init_matrix(requirements: dict) -> dict:
    """Initialize traceability matrix from requirements output."""
    entries = []
    stories = requirements.get("user_stories", [])
    traceability = requirements.get("traceability", [])

    trace_map = {t["requirement"]: t for t in traceability} if traceability else {}

    for story in stories:
        story_id = story.get("id", "US-???")
        acs = story.get("acceptance_criteria", [])
        ac_entries = []
        for ac in acs:
            ac_entries.append({
                "ac_id": ac.get("id", "AC-???"),
                "description": f"GIVEN {ac.get('given', '?')} WHEN {ac.get('when', '?')} THEN {ac.get('then', '?')}",
                "components": [],
                "api_endpoints": [],
                "data_entities": [],
                "source_files": [],
                "migrations": [],
                "tests": [],
            })

        req_id = None
        for req, info in trace_map.items():
            if story_id in info.get("stories", []):
                req_id = req
                break

        entries.append({
            "requirement_id": req_id or "REQ-???",
            "title": f"{story.get('as_a', '?')} wants {story.get('i_want', '?')}",
            "stories": [{
                "story_id": story_id,
                "title": story.get("i_want", ""),
                "acceptance_criteria": ac_entries,
            }],
        })

    return {
        "traceability_matrix": {
            "meta": {
                "matrix_id": f"TM-{datetime.now(timezone.utc).strftime('%Y%m%d')}",
                "last_updated": datetime.now(timezone.utc).isoformat(),
                "last_phase": "requirements",
            },
            "entries": entries,
            "orphans": detect_orphans(entries, "requirements"),
            "coverage": calculate_coverage(entries),
        }
    }


def detect_orphans(entries: list, phase: str) -> dict:
    """Detect orphaned artifacts in the matrix."""
    orphans = {
        "requirements_without_tests": [],
        "tests_without_requirements": [],
        "components_without_requirements": [],
        "requirements_without_components": [],
        "acceptance_criteria_without_tests": [],
    }

    for entry in entries:
        req_id = entry.get("requirement_id", "?")
        has_any_test = False
        has_any_component = False

        for story in entry.get("stories", []):
            for ac in story.get("acceptance_criteria", []):
                if not ac.get("tests"):
                    orphans["acceptance_criteria_without_tests"].append(ac.get("ac_id", "?"))
                else:
                    has_any_test = True
                if ac.get("components"):
                    has_any_component = True

        if not has_any_test:
            orphans["requirements_without_tests"].append(req_id)
        if phase in ("design", "implementation", "testing") and not has_any_component:
            orphans["requirements_without_components"].append(req_id)

    return orphans


def calculate_coverage(entries: list) -> dict:
    """Calculate coverage percentages."""
    total_ac = 0
    covered_ac = 0
    total_stories = 0
    covered_stories = 0

    for entry in entries:
        for story in entry.get("stories", []):
            total_stories += 1
            story_covered = False
            for ac in story.get("acceptance_criteria", []):
                total_ac += 1
                if ac.get("tests"):
                    covered_ac += 1
                    story_covered = True
            if story_covered:
                covered_stories += 1

    total_req = len(entries)
    covered_req = sum(
        1 for e in entries
        if any(
            ac.get("tests")
            for s in e.get("stories", [])
            for ac in s.get("acceptance_criteria", [])
        )
    )

    def pct(n, d):
        return f"{n}/{d} ({round(n / d * 100)}%)" if d > 0 else "0/0 (0%)"

    return {
        "requirements_covered": pct(covered_req, total_req),
        "stories_covered": pct(covered_stories, total_stories),
        "ac_covered": pct(covered_ac, total_ac),
        "target": "100% AC coverage",
    }


def validate_matrix(matrix: dict) -> list[str]:
    """Validate matrix and return list of issues."""
    issues = []
    entries = matrix.get("traceability_matrix", {}).get("entries", [])
    orphans = detect_orphans(entries, matrix.get("traceability_matrix", {}).get("meta", {}).get("last_phase", ""))

    for orphan_type, items in orphans.items():
        for item in items:
            issues.append(f"ORPHAN: {orphan_type} — {item}")

    return issues


def impact_analysis(matrix: dict, changed_reqs: list[str]) -> dict:
    """Analyze impact of requirement changes."""
    entries = matrix.get("traceability_matrix", {}).get("entries", [])
    affected = {
        "stories": [], "acceptance_criteria": [], "components": [],
        "api_endpoints": [], "source_files": [], "tests": [], "migrations": [],
    }

    for entry in entries:
        if entry.get("requirement_id") in changed_reqs:
            for story in entry.get("stories", []):
                affected["stories"].append(story.get("story_id"))
                for ac in story.get("acceptance_criteria", []):
                    affected["acceptance_criteria"].append(ac.get("ac_id"))
                    affected["components"].extend(ac.get("components", []))
                    affected["api_endpoints"].extend(ac.get("api_endpoints", []))
                    affected["source_files"].extend(ac.get("source_files", []))
                    affected["tests"].extend([t.get("test_id") for t in ac.get("tests", [])])
                    affected["migrations"].extend(ac.get("migrations", []))

    return {
        "impact_analysis": {
            "changed_requirements": changed_reqs,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "affected_artifacts": affected,
        }
    }


def main():
    parser = argparse.ArgumentParser(description="V-Bounce Traceability Matrix Tool")
    sub = parser.add_subparsers(dest="command")

    init_p = sub.add_parser("init", help="Initialize matrix from requirements")
    init_p.add_argument("--requirements", required=True, help="Path to requirements YAML")
    init_p.add_argument("--output", default="traceability.yaml", help="Output path")

    validate_p = sub.add_parser("validate", help="Validate matrix")
    validate_p.add_argument("--matrix", required=True, help="Path to matrix YAML")

    impact_p = sub.add_parser("impact", help="Impact analysis")
    impact_p.add_argument("--matrix", required=True, help="Path to matrix YAML")
    impact_p.add_argument("--changed", required=True, help="Comma-separated REQ IDs")

    args = parser.parse_args()

    if args.command == "init":
        req = load_yaml(args.requirements)
        matrix = init_matrix(req)
        save_yaml(matrix, args.output)
        print(f"Matrix initialized → {args.output}")

    elif args.command == "validate":
        matrix = load_yaml(args.matrix)
        issues = validate_matrix(matrix)
        if issues:
            print(f"Found {len(issues)} issues:")
            for issue in issues:
                print(f"  - {issue}")
            sys.exit(1)
        else:
            print("Matrix is valid — no orphans detected.")

    elif args.command == "impact":
        matrix = load_yaml(args.matrix)
        changed = [r.strip() for r in args.changed.split(",")]
        result = impact_analysis(matrix, changed)
        print(yaml.dump(result, default_flow_style=False))

    else:
        parser.print_help()


if __name__ == "__main__":
    main()
