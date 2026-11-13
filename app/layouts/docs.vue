<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { BingScrollbar } from '@moubing/bing-ui'
import type { BingScrollbarExpose } from '@moubing/bing-ui'
import { useRoute } from '#imports'
import { upgradeGuideTitle } from '#shared/docs/release'

const { $gsap } = useNuxtApp()

type TocItem = {
  id: string
  label: string
  depth: 1 | 2 | 3
}

type ScrollPosition = {
  left: number
  top: number
}

const docsPageScrollPositions = new Map<string, ScrollPosition>()

const routeScrollKey = (fullPath: string) => fullPath.replace(/#.*$/, '')

const route = useRoute()
const pageTitle = computed(() => {
  const segments = route.path.split('/').filter(Boolean)

  if (segments.length <= 1) return '快速开始 · Bing UI'
  if (route.path.replace(/\/$/, '') === '/docs/upgrade') return `${upgradeGuideTitle} · Bing UI`

  const pageName = segments.at(-1)
    ?.split('-')
    .filter(Boolean)
    .map(segment => `${segment.charAt(0).toUpperCase()}${segment.slice(1)}`)
    .join('')

  return pageName ? `${pageName} · Bing UI` : 'Bing UI 文档'
})

useHead(() => ({
  title: pageTitle.value,
}))

const pageScrollbarRef = ref<BingScrollbarExpose | null>(null)
const tocScrollbarRef = ref<BingScrollbarExpose | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const tocListRef = ref<HTMLElement | null>(null)
const tocTrackRailRef = ref<HTMLElement | null>(null)
const tocActiveTrackRef = ref<HTMLElement | null>(null)
const tocItems = ref<TocItem[]>([])
const activeTocIds = ref<string[]>([])
const mobileNavOpen = ref(false)
const mobileNavToggle = ref<HTMLButtonElement | null>(null)
watch(() => route.path, () => { mobileNavOpen.value = false })

function closeMobileNav() {
  mobileNavOpen.value = false
  if (mobileNavToggle.value?.offsetParent) mobileNavToggle.value.focus()
}

const pageScrollbarHeight = '100%'
const navScrollbarMaxHeight = 'var(--docs-nav-max-height, calc(100vh - 106px))'
const pageAnchorOffset = 36
const windowAnchorOffset = 92

let scrollFrame = 0
let tocRefreshFrame = 0
let tocTrackFrame = 0
let hashScrollFrame = 0
let pageScrollRestoreFrame = 0
let pageScrollRestoreTimer: number | undefined
let releaseScrollTimer: number | undefined
let tocTrackTween: ReturnType<typeof $gsap.to> | null = null
let lastTocTrackElement: HTMLElement | null = null
let lastTocTrackTop = 0
let lastTocTrackScale = 0
let lastTocTrackVisible = false
let isProgrammaticScroll = false
let programmaticTocId = ''
let isChangingDocsRoute = false
let pendingPageScrollKey = ''
let pendingPageScrollPosition: ScrollPosition | undefined
let pendingPageScrollAttempts = 0
let pendingHashScrollId = ''
let contentObserver: MutationObserver | undefined
const tocSelector = 'h1[id], h2[id], h3[id], section[id]'
const tocMutationSelector = 'h1, h2, h3, section[id], [data-docs-route]'
const tocTargets = new Map<string, { target: HTMLElement; heading: HTMLElement }>()

onMounted(() => {
  document.addEventListener('pointerdown', handleDocsNavigationCapture, true)
  document.addEventListener('click', handleDocsNavigationCapture, true)
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize, { passive: true })
  setupContentObserver()
  requestHashScroll(route.hash)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocsNavigationCapture, true)
  document.removeEventListener('click', handleDocsNavigationCapture, true)
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)

  if (scrollFrame) {
    window.cancelAnimationFrame(scrollFrame)
  }

  if (tocRefreshFrame) {
    window.cancelAnimationFrame(tocRefreshFrame)
  }

  if (tocTrackFrame) {
    window.cancelAnimationFrame(tocTrackFrame)
  }

  if (hashScrollFrame) {
    window.cancelAnimationFrame(hashScrollFrame)
  }

  if (pageScrollRestoreFrame) {
    window.cancelAnimationFrame(pageScrollRestoreFrame)
  }

  if (pageScrollRestoreTimer !== undefined) {
    window.clearTimeout(pageScrollRestoreTimer)
  }

  if (releaseScrollTimer !== undefined) {
    window.clearTimeout(releaseScrollTimer)
  }

  tocTrackTween?.kill()
  contentObserver?.disconnect()
})

