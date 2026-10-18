---
title: "The cache-hit test that forbids generation"
description: "A small Redis key mismatch taught me to test the path that must not run."
date: "2026-10-18"
category: "System design"
draft: false
---
A full-length mock test was already in the pool. The request should have returned it, including its saved student and teacher PDFs. Instead, the cache path could miss and fall through to generation.

The issue crossed two layers: the pool held a paper ID, while the paper itself lived under a different Redis key. I corrected that lookup and the response built from the cached record.

The most useful part of the fix was the regression test.

## Make the wrong path fail loudly

A test that checks only “a paper was returned” can pass even if the system generated a fresh one. That misses the reason for having the pool.

I split the regression into two checks:

1. A fake Redis instance asserts that the pool reader fetches the actual paper key. It also fails if a valid pool member is removed.
2. The cache-hit request receives a prepared paper with both PDF links. Its generation mock throws if called, and the test also asserts it was never awaited.

The response must preserve the cached paper’s identity and both links. Returning any valid-looking paper is not enough.

## Test the avoided work

Caching is a behavior promise: under a particular condition, expensive work does not happen.

That negative assertion is often more useful than checking a cache helper in isolation. It catches a service that reads the cache correctly and then accidentally continues into generation anyway.

I use this pattern when the requirement is “reuse”: make the reusable result recognizable, make the replacement path fail, and assert that the original result reaches the caller intact.

*Based on my generation-service cache fix and regression cases from 3 October 2026. The example is described without company source.*
