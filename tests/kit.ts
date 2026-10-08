// Bottom hooks standing for the engine in the next-steps-zh tests, with a
// prompt box that follows replace／append／insert. From the adversarial review
// of 0.2.0 (20261008).
import type { Engine } from 'claude-code/testing'
import type { On, RenderElement } from 'claude-code'

declare function setTimeout(fn: (...args: never[]) => void, ms: number): unknown
export const tick = (ms = 5) => new Promise<void>(r => setTimeout(r, ms))
export const USAGE = { input_tokens: 0, output_tokens: 0, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 }
export const BELOW = { type: 'Box', props: {}, children: [] } as unknown as RenderElement
export const ABOVE = { hasSurvey: false, isWorking: false, maxRows: 10, bodyColumns: 77, scroll: { offset: 0, bodyRows: 9 }, view: {} } as never

export const store = {
  box: '',
  read: null as null | (() => unknown),
  beforeFill: null as null | (() => void),
  fills: [] as { text: string; mode: string }[],
  forks: 0,
  forkReply: '[]' as string,
  forkDelay: 0,
  suggests: [] as string[],
  toasts: [] as string[],
  logs: [] as string[],
  commands: [] as { name: string; description: string; source: string }[],
}

export function reset(on: On) {
  store.box = ''; store.read = null; store.beforeFill = null; store.fills = []; store.forks = 0
  store.forkReply = '[]'; store.forkDelay = 0; store.suggests = []; store.toasts = []; store.logs = []; store.commands = []
  on('turn.complete', async () => ({ text: '' }))
  on('turn.start', async (_$, e) => ({ turnId: e.turnId }))
  on('ui.render', { component: 'AbovePrompt' }, async () => BELOW)
  on('command.list', async () => ({ value: store.commands }) as never)
  on('model.fork', async () => {
    store.forks++
    if (store.forkDelay) await tick(store.forkDelay)
    return { value: { isAnswered: true, text: store.forkReply, usage: USAGE } } as never
  })
  on('prompt.suggest', async (_$, e) => { store.suggests.push(e.text); return { isShown: true } as never })
  on('ui.toast', async (_$, e) => { store.toasts.push(String((e as { text?: unknown }).text)); return { value: undefined } })
  on('ui.log', async (_$, e) => { store.logs.push(String((e as { text?: unknown }).text)); return { value: undefined } })
  on('prompt.read', async () => {
    if (store.read) return { value: store.read() } as never
    return { value: { text: store.box, cursor: store.box.length } } as never
  })
  on('prompt.fill', async (_$, e) => {
    store.beforeFill?.()
    store.fills.push({ text: e.text, mode: e.mode ?? 'replace' })
    if (e.mode === 'append') store.box = store.box + e.text
    else if (e.mode === 'insert') store.box = store.box + e.text
    else store.box = e.text
    return { isFilled: true, text: store.box, cursor: store.box.length } as never
  })
}

export const LONG = '這是一段很長的回答內容。'.repeat(30)
let n = 0
export async function start($: Engine) {
  await $.turn.start({ text: 'x', turnId: `s${++n}` } as never)
}
export async function complete($: Engine, extra: Record<string, unknown> = {}, answer = LONG) {
  const turnId = `t${++n}`
  await $.turn.complete({ reason: 'answer', answer, durationMs: 1, isAborted: false, turnId, ...extra } as never)
  return turnId
}
export const offer = (items: unknown[]) => JSON.stringify(items)
export async function band($: Engine, surface: 'terminal' | 'desktop' = 'desktop') {
  return await $.ui.mount({ plugin: 'next-steps-zh', surface, component: 'AbovePrompt', props: ABOVE })
}
export async function buttons($: Engine, surface: 'terminal' | 'desktop' = 'desktop') {
  const ui = await band($, surface)
  const all = await ui.findAll({ type: 'Button' })
  return { ui, all: all as { key?: string; props?: Record<string, unknown>; label?: string }[] }
}