function handleDocsNavigationCapture(event: Event) {
  if (
    event instanceof MouseEvent
    && (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
  ) {
    return
  }

  const target = event.target instanceof Element
    ? event.target.closest<HTMLAnchorElement>('a[href]')
    : null

  if (!target) {
    return
  }

  const url = new URL(target.href, window.location.href)

  if (url.origin !== window.location.origin || !url.pathname.startsWith('/docs')) {
    return
  }

  const currentKey = routeScrollKey(route.fullPath)
  const targetKey = routeScrollKey(`${url.pathname}${url.search}${url.hash}`)

  if (currentKey === targetKey) {
    return
  }

  savePageScrollPosition(currentKey)
  isChangingDocsRoute = true
}

watch(
  () => route.fullPath,
  (fullPath, previousFullPath) => {
    const currentKey = routeScrollKey(fullPath)
    const previousKey = routeScrollKey(previousFullPath)

    if (currentKey === previousKey) {
      return
    }

    if (!docsPageScrollPositions.has(previousKey)) {
      savePageScrollPosition(previousKey)
    }
    tocItems.value = []
    tocTargets.clear()
    setActiveTocIds([])
    requestHashScroll(route.hash)

    if (!decodeHash(route.hash)) {
      schedulePageScrollRestore(currentKey)
    } else {
      isChangingDocsRoute = false
    }
  },
)

watch(
  () => route.hash,
  (hash) => requestHashScroll(hash),
)

function requestHashScroll(hash: string) {
  pendingHashScrollId = decodeHash(hash)

  if (hashScrollFrame) {
    window.cancelAnimationFrame(hashScrollFrame)
    hashScrollFrame = 0
  }

  scheduleTocRefresh()

  if (!pendingHashScrollId) {
    updateActiveToc()
  }
}

function setupContentObserver() {
  if (!contentRef.value || typeof MutationObserver === 'undefined') {
    return
  }

  // 示例排序、虚拟行和代码高亮都会改动子节点，但不会改变目录。
  contentObserver = new MutationObserver(records => {
    const affectsToc = records.some(record => {
      const target = record.target instanceof Element ? record.target : record.target.parentElement
      if (target?.closest('h1, h2, h3')) return true
      if (record.type === 'attributes') return target?.matches('h1, h2, h3, section')
      return [...record.addedNodes, ...record.removedNodes].some(node =>
        node instanceof Element && (node.matches(tocMutationSelector) || node.querySelector(tocMutationSelector)),
      )
    })
    if (affectsToc) scheduleTocRefresh()
  })
  contentObserver.observe(contentRef.value, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['id'],
  })
}

function scheduleTocRefresh() {
  void nextTick(() => {
    if (tocRefreshFrame) {
      window.cancelAnimationFrame(tocRefreshFrame)
    }

    tocRefreshFrame = window.requestAnimationFrame(() => {
      tocRefreshFrame = 0
      refreshToc()
    })
  })
}

