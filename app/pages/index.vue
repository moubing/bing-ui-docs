<script setup lang="ts">
import { computed, nextTick, onActivated, onBeforeUnmount, onDeactivated, onMounted, ref } from 'vue'
import { docsVersion, componentMigrations } from '#shared/docs/migration'
import { publicEntries } from '#shared/docs/entries'
import HomeShowcase from '../../examples/home/showcase.vue'
import showcaseSource from '../../examples/home/showcase.vue?raw'
import type { CSSProperties } from 'vue'
import {
  BingAnimatedText,
  BingButton,
  BingCard,
  BingCodeBlock,
  BingColorPicker,
  BingSortableList,
  BingTabs,
  BingTag,
  bingToast,
} from '@moubing/bing-ui'
import DocsToastViewport from '~/components/content/DocsToastViewport.vue'
import type {
  BingSortableListKey,
  BingTabItem,
  BingTabValue,
} from '@moubing/bing-ui'

type CompositionItem = {
  id: string
  label: string
  detail: string
  tone: 'pink' | 'sky' | 'green'
}

const installCommand = `pnpm add @moubing/bing-ui@${docsVersion.packageVersion} gsap@^3.15.0`
const componentCount = Object.keys(componentMigrations).length
const examplesActive = ref(true)
const homeRoot = ref<HTMLElement | null>(null)
const activeScene = ref<BingTabValue>('motion')
const accent = ref('#52525b')
const copied = ref(false)

const sceneTabs: BingTabItem[] = [
  { value: 'motion', label: 'Motion' },
  { value: 'controls', label: 'Controls' },
  { value: 'compose', label: 'Compose' },
]

const accentPresets = [
  { label: '中性灰', value: '#52525b' },
  { label: '蓝色', value: '#38bdf8' },
  { label: '紫色', value: '#c084fc' },
  { label: '绿色', value: '#34d399' },
]

const componentLinks = [
  { label: 'AnimatedText', path: '/docs/components/animated-text', tone: 'pink' },
  { label: 'Button', path: '/docs/components/button', tone: 'sky' },
  { label: 'Card', path: '/docs/components/card', tone: 'green' },
  { label: 'ColorPicker', path: '/docs/components/color-picker', tone: 'purple' },
  { label: 'Cursor', path: '/docs/components/cursor', tone: 'pink' },
  { label: 'DeckTransition', path: '/docs/components/deck-transition', tone: 'pink' },
  { label: 'Dialog', path: '/docs/components/dialog', tone: 'sky' },
  { label: 'SortableList', path: '/docs/components/sortable-list', tone: 'green' },
  { label: 'Table', path: '/docs/components/table', tone: 'purple' },
  { label: 'Toast', path: '/docs/components/toast', tone: 'pink' },
  { label: 'TreeSelect', path: '/docs/components/tree-select', tone: 'sky' },
]

const featureCards = [
  {
    index: '01',
    title: '动效有意图',
    description: '把节奏、缓动与触发方式封装进组件，让反馈服务于理解，而不是抢夺注意力。',
    meta: 'GSAP · reduced motion',
    tone: 'pink',
  },
  {
    index: '02',
    title: '组合很清晰',
    description: '显式的 Props、Emits、Slots 与导出类型，让复杂交互仍然容易阅读和维护。',
    meta: 'Vue 3 · TypeScript',
    tone: 'sky',
  },
  {
    index: '03',
    title: '主题有弹性',
    description: '亮色、深色与跟随系统共享一套语义变量，也能快速切换成你的品牌语言。',
    meta: 'semantic tokens',
    tone: 'green',
  },
]

const showcaseCode = showcaseSource.trim()

const compositionItems: CompositionItem[] = [
  { id: 'motion', label: 'Motion layer', detail: 'GSAP timeline', tone: 'pink' },
  { id: 'content', label: 'Content layer', detail: 'Typed slots', tone: 'sky' },
  { id: 'feedback', label: 'Feedback layer', detail: 'Toast & states', tone: 'green' },
]
const compositionOrder = ref<BingSortableListKey[]>(compositionItems.map(item => item.id))
const compositionItemKey = (item: CompositionItem) => item.id

const stageStyle = computed<CSSProperties>(() => {
  const rgb = hexToRgb(accent.value)
  const channels = [rgb.r, rgb.g, rgb.b].map(value => {
    const channel = value / 255
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })
  const luminance = channels[0]! * 0.2126 + channels[1]! * 0.7152 + channels[2]! * 0.0722

  return {
    '--home-accent': accent.value,
    '--bing-accent': accent.value,
    '--bing-accent-solid': accent.value,
    '--bing-accent-strong': accent.value,
    '--bing-accent-solid-rgb': `${rgb.r} ${rgb.g} ${rgb.b}`,
    '--bing-accent-strong-rgb': `${rgb.r} ${rgb.g} ${rgb.b}`,
    '--bing-accent-soft': `rgb(${rgb.r} ${rgb.g} ${rgb.b} / 0.12)`,
    '--bing-accent-contrast': luminance > 0.179 ? '#000000' : '#ffffff',
    '--bing-accent-rgb': `${rgb.r} ${rgb.g} ${rgb.b}`,
    '--bing-focus': `rgb(${rgb.r} ${rgb.g} ${rgb.b} / 0.42)`,
  } as CSSProperties
})

const { $gsap } = useNuxtApp()
let animationMedia: ReturnType<typeof $gsap.matchMedia> | undefined
let copyResetTimer: ReturnType<typeof setTimeout> | undefined

useHead({
  title: 'Bing UI · 让界面动得恰到好处',
  meta: [
    {
      name: 'description',
      content: 'Bing UI 是一套专注创意交互、精致动效与真实产品体验的 Vue 3 组件库。',
    },
  ],
})

