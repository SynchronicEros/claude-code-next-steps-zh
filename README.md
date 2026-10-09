# next-steps-zh（下一步建議・繁中版）

每回合結束後，在輸入框上方給至多三則下一步建議；按 1、2、3（或點選）把建議放進輸入框當草稿，自己修改後按 Enter；0 略過。第一則建議也會成為輸入框的灰字提示，按 Tab 即可採用。本 Mod 不會自行送出任何訊息。

## 安裝

- 需要 **Claude Code（付費方案）**；Codex 免費版不能安裝（只有 Codex 的人，改照[範本 repo](https://github.com/SynchronicEros/eros-kmu-learning-example) README「只用 Codex 的人」一節）。
- 還沒裝 Claude Code：見[官方安裝說明](https://code.claude.com/docs/zh-TW/setup)。
- 需要 Claude Code **v2.1.287 以上**（Mods 的 API 仍屬 early access，也就是搶先體驗版，引擎更新可能使 Mod 失效）。
- Windows：Windows 版 Claude Code 也能安裝；本 Mod 不呼叫外部指令，不需另裝工具（作者尚未在 Windows 實機測試）。

**指令貼在哪裡**：貼在**終端機**，貼上後按 Enter（Mac：按 ⌘＋空白鍵開 Spotlight，搜尋「終端機」；Windows：在開始選單搜尋「PowerShell」）。不是貼在 Claude Code 的對話框。若終端機回應 `command not found`（找不到指令），表示終端機裡還沒有 Claude Code：照上面的官方安裝說明安裝；只用桌面版的人，改用下方「對話框裡」的寫法。

先查版本，會顯示像 `2.1.292 (Claude Code)` 的一行；版本太舊就執行 `claude update`：

```bash
claude --version
```

```bash
claude plugin marketplace add SynchronicEros/claude-code-next-steps-zh
```

```bash
claude plugin install next-steps-zh@claude-code-next-steps-zh
```

**對話框裡**（已經在 Claude Code 裡，或只用桌面版）：改打 `/plugin marketplace add SynchronicEros/claude-code-next-steps-zh`，再打 `/plugin install next-steps-zh@claude-code-next-steps-zh`；會跳出英文選單，選第一個 **Install for you (user scope)**。

安裝時若出現英文訊息「SSH not configured, cloning via HTTPS」或「userConfig options not yet set」，可以忽略（沒設定就用預設值）。

裝好後要**開新的 session（一次新對話）**才會生效：終端機版先打 `/exit` 離開，再打 `claude`；桌面版開一個新對話。

**總目錄與本 repo 二擇一**：同一個 Mod 或 skill 只從一處安裝（skill 兩處都裝會出現兩份）。用 `claude plugin list` 檢查；若同時看到 `next-steps-zh@claude-code-next-steps-zh` 與 `next-steps-zh@claude-code-mods-zh`，**保留總目錄那份**，移除本 repo 這份（只執行一次）：

```bash
claude plugin uninstall next-steps-zh@claude-code-next-steps-zh
```

再用 `claude plugin list` 確認只剩一份。重複執行會出現 ✘ 與「not installed」，表示已經移除過，無害。

## 更新

有新版時，在終端機依你當初的安裝來源執行兩行，再開新的 session。從本 repo 裝的：

```bash
claude plugin marketplace update claude-code-next-steps-zh
```

```bash
claude plugin update next-steps-zh@claude-code-next-steps-zh
```

從總目錄裝的：把兩行裡的 `claude-code-next-steps-zh` 換成 `claude-code-mods-zh`。只打第二行會顯示「already at the latest version」，因為還沒先抓新的目錄。

全部 Mod 與 skill 見總目錄 [claude-code-mods-zh](https://github.com/SynchronicEros/claude-code-mods-zh)。

改寫自 Thariq Shihipar 之社群 plugin `next-steps` 1.0.0，與原版差異（詳見 [NOTICE.md](NOTICE.md)）：

- 建議與介面文字一律繁體中文（台灣用語）；檔名、路徑、程式碼、指令照原文。
- 點選建議一律接在輸入框後面，有草稿時換行接上，不會蓋掉草稿。
- 回答短於 300 字不給建議（原版 80），省分身額度。
- 子代理的回合不產生建議，也不替換已出現的建議。
- 標籤依顯示寬度截至約 24 個中文字；每顆按鈕有固定識別碼。

**不可與官方 `next-steps` 同時啟用**（會出現兩組建議）。先用 `claude plugin list` 看有沒有 `next-steps@claude-community`；**沒有就不用做**，有的話停用：

```bash
claude plugin disable next-steps@claude-community
```

（沒裝過官方版卻執行這行，會顯示 ✘ 與「already disabled」，無害。）

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

**Install / License (English):** Requires Claude Code (a paid plan); the free Codex tier cannot install it. Claude Code v2.1.287+ (check with `claude --version`); works on Windows without extra tools (not yet tested there). `claude plugin marketplace add SynchronicEros/claude-code-next-steps-zh`, then `claude plugin install next-steps-zh@claude-code-next-steps-zh`; takes effect in new sessions. Install from either this repo or the index, not both (keep the index copy). To update, run `claude plugin marketplace update` for your source first, then `claude plugin update`. All mods and skills: [claude-code-mods-zh](https://github.com/SynchronicEros/claude-code-mods-zh). MIT. Adapted from Thariq Shihipar's `next-steps`; see [NOTICE.md](NOTICE.md).