function refreshToc() {
  const content = getCurrentDocPageElement()
  tocTargets.clear()

  if (!content) {
    tocItems.value = []
    setActiveTocIds([])
    return
  }

  const targets = Array.from(
    content.querySelectorAll<HTMLElement>(
      tocSelector,
    ),
  )

  const nextItems: TocItem[] = targets.map((target) => {
    const heading = target.matches('section')
      ? target.querySelector<HTMLElement>('h2, h3')
      : target
    const tagName = heading?.tagName.toLowerCase()
    tocTargets.set(target.id, { target, heading: heading || target })

    return {
      id: target.id,
      label: heading?.textContent?.trim() || target.id,
      depth: tagName === 'h3' ? 3 : tagName === 'h2' ? 2 : 1,
    }
  })
  if (nextItems.length !== tocItems.value.length || nextItems.some((item, index) => {
    const previous = tocItems.value[index]
    return item.id !== previous?.id || item.label !== previous.label || item.depth !== previous.depth
  })) tocItems.value = nextItems

  pageScrollbarRef.value?.update()
  tocScrollbarRef.value?.update()

  const hashScrollId = pendingHashScrollId

  if (hashScrollId && getContentTarget(hashScrollId)) {
    pendingHashScrollId = ''
    setActiveTocIds([hashScrollId])
    scheduleHashScroll(hashScrollId)
    return
  }

  updateActiveToc()
  scheduleTocTrackUpdate()
}

function scheduleHashScroll(id: string) {
  hashScrollFrame = window.requestAnimationFrame(() => {
    hashScrollFrame = 0

    if (decodeHash(window.location.hash) !== id) {
      return
    }

    scrollToHeading(id, 'auto')
    hashScrollFrame = window.requestAnimationFrame(() => {
      hashScrollFrame = 0

      if (decodeHash(window.location.hash) === id) {
        scrollToHeading(id, 'auto')
      }
    })
  })
}

function handleScroll() {
  if (!isProgrammaticScroll && !isChangingDocsRoute && !pendingPageScrollKey) {
    savePageScrollPosition()
  }

  if (scrollFrame) {
    return
  }

  scrollFrame = window.requestAnimationFrame(() => {
    scrollFrame = 0

    if (isProgrammaticScroll) {
      if (programmaticTocId) {
        setActiveTocIds([programmaticTocId])
      }

      scheduleProgrammaticScrollRelease('smooth')
      return
    }

    updateActiveToc()
  })
}

function handleResize() {
  handleScroll()
  scheduleTocTrackUpdate()
}

function updateActiveToc() {
  if (!tocItems.value.length) {
    setActiveTocIds([])
    return
  }

  const viewport = getPageViewport()
  const viewportRect = viewport?.getBoundingClientRect()
  const viewportTop = viewportRect?.top || 0
  const viewportBottom = viewportRect?.bottom || window.innerHeight
  const checkpoint = viewport ? viewportTop + pageAnchorOffset + 8 : windowAnchorOffset + 8
  const visibleBottom = viewportBottom - 24
  const visibleIds: string[] = []
  let currentId = tocItems.value[0]?.id || ''

  for (const item of tocItems.value) {
    const target = getContentHeadingTarget(item.id)

    if (!target) {
      continue
    }

    const rect = target.getBoundingClientRect()

    if (rect.top <= checkpoint) {
      currentId = item.id
    }

    if (rect.bottom >= viewportTop + 4 && rect.top <= visibleBottom) {
      visibleIds.push(item.id)
    }
  }

  setActiveTocIds(visibleIds.length ? visibleIds : [currentId])
}