function startAnimations() {
  if (!homeRoot.value || animationMedia) return

  animationMedia = $gsap.matchMedia()
  animationMedia.add(
    '(min-width: 960px) and (prefers-reduced-motion: no-preference)',
    () => {
      // 首屏入场由 CSS 随首次绘制启动；客户端只接管持续动效，避免重新隐藏 SSR 内容。
      $gsap.to('.home-float--motion', {
        y: -8,
        rotation: -1.5,
        duration: 3.8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
      $gsap.to('.home-float--type', {
        y: 7,
        rotation: 1.5,
        duration: 4.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
    },
    homeRoot.value,
  )
}

function stopAnimations() {
  animationMedia?.revert()
  animationMedia = undefined
  if (copyResetTimer !== undefined) clearTimeout(copyResetTimer)
  copyResetTimer = undefined
  copied.value = false
  bingToast.clear()
}

onMounted(startAnimations)
onActivated(() => { examplesActive.value = true; void nextTick(startAnimations) })
onDeactivated(() => { examplesActive.value = false; stopAnimations() })
onBeforeUnmount(stopAnimations)

function goToDocs() {
  void navigateTo('/docs')
}

function goToComponents() {
  void navigateTo('/docs/components/animated-text')
}

function showPreviewToast() {
  bingToast.success({
    title: '交互已就绪',
    message: '反馈、主题与动效正在使用同一套设计语言。',
    position: 'top-right',
    duration: 2400,
  })
}

async function copyInstallCommand() {
  const success = await copyText(installCommand)

  if (!success) {
    bingToast.error({
      title: '复制失败',
      message: '请手动选择安装命令。',
      position: 'top-right',
      duration: 2400,
    })
    return
  }

  copied.value = true
  bingToast.success({
    title: '安装命令已复制',
    message: installCommand,
    position: 'top-right',
    duration: 2200,
  })

  if (copyResetTimer !== undefined) clearTimeout(copyResetTimer)
  copyResetTimer = setTimeout(() => {
    copied.value = false
  }, 1800)
}

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = value
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const success = document.execCommand('copy')
    textarea.remove()
    return success
  }
}

function hexToRgb(value: string) {
  const normalized = value.trim().replace(/^#/, '')
  const hex = normalized.length === 3
    ? normalized.split('').map(character => `${character}${character}`).join('')
    : normalized.slice(0, 6)
  const parsed = Number.parseInt(hex, 16)

  if (!Number.isFinite(parsed) || hex.length !== 6) {
    return { r: 82, g: 82, b: 91 }
  }

  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255,
  }
}
</script>

<template>
  <div ref="homeRoot" class="home-page">
    <ClientOnly v-if="examplesActive">
      <DocsToastViewport viewport-position="top-right" width="360px" offset="36px" />
    </ClientOnly>

    <section class="landing-hero" aria-labelledby="home-title">
      <div class="home-copy-column">
        <div class="home-reveal home-kicker">
          <BingTag label="Vue 3 · TypeScript · GSAP" tone="primary" variant="soft" size="sm" />
          <span class="home-version">v{{ docsVersion.packageVersion }}</span>
        </div>

        <h1 id="home-title" class="home-reveal home-title">
          <span class="home-title__brand">Bing UI</span>
          <span class="home-title__statement">
            让界面，
            <BingAnimatedText
              v-if="examplesActive"
              effect="shine"
              trigger="once"
              shine-color="#71717a"
              :shine-speed="1.7"
            >动得恰到好处。</BingAnimatedText>
          </span>
        </h1>

        <p class="home-reveal home-lead">
          一套专注创意交互、精致动效与真实产品体验的 Vue 3 组件库。
          用清晰的 API，把有感觉的界面带进每一次构建。
        </p>

        <div class="home-reveal home-actions-new">
          <BingButton
            size="lg"
            rounded="md"
            text-effect="jump"
            text-effect-trigger="hover"
            :throttle="false"
            @click="goToDocs"
          >
            <span>开始使用</span>
            <template #suffix><span aria-hidden="true">→</span></template>
          </BingButton>
          <BingButton
            variant="secondary"
            size="lg"
            rounded="md"
            :throttle="false"
            @click="goToComponents"
          >
            浏览组件
          </BingButton>
        </div>

        <p class="home-entry-note">
          在本站查看安装、API 与升级说明；前往
          <a :href="publicEntries.storybook" target="_blank" rel="noopener noreferrer">Storybook 体验组件交互 ↗</a>。
        </p>

        <button
          class="home-reveal install-command"
          type="button"
          :aria-label="copied ? '安装命令已复制' : '复制安装命令'"
          @click="copyInstallCommand"
        >
          <span class="install-command__prompt" aria-hidden="true">›</span>
          <code>{{ installCommand }}</code>
          <span class="install-command__copy" aria-live="polite">
            {{ copied ? '已复制' : '复制' }}
          </span>
        </button>

        <dl class="home-reveal home-facts" aria-label="组件库信息">
          <div><dt>{{ componentCount }}</dt><dd>组件与动效</dd></div>
          <div><dt>3</dt><dd>主题模式</dd></div>
          <div><dt>100%</dt><dd>TypeScript</dd></div>
        </dl>
      </div>

      <div class="home-visual-column" :style="stageStyle">
        <div class="home-stage">
          <div class="home-stage__bar">
            <span class="stage-dots" aria-hidden="true"><i></i><i></i><i></i></span>
            <span class="stage-file">interaction-lab.vue</span>
            <span class="stage-live"><i aria-hidden="true"></i> Live</span>
          </div>

          <div class="home-stage__toolbar">
            <div>
              <span class="stage-label">PLAYGROUND</span>
              <strong>Design the feeling</strong>
            </div>
            <BingTabs
              v-model="activeScene"
              :items="sceneTabs"
              size="sm"
              variant="soft"
              aria-label="选择交互演示"
            />
          </div>

          <div class="home-stage__canvas">
            <Transition name="scene-swap" mode="out-in">
              <div v-if="activeScene === 'motion'" key="motion" class="stage-scene stage-scene--motion">
                <div class="motion-heading">
                  <BingTag label="INTENTIONAL MOTION" tone="secondary" size="sm" />
                  <span>01 / 03</span>
                </div>
                <h2>
                  <BingAnimatedText
                    v-if="examplesActive"
                    class="motion-title"
                    effect="jump"
                    trigger="hover"
                    :jump-y="-8"
                    :jump-stagger="0.025"
                  >
                    <span class="motion-title-phrase">每一次反馈，</span><wbr>
                    <span class="motion-title-phrase">都有理由。</span>
                  </BingAnimatedText>
                </h2>
                <p>悬停标题，感受由组件封装好的节奏与回弹。</p>

                <div class="motion-grid">
                  <template v-if="examplesActive">
                    <BingCard
                      class="motion-card motion-card--primary"
                      variant="accent"
                      rounded="lg"
                      padding="sm"
                      entrance="none"
                      :tilt-max="5"
                    >
                      <span class="motion-card__icon">↗</span>
                      <strong>Responsive</strong>
                      <small>pointer · focus · touch</small>
                    </BingCard>
                    <BingCard
                      class="motion-card"
                      variant="sky"
                      rounded="lg"
                      padding="sm"
                      entrance="none"
                      :tilt-max="5"
                    >
                      <span class="motion-card__pulse" aria-hidden="true"></span>
                      <strong>Purposeful</strong>
                      <small>motion with intent</small>
                    </BingCard>
                  </template>
                </div>
              </div>

              <div v-else-if="activeScene === 'controls'" key="controls" class="stage-scene stage-scene--controls">
                <div class="controls-heading">
                  <div>
                    <span class="stage-label">LIVE THEME</span>
                    <h2>把品牌色交给语义变量。</h2>
                  </div>
                  <code>{{ accent.toUpperCase() }}</code>
                </div>

                <div class="accent-control">
                  <span>Accent color</span>
                  <BingColorPicker
                    id="home-stage-accent-picker"
                    v-model="accent"
                    :presets="accentPresets"
                :width="160"
                :min-width="120"
                    size="sm"
                    aria-label="选择演示强调色"
                  />
                </div>

                <div class="control-preview">
                  <div class="control-preview__tags">
                    <BingTag label="Creative" tone="primary" />
                    <BingTag label="Typed" tone="secondary" />
                    <BingTag label="Accessible" tone="success" />
                  </div>
                  <div class="control-preview__buttons">
                    <BingButton size="sm" rounded="md" :throttle="false">确认发布</BingButton>
                    <BingButton variant="secondary" size="sm" rounded="md" :throttle="false">
                      保存草稿
                    </BingButton>
                  </div>
                </div>
              </div>

              <div v-else key="compose" class="stage-scene stage-scene--compose">
                <div class="compose-heading">
                  <div>
                    <span class="stage-label">COMPOSABLE</span>
                    <h2>拖动图层，重组你的界面。</h2>
                  </div>
                  <span class="compose-hint">拖拽或使用键盘</span>
                </div>

                <ClientOnly v-if="examplesActive">
                  <BingSortableList
                    v-model:order="compositionOrder"
                    :items="compositionItems"
                    :item-key="compositionItemKey"
                    reorder-mode="live"
                    aria-label="界面图层排序演示"
                  >
                    <template #default="{ item, handleProps, dragging }">
                      <div class="compose-item" :class="{ 'is-dragging': dragging }">
                        <button class="compose-handle" type="button" v-bind="handleProps">
                          <i></i><i></i><i></i>
                        </button>
                        <span class="compose-dot" :class="`is-${item.tone}`"></span>
                        <span class="compose-item__copy">
                          <strong>{{ item.label }}</strong>
                          <small>{{ item.detail }}</small>
                        </span>
                        <code>{{ String(item.id).padStart(2, '0') }}</code>
                      </div>
                    </template>
                  </BingSortableList>
                  <template #fallback>
                    <div class="compose-fallback">Motion · Content · Feedback</div>
                  </template>
                </ClientOnly>
              </div>
            </Transition>
          </div>

          <div class="home-stage__footer">
            <span><i class="status-dot" aria-hidden="true"></i> All systems ready</span>
            <code>60 fps</code>
          </div>
        </div>

        <div class="home-float home-float--motion" aria-hidden="true">
          <span>✦</span><strong>Motion</strong><small>power3.out</small>
        </div>
        <div class="home-float home-float--type" aria-hidden="true">
          <strong>&lt;BingCard /&gt;</strong><span>typed</span>
        </div>
      </div>
    </section>

    <nav class="component-rail" aria-label="精选组件">
      <div class="component-rail__intro">
        <span>EXPLORE</span>
        <strong>{{ componentCount }} 个组件</strong>
      </div>
      <div class="component-rail__list">
        <NuxtLink
          v-for="component in componentLinks"
          :key="component.label"
          :to="component.path"
          class="component-chip"
          :class="`is-${component.tone}`"
        >
          <i aria-hidden="true"></i>
          {{ component.label }}
        </NuxtLink>
      </div>
    </nav>

    <section class="home-section principles-section" aria-labelledby="principles-title">
      <div class="section-heading">
        <div>
          <span class="section-eyebrow">WHY BING UI</span>
          <h2 id="principles-title">交互不是装饰，<br>是产品表达的一部分。</h2>
        </div>
        <p>
          从最小的按钮反馈到完整的页面转场，Bing UI 让视觉、行为与代码保持同一种语气。
        </p>
      </div>

      <ol class="principle-grid">
        <li
          v-for="feature in featureCards"
          :key="feature.index"
          class="principle-card"
          :class="`is-${feature.tone}`"
        >
          <div class="principle-card__top">
            <span>{{ feature.index }}</span>
            <i aria-hidden="true"></i>
          </div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
          <code>{{ feature.meta }}</code>
        </li>
      </ol>
    </section>

    <section class="home-section build-section" aria-labelledby="build-title">
      <div class="section-heading section-heading--build">
        <div>
          <span class="section-eyebrow">BUILD BY COMPOSING</span>
          <h2 id="build-title">写下结构，<br>交互自然发生。</h2>
        </div>
        <p>
          真实组件、真实代码、真实反馈。点击右侧卡片翻面，或者触发一次 Toast。
        </p>
      </div>

      <div class="build-workbench" :style="stageStyle">
        <div class="code-panel">
          <div class="workbench-label">
            <span><i aria-hidden="true"></i> BrandCard.vue</span>
            <code>Vue</code>
          </div>
          <BingCodeBlock
            :code="showcaseCode"
            language="vue"
            title="可组合的交互卡片"
            :max-height="460"
            wrap
          />
        </div>

        <div class="preview-panel">
          <div class="preview-panel__bar">
            <span>LIVE PREVIEW</span>
            <span><i aria-hidden="true"></i> Interactive</span>
          </div>

          <div class="preview-panel__canvas">
            <div class="preview-orbit preview-orbit--one" aria-hidden="true"></div>
            <div class="preview-orbit preview-orbit--two" aria-hidden="true"></div>

            <ClientOnly v-if="examplesActive">
              <HomeShowcase />
              <template #fallback>
                <div class="showcase-card showcase-card--fallback">
                  Interfaces with feeling.
                </div>
              </template>
            </ClientOnly>
          </div>

          <div class="preview-panel__controls">
            <div>
              <span>Accent</span>
              <BingColorPicker
                id="home-preview-accent-picker"
                v-model="accent"
                :presets="accentPresets"
                :width="160"
                :min-width="120"
                size="sm"
                aria-label="选择预览强调色"
              />
            </div>
            <BingButton
              variant="secondary"
              size="sm"
              rounded="md"
              :throttle="false"
              @click="showPreviewToast"
            >
              触发反馈
            </BingButton>
          </div>
        </div>
      </div>
    </section>

    <section class="home-cta" aria-labelledby="cta-title">
      <span class="section-eyebrow">READY WHEN YOU ARE</span>
      <h2 id="cta-title">现在，开始构建<br>有感觉的界面。</h2>
      <p>从第一个组件开始，把细腻的交互带进你的 Vue 应用。</p>
      <div class="home-cta__actions">
        <BingButton
          size="lg"
          rounded="md"
          text-effect="shine"
          text-effect-trigger="hover"
          :throttle="false"
          @click="goToDocs"
        >
          阅读快速开始&nbsp; →
        </BingButton>
        <button type="button" class="cta-install" @click="copyInstallCommand">
          <code>{{ installCommand }}</code>
          <span>{{ copied ? '已复制' : '复制' }}</span>
        </button>
      </div>
    </section>

    <footer class="home-footer">
      <div class="home-footer__brand">
        <img
          class="home-footer__mark"
          src="/bing-ui-docs-logo.png"
          alt=""
          width="36"
          height="36"
          loading="lazy"
          decoding="async"
        >
        <div><strong>Bing UI</strong><small>Interfaces with feeling.</small></div>
      </div>
      <p>Built with Vue 3, TypeScript &amp; GSAP.</p>
      <div class="home-footer__links">
        <NuxtLink to="/docs">文档</NuxtLink>
        <NuxtLink to="/docs/upgrade">升级指南</NuxtLink>
        <NuxtLink to="/docs/components/animated-text">组件</NuxtLink>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.home-page {
  --home-accent: var(--bing-accent);
  position: relative;
  isolation: isolate;
}

.home-page h1,
.home-page h2,
.home-page h3,
.home-page strong { font-weight: 500; }

.landing-hero {
  display: grid;
  grid-template-columns: minmax(0, 0.88fr) minmax(540px, 1.12fr);
  gap: clamp(48px, 6vw, 104px);
  min-height: calc(100svh - 56px);
  align-items: center;
  padding: clamp(72px, 9vh, 112px) 0;
}

.home-copy-column {
  position: relative;
  z-index: 2;
}

.home-kicker,
.home-actions-new,
.home-facts,
.home-stage__bar,
.home-stage__toolbar,
.home-stage__footer,
.motion-heading,
.controls-heading,
.accent-control,
.control-preview__tags,
.control-preview__buttons,
.compose-heading,
.compose-item {
  display: flex;
  align-items: center;
}

.home-kicker {
  gap: 10px;
  margin-bottom: 22px;
}

.home-version {
  color: var(--muted);
  font-size: 0.74rem;
  font-weight: 500;
  letter-spacing: 0.06em;
}

.home-title {
  margin: 0;
  letter-spacing: -0.065em;
}

.home-title__brand,
.home-title__statement {
  display: block;
}

.home-title__brand {
  color: var(--ink);
  font-size: clamp(4.6rem, 7.4vw, 7rem);
  font-weight: 500;
  line-height: 0.84;
}

.home-title__statement {
  margin-top: 24px;
  color: var(--ink);
  font-size: clamp(2.1rem, 3.2vw, 3.55rem);
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: -0.055em;
}

.home-title__statement :deep(.bing-animated-text) {
  color: var(--doc-heading);
}

.home-lead {
  max-width: 610px;
  margin: 26px 0 0;
  color: var(--muted);
  font-family: var(--font-main);
  font-size: clamp(1rem, 1.25vw, 1.15rem);
  line-height: 1.85;
}

.home-actions-new {
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
}

.install-command {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  width: min(100%, 430px);
  min-height: 48px;
  gap: 12px;
  align-items: center;
  margin-top: 20px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: rgb(var(--doc-surface-rgb) / 0.64);
  box-shadow: var(--bing-shadow-sm);
  color: var(--muted);
  cursor: pointer;
  padding: 10px 14px;
  text-align: left;
  transition: border-color 180ms ease, background 180ms ease, transform 180ms ease;
}

.install-command:hover {
  border-color: color-mix(in srgb, var(--doc-heading) 34%, var(--line));
  background: var(--surface);
  transform: translateY(-2px);
}

.install-command:focus-visible {
  outline: 3px solid var(--bing-focus);
  outline-offset: 3px;
}

.install-command__prompt {
  color: var(--doc-heading);
  font-size: 1.2rem;
  font-weight: 500;
}

.install-command code {
  overflow: hidden;
  color: var(--ink);
  font-family: var(--font-main);
  font-size: 0.82rem;
  overflow-wrap: anywhere;
  white-space: normal;
}

.install-command__copy {
  color: var(--doc-heading);
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.home-facts {
  gap: 28px;
  margin: 34px 0 0;
}

.home-facts > div {
  display: grid;
  gap: 4px;
}

.home-facts dt {
  color: var(--ink);
  font-size: 1rem;
  font-weight: 500;
}

.home-facts dd {
  margin: 0;
  color: var(--muted);
  font-family: var(--font-main);
  font-size: 0.75rem;
}

.home-visual-column {
  position: relative;
  z-index: 1;
  min-width: 0;
  perspective: 1200px;
}

.home-stage {
  position: relative;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--line) 76%, transparent);
  border-radius: 16px;
  background: var(--surface);
  box-shadow: var(--bing-shadow-sm);
  transform: rotateY(-2.2deg) rotateX(1deg);
  transform-origin: center center;
}

.home-stage::before {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(rgb(var(--bing-heading-rgb) / 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgb(var(--bing-heading-rgb) / 0.035) 1px, transparent 1px);
  background-size: 24px 24px;
  content: "";
  mask-image: linear-gradient(to bottom, transparent, black 20%, black 82%, transparent);
  pointer-events: none;
}

.home-stage__bar {
  position: relative;
  z-index: 2;
  min-height: 45px;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid var(--line);
  background: rgb(var(--doc-surface-rgb) / 0.72);
  padding: 0 18px;
}

.stage-dots {
  display: flex;
  gap: 6px;
}

.stage-dots i {
  display: block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--line);
}

.stage-dots i:first-child { background: var(--bing-accent); }
.stage-dots i:nth-child(2) { background: var(--bing-warning); }
.stage-dots i:last-child { background: var(--bing-success); }

.stage-file,
.stage-live,
.stage-label,
.compose-hint {
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.065em;
  text-transform: uppercase;
}

.stage-file { color: var(--muted); }

.stage-live {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--bing-success);
}

