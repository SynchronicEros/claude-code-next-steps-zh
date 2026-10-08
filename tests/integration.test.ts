// Regression tests from the adversarial review of next-steps-zh 0.2.0 (20261008):
// S1–S5 reproduced defects that 0.3.0 fixes; S6–S10 are upstream behaviour kept
// as is and recorded here as controls.
import { expect, test } from 'claude-code/testing'
import type { Engine } from 'claude-code/testing'
import { forkPrompt } from '../hooks/register.tsx'
import { buttons, complete, offer, reset, start, store, tick } from './kit.ts'

const width = (s: string) => [...s].reduce((w, c) => w + (/[ᄀ-ᅟ⺀-꓏가-힣豈-﫿︰-﹏＀-｠￠-￦]/.test(c) || (c.codePointAt(0) ?? 0) > 0x1f000 ? 2 : 1), 0)

async function pick($: Engine, index: number) {
  const { ui, all } = await buttons($)
  await ui.press({ key: all[index]?.key ?? '' })
  await tick()
  await ui.unmount()
}

test('S1 subagent turn (agentId) must not fork', async ($, on) => {
  reset(on)
  await start($)
  store.forkReply = offer([{ label: '執行測試', prompt: '執行測試' }])
  await complete($, { agentId: 'agent-1' })
  await tick()
  expect(store.forks).toBe(0)
})

test('S1b a background subagent finishing after the offer must not replace it', async ($, on) => {
  reset(on)
  await start($)
  store.forkReply = offer([{ label: '主回合建議', prompt: '主回合建議' }])
  await complete($)
  await tick()
  store.forkReply = offer([{ label: '另一則', prompt: '另一則' }])
  await complete($, { agentId: 'bg-agent' })
  await tick()
  const { ui, all } = await buttons($)
  await ui.unmount()
  expect(all[0]?.props?.label).toBe('主回合建議')
})

test('S2 prompt.read failing must not let a pick overwrite the draft', async ($, on) => {
  reset(on)
  await start($)
  store.forkReply = offer([{ label: '執行測試', prompt: '執行測試' }])
  await complete($)
  await tick()
  store.box = '我打到一半的重要草稿'
  store.read = () => { throw new Error('read failed') }
  await pick($, 0)
  expect(store.box.includes('我打到一半的重要草稿')).toBe(true)
})

test('S2b prompt.read answering empty (another plugin, or not readable) must not overwrite the draft', async ($, on) => {
  reset(on)
  await start($)
  store.forkReply = offer([{ label: '執行測試', prompt: '執行測試' }])
  await complete($)
  await tick()
  store.box = '我打到一半的重要草稿'
  store.read = () => ({ text: '', cursor: 0 })
  await pick($, 0)
  expect(store.box.includes('我打到一半的重要草稿')).toBe(true)
})

test('S2c typing between read and fill must not be lost', async ($, on) => {
  reset(on)
  await start($)
  store.forkReply = offer([{ label: '執行測試', prompt: '執行測試' }])
  await complete($)
  await tick()
  store.box = ''
  store.beforeFill = () => { store.box = '剛打的字' }
  await pick($, 0)
  expect(store.box.includes('剛打的字')).toBe(true)
})

test('S3 a Chinese label longer than 24 characters is not cut to fit (N1)', async ($, on) => {
  reset(on)
  await start($)
  const label = '請幫我把剛剛修改過的設定檔重新檢查一次並且執行全部的單元測試確認沒有問題'
  store.forkReply = offer([{ label, prompt: '執行測試' }])
  await complete($)
  await tick()
  const { ui, all } = await buttons($)
  await ui.unmount()
  const shown = String(all[0]?.props?.label)
  expect(width(shown) <= 48).toBe(true)
})

test('S3b label falling back to the prompt is up to 48 CJK = 96 columns', async ($, on) => {
  reset(on)
  await start($)
  store.forkReply = offer([{ label: '', prompt: '請'.repeat(200) }])
  await complete($)
  await tick()
  const { ui, all } = await buttons($)
  await ui.unmount()
  const shown = String(all[0]?.props?.label)
  expect(width(shown) <= 48).toBe(true)
})

