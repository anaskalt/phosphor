+++
title = "Ghidra Notes: Renaming the Mess Before You Read It"
date = 2026-04-15T09:00:00+02:00
draft = false
kicker = "reversing"
description = "A short field guide to taming a stripped MIPS binary in Ghidra before you try to understand a single line of it."
tags = ["reversing", "ghidra", "mips"]
toc = false
+++

When you first drop a stripped embedded binary into Ghidra, the decompiler
output is a wall of `FUN_0040xxxx`. Here's the cheap prep work I do first.

## Set the architecture correctly

Half of the "Ghidra is bad at this" complaints come from the wrong language
spec. For these little routers and cameras it's almost always MIPS32
little-endian (sometimes with `mips16e`) or ARMv7 little-endian with Thumb.

## Find the anchors

Strings are your map. Search for format strings, log tags, and `system()`-style
calls, then work outward:

```text
"set_language '%s'"   -> command construction, look for injection
"/etc/passwd"          -> auth / account handling
"%s/%s/firmware.bin"   -> update path, often unauthenticated
```

Rename `FUN_*` to what the surrounding strings imply. Even a rough
`maybe_parse_request` beats `FUN_004012a0` for keeping the call graph in your head.

## Watch for the wrappers

Ghidra often wraps library calls in strange thunks. Don't waste an hour
reversing what turns out to be `strdup`. If a one-line function forwards its args
and returns, check whether it's a PLT stub first.

Boring, but it turns an unreadable blob into something you can reason about.
