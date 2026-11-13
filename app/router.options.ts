import type { RouterConfig } from 'nuxt/schema'
import type { RouteLocationNormalized } from 'vue-router'

type ScrollPosition = {
  left: number
  top: number
}

const docsScrollPositions = new Map<string, ScrollPosition>()

const isDocsRoute = (route: RouteLocationNormalized) => /^\/docs(?:\/|$)/.test(route.path)

const routeScrollKey = (route: RouteLocationNormalized) =>
  route.fullPath.replace(/#.*$/, '')

const normalizePath = (path: string) => path.replace(/\/$/, '')

const getHashElementScrollMarginTop = (selector: string) => {
  try {
    const element = document.querySelector(selector)

    if (!element) {
      return 0
    }

    const elementStyles = window.getComputedStyle(element)
    const documentStyles = window.getComputedStyle(document.documentElement)

    return (
      (Number.parseFloat(elementStyles.scrollMarginTop) || 0) +
      (Number.parseFloat(documentStyles.scrollPaddingTop) || 0)
    )
  } catch {
    return 0
  }
}

const waitForPagePaint = (position: ScrollPosition) =>
  new Promise<ScrollPosition>((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => resolve(position))
    })
  })

export default {
  scrollBehavior(to, from, savedPosition) {
    if (!import.meta.client) {
      return false
    }

    if (isDocsRoute(from)) {
      docsScrollPositions.set(routeScrollKey(from), {
        left: window.scrollX,
        top: window.scrollY,
      })
    }

    if (savedPosition) {
      return savedPosition
    }

    if (normalizePath(to.path) === normalizePath(from.path)) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 }
      }

      if (to.hash) {
        return {
          el: to.hash,
          top: getHashElementScrollMarginTop(to.hash),
          behavior: 'auto',
        }
      }

      return false
    }

    if (to.hash) {
      return {
        el: to.hash,
        top: getHashElementScrollMarginTop(to.hash),
        behavior: 'auto',
      }
    }

    if (isDocsRoute(to)) {
      const previousPosition = docsScrollPositions.get(routeScrollKey(to))

      if (previousPosition) {
        return waitForPagePaint(previousPosition)
      }
    }

    return { left: 0, top: 0 }
  },
} satisfies RouterConfig
