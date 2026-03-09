# Ideation Techniques

## Techniques for Solution Generation

### 1. Brainstorm Burst
- Present each HMW question to the user
- Generate 3-5 solution ideas per HMW
- No evaluation during generation — quantity over quality
- Build on user's ideas with "Yes, and..." responses

### 2. Analogous Inspiration
- "How does {unrelated industry} solve a similar problem?"
- Map the analogy back to the user's domain
- Example: "How does Uber solve the 'matching supply to demand' problem? Can we apply that to task assignment?"

### 3. Worst Possible Idea
- "What's the worst solution we could build?"
- Invert it to find the opposite (good) solution
- Reveals assumptions and hidden constraints

### 4. Constraint Removal
- "If we had unlimited budget/time/technology, what would we build?"
- Then: "Which parts of that are feasible now?"
- Separates vision from constraints

### 5. User Journey Redesign
- Walk through the current journey step by step
- At each step: "What if we eliminated this step?" / "What if this step took 0 seconds?"
- Identify which steps add value vs. which are overhead

## Evaluation Criteria

When scoring solution concepts (SC-NNN), use these dimensions:

| Criterion | Weight | Scale | Description |
|-----------|--------|-------|-------------|
| Impact | 30% | 1-5 | How much does it solve the core problem? |
| Feasibility | 25% | 1-5 | Can it be built with available resources? |
| User Value | 20% | 1-5 | How much do users want this? |
| Effort | 15% | 1-5 (inverse) | How much effort to implement? (5 = low effort) |
| Risk | 10% | 1-5 (inverse) | How risky? (5 = low risk) |

**Weighted Score** = (Impact × 0.3) + (Feasibility × 0.25) + (User Value × 0.2) + (Effort × 0.15) + (Risk × 0.1)

## Direction Selection

After scoring all concepts:
1. Rank by weighted score
2. Top concept becomes the **selected direction** (unless user overrides)
3. Document rationale: why this direction over alternatives
4. Link direction back to design principles (DP-NNN) for consistency check