function scrollToHeading(id: string, behavior: ScrollBehavior = 'smooth') {
  const target = getContentTarget(id)

  if (!target) {
    return
  }

  setActiveTocIds([id])
  // 用户已选择章节，之前的切页滚动恢复不能再覆盖这次定位。
  pendingPageScrollKey = ''
  pendingPageScrollPosition = undefined
  isChangingDocsRoute = false
  isProgrammaticScroll = true
  programmaticTocId = id

  if (releaseScrollTimer !== undefined) {
    window.clearTimeout(releaseScrollTimer)
  }

  const viewport = getPageViewport()

  if (viewport) {
    const viewportRect = viewport.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    const top = viewport.scrollTop + targetRect.top - viewportRect.top - pageAnchorOffset
    const maxTop = Math.max(0, viewport.scrollHeight - viewport.clientHeight)

    pageScrollbarRef.value?.scrollTo({ top, behavior })
    docsPageScrollPositions.set(routeScrollKey(route.fullPath), {
      left: viewport.scrollLeft,
      top: Math.min(Math.max(0, top), maxTop),
    })
  } else {
    window.scrollTo({
      top: window.scrollY + target.getBoundingClientRect().top - windowAnchorOffset,
      behavior,
    })
  }

  window.history.replaceState(
    window.history.state,
    '',
    `${window.location.pathname}${window.location.search}#${id}`,
  )

  scheduleProgrammaticScrollRelease(behavior)
}

function scheduleProgrammaticScrollRelease(behavior: ScrollBehavior) {
  if (releaseScrollTimer !== undefined) {
    window.clearTimeout(releaseScrollTimer)
  }

  releaseScrollTimer = window.setTimeout(() => {
    isProgrammaticScroll = false
    programmaticTocId = ''
    updateActiveToc()
  }, behavior === 'auto' ? 0 : 160)
}

function getPageViewport() {
  return pageScrollbarRef.value?.viewport || null
}

function getCurrentDocPageElement() {
  const path = route.path.replace(/\/$/, '')
  // 连点时新旧页面可能短暂共存；目录、锚点和滚动恢复只读取当前路由的正文。
  const documentRoot = Array.from(contentRef.value?.querySelectorAll<HTMLElement>('[data-docs-route]') || [])
    .find(element => element.dataset.docsRoute === path)
  return documentRoot?.matches('.doc-page')
    ? documentRoot
    : documentRoot?.querySelector<HTMLElement>('.doc-page') || null
}

function savePageScrollPosition(key = routeScrollKey(route.fullPath)) {
  const viewport = getPageViewport()

  if (!viewport || !key) {
    return
  }

  docsPageScrollPositions.set(key, {
    left: viewport.scrollLeft,
    top: viewport.scrollTop,
  })
}

function getContentTarget(id: string) {
  const cached = tocTargets.get(id)?.target
  if (cached?.isConnected && contentRef.value?.contains(cached)) return cached
  const content = getCurrentDocPageElement()

  if (!content) {
    return null
  }

  return content.querySelector<HTMLElement>(`#${CSS.escape(id)}`)
}

function getContentHeadingTarget(id: string) {
  const cached = tocTargets.get(id)?.heading
  if (cached?.isConnected && contentRef.value?.contains(cached)) return cached
  const target = getContentTarget(id)

  if (!target) {
    return null
  }

  if (target.matches('h1, h2, h3')) {
    return target
  }

  return target.querySelector<HTMLElement>('h1, h2, h3') || target
}

function setActiveTocIds(ids: string[]) {
  const nextIds = ids.filter((id, index) => id && ids.indexOf(id) === index)
  const currentIds = activeTocIds.value

  if (
    nextIds.length === currentIds.length
    && nextIds.every((id, index) => id === currentIds[index])
  ) {
    return
  }

  activeTocIds.value = nextIds
  scheduleTocTrackUpdate()
}

function scheduleTocTrackUpdate() {
  void nextTick(() => {
    if (tocTrackFrame) {
      window.cancelAnimationFrame(tocTrackFrame)
    }

    tocTrackFrame = window.requestAnimationFrame(() => {
      tocTrackFrame = 0
      updateTocTrack()
    })
  })
}