.stage-live i,
.status-dot {
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 0 4px rgb(var(--bing-success-rgb) / 0.12);
}

.home-stage__toolbar {
  position: relative;
  z-index: 3;
  justify-content: space-between;
  gap: 20px;
  padding: 22px 24px 14px;
}

.home-stage__toolbar > div:first-child {
  display: grid;
  gap: 5px;
}

.stage-label { color: var(--bing-accent); }

.home-stage__toolbar strong {
  color: var(--ink);
  font-size: 0.94rem;
}

.home-stage__toolbar :deep(.bing-tabs) { flex: 0 0 auto; }

.home-stage__canvas {
  position: relative;
  z-index: 2;
  min-height: 390px;
  margin: 0 24px;
  overflow: visible;
  border: 1px solid color-mix(in srgb, var(--line) 84%, transparent);
  border-radius: 16px;
  background: var(--surface);
  box-shadow: var(--bing-shadow-sm);
}

.stage-scene {
  min-height: 390px;
  padding: 34px;
}

.motion-heading,
.controls-heading,
.compose-heading {
  justify-content: space-between;
  gap: 20px;
}

.motion-heading > span,
.compose-hint { color: var(--muted); }

.stage-scene h2 {
  margin: 26px 0 0;
  color: var(--ink);
  font-size: clamp(1.75rem, 2.5vw, 2.45rem);
  line-height: 1.18;
  letter-spacing: -0.05em;
}

