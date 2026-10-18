---
title: "One payment, two handlers, one fulfillment"
description: "The duplicate-payment fix needed a database boundary and a clearer history view."
date: "2026-10-18"
category: "Databases"
draft: false
---
A payment can reach the backend twice through different paths: the provider sends a webhook while the browser verifies the same subscription.

Each handler can look correct in isolation. Both can read an unfulfilled subscription before either commits. An early “already active” check does not close that window.

I worked on this race in YoLearn’s billing gateway. The fix had two parts: protect fulfillment, then make existing history readable.

## Recheck while holding the lock

I added a transaction-scoped PostgreSQL advisory lock keyed to the subscription. After taking the lock, the handler reads the current state again and checks whether fulfillment already happened. Ledger idempotency checks provide another guard against repeated credit creation.

The placement of that second read matters. Checking only before the lock lets both handlers make a decision using the same old state.

[PostgreSQL transaction-level advisory locks](https://www.postgresql.org/docs/current/explicit-locking.html#ADVISORY-LOCKS) release when the transaction ends. They still rely on cooperating write paths using the same locking convention; a helper function alone does not protect every future caller.

## A cleaner screen is a separate fix

Existing payment history could contain complementary fragments: one record had provider details, another had invoice information. I added deduplication that merges those fragments into a richer entry while preserving separate renewal payments.

The regression cases distinguish a duplicate delivery from a later recurring payment. Two rows looking similar is not enough reason to discard one.

## The boundary I take from this

A lock coordinates concurrent attempts. An idempotency key identifies repeated work. A history projection explains the records to a user.

Those mechanisms solve related problems, but they are not interchangeable. Fixing the display cannot prevent another duplicate write, and preventing future writes does not repair what the user already sees.

*Based on my gateway billing changes from 12 September 2026. No payment identifiers or company source are included here.*