function updateTocTrack() {
  const list = tocListRef.value
  const rail = tocTrackRailRef.value
  const track = tocActiveTrackRef.value
  const activeLinks = activeTocIds.value
    .map((id) => getTocLinkElement(id))
    .filter((link): link is HTMLAnchorElement => Boolean(link))

  if (!track || !rail) {
    return
  }

  if (!list || !activeLinks.length) {
    animateTocTrack(track, 0, 0, false)
    return
  }

  const railRect = rail.getBoundingClientRect()
  const allLinks = Array.from(list.querySelectorAll<HTMLAnchorElement>('a'))
  const firstRect = activeLinks[0]!.getBoundingClientRect()
  const lastRect = activeLinks[activeLinks.length - 1]!.getBoundingClientRect()
  const firstIsListStart = activeLinks[0] === allLinks[0]
  const lastIsListEnd = activeLinks[activeLinks.length - 1] === allLinks[allLinks.length - 1]
  const top = firstIsListStart
    ? 0
    : snapToDevicePixel(firstRect.top - railRect.top)
  const bottom = lastIsListEnd
    ? railRect.height
    : snapToDevicePixel(lastRect.bottom - railRect.top)
  const height = Math.max(0, bottom - top)
  const scale = railRect.height > 0
    ? Math.min(1, height / railRect.height)
    : 0

  animateTocTrack(
    track,
    top,
    scale,
    true,
  )
}

function animateTocTrack(
  track: HTMLElement,
  top: number,
  scale: number,
  visible: boolean,
) {
  if (lastTocTrackElement !== track) {
    lastTocTrackElement = track
    lastTocTrackTop = 0
    lastTocTrackScale = 0
    lastTocTrackVisible = false
    $gsap.set(track, { y: 0, scaleY: 0, autoAlpha: 0 })
  }

  if (
    top === lastTocTrackTop
    && scale === lastTocTrackScale
    && visible === lastTocTrackVisible
  ) {
    return
  }

  lastTocTrackTop = top
  lastTocTrackScale = scale
  lastTocTrackVisible = visible
  tocTrackTween?.kill()

  const vars = {
    y: top,
    scaleY: visible ? scale : 0,
    autoAlpha: visible ? 1 : 0,
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    $gsap.set(track, vars)
    tocTrackTween = null
    return
  }

  tocTrackTween = $gsap.to(track, {
    ...vars,
    duration: visible ? 0.22 : 0.12,
    ease: 'power2.out',
    overwrite: 'auto',
    onComplete: () => {
      tocTrackTween = null
    },
  })
}

function snapToDevicePixel(value: number) {
  const ratio = window.devicePixelRatio || 1
  return Math.round(value * ratio) / ratio
}

function getTocLinkElement(id: string) {
  const list = tocListRef.value

  if (!list) {
    return null
  }

  return Array.from(list.querySelectorAll<HTMLAnchorElement>('a')).find(
    (link) => decodeHash(link.hash) === id,
  ) || null
}

function schedulePageScrollRestore(key: string) {
  pendingPageScrollKey = key
  pendingPageScrollPosition = docsPageScrollPositions.get(key) || { left: 0, top: 0 }
  pendingPageScrollAttempts = 0
  queuePageScrollRestore(0)
}

function queuePageScrollRestore(delay = 0) {
  if (pageScrollRestoreFrame) {
    window.cancelAnimationFrame(pageScrollRestoreFrame)
    pageScrollRestoreFrame = 0
  }

  if (pageScrollRestoreTimer !== undefined) {
    window.clearTimeout(pageScrollRestoreTimer)
    pageScrollRestoreTimer = undefined
  }

  const scheduleFrame = () => {
    pageScrollRestoreFrame = window.requestAnimationFrame(() => {
      pageScrollRestoreFrame = 0
      applyPageScrollRestore()
    })
  }

  if (delay > 0) {
    pageScrollRestoreTimer = window.setTimeout(() => {
      pageScrollRestoreTimer = undefined
      scheduleFrame()
    }, delay)
    return
  }

  void nextTick(scheduleFrame)
}

