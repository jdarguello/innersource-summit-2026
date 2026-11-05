# Integrated opening · InnerSource Summit 2026

User correction: preserve Juan David's original HTML format. The opening is
six slides maximum, including the original cover. English throughout. Target
rehearsal duration: eight minutes. Juan David owns the technical explanation.

## Acceptance criteria

- Preserve the original cover, shared CSS, 1280×720 canvas, Nunito typography,
  Summit palette, lockup, footer, transitions, notes and keyboard player.
- Six opening slides: original cover / ABC and mobility / repeated composition /
  proposed InnerSource landing zone / benefits and challenges / GitOps handoff.
- New graphics use the original SVG vocabulary and motion engine: sequenced
  construction, drawn connectors, packets travelling along paths, destination
  emphasis, and reduced-motion final states. No parallel theme or player.
- All original slides from OpenTofu to the closing remain byte for byte unchanged.
  They follow the six-slide opening, so the integrated deck contains 25 slides.
- Scoped styles only under .opening. No changes to the original global tokens.
- Build asserts exact preservation of the original cover/shell and technical
  suffix. Browser checks cover every opening state, geometry, notes, navigation,
  handoff, motion interruption, responsive scale and print visibility.

## Source layout

The repository arrived with only the assembled presentation.html. The original
is kept in presentation-full.html as a source snapshot. tools/build.py inserts
five fragments from deck/opening/ in place of the former introductory slides
02–04. It leaves the cover and technical slides unchanged. Each new fragment
includes English speaker notes. storyboard.json records opening timing.

## Content boundaries

“InnerSource landing zone” is the talk's proposal, not an official pattern.
Benefits are prospective; companies and versions in graphics are illustrative.
GitOps changes desired state and attempts reconciliation; success is observed.
No implementation examples or tool catalog in the opening.

## References

- https://github.com/emilkowalski/skills/blob/main/skills/apple-design/SKILL.md
- https://emilkowal.ski/
- https://slides.0vas.com/abstraccion-o-friccion-f13/#1
- https://github.com/0vas/slides/tree/main/decks/abstraccion-o-friccion-f13
- https://innersourcecommons.org/learn/learning-path/
- https://opengitops.dev/

The first four references inform motion discipline and craft within Juan's
existing design, rather than replacing that design.

## Visual revision · clear ownership and illustrated opening

Acceptance criteria before editing:
- Explicit presenter badges: cover shared, 2–6 Oscar, 7–23 Juan David, 24–25
  shared closing. Distinguish opening position from global slide numbering.
- Preserve Juan's original content and runtime. Enhancements are scoped to
  the opening and a separate presenter label layer.
- Replace diagram boxes with original SVG illustrations: artifact objects,
  people, repeated platform assembly, an exploded platform foundation, a
  collaborative flywheel, and a GitOps control loop.
- Add finite, meaningful object movement triggered by the existing steps.
  Animations cancel on navigation, replay correctly, pause on black screen or
  hidden tab, and collapse to complete static objects with reduced motion.
- No perpetual decorative movement. Keep the six-slide/eight-minute opening,
  English notes, and all technical slide content intact.
- Verify labels, all opening states, text bounds/overlap, handoff, actual object
  animation, reduced motion, reverse navigation and representative screenshots.

## Expanded eight-minute opening

The user explicitly authorized more slides to explain the problem and context.
Acceptance criteria before this revision:
- Ten scenes including the shared cover, exactly 480 seconds of rehearsal time.
- Separate ABC, mobility, holding context, repeated assembly, larger-unit pivot,
  landing zone, local autonomy, value/governance and GitOps into clear beats.
- Add stateful explanatory motion: a person crosses teams, repeated assemblies
  diverge, small artifacts compose into a larger unit, a company's local layer
  changes while the shared base stays pinned, and desired/actual state converge.
- Every state transition is finite, reversible, replayable and reduced-motion
  safe; no decorative loops. Preserve Juan's design and technical content.