.motion-title {
  width: 100%;
}

.motion-title-phrase {
  /* 原文与跳字副本按相同短句换行，避免拆字舍入误差把标点挤出行尾。 */
  display: inline-block;
  white-space: nowrap;
}

.stage-scene > p {
  margin: 12px 0 0;
  color: var(--muted);
  font-family: var(--font-main);
  font-size: 0.86rem;
  line-height: 1.7;
}

.motion-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 30px;
}

.motion-card :deep(.bing-card__body) {
  display: grid;
  min-height: 116px;
  align-content: end;
  gap: 5px;
}

.motion-card strong { color: var(--ink); font-size: 0.9rem; }
.motion-card small { color: var(--muted); font-size: 0.7rem; }

.motion-card__icon {
  display: grid;
  width: 28px;
  height: 28px;
  margin-bottom: 8px;
  place-items: center;
  border-radius: 10px;
  background: rgb(var(--bing-accent-rgb) / 0.16);
  color: var(--bing-accent-strong);
  font-weight: 500;
}

.motion-card__pulse {
  width: 12px;
  height: 12px;
  margin-bottom: 16px;
  border-radius: 50%;
  background: var(--bing-secondary);
  box-shadow: 0 0 0 7px rgb(var(--bing-secondary-rgb) / 0.12), 0 0 0 14px rgb(var(--bing-secondary-rgb) / 0.06);
}

