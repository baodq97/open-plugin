# Conversation Guides

Structured conversation frameworks for each Design Thinking phase.

## Empathize Phase — Deep Structured Interview (5 Rounds)

### Round 1: Context & Users (2-3 turns)
**Goal**: Understand who the users are and their environment.

Opening prompt:
> "Tell me about the people who will use this product/solution. Who are they? What are their roles, backgrounds, and technical abilities? What environment do they work in?"

Follow-up probes:
- "How many distinct types of users are there?"
- "Which users are most affected by the problem?"
- "What's their technical comfort level?"
- "Who else is involved — managers, admins, external stakeholders?"

**Log to conversation-log.md**: User type descriptions, demographics, environment details.

### Round 2: Current Workflow (2-3 turns)
**Goal**: Map how users work today, step by step.

Opening prompt:
> "Walk me through how [users] handle [problem area] today, step by step. What tools do they use? Where do handoffs happen?"

Follow-up probes:
- "What happens between step X and step Y?"
- "How long does each step take?"
- "Who is responsible for each step?"
- "What tools/systems are involved?"
- "Where does information get lost or duplicated?"

**Log**: Step-by-step workflow, tools, handoff points, time per step.

### Round 3: Pain Points Deep-Dive (3-4 turns)
**Goal**: For each workflow step, identify what hurts and quantify impact.

Opening prompt:
> "Looking at this workflow, which steps are the most painful or frustrating? For each, tell me: what goes wrong, how often, and what's the impact?"

Follow-up probes:
- "Why does that happen? What's the root cause?"
- "How often does this occur — daily, weekly, monthly?"
- "What's the impact in terms of time, money, or frustration?"
- "Can you give me a specific recent example?"
- "On a scale of 1-10, how severe is this?"

**Log**: Pain points with severity (1-10), frequency, quantified impact.

### Round 4: Emotions & Workarounds (2-3 turns)
**Goal**: Understand emotional responses and existing coping mechanisms.

Opening prompt:
> "How do [users] feel about [pain points mentioned]? What workarounds or hacks have they developed? What solutions have been tried before?"

Follow-up probes:
- "What do they say about it vs. what do they actually do?"
- "Have they tried any tools/processes to fix this? What happened?"
- "What's the emotional tone — frustration, resignation, anger, apathy?"
- "Are there any workarounds that actually work well?"

**Log**: Emotional responses, workarounds, failed solutions, what works.

### Round 5: Priorities & Vision (2-3 turns)
**Goal**: Understand what matters most and the ideal future state.

Opening prompt:
> "If you had a magic wand and could fix one thing about this entire workflow, what would it be? What does 'success' look like for these users?"

Follow-up probes:
- "What's the single most important improvement?"
- "Are there any constraints we should know about — budget, timeline, technology?"
- "What would make stakeholders/management happy?"
- "What's the minimum viable improvement that would make a real difference?"

**Log**: Priorities, vision, constraints, success definition.

### Orchestrator Behavior During Empathize
- Log every user response to `conversation-log.md` with round labels
- Count conversation turns — enforce minimum 10 turns across all rounds
- Follow unexpected threads: if user reveals a pain point during Round 1, probe it immediately, then return to the round structure
- Use "why?" liberally — 5 Whys technique to reach root causes
- Summarize what you've heard back to the user at the end of each round

## Define Phase — AI-Present, User-React (2-3 turns)

### Turn 1: Present Synthesis
**Goal**: Show the user what you've learned and propose problem framing.

Prompt:
> "Based on our conversation, here's what I've found:
>
> **Key Personas**: [list personas with 1-line summaries]
> **Top Pain Points**: [list top 3-5 PPs with severity]
> **Core Insight**: [1-2 sentence synthesis]
>
> I'd frame the core problem as:
> **[Persona] needs [need] because [insight]**
>
> Does this capture the real issue? What would you adjust?"

### Turn 2: Refine & Expand
**Goal**: Validate/correct POV, present HMW questions.

Prompt:
> "Here are How-Might-We questions to open up the solution space:
> [HMW-001 through HMW-NNN]
>
> Which of these resonate most? Any we should add or remove?"

### Turn 3 (optional): Design Principles
> "Based on everything, I propose these design principles to guide our solution:
> [DP-001 through DP-NNN]
>
> Do these reflect your priorities?"

**Log**: User corrections, additions, and confirmations.

## Ideate Phase — AI-Present, User-React (2-3 turns)

### Turn 1: Present Problem + Initial Ideas
**Goal**: Ground in problem statement, generate solution ideas together.

Prompt:
> "Our core problem: [POV-001]
> Our top HMW questions: [top 3 HMWs]
>
> Here are some solution concepts I've brainstormed:
> [SC-001 through SC-NNN with brief descriptions]
>
> What ideas do you have? What do you think of these?"

### Turn 2: Evaluate Together
**Goal**: Score and compare solutions.

Prompt:
> "Let's evaluate these solutions. For each, I'll score on Impact, Feasibility, User Value, Effort, and Risk:
> [Evaluation matrix]
>
> Do you agree with these assessments? Would you change any scores?"

### Turn 3: Select Direction
**Goal**: Confirm the chosen direction.

Prompt:
> "Based on our evaluation, I recommend: [top-scored concept]
> Rationale: [why it scored highest, alignment with design principles]
>
> Shall we proceed with this direction?"

**Log**: User's ideas, score adjustments, direction confirmation.

## Prototype Phase — Brief Constraints Input (1-2 turns)

### Turn 1: Constraints Interview
**Goal**: Gather technical and business constraints before feature specification.

Prompt:
> "Before I detail the features, I need to understand your constraints:
> 1. **Technical**: What tech stack, existing systems, or platforms must we integrate with?
> 2. **Timeline**: When does this need to ship?
> 3. **Budget/Team**: What resources are available?
> 4. **Deployment**: Where will this run? (cloud, on-prem, mobile, etc.)
> 5. **Compliance**: Any regulatory or security requirements?"

**Log**: Constraints for each category.

## PRD Phase — No Conversation

The PRD phase is pure compilation. The orchestrator dispatches the prd-compiler agent directly with all previous artifacts. No user conversation needed before synthesis.
