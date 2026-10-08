# NOTICE

`next-steps-zh` is a modified version of **next-steps** by **Thariq Shihipar**, published in the community plugin marketplace `anthropics/claude-plugins-community` (directory `next-steps/`, version 1.0.0).

The upstream `plugin.json` declares the MIT license; the upstream repository's root `LICENSE` is the Apache License 2.0, included here as [`LICENSE-APACHE-2.0`](LICENSE-APACHE-2.0). This derivative is offered under the terms of both: the upstream work under its own license, and our changes under the MIT license in the repository root.

## Changes from upstream 1.0.0

- The fork's question adds a rule to write every label and prompt in Traditional Chinese (Taiwan), keeping file names, paths, code and commands as they are; the band's own labels are in Chinese.
- A pick is always appended to the prompt box, after a newline when there is a draft, so a draft is never replaced.
- The default `minAnswerChars` is 300 instead of 80.
- A subagent's `turn.complete` (one with `agentId`) neither forks nor replaces the offer.
- Labels are cut by display width (48 columns; CJK and emoji count two) with an ellipsis.
- Every button has its own `key`.

---

`next-steps-zh` 改寫自 Thariq Shihipar 之 **next-steps**（社群 marketplace `anthropics/claude-plugins-community`，1.0.0）。上游 `plugin.json` 標 MIT，上游 repo 根目錄 LICENSE 為 Apache-2.0（全文見 `LICENSE-APACHE-2.0`）；原作依其授權，本版之修改依 repo 根目錄之 MIT 授權。修改內容見上列。
