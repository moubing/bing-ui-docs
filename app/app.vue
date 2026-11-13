<script setup lang="ts">
import { onBeforeUnmount, onMounted, type TransitionProps } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

const router = useRouter()
const nuxtApp = useNuxtApp()
let latestNavigation: RouteLocationNormalized | undefined
let activeTransition: { route: RouteLocationNormalized; finished: Promise<void>; resolve: () => void } | undefined
let transitionFrame = 0
const cleanup: (() => void)[] = []

function finishPageTransition() {
  if (transitionFrame) {
    window.cancelAnimationFrame(transitionFrame)
    transitionFrame = 0
  }
  activeTransition?.resolve()
  activeTransition = undefined
}

function observeRenderedPageTransition() {
  const transition = activeTransition
  if (!transition || transitionFrame) return
  let settledFrames = 0

  const check = () => {
    transitionFrame = 0
    if (activeTransition !== transition) return

    const pages = Array.from(document.querySelectorAll<HTMLElement>('.docs-content [data-docs-route]'))
    const page = pages[0]
    const hasRenderedPage = page?.matches('.doc-page') || page?.querySelector('.doc-page')
    const isSettled = router.currentRoute.value === transition.route
      && pages.length === 1
      && page?.dataset.docsRoute === transition.route.path.replace(/\/$/, '')
      && hasRenderedPage
      && !Array.from(page.classList).some(name => /^docs-page-(enter|leave)-/.test(name))
      && page.getAnimations().every(animation => animation.playState === 'finished' || animation.playState === 'idle')

    // 完成回调可能缺失；以正文实际落位且连续两帧没有过渡为准，避免永久阻塞后续导航。
    // 不用固定超时强行放行，异步正文未就绪或动画仍在播放时继续等待。
    settledFrames = isSettled ? settledFrames + 1 : 0
    if (settledFrames >= 2) finishPageTransition()
    else transitionFrame = window.requestAnimationFrame(check)
  }

  transitionFrame = window.requestAnimationFrame(check)
}

function finishRenderedPageTransition(element: Element) {
  // 同一路由重新进入时，旧回调也可能匹配路径；仍须核验实际正文，不能直接释放等待。
  if (element.getAttribute('data-docs-route') === activeTransition?.route.path.replace(/\/$/, '')) {
    observeRenderedPageTransition()
  }
}

const pageTransitionHooks: TransitionProps = {
  onAfterEnter: finishRenderedPageTransition,
  onEnterCancelled: finishRenderedPageTransition,
}

onMounted(() => {
  cleanup.push(router.beforeEach(to => { latestNavigation = to }))
  cleanup.push(router.beforeResolve(async (to, from) => {
    // KeepAlive 的停用和恢复必须等上一轮过渡结束；等待期间仅接受最后一次导航。
    await activeTransition?.finished
    if (to !== latestNavigation) return false

    if (to.meta.layout === 'docs' && from.meta.layout === 'docs' && to.path !== from.path) {
      let resolve!: () => void
      const finished = new Promise<void>(done => { resolve = done })
      activeTransition = { route: to, finished, resolve }
    }
  }))
  cleanup.push(router.afterEach((to, _from, failure) => {
    if (activeTransition?.route !== to) return
    if (failure) finishPageTransition()
    else observeRenderedPageTransition()
  }))
  cleanup.push(router.onError((_error, to) => {
    if (activeTransition?.route === to) finishPageTransition()
  }))
  cleanup.push(nuxtApp.hook('app:error', finishPageTransition))
  cleanup.push(nuxtApp.hook('vue:error', finishPageTransition))
})

onBeforeUnmount(() => {
  latestNavigation = undefined
  cleanup.forEach(remove => remove())
  finishPageTransition()
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator
    color="color-mix(in srgb, var(--bing-muted) 60%, var(--bing-canvas))"
    error-color="var(--bing-danger)"
    :height="3"
    :throttle="0"
  />
  <NuxtLayout>
    <NuxtPage :transition="pageTransitionHooks" />
  </NuxtLayout>
</template>