.controls-heading > div,
.compose-heading > div {
  display: grid;
  gap: 6px;
}

.controls-heading h2,
.compose-heading h2 {
  margin: 0;
  font-size: 1.35rem;
}

.controls-heading > code {
  border: 1px solid var(--line);
  border-radius: 9px;
  background: var(--surface-muted);
  color: var(--bing-accent);
  padding: 7px 9px;
  font-size: 0.72rem;
  font-weight: 500;
}

.accent-control {
  justify-content: space-between;
  gap: 20px;
  margin-top: 28px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: rgb(var(--doc-surface-rgb) / 0.7);
  padding: 14px 16px;
}

.accent-control > span {
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 500;
}

.control-preview {
  display: grid;
  gap: 26px;
  margin-top: 30px;
}

.control-preview__tags,
.control-preview__buttons {
  flex-wrap: wrap;
  gap: 9px;
}

.stage-scene--compose { padding-top: 32px; }

.stage-scene--compose :deep(.bing-sortable-list) {
  display: grid;
  gap: 10px;
  margin-top: 26px;
}

.compose-item {
  display: grid;
  grid-template-columns: auto auto minmax(0, 1fr) auto;
  gap: 12px;
  min-height: 70px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: rgb(var(--doc-surface-rgb) / 0.78);
  box-shadow: 0 9px 24px rgb(var(--doc-shadow-rgb) / 0.08);
  padding: 10px 14px 10px 10px;
  transition: border-color 180ms ease, box-shadow 180ms ease;
}

.compose-item.is-dragging {
  border-color: rgb(var(--bing-accent-rgb) / 0.42);
  box-shadow: var(--bing-shadow-sm);
}

