---
title: "A reconnect should not start the work again"
description: "How I split a tutoring run from its connection—and kept the completed result after the replay journal expired."
date: "2026-10-18"
category: "System design"
draft: false
---
A teacher starts generating a document, the connection drops, and the page reconnects. There are two very different things it can do next: find the existing run, or start another one.

In my YoLearn work, I added a run protocol that makes that distinction explicit. The browser connection observes the work. It does not define the work’s identity.

## Give recovery something to ask for

The gateway keeps an ordered event journal in Redis. The client remembers the last sequence it processed and asks for later events when it reconnects. A request identity also lets the start path recognize the same request rather than treating every retry as new work.

That handles a brief disconnect. It does not make Redis an unlimited history store.

I bounded the journal by retention and size. When the client’s cursor falls outside the retained range, the gateway reports a gap and returns a snapshot. It does not silently hand back an incomplete replay.

## Save completion before publishing it

There is another awkward window: the document is complete, but the final event never reaches the client.

The settlement path saves the document and terminal state in PostgreSQL before appending the completion event. The recovery response can reconstruct completion from that saved record even if Redis expires or publication fails.

This also keeps the billing outcome attached to the run. A broken socket should not make the browser guess whether work completed or whether tokens were refunded.

## The last frame can still break the UI

I fixed a related frontend bug where an image arrived during streaming and disappeared at completion. The final document carried an empty asset list, which replaced useful state already on screen.

The fix merges ready assets by stable ID and preserves them across that empty terminal frame. The regression case delivers an asset twice, completes with an empty list, and checks that one image remains.

For me, recovery is a contract across storage, transport, and rendering. A retained journal restores recent progress; a durable result restores the outcome. Neither implies that an interrupted worker can always resume generation.

*Based on my gateway and web-client changes from 3–4 October 2026. Company implementation details are summarized here; the source remains private.*