test('S4 fork prompt states one label limit (24 CJK), not also "≤48 chars"', async () => {
  const p = forkPrompt('')
  expect(p.includes('24 Chinese characters')).toBe(true)
  expect(p.includes('≤48 chars')).toBe(false)
})

test('S5 two suggestions with the same label: pressing the second fills the second', async ($, on) => {
  reset(on)
  await start($)
  store.forkReply = offer([{ label: '修正', prompt: '修正第一個' }, { label: '修正', prompt: '修正第二個' }])
  await complete($)
  await tick()
  const { ui, all } = await buttons($)
  await ui.press({ key: all[1]?.key ?? '' })
  await tick()
  await ui.unmount()
  expect(store.fills.map(f => f.text)).toEqual(['修正第二個'])
})

test('S5b a suggestion labelled 略過 collides with the dismiss button', async ($, on) => {
  reset(on)
  await start($)
  store.forkReply = offer([{ label: '略過', prompt: '略過這個測試，先處理別的' }])
  await complete($)
  await tick()
  const { ui, all } = await buttons($)
  const keys = all.map(b => b.key)
  await ui.unmount()
  expect(new Set(keys).size).toBe(keys.length)
})

test('S6 (control, upstream kept) prose with brackets before the JSON array yields no suggestions', async ($, on) => {
  reset(on)
  await start($)
  store.forkReply = '以下為建議 [共 1 則]：\n' + offer([{ label: '執行測試', prompt: '執行測試' }])
  await complete($)
  await tick()
  const { ui, all } = await buttons($)
  await ui.unmount()
  expect(all.length).toBe(0)
})

test('S6b a code-fenced reply still parses', async ($, on) => {
  reset(on)
  await start($)
  store.forkReply = '```json\n' + offer([{ label: '執行測試', prompt: '執行測試' }]) + '\n```'
  await complete($)
  await tick()
  const { ui, all } = await buttons($)
  await ui.unmount()
  expect(all.length).toBe(2)
})

test('S7 non-answer endings do not fork; a newer turn drops a stale fork', async ($, on) => {
  reset(on)
  await start($)
  for (const reason of ['aborted', 'error']) await complete($, { reason, isAborted: reason === 'aborted' })
  await complete($, { reason: 'refusal', refusal: { category: null, explanation: null } })
  await tick()
  expect(store.forks).toBe(0)
  store.forkDelay = 30
  store.forkReply = offer([{ label: '舊的', prompt: '舊的' }])
  await complete($)
  await tick()
  await start($)
  await tick(50)
  const { ui, all } = await buttons($)
  await ui.unmount()
  expect(all.length).toBe(0)
})

test('S8 dismiss hides the band but the ghost suggestion is never withdrawn', async ($, on) => {
  reset(on)
  await start($)
  store.forkReply = offer([{ label: '執行測試', prompt: '執行剛寫的測試' }])
  await complete($)
  await tick()
  const { ui, all } = await buttons($)
  await ui.press({ key: all[all.length - 1]?.key ?? '' })
  await tick()
  await ui.unmount()
  expect(store.suggests).toEqual(['執行剛寫的測試'])
})

test('S9 (control, upstream kept) slash prompts: unknown commands and path-led prompts dropped', async ($, on) => {
  reset(on)
  await start($)
  store.commands = [{ name: 'code-review', description: '審查', source: 'plugin' }]
  store.forkReply = offer([
    { label: 'a', prompt: '/code-review　檢查 diff' },
    { label: 'b', prompt: '/Code-Review 檢查' },
    { label: 'c', prompt: '/Users/me/x.md 這個檔再看一次' },
  ])
  await complete($)
  await tick()
  const { ui, all } = await buttons($)
  await ui.unmount()
  expect(all.map(b => b.props?.label)).toEqual(['a', '略過'])
})

test('S10 (control, upstream kept) emoji count double toward the threshold', async ($, on) => {
  reset(on)
  await start($)
  await complete($, {}, '😀'.repeat(150))
  await tick()
  expect(store.forks).toBe(1)
})