- Generate presenter ranges and handoff links from opening length so ownership
  stays correct when the number of introductory slides changes.
- Verify all steps, actual moving objects, convergence and rollback, reduced
  motion, pause, responsive layout and exact technical-content preservation.

Current authoritative scope: 10 opening slides, eight minutes, with Oscar on
2–10; Juan David starts on 11 and closes his technical block on 27; 28–29 are
shared closing slides. Earlier six-slide constraints above record the prior
revision and are superseded by the user's explicit permission to add scenes.
Durations: 0:20 / 0:45 / 0:35 / 0:45 / 0:55 / 0:30 / 1:00 / 0:55 / 1:00 / 1:15.

## Final polish: organic motion, requested by the user

This request supersedes the earlier finite-only motion constraint. Add restrained,
meaningful ambient loops only within Oscar's opening: floating artifact/layer
objects, contribution flow and the GitOps reconciliation rotor. No animated
full-slide background. Keep typography, colors, timing, content and Juan's
technical slides intact. Every loop must stop or pause off-slide, when unrevealed,
on black screen, hidden tab, print or reduced motion. Verify loop lifecycle,
replay, pause/resume, geometry, presentation preservation and visual screenshots.

## Context engineering alignment

User requests a slide connecting the strategy with more dynamic context.
Acceptance criteria before editing:
- Add one explicitly proposed agentic extension before the GitOps handoff.
- Explain versioned shared knowledge + task/identity + fresh runtime signals →
  selectively assembled context for an agent's current step.
- Do not equate GitOps with context engineering or imply Git automatically
  retrieves current state. Authorization is enforced by tools/services.
- Animate selective assembly and replacement of a stale status with a newer,
  timestamped tool result; label the example and proposal clearly.
- Keep the original Summit design, English slides/notes, and eight minutes total
  by rebalancing introductory timing. Update ranges and tests dynamically.
- Verify source-to-context steps, runtime status replacement, reverse/replay,
  layout, loop lifecycle, handoff and exact preservation of Juan's content.

Primary source: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
Secondary primary source: https://www.langchain.com/blog/context-engineering-for-agents
The mapping from this platform proposal to context engineering is our design
inference; neither source claims this specific architecture is implemented.

Current scope after adding context engineering: 11 opening scenes / 8:00.
Slide 10 is the proposed context engineering extension, slide 11 the GitOps
handoff. Juan David starts on 12, continues through 28, with shared closing on
29–30. The current durations in storyboard.json supersede prior revision notes.
Validation includes stale/fresh context replacement and reverse navigation.

## Context slide redesign after visual feedback

Replace the dense funnel/UI composition with a single dark Summit scene:
versioned foundation → a prominent, assembled context object → agent. Use larger
labels, a clear reading direction and a distinct live-observation input. The
context object changes from progressing to healthy through the existing step
controls; the new observation replaces the older one. Keep the proposal label,
45-second timing, source notes and authorization distinction. Verify all four
states, status replacement/reverse, reduced motion, object/loop lifecycle and
visual geometry; inspect the final state at presentation size.

## Context engineering: visible capabilities and effects

User requests several dynamic elements showing what the strategy enables.
Acceptance criteria before editing:
- Keep the context slide (10), current Summit identity and 45-second timing.
- Add multiple semantic moving objects: incoming knowledge packets, fresh
  observations, and selected context delivered to the agent.
- Show concrete illustrative effects: reuse an approved template, scoped tool
  access enforced by tools, and a changed next action when rollout state changes.
- Build effects in the existing three steps; keep text readable and routes out
  of labels. No autonomous deployment or claim of guaranteed agent behavior.
- Update the next-action illustration from “Wait for rollout” to “Verify health”
  with the fresh observation. Both status and action reverse/replay correctly.
- Validate all states, loop pause/reduced/off-slide behavior, and the explicit
  status-to-next-action relation. Preserve eight minutes and Juan's content.
