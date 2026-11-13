import { expect, type Locator } from '@playwright/test'

/** 重放线上页面缩放后的真实档位值，验证首格惯性而不只检查是否滚动。 */
export async function verifyZoomedWheel(viewport: Locator) {
  for (const input of [{ deltaY: 100 / 1.1, wheelDeltaY: -109 }, { deltaY: 80, wheelDeltaY: -96 }]) {
    const sample = await viewport.evaluate(async (node, input) => {
      node.scrollTop = 100
      const before = node.scrollTop
      const event = new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY: input.deltaY })
      Object.defineProperty(event, 'wheelDeltaY', { value: input.wheelDeltaY })
      node.dispatchEvent(event)
      const immediate = node.scrollTop - before, frames: number[] = [], start = performance.now()
      do {
        await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
        frames.push(node.scrollTop - before)
      } while (performance.now() - start < 600)
      return { prevented: event.defaultPrevented, immediate, frames }
    }, input)
    expect(sample.prevented).toBe(true)
    expect(sample.immediate).toBe(0)
    expect(new Set(sample.frames).size).toBeGreaterThan(3)
    expect(Math.abs(sample.frames.at(-1)! - input.deltaY * 100 / 120)).toBeLessThan(1)
  }
}
