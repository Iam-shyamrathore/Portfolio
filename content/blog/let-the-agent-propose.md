---
title: "Why I made architecture edits rejectable"
description: "In Previo, a convincing AI proposal still has to pass scope, revision, graph, and rollback checks."
date: "2026-10-18"
category: "Agents"
draft: false
---
An agent proposes removing a database from an architecture. The sentence sounds sensible. The board still has connections attached to it—and someone has edited the board since the proposal was generated.

In Previo, I built a typed patch engine to handle that boundary. The agent describes an intended change. The operation engine decides whether that change can apply to this version of this board.

## Reject stale intent before touching state

Every patch identifies its workspace, board, scenario, and base revision. The engine checks those before applying operations. It also validates identifiers, connection endpoints, and graph invariants.

I chose to reject a stale revision rather than quietly rebase it. Rejection costs another interaction, but an automatic repair could change what the original proposal meant.

Accepted operations apply to cloned state and produce a new revision. An invalid request should leave the current board intact.

## Deletion needs an explicit answer about connections

A connected component cannot simply disappear. The engine requires explicit cascade removal before deleting it.

That is a useful example of a rule I keep outside the model. The model can explain why a component should go; the domain layer must account for every edge that will go with it.

## Undo is another operation to validate

I added inverse patches for accepted edits. Removing a component records enough information to restore its objects, connections, and visual bindings.

The tests check those structures after restoration. The revision keeps moving forward: undo restores the content, not an old revision number. That distinction keeps later stale-edit checks meaningful.

A small review sequence falls out of the design:

```text
Propose → Check scope and revision → Validate graph
        → Apply a new revision → Retain its inverse
```

This is more work than asking an LLM for a replacement board. It gives the interface something concrete to preview, reject, accept, and reverse.

I use the same boundary for pricing: an absent or stale price remains unpriced. A plausible explanation cannot stand in for a valid domain record.

*Based on my Previo patch-engine implementation and tests from 29 August 2026. The project remains in development and its source is private.*
