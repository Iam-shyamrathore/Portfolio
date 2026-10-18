---
title: "Save the report before announcing the progress"
description: "A Prachaar audit checkpoint became more useful when the database—not the open browser—owned its result."
date: "2026-10-18"
category: "Databases"
draft: false
---
A progress message saying “section complete” creates an expectation: that section should still exist when the user returns.

That expectation shaped my durable audit work in Prachaar. I separated the job from its browser session and changed the order of a checkpoint: save the report snapshot first, broadcast the saved revision second.

## Make the saved state the thing you announce

The worker updates a database-backed run as specialist findings arrive. A checkpoint commits the snapshot and receives its new revision. The realtime update carries that saved state.

If broadcasting fails, the finding is still in the database. The page can fetch it again. Publishing first would create the opposite failure: a user could see progress that a later refresh cannot recover.

One integration test checks this ordering directly. Inside the broadcast callback, it reads the persisted run and compares its revision and snapshot with the outgoing update.

## Preserve a useful partial result

An audit can collect several valid findings before another check fails. I keep completed sections, mark unfinished checks explicitly, and save the failure alongside the retained evidence.

Worker leases introduce another boundary. A worker must still own a valid lease to save a new snapshot. An expired worker cannot arrive late and overwrite a newer state. In this implementation, an expired run is marked failed with its available findings preserved; automatic continuation is a separate capability.

## Give each kind of state one job

| State | What I use it for |
| --- | --- |
| Saved snapshot | Recover the report and its evidence |
| Revision | Order updates to the same report |
| Worker lease | Decide who may write the next checkpoint |
| Realtime message | Tell an open page that saved state changed |

This adds writes and revision handling. I accept that cost because the report is the product; progress is how someone watches it arrive.

The question I now ask about every “done” event is concrete: **could a new client read the state this event claims exists?**

*Based on my durable-audit implementation and tests from 7 October 2026. Company source remains private.*