function applyPageScrollRestore() {
  const key = pendingPageScrollKey

  if (!key || key !== routeScrollKey(route.fullPath) || decodeHash(route.hash)) {
    pendingPageScrollKey = ''
    pendingPageScrollPosition = undefined
    isChangingDocsRoute = false
    return
  }

  const position = pendingPageScrollPosition || { left: 0, top: 0 }
  const viewport = getPageViewport()
  const currentPageElement = getCurrentDocPageElement()

  // Nuxt 的 route 在新页解析完成后同步，无需再等待离场元素消失。
  if (!currentPageElement) {
    pendingPageScrollAttempts += 1

    if (pendingPageScrollAttempts < 16) {
      queuePageScrollRestore(40)
      return
    }
  }

  if (!viewport) {
    pendingPageScrollAttempts += 1

    if (pendingPageScrollAttempts < 16) {
      queuePageScrollRestore(180)
      return
    }

    pendingPageScrollKey = ''
    pendingPageScrollPosition = undefined
    isChangingDocsRoute = false
    return
  }

  pageScrollbarRef.value?.scrollTo({
    left: position.left,
    top: position.top,
    behavior: 'auto',
  })
  pageScrollbarRef.value?.update()
  updateActiveToc()

  pendingPageScrollAttempts += 1
  const maxTop = Math.max(0, viewport.scrollHeight - viewport.clientHeight)
  const isWaitingForTargetHeight = position.top > maxTop + 1

  if (pendingPageScrollAttempts < 16 && position.top > 0 && isWaitingForTargetHeight) {
    queuePageScrollRestore(180)
    return
  }

  pendingPageScrollKey = ''
  pendingPageScrollPosition = undefined
  isChangingDocsRoute = false
}

function decodeHash(hash: string) {
  if (!hash.startsWith('#')) {
    return ''
  }

  try {
    return decodeURIComponent(hash.slice(1))
  } catch {
    return hash.slice(1)
  }
}
</script>

