# next-steps-zh（下一步建議・繁中版）

每回合結束後，在輸入框上方給至多三則下一步建議；按 1、2、3（或點選）把建議放進輸入框當草稿，自己修改後按 Enter；0 略過。第一則建議也會成為輸入框的灰字提示，按 Tab 即可採用。本 Mod 不會自行送出任何訊息。

## 安裝

在 Claude Code 裡貼上這段話：

> 請幫我安裝 https://github.com/SynchronicEros/claude-code-mods-zh 裡的 next-steps-zh（照該 README「給協助安裝的 AI」一節），遇到問題幫我處理，裝好告訴我怎麼讓它生效。

要更新時說「請幫我把 next-steps-zh 更新到最新版」。

<details>
<summary>給協助安裝的 AI</summary>

- 需要 Claude Code（付費方案）；只有 Codex 的使用者無法安裝。
- 安裝（user scope，在終端機或 Bash 工具執行）：`claude plugin marketplace add SynchronicEros/claude-code-mods-zh`，再 `claude plugin install next-steps-zh@claude-code-mods-zh`。
- 更新：`claude plugin marketplace update claude-code-mods-zh`，再 `claude plugin update next-steps-zh@claude-code-mods-zh`；顯示 already at the latest version 即為最新。
- 一律保留總目錄那份；若同時裝了 `next-steps-zh@claude-code-next-steps-zh`，執行 `claude plugin uninstall next-steps-zh@claude-code-next-steps-zh`。
- 安裝或更新後須開新的 session 才生效（終端機版 `/exit` 後重打 `claude`；桌面版開新對話）。桌面版 Code 分頁不能用 `/plugin` 指令。
- 需要 Claude Code v2.1.287 以上（`claude --version` 查詢，太舊執行 `claude update`）。
- 若已裝官方 `next-steps@claude-community`，先 `claude plugin disable next-steps@claude-community`，否則會出現兩組建議。

</details>

## 與原版差異

改寫自 Thariq Shihipar 之社群 plugin `next-steps` 1.0.0，與原版差異（詳見 [NOTICE.md](NOTICE.md)）：

- 建議與介面文字一律繁體中文（台灣用語）；檔名、路徑、程式碼、指令照原文。
- 點選建議一律接在輸入框後面，有草稿時換行接上，不會蓋掉草稿。
- 回答短於 300 字不給建議（原版 80），省分身額度。
- 子代理的回合不產生建議，也不替換已出現的建議。
- 標籤依顯示寬度截至約 24 個中文字；每顆按鈕有固定識別碼。

## 設定（userConfig）

| 設定 | 預設 | 作用 |
|---|---|---|
| `minAnswerChars` | `300` | 回答短於此字數不給建議；須填數字，填文字會使本 Mod 無法載入 |
| `suggestSkills` | `true` | 讓建議可用本 session 的 skill 與斜線指令 |

## 額度

每個夠長的回答後呼叫分身一次（共用 prompt cache，約一則短回覆的成本）。

## 授權

MIT（見 [LICENSE](LICENSE)）；改寫自 Thariq Shihipar 之 `next-steps`，原作授權與修改說明見 [NOTICE.md](NOTICE.md)。

---

**English:** Up to three next-prompt suggestions above the prompt after each turn, in Traditional Chinese; press 1/2/3 (or click) to put one in the prompt box as a draft, 0 to dismiss. Adapted from Thariq Shihipar's community plugin `next-steps` 1.0.0 — see NOTICE.md for the license and the list of changes (Chinese output, picks always appended, default threshold 300, subagent turns ignored, width-based label cut, keyed buttons). Do not enable it together with the official `next-steps`.

**Install / License (English):** Requires Claude Code (a paid plan). Ask Claude Code to install `next-steps-zh` from https://github.com/SynchronicEros/claude-code-mods-zh, or run `claude plugin marketplace add SynchronicEros/claude-code-mods-zh`, then `claude plugin install next-steps-zh@claude-code-mods-zh`; takes effect in new sessions. MIT. Adapted from Thariq Shihipar's `next-steps`; see [NOTICE.md](NOTICE.md).
