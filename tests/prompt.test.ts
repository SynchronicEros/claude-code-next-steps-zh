import { expect, test } from 'claude-code/testing'

import { LANGUAGE_RULE, fitLabel, forkPrompt } from '../hooks/register.tsx'

test('fork question asks for Traditional Chinese, with or without skills', async () => {
  expect(LANGUAGE_RULE.includes('Traditional Chinese')).toBe(true)
  expect(LANGUAGE_RULE.includes('台灣')).toBe(true)
  for (const skills of ['', '/code-review: review the diff']) {
    const prompt = forkPrompt(skills)
    expect(prompt.includes(LANGUAGE_RULE)).toBe(true)
    // The rule sits right before the answer format, the last thing the fork reads.
    expect(prompt.indexOf(LANGUAGE_RULE) < prompt.indexOf('Answer with ONLY a JSON array')).toBe(true)
    expect(prompt.indexOf('</available-skills>') < prompt.indexOf(LANGUAGE_RULE)).toBe(true)
  }
})

test('fitLabel cuts by display width (Chinese and emoji 2 columns) with an ellipsis', async () => {
  expect(fitLabel('執行測試')).toBe('執行測試')
  expect(fitLabel('a'.repeat(48))).toBe('a'.repeat(48))
  expect(fitLabel('請'.repeat(30))).toBe(`${'請'.repeat(23)}…`)
  expect(fitLabel('a'.repeat(49))).toBe(`${'a'.repeat(47)}…`)
})
