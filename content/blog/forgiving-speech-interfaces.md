---
title: "The screen transition that exposed an empty-state bug"
description: "Keeping Speechee’s screens mounted removed a white flash—and revealed an assumption about when session data exists."
date: "2026-10-18"
category: "Product thinking"
draft: false
---
I changed a transition in Speechee to make it feel quieter. Moving from the lesson map to speaking briefly exposed a blank frame: the old screen faded out before the next one was ready.

My fix kept the screens mounted and crossfaded them concurrently. The outgoing screen stays visible while the incoming one gains opacity and moves into place. Pointer events follow the active screen, and a guard prevents overlapping transitions.

The visual gap disappeared. A different assumption became visible.

## Mounted does not mean ready

The speaking screen could now render before a lesson had supplied any words. Its current-item lookup returned nothing, and a later read of `stageId` failed.

I added a safe fallback item and guarded the last-question calculation. That lets the component mount while the session is being prepared. It does not replace the selected lesson data once the session starts.

This is the lifecycle consequence of preserving screens: code that previously ran only during navigation may now run earlier and stay alive longer. [React’s state-preservation model](https://react.dev/learn/preserving-and-resetting-state) helps explain why a change in the rendered tree affects more than appearance.

## Follow the side effects too

A speech screen has more lifecycle work than a static form. It can play a prompt, open recognition, or retain an answer. A smooth transition should not trigger audio before the learner enters the lesson.

In a later fix, I limited the speaking and results screens to the active screen again, preventing text-to-speech from firing on initial launch. That is the same boundary from another angle: “this component exists” is a weaker signal than “the user is ready to practice.”

## What I check after changing navigation

- Can an inactive screen render safely with empty input?
- Which screen receives touches during the overlap?
- Can a second tap start another transition?
- Does audio or recognition start because of mounting rather than user intent?

For this app, keeping every screen alive was too broad a solution. The useful lesson was to make the transition smooth while keeping audio and session lifetimes tied to the active practice flow.

*Based on my Speechee navigation, empty-session, and launch-audio fixes from 18 October 2026. The app’s source is private.*
