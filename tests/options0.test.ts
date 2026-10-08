import { expect, test } from 'claude-code/testing'
import { complete, reset, start, store, tick } from './kit.ts'
// Control: upstream behaviour, kept as is.
test('S11 (control) minAnswerChars 0: an empty (thinking-only) answer still forks', { options: { minAnswerChars: 0 } }, async ($, on) => {
  reset(on)
  await start($)
  await complete($, {}, '')
  await tick()
  expect(store.forks).toBe(1)
})