<template>
  <div class="site-shell docs-layout-shell">
    <SiteHeader />

    <BingScrollbar
      ref="pageScrollbarRef"
      class="docs-page-scrollbar"
      :height="pageScrollbarHeight"
      always
      aria-label="文档页面"
      @scroll="handleScroll"
    >
      <div class="docs-shell">
        <aside class="docs-sidebar" :class="{ 'is-open': mobileNavOpen }" aria-label="文档导航" @keydown.esc="closeMobileNav">
          <p class="docs-sidebar-label">文档</p>
          <button ref="mobileNavToggle" class="docs-navigation-toggle" type="button" :aria-expanded="mobileNavOpen" aria-controls="docs-navigation" @click="mobileNavOpen = !mobileNavOpen">
            <span>文档导航</span><span aria-hidden="true">{{ mobileNavOpen ? '收起' : '展开' }}</span>
          </button>

          <BingScrollbar
            id="docs-navigation"
            class="docs-sidebar-scrollbar"
            :max-height="navScrollbarMaxHeight"
            always
            aria-label="文档导航"
          >
            <nav
              class="docs-nav-list"
              aria-label="文档导航"
              @click="mobileNavOpen = false"
              @dragstart.prevent
            >
              <NuxtLink to="/docs">快速开始</NuxtLink>
              <NuxtLink to="/docs/upgrade">{{ upgradeGuideTitle }}</NuxtLink>
              <NuxtLink to="/docs/components/animated-text">AnimatedText</NuxtLink>
              <NuxtLink to="/docs/components/app-switcher-transition">AppSwitcherTransition</NuxtLink>
              <NuxtLink to="/docs/components/button">Button</NuxtLink>
              <NuxtLink to="/docs/components/card">Card</NuxtLink>
              <NuxtLink to="/docs/components/carousel-transition">CarouselTransition</NuxtLink>
              <NuxtLink to="/docs/components/checkbox">Checkbox</NuxtLink>
              <NuxtLink to="/docs/components/checkbox-group">CheckboxGroup</NuxtLink>
              <NuxtLink to="/docs/components/code-block">CodeBlock</NuxtLink>
              <NuxtLink to="/docs/components/color-picker">ColorPicker</NuxtLink>
              <NuxtLink to="/docs/components/config-provider">ConfigProvider</NuxtLink>
              <NuxtLink to="/docs/components/cursor">Cursor</NuxtLink>
              <NuxtLink to="/docs/components/date-picker">DatePicker</NuxtLink>
              <NuxtLink to="/docs/components/deck-transition">DeckTransition</NuxtLink>
              <NuxtLink to="/docs/components/dialog">Dialog</NuxtLink>
              <NuxtLink to="/docs/components/drag-drop">DragDrop</NuxtLink>
              <NuxtLink to="/docs/components/drop-down">DropDown</NuxtLink>
              <NuxtLink to="/docs/components/file-preview">FilePreview</NuxtLink>
              <NuxtLink to="/docs/components/form">Form</NuxtLink>
              <NuxtLink to="/docs/components/form-item">FormItem</NuxtLink>
              <NuxtLink to="/docs/components/icon">Icon</NuxtLink>
              <NuxtLink to="/docs/components/image">Image</NuxtLink>
              <NuxtLink to="/docs/components/image-preview">ImagePreview</NuxtLink>
              <NuxtLink to="/docs/components/input">Input</NuxtLink>
              <NuxtLink to="/docs/components/radio">Radio</NuxtLink>
              <NuxtLink to="/docs/components/radio-group">RadioGroup</NuxtLink>
              <NuxtLink to="/docs/components/resizable">Resizable</NuxtLink>
              <NuxtLink to="/docs/components/scrollbar">Scrollbar</NuxtLink>
              <NuxtLink to="/docs/components/slider">Slider</NuxtLink>
              <NuxtLink to="/docs/components/split-pane">SplitPane</NuxtLink>
              <NuxtLink to="/docs/components/select">Select</NuxtLink>
              <NuxtLink to="/docs/components/autocomplete">Autocomplete</NuxtLink>
              <NuxtLink to="/docs/components/sortable-list">SortableList</NuxtLink>
              <NuxtLink to="/docs/components/table">Table</NuxtLink>
              <NuxtLink to="/docs/components/table-column-controls">TableColumnControls</NuxtLink>
              <NuxtLink to="/docs/components/tree-select">TreeSelect</NuxtLink>
              <NuxtLink to="/docs/components/tabs">Tabs</NuxtLink>
              <NuxtLink to="/docs/components/tag">Tag</NuxtLink>
              <NuxtLink to="/docs/components/textarea">Textarea</NuxtLink>
              <NuxtLink to="/docs/components/toast">Toast</NuxtLink>
              <NuxtLink to="/docs/components/tooltip">Tooltip</NuxtLink>
              <span class="docs-disabled-link">更多组件</span>
            </nav>
          </BingScrollbar>
        </aside>

        <main ref="contentRef" class="docs-content">
          <slot />
        </main>

        <aside v-if="tocItems.length" class="docs-toc" aria-label="本页目录">
          <p class="docs-sidebar-label">本页目录</p>

          <BingScrollbar
            ref="tocScrollbarRef"
            class="docs-toc-scrollbar"
            :max-height="navScrollbarMaxHeight"
            always
            aria-label="本页目录"
          >
            <nav ref="tocListRef" class="docs-toc-list" aria-label="本页目录">
              <span ref="tocTrackRailRef" class="docs-toc-track-rail" aria-hidden="true">
                <span ref="tocActiveTrackRef" class="docs-toc-active-track" />
              </span>
              <a
                v-for="item in tocItems"
                :key="item.id"
                class="docs-toc-link"
                :class="[
                  `docs-toc-link--level-${item.depth}`,
                  { 'is-active': activeTocIds.includes(item.id) },
                ]"
                :href="`#${item.id}`"
                :title="item.label"
                :aria-current="activeTocIds[0] === item.id ? 'location' : undefined"
                @click.prevent="scrollToHeading(item.id)"
              >
                {{ item.label }}
              </a>
            </nav>
          </BingScrollbar>
        </aside>
      </div>
    </BingScrollbar>
  </div>
</template>