.compose-handle {
  display: grid;
  width: 34px;
  height: 42px;
  place-content: center;
  gap: 3px;
  border: 0;
  border-radius: 10px;
  background: var(--surface-muted);
  cursor: grab;
}

.compose-handle:active { cursor: grabbing; }

.compose-handle:focus-visible {
  outline: 3px solid var(--bing-focus);
  outline-offset: 2px;
}

.compose-handle i {
  display: block;
  width: 12px;
  height: 2px;
  border-radius: 99px;
  background: var(--muted);
}

.compose-dot { width: 9px; height: 9px; border-radius: 50%; }
.compose-dot.is-pink { background: var(--bing-accent); }
.compose-dot.is-sky { background: var(--bing-secondary); }
.compose-dot.is-green { background: var(--bing-success); }

.compose-item__copy {
  display: grid;
  gap: 4px;
}

.compose-item__copy strong { color: var(--ink); font-size: 0.84rem; }
.compose-item__copy small,
.compose-item > code { color: var(--muted); font-size: 0.68rem; }
.compose-fallback { margin-top: 30px; color: var(--muted); }

.home-stage__footer {
  position: relative;
  z-index: 2;
  min-height: 58px;
  justify-content: space-between;
  gap: 16px;
  padding: 0 26px;
  color: var(--muted);
  font-size: 0.7rem;
}

.home-stage__footer > span {
  display: inline-flex;
  align-items: center;
  gap: 9px;
}

.status-dot { color: var(--bing-success); }
.home-stage__footer code { color: var(--bing-success); }

.home-float {
  position: absolute;
  z-index: 4;
  border: 1px solid color-mix(in srgb, var(--line) 74%, transparent);
  background: rgb(var(--doc-surface-rgb) / 0.88);
  box-shadow: var(--bing-shadow-sm);
  backdrop-filter: blur(16px);
  pointer-events: none;
}

.home-float--motion {
  top: 16%;
  /* 用布局确定横向位置，避免 GSAP 接管 transform 时重新解析带 calc 的 translate。 */
  left: calc(100% - 12px);
  display: grid;
  grid-template-columns: auto auto;
  gap: 3px 9px;
  align-items: center;
  border-radius: 15px;
  padding: 12px 14px;
}

.home-float--motion > span {
  grid-row: span 2;
  color: var(--bing-accent);
  font-size: 1.15rem;
}

.home-float--motion strong { color: var(--ink); font-size: 0.74rem; }
.home-float--motion small { color: var(--muted); font-size: 0.6rem; }

.home-float--type {
  bottom: 13%;
  left: -52px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 999px;
  padding: 11px 12px 11px 15px;
}

.home-float--type strong { color: var(--ink); font-size: 0.68rem; }

.home-float--type span {
  border-radius: 999px;
  background: rgb(var(--bing-success-rgb) / 0.14);
  color: var(--bing-success);
  padding: 4px 7px;
  font-size: 0.58rem;
  font-weight: 500;
  text-transform: uppercase;
}

.scene-swap-enter-active,
.scene-swap-leave-active {
  transition: opacity 200ms ease, transform 260ms cubic-bezier(0.22, 1, 0.36, 1), filter 220ms ease;
}

.scene-swap-enter-from {
  opacity: 0;
  filter: blur(5px);
  transform: translateY(12px);
}

.scene-swap-leave-to {
  opacity: 0;
  filter: blur(4px);
  transform: translateY(-8px);
}

.component-rail {
  display: grid;
  grid-template-columns: 168px minmax(0, 1fr);
  gap: 22px;
  align-items: center;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: rgb(var(--doc-surface-rgb) / 0.62);
  box-shadow: var(--bing-shadow-sm);
  padding: 18px 20px;
}

.component-rail__intro {
  display: grid;
  gap: 5px;
  border-right: 1px solid var(--line);
}

.component-rail__intro span,
.section-eyebrow,
.workbench-label,
.preview-panel__bar,
.preview-panel__controls > div > span {
  color: var(--doc-heading);
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.075em;
  text-transform: uppercase;
}

.component-rail__intro strong {
  color: var(--ink);
  font-size: 0.83rem;
}

.component-rail__list {
  display: flex;
  min-width: 0;
  gap: 8px;
  overflow-x: auto;
  padding: 3px 1px 6px;
  scrollbar-width: none;
}

.component-rail__list::-webkit-scrollbar {
  display: none;
}

.component-chip {
  --chip-color: var(--bing-accent);
  display: inline-flex;
  flex: 0 0 auto;
  min-height: 35px;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--surface);
  color: var(--muted);
  padding: 0 12px;
  font-size: 0.72rem;
  font-weight: 500;
  transition:
    border-color 180ms ease,
    color 180ms ease,
    transform 180ms ease;
}

.component-chip:hover {
  border-color: color-mix(in srgb, var(--chip-color) 46%, var(--line));
  color: var(--ink);
  transform: translateY(-2px);
}

.component-chip:focus-visible {
  outline: 3px solid var(--bing-focus);
  outline-offset: 2px;
}

.component-chip i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--chip-color);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--chip-color) 12%, transparent);
}






.home-section {
  padding: clamp(110px, 13vw, 180px) 0 0;
}

.section-heading {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 450px);
  gap: 80px;
  align-items: end;
}

.section-heading > div {
  min-width: 0;
}

.section-heading h2 {
  margin: 18px 0 0;
  color: var(--ink);
  font-size: clamp(2.65rem, 5vw, 5rem);
  font-weight: 500;
  line-height: 0.98;
  letter-spacing: -0.07em;
}

.section-heading > p {
  margin: 0 0 5px;
  color: var(--muted);
  font-family: var(--font-main);
  font-size: 1rem;
  line-height: 1.9;
}

.principle-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin: 62px 0 0;
  padding: 0;
  list-style: none;
}

.principle-card {
  --feature-color: var(--bing-accent);
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 350px;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--surface);
  box-shadow: var(--bing-shadow-sm);
  padding: 26px;
  transition:
    border-color 220ms ease,
    box-shadow 220ms ease,
    transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.principle-card:hover {
  border-color: color-mix(in srgb, var(--feature-color) 32%, var(--line));
  box-shadow: var(--bing-shadow-sm);
  transform: translateY(-6px);
}




