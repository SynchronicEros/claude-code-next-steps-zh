import { expect, test } from 'claude-code/testing'
import { complete, reset, start, store, tick } from './kit.ts'
// Control: upstream behaviour, kept as is.
test('S11b (control) minAnswerChars -5 is accepted and forks on empty answers', { options: { minAnswerChars: -5 } }, async ($, on) => {
  reset(on)
  await start($)
  await complete($, {}, '   ')
  await tick()
  expect(store.forks).toBe(1)
})
