// Pressing a suggestion with and without a draft in the box (0.2.0).
import { expect, test } from 'claude-code/testing'
import type { RenderElement } from 'claude-code'

import { fillArgs, MIN_ANSWER_CHARS } from '../hooks/register.tsx'

declare function setTimeout(fn: (...args: never[]) => void, ms: number): unknown
const tick = () => new Promise<void>(r => setTimeout(r, 5))
const BELOW = { type: 'Box', props: {}, children: [] } as unknown as RenderElement
const ABOVE = { hasSurvey: false, isWorking: false, maxRows: 10, bodyColumns: 100, scroll: { offset: 0, bodyRows: 9 }, view: {} } as never
const USAGE = { input_tokens: 0, output_tokens: 0, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 }

test('fillArgs: always append; a draft gets a newline before the pick', async () => {
  expect(fillArgs('', '執行測試')).toEqual({ text: '執行測試', mode: 'append' })
  expect(fillArgs('  ', '執行測試')).toEqual({ text: '執行測試', mode: 'append' })
  expect(fillArgs('我打到一半', '執行測試')).toEqual({ text: '\n執行測試', mode: 'append' })
  expect(fillArgs('我打到一半\n', '執行測試')).toEqual({ text: '執行測試', mode: 'append' })
  expect(MIN_ANSWER_CHARS).toBe(300)
})

const store = { draft: '', fills: [] as { text: string; mode: string }[], forks: 0 }

test('a click with a draft appends; short answers get no fork', async ($, on) => {
  on('turn.complete', async () => ({ text: '' }))
  on('turn.start', async () => ({ text: '' }) as never)
  on('ui.render', { component: 'AbovePrompt' }, async () => BELOW)
  on('command.list', async () => ({ value: [] }) as never)
  on('model.fork', async () => {
    store.forks++
    return { value: { isAnswered: true, text: JSON.stringify([{ label: '執行測試', prompt: '執行剛寫的測試' }]), usage: USAGE } } as never
  })
  on('prompt.suggest', async () => ({ isShown: true }) as never)
  on('ui.toast', async () => ({ value: undefined }))
  on('prompt.read', async () => ({ value: { text: store.draft, cursor: store.draft.length } }) as never)
  on('prompt.fill', async (_$, e) => {
    store.fills.push({ text: e.text, mode: e.mode ?? 'replace' })
    return { isFilled: true, text: e.text, cursor: 0 } as never
  })

  const complete = (answer: string) =>
    $.turn.complete({ reason: 'answer', answer, durationMs: 1, isAborted: false, turnId: `t${answer.length}` } as never)

  await complete('短回答'.repeat(67)) // 201 字：超過官方 80、未達 300
  await tick()
  expect(store.forks).toBe(0)

  await complete('長回答'.repeat(120))
  await tick()
  expect(store.forks).toBe(1)
  store.draft = '我打到一半'
  const ui = await $.ui.mount({ plugin: 'next-steps-zh', surface: 'desktop', component: 'AbovePrompt', props: ABOVE })
  const [first] = await ui.findAll({ type: 'Button' })
  expect(first).toBeDefined()
  await ui.press({ key: (first as { key?: string }).key ?? '' })
  await tick()
  await ui.unmount()
  expect(store.fills).toEqual([{ text: '\n執行剛寫的測試', mode: 'append' }])
})