.principle-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.principle-card__top span {
  color: var(--muted);
  font-size: 0.72rem;
  font-weight: 500;
}

.principle-card__top i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--feature-color);
  box-shadow: 0 0 0 8px color-mix(in srgb, var(--feature-color) 10%, transparent);
}

.principle-card h3 {
  align-self: stretch;
  margin: auto 0 0;
  color: var(--ink);
  font-size: clamp(1.6rem, 2.2vw, 2.15rem);
  letter-spacing: -0.05em;
}

.principle-card p {
  margin: 18px 0 0;
  color: var(--muted);
  font-family: var(--font-main);
  font-size: 0.9rem;
  line-height: 1.78;
}

.principle-card code {
  display: inline-flex;
  width: auto;
  min-height: 30px;
  align-items: center;
  align-self: flex-start;
  justify-content: center;
  margin-top: 26px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--feature-color) 10%, var(--surface));
  color: var(--feature-color);
  padding: 0 12px;
  font-size: 0.65rem;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
}

.section-heading--build {
  align-items: end;
}

.build-workbench {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: 1px;
  margin-top: 66px;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--line);
  box-shadow: var(--bing-shadow-sm);
}

.code-panel,
.preview-panel {
  min-width: 0;
  background: rgb(var(--doc-surface-rgb) / 0.86);
}

.code-panel {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  padding: 24px;
}

.workbench-label,
.preview-panel__bar,
.preview-panel__controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

.workbench-label {
  flex-wrap: wrap;
  min-height: 34px;
  color: var(--muted);
}

.workbench-label > span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
}

.workbench-label i,
.preview-panel__bar i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--bing-success);
}

.workbench-label > code {
  border-radius: 6px;
  background: var(--surface-muted);
  color: var(--bing-secondary);
  padding: 5px 7px;
}

.code-panel :deep(.bing-code-block) {
  min-width: 0;
  max-width: 100%;
  align-self: stretch;
  margin-top: 18px;
  box-shadow: none;
}

.code-panel :deep(.bing-code-block__pre) {
  min-height: 420px;
}

.preview-panel {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
}

.preview-panel__bar {
  min-height: 58px;
  border-bottom: 1px solid var(--line);
  padding: 0 22px;
}

.preview-panel__bar > span:last-child {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--bing-success);
}

.preview-panel__canvas {
  position: relative;
  display: grid;
  min-height: 480px;
  overflow: hidden;
  place-items: center;
  background:
    linear-gradient(rgb(var(--bing-heading-rgb) / 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgb(var(--bing-heading-rgb) / 0.04) 1px, transparent 1px),
    var(--bing-canvas);
  background-size: 28px 28px, 28px 28px, auto;
  padding: 48px;
}

.preview-orbit {
  position: absolute;
  border: 1px solid rgb(var(--bing-accent-rgb) / 0.16);
  border-radius: 50%;
  pointer-events: none;
}

.preview-orbit--one {
  width: 420px;
  height: 420px;
}

.preview-orbit--two {
  width: 310px;
  height: 310px;
  border-color: rgb(var(--bing-secondary-rgb) / 0.14);
}

.showcase-card--fallback { width: min(100%, 370px); min-height: 320px; }

.showcase-card--fallback {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--surface);
  color: var(--ink);
  font-size: 1.6rem;
  font-weight: 500;
}

.preview-panel__controls {
  min-height: 74px;
  border-top: 1px solid var(--line);
  padding: 0 22px;
}

.preview-panel__controls > div {
  display: flex;
  align-items: center;
  gap: 12px;
}

.home-cta {
  position: relative;
  display: grid;
  min-height: 520px;
  overflow: hidden;
  align-content: center;
  justify-items: center;
  margin-top: clamp(120px, 15vw, 210px);
  border-radius: 16px;
  border: 1px solid var(--line);
  background: var(--surface);
  box-shadow: var(--bing-shadow-sm);
  padding: 70px 24px;
  text-align: center;
}

.home-cta::before {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(rgb(var(--bing-heading-rgb) / 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgb(var(--bing-heading-rgb) / 0.04) 1px, transparent 1px);
  background-size: 30px 30px;
  content: "";
  mask-image: radial-gradient(circle, black, transparent 76%);
}

.home-cta > * {
  position: relative;
  z-index: 2;
}

.home-cta .section-eyebrow {
  color: var(--bing-accent);
}

.home-cta h2 {
  margin: 22px 0 0;
  color: var(--ink);
  font-size: clamp(3rem, 6.4vw, 6.4rem);
  line-height: 0.94;
  letter-spacing: -0.075em;
}

.home-cta > p {
  margin: 24px 0 0;
  color: var(--muted);
  font-family: var(--font-main);
  font-size: 1rem;
  line-height: 1.8;
}

.home-cta__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-top: 34px;
}

.cta-install {
  display: inline-flex;
  min-height: 52px;
  align-items: center;
  gap: 18px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--surface-muted);
  color: var(--ink);
  cursor: pointer;
  padding: 10px 18px;
  transition: background 180ms ease, border-color 180ms ease;
}

.cta-install:hover {
  border-color: var(--bing-accent);
  background: var(--bing-surface-active);
}

.cta-install:focus-visible {
  outline: 3px solid var(--bing-focus);
  outline-offset: 3px;
}

.cta-install code {
  min-width: 0;
  overflow-wrap: anywhere;
  text-align: left;
  font-size: 0.76rem;
}

.cta-install span {
  flex-shrink: 0;
  white-space: nowrap;
  color: var(--bing-accent);
  font-size: 0.65rem;
  font-weight: 500;
  text-transform: uppercase;
}

.home-footer {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 32px;
  align-items: center;
  min-height: 150px;
  padding: 36px 2px;
}

.home-footer__brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.home-footer__mark {
  display: block;
  flex: 0 0 auto;
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.home-footer__brand > div {
  display: grid;
  gap: 2px;
}

.home-footer__brand strong {
  color: var(--ink);
  font-size: 0.88rem;
}

.home-footer__brand small,
.home-footer > p,
.home-footer__links {
  color: var(--muted);
  font-size: 0.68rem;
}

.home-footer > p {
  margin: 0;
  text-align: center;
}

.home-footer__links {
  display: flex;
  gap: 18px;
  justify-content: flex-end;
}

.home-footer__links a:hover {
  color: var(--doc-heading);
}

@media (max-width: 1680px) {
  .home-float--motion { display: none; }
}

@media (max-width: 1220px) {
  .landing-hero {
    grid-template-columns: minmax(0, 0.84fr) minmax(480px, 1.16fr);
    gap: 44px;
  }

  .home-float--type { left: -18px; }
}

@media (max-width: 980px) {
  .landing-hero {
    grid-template-columns: 1fr;
    min-height: auto;
    padding: 72px 0 96px;
  }

  .home-copy-column { max-width: 720px; }
  .home-title__brand { font-size: clamp(4rem, 13vw, 7rem); }
  .home-title__statement { font-size: clamp(2.15rem, 7vw, 3.45rem); }

  .home-visual-column {
    width: min(100%, 720px);
    justify-self: center;
  }

  .component-rail {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .component-rail__intro {
    grid-template-columns: auto 1fr;
    gap: 12px;
    border-right: 0;
    border-bottom: 1px solid var(--line);
    padding-bottom: 14px;
  }

  .section-heading {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .section-heading > p {
    max-width: 650px;
  }

  .principle-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .principle-card:last-child {
    grid-column: 1 / -1;
    min-height: 290px;
  }

  .build-workbench {
    grid-template-columns: 1fr;
  }

  .code-panel :deep(.bing-code-block__pre) {
    min-height: 360px;
  }

  .home-footer {
    grid-template-columns: 1fr auto;
  }

  .home-footer > p {
    display: none;
  }
}

@media (max-width: 680px) {
  .landing-hero { gap: 54px; padding: 52px 0 78px; }
  .home-kicker { align-items: flex-start; flex-direction: column; }
  .home-title__brand { font-size: clamp(3.5rem, 21vw, 5.2rem); }
  .home-title__statement { margin-top: 20px; font-size: clamp(1.9rem, 10vw, 2.8rem); }
  .home-lead { font-size: 0.98rem; }

  .home-actions-new {
    align-items: stretch;
    flex-direction: column;
  }

  .home-actions-new :deep(.bing-button) { width: 100%; }

  .home-facts {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  .home-stage { border-radius: 16px; transform: none; }

  .home-stage__toolbar {
    align-items: flex-start;
    flex-direction: column;
    padding: 20px 18px 14px;
  }

  .home-stage__toolbar :deep(.bing-tabs) { width: 100%; }
  .home-stage__canvas { min-height: 430px; margin: 0 14px; }
  .stage-scene { min-height: 430px; padding: 24px 20px; }
  .motion-grid { grid-template-columns: 1fr; }
  .motion-grid .motion-card:nth-child(2) { display: none; }

  .controls-heading,
  .compose-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .home-float { display: none; }

  .component-rail {
    border-radius: 18px;
    padding: 16px;
  }

  .component-rail__intro {
    grid-template-columns: 1fr;
    gap: 4px;
  }

  .home-section {
    padding-top: 104px;
  }

  .section-heading h2 {
    font-size: clamp(2.45rem, 13vw, 3.8rem);
  }

  .principle-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-top: 42px;
  }

  .principle-card,
  .principle-card:last-child {
    grid-column: auto;
    min-height: 300px;
    padding: 22px;
  }

  .build-workbench {
    margin-top: 42px;
    border-radius: 16px;
  }

  .code-panel {
    padding: 16px;
  }

  .code-panel :deep(.bing-code-block__pre) {
    min-height: 330px;
  }

  .preview-panel__canvas {
    min-height: 430px;
    padding: 30px 20px;
  }

  .preview-orbit--one {
    width: 340px;
    height: 340px;
  }

  .preview-orbit--two {
    width: 250px;
    height: 250px;
  }

  .showcase-card,
  .showcase-card--fallback {
    width: min(100%, 320px);
  }

  .preview-panel__controls {
    align-items: stretch;
    flex-direction: column;
    padding: 18px;
  }

  .preview-panel__controls > div {
    justify-content: space-between;
  }

  .preview-panel__controls :deep(.bing-button) {
    width: 100%;
  }

  .home-cta {
    min-height: 500px;
    margin-top: 112px;
    border-radius: 16px;
    padding: 60px 20px;
  }

  .home-cta h2 {
    font-size: clamp(2rem, 9vw, 3rem);
  }

  .home-cta__actions {
    width: min(100%, 390px);
    align-items: stretch;
    flex-direction: column;
  }

  .home-cta__actions :deep(.bing-button),
  .cta-install {
    width: 100%;
    justify-content: center;
  }

  .cta-install {
    gap: 12px;
  }

  .home-footer {
    grid-template-columns: 1fr;
    justify-items: center;
    padding: 50px 0;
    text-align: center;
  }

  .home-footer__links {
    justify-content: center;
  }
}

/* 入场与 SSR 样式一起到达，不依赖 JavaScript，也不会在 hydration 后重播。
   只使用 backwards 填充，结束后释放位移，避免覆盖安装按钮的 hover 效果。 */
@keyframes home-enter {
  from {
    opacity: 0.6;
    translate: 0 12px;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .home-reveal,
  .home-stage {
    animation: home-enter 480ms cubic-bezier(0.22, 1, 0.36, 1) backwards;
  }

  .home-title { animation-delay: 30ms; }
  .home-lead { animation-delay: 60ms; }
  .home-actions-new { animation-delay: 90ms; }
  .install-command { animation-delay: 120ms; }
  .home-facts { animation-delay: 150ms; }
  .home-stage { animation-delay: 60ms; }
}

@media (prefers-reduced-motion: reduce) {
  .scene-swap-enter-active,
  .scene-swap-leave-active,
  .install-command,
  .component-chip,
  .principle-card { transition-duration: 1ms; }
  .install-command:hover,
  .component-chip:hover,
  .principle-card:hover { transform: none; }
}
</style>
