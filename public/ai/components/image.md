# BingImage

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export image；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。五个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

options 是演示配置。所有示例图片均内置；损坏数据用于验证回退与重试。模型由组件内部管理，通过事件读取加载状态；图库初始索引由业务明确传入。

BingImage 是图片展示组件，在原生 `img` 基础上补齐加载反馈、占位图、失败回退、错误态、尺寸比例、圆角、预览和事件。它适合组件文档、商品图、头像以外的内容图和图库入口。

独立使用需导入 `BingImage` 和 `@moubing/bing-ui/style.css`。五个示例自带 SVG 图片生成函数；故障示例使用故意损坏的图片数据，无需准备额外文件或访问图片服务。

## 基础配置

用 `width`、`height` 或 `aspectRatio` 固定布局空间，再通过 `fit`、`position`、`radius` 控制图片裁剪方式。

组件内部管理加载状态，没有加载状态的 v-model 或公开实例方法。使用 load、error 和 `@status-change` 读取反馈。width/height 的 number 会转为 px，CSS 字符串按原值使用；给像素尺寸时优先传 number 或带单位字符串。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingImage, type BingImageProps, type BingImageStatus, type BingImageLoadPayload, type BingImageStatusChangePayload } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const options: BingImageProps = {
  "width": "100%",
  "aspectRatio": "16 / 9",
  "fit": "cover",
  "position": "center",
  "radius": "lg",
  "block": true,
  "preview": true
}
const photoSrc = createSvgImage('Bing Image', '#fef3c7', '#f472b6', '#1f2937')
const status = ref<BingImageStatus>('idle')
const dimensions = ref('等待图片加载')
function changed(payload: BingImageStatusChangePayload) { status.value = payload.status }
function loaded(payload: BingImageLoadPayload) { dimensions.value = payload.naturalWidth + ' × ' + payload.naturalHeight }

function createSvgImage(
  label: string,
  background: string,
  accent: string,
  text: string,
  mode: 'landscape' | 'portrait' = 'landscape',
) {
  const width = mode === 'portrait' ? 520 : 900
  const height = mode === 'portrait' ? 720 : 560
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${background}"/>
  <circle cx="${width * 0.78}" cy="${height * 0.22}" r="${Math.min(width, height) * 0.2}" fill="${accent}" opacity="0.5"/>
  <circle cx="${width * 0.22}" cy="${height * 0.76}" r="${Math.min(width, height) * 0.28}" fill="${accent}" opacity="0.22"/>
  <path d="M0 ${height * 0.72} C ${width * 0.25} ${height * 0.48}, ${width * 0.45} ${height * 0.92}, ${width} ${height * 0.58} L ${width} ${height} L 0 ${height} Z" fill="${accent}" opacity="0.32"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${text}" font-family="Maple Mono NF CN, Consolas, monospace" font-size="${Math.round(width / 12)}" font-weight="800">${label}</text>
</svg>`

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}
</script>

<template>
  <div class="stage">
    <BingImage :src="photoSrc" alt="组件封面图" v-bind="options" preview-aria-label="预览组件封面图" @status-change="changed" @load="loaded" />
    <p role="status">状态：{{ status }}；原始尺寸：{{ dimensions }}</p>
  </div>
</template>

<style scoped>
.stage { max-width: 620px; }
</style>
```

## 占位与回退

主图失败后，组件先发送 `error({ isFallback: false })`，再尝试一次与当前地址不同的 fallbackSrc，并移除 srcset/sizes。回退成功进入 loaded；回退也失败则再发 `error({ isFallback: true })`，最终进入 error，不会无限循环。

statusChange 仅在状态名称改变时发送，因此主图 loading 切到回退图 loading 不会再次发送 loading。初始 src 为空时保持 idle，也不会产生初次 idle 通知；空主图不会主动加载回退图。仅修改 fallbackSrc 不自动重试，需改变 src 或使用错误插槽的 retry。

placeholderSrc 在未 loaded 时可显示，包括 idle 和最终 error；placeholder 插槽在 loading 时也可替代默认骨架。showLoading/showError 控制整个对应层，也会隐藏自定义插槽，但不会取消加载或改变事件。加载层和占位层为 aria-hidden，需播报进度时可像示例一样在外部通过 statusChange 提供状态文本。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingImage, type BingImageStatus, type BingImageErrorPayload, type BingImageStatusChangePayload } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

// 故意损坏的图片数据，无需准备不存在的本地文件。
const brokenSrc = 'data:image/png;base64,bm90LWFuLWltYWdl'
const placeholderSrc = createSvgImage('Loading', '#e0f2fe', '#93c5fd', '#475569')
const fallbackSrc = createSvgImage('Fallback', '#dcfce7', '#34d399', '#14532d')
const status = ref<BingImageStatus>('idle')
const failures = ref<string[]>([])
function changed(payload: BingImageStatusChangePayload) { status.value = payload.status }
function failed(payload: BingImageErrorPayload) { failures.value.push(payload.isFallback ? '回退图失败' : '主图失败') }

function createSvgImage(
  label: string,
  background: string,
  accent: string,
  text: string,
  mode: 'landscape' | 'portrait' = 'landscape',
) {
  const width = mode === 'portrait' ? 520 : 900
  const height = mode === 'portrait' ? 720 : 560
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${background}"/>
  <circle cx="${width * 0.78}" cy="${height * 0.22}" r="${Math.min(width, height) * 0.2}" fill="${accent}" opacity="0.5"/>
  <circle cx="${width * 0.22}" cy="${height * 0.76}" r="${Math.min(width, height) * 0.28}" fill="${accent}" opacity="0.22"/>
  <path d="M0 ${height * 0.72} C ${width * 0.25} ${height * 0.48}, ${width * 0.45} ${height * 0.92}, ${width} ${height * 0.58} L ${width} ${height} L 0 ${height} Z" fill="${accent}" opacity="0.32"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${text}" font-family="Maple Mono NF CN, Consolas, monospace" font-size="${Math.round(width / 12)}" font-weight="800">${label}</text>
</svg>`

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}
</script>

<template>
  <div class="stage">
    <BingImage :src="brokenSrc" :fallback-src="fallbackSrc" :placeholder-src="placeholderSrc"
      alt="带回退图的示例" width="100%" aspect-ratio="16 / 9" radius="lg" block error-text="图片加载失败"
      @status-change="changed" @error="failed" />
    <p role="status">状态：{{ status }}；错误事件：{{ failures.length }}；{{ failures.join(' → ') }}</p>
  </div>
</template>

<style scoped>
.stage { max-width: 620px; }
</style>
```

## 裁剪与比例

列表和网格里推荐优先给 `aspectRatio`，这样图片加载前后都不会挤压布局。`cover` 适合封面，`contain` 适合完整展示，`position` 用来控制裁切焦点。

```vue
<script setup lang="ts">
import { BingImage } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const photoSrc = createSvgImage('Bing Image', '#fef3c7', '#f472b6', '#1f2937')
const portraitSrc = createSvgImage('Portrait', '#ede9fe', '#a78bfa', '#312e81', 'portrait')

function createSvgImage(
  label: string,
  background: string,
  accent: string,
  text: string,
  mode: 'landscape' | 'portrait' = 'landscape',
) {
  const width = mode === 'portrait' ? 520 : 900
  const height = mode === 'portrait' ? 720 : 560
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${background}"/>
  <circle cx="${width * 0.78}" cy="${height * 0.22}" r="${Math.min(width, height) * 0.2}" fill="${accent}" opacity="0.5"/>
  <circle cx="${width * 0.22}" cy="${height * 0.76}" r="${Math.min(width, height) * 0.28}" fill="${accent}" opacity="0.22"/>
  <path d="M0 ${height * 0.72} C ${width * 0.25} ${height * 0.48}, ${width * 0.45} ${height * 0.92}, ${width} ${height * 0.58} L ${width} ${height} L 0 ${height} Z" fill="${accent}" opacity="0.32"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${text}" font-family="Maple Mono NF CN, Consolas, monospace" font-size="${Math.round(width / 12)}" font-weight="800">${label}</text>
</svg>`

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}
</script>

<template>
  <div class="grid">
    <BingImage :src="photoSrc" alt="cover 示例" fit="cover" position="center" aspect-ratio="16 / 9" block radius="lg" />
    <BingImage :src="photoSrc" alt="contain 示例" fit="contain" aspect-ratio="16 / 9" block radius="lg" />
    <BingImage :src="portraitSrc" alt="portrait 示例" fit="cover" position="top" aspect-ratio="3 / 4" block radius="lg" />
  </div>
</template>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: 16px; max-width: 1000px; align-items: start; }
</style>
```

## 预览图库

开启 `preview` 后，图片加载成功才会变成可点击的预览入口。传入 `previewItems` 可以把多张图片串成同一个预览图库。

入口是带 role=button、tabindex=0 的 figure，支持点击、Enter 和空格；并非原生 button。默认预览名称固定为 预览图片，示例为每张图设置独立的 previewAriaLabel，避免仅凭 alt 假定按钮已有不同名称。

非空 previewItems 优先作为整个图库，previewInitialIndex 需要由业务按缩略图索引传入。单图模式才从当前图和 previewSrc、previewDownloadUrl、previewDownloadName 生成预览项；使用图库时这些信息应写在各项中。只有缩略图本身 loaded 才可打开预览，即使 previewSrc 已设置也一样。

previewOpen 的 src 为 previewSrc 或当前图片地址，不一定是传入图库的当前项，也不持续报告左右切换。BingImage 没有暴露预览 v-model；如需外部开关、当前索引或更多预览配置，直接使用 [BingImagePreview](/docs/components/image-preview)。当前禁用 preview 会卸载内置预览，但保留内部打开标记，重新启用可能再次显示；修改 src 也不等同关闭预览。

文档站在 KeepAlive 页面停用时卸载预览实例，避免 Teleport 图库与滚动锁留在隐藏页面。不要把多张缩略图都配置为独立的、同时打开的弹窗。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingImage, type BingImagePreviewClosePayload } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const galleryItems = [
  {
    src: createSvgImage('Gallery 01', '#fee2e2', '#fb7185', '#7f1d1d'),
    alt: '图库图片一',
    caption: '图库图片一',
    downloadName: 'gallery-01.svg',
  },
  {
    src: createSvgImage('Gallery 02', '#dbeafe', '#60a5fa', '#1e3a8a'),
    alt: '图库图片二',
    caption: '图库图片二',
    downloadName: 'gallery-02.svg',
  },
  {
    src: createSvgImage('Gallery 03', '#dcfce7', '#4ade80', '#14532d'),
    alt: '图库图片三',
    caption: '图库图片三',
    downloadName: 'gallery-03.svg',
  },
]
const feedback = ref('等待打开图库')
function closed(payload: BingImagePreviewClosePayload) { feedback.value = '关闭原因：' + payload.reason }

function createSvgImage(
  label: string,
  background: string,
  accent: string,
  text: string,
  mode: 'landscape' | 'portrait' = 'landscape',
) {
  const width = mode === 'portrait' ? 520 : 900
  const height = mode === 'portrait' ? 720 : 560
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${background}"/>
  <circle cx="${width * 0.78}" cy="${height * 0.22}" r="${Math.min(width, height) * 0.2}" fill="${accent}" opacity="0.5"/>
  <circle cx="${width * 0.22}" cy="${height * 0.76}" r="${Math.min(width, height) * 0.28}" fill="${accent}" opacity="0.22"/>
  <path d="M0 ${height * 0.72} C ${width * 0.25} ${height * 0.48}, ${width * 0.45} ${height * 0.92}, ${width} ${height * 0.58} L ${width} ${height} L 0 ${height} Z" fill="${accent}" opacity="0.32"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${text}" font-family="Maple Mono NF CN, Consolas, monospace" font-size="${Math.round(width / 12)}" font-weight="800">${label}</text>
</svg>`

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}
</script>

<template>
  <div class="gallery">
    <BingImage v-for="(item, index) in galleryItems" :key="item.src" :src="item.src" :alt="item.alt"
      :preview-items="galleryItems" :preview-initial-index="index" :preview-aria-label="'预览' + item.alt"
      preview preview-downloadable width="100%" aspect-ratio="4 / 3" block radius="lg"
      @preview-open="feedback = '打开：' + item.caption" @preview-close="closed" />
  </div>
  <p role="status">{{ feedback }}</p>
</template>

<style scoped>
.gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr)); gap: 16px; max-width: 960px; }
</style>
```

## 插槽与事件

默认加载态和错误态已经可用；如果业务页面需要更明确的文案或动作，可以使用 `loading`、`placeholder` 和 `error` 插槽。

retry() 重建 img，从主图开始再尝试一次回退流程，不保证绕过浏览器缓存。下面的数据故意损坏，重复 retry 仍然失败；“使用有效图片”改变 src 后恢复 loaded，与重试同一地址是两件事。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingImage } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const brokenSrc = 'data:image/png;base64,bm90LWFuLWltYWdl'
const photoSrc = createSvgImage('Bing Image', '#fef3c7', '#f472b6', '#1f2937')
const src = ref(brokenSrc)
const failures = ref(0)

function createSvgImage(
  label: string,
  background: string,
  accent: string,
  text: string,
  mode: 'landscape' | 'portrait' = 'landscape',
) {
  const width = mode === 'portrait' ? 520 : 900
  const height = mode === 'portrait' ? 720 : 560
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${background}"/>
  <circle cx="${width * 0.78}" cy="${height * 0.22}" r="${Math.min(width, height) * 0.2}" fill="${accent}" opacity="0.5"/>
  <circle cx="${width * 0.22}" cy="${height * 0.76}" r="${Math.min(width, height) * 0.28}" fill="${accent}" opacity="0.22"/>
  <path d="M0 ${height * 0.72} C ${width * 0.25} ${height * 0.48}, ${width * 0.45} ${height * 0.92}, ${width} ${height * 0.58} L ${width} ${height} L 0 ${height} Z" fill="${accent}" opacity="0.32"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${text}" font-family="Maple Mono NF CN, Consolas, monospace" font-size="${Math.round(width / 12)}" font-weight="800">${label}</text>
</svg>`

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}
</script>

<template>
  <div class="stage">
    <BingImage :src="src" alt="错误槽示例" width="100%" aspect-ratio="16 / 9" block radius="lg" @error="failures += 1">
      <template #error="{ src: failedSrc, retry }">
        <div class="error-content">
          <strong>图片没有加载成功</strong>
          <span>{{ failedSrc }}</span>
          <BingButton :throttle="false" @click.stop="retry">重试</BingButton>
        </div>
      </template>
    </BingImage>
    <p role="status">错误事件：{{ failures }}</p>
    <p>数据故意损坏，重试仍会失败；可切换有效图片验证恢复。</p>
    <BingButton :throttle="false" @click="src = photoSrc">使用有效图片</BingButton>
    <BingButton variant="secondary" :throttle="false" @click="src = brokenSrc">恢复错误示例</BingButton>
  </div>
</template>

<style scoped>
.stage { max-width: 620px; }
.error-content { display: grid; justify-items: center; gap: 12px; padding: 16px; }
.error-content span { overflow-wrap: anywhere; }
</style>
```

### 插槽

| 插槽            | 参数                                                | 说明                                                                        |
| ------------- | ------------------------------------------------- | ------------------------------------------------------------------------- |
| `placeholder` | `-`                                               | 替换占位图和骨架；loading 时显示，idle/error 时只有配置 placeholderSrc 才显示。所在层 aria-hidden。 |
| `loading`     | `-`                                               | showLoading=true 且处于 loading 时显示；所在层 aria-hidden。                         |
| `error`       | `{ src: string \| undefined; retry: () => void }` | showError=true 且最终失败时显示。retry 重建 img 并重新尝试主图，不保证绕过浏览器缓存。                  |

### 事件

| 事件             | 参数                             | 说明                                                            |
| -------------- | ------------------------------ | ------------------------------------------------------------- |
| `load`         | `BingImageLoadPayload`         | 原生 load 成功时触发；src 是组件当前地址，不一定等于 srcset 实际选中的 currentSrc。      |
| `error`        | `BingImageErrorPayload`        | 当前图片加载失败时触发，包含 src 和 isFallback。                              |
| `statusChange` | `BingImageStatusChangePayload` | 仅状态值改变时触发；主图 loading 切到回退图 loading 不再次发出。模板可用 @status-change。 |
| `previewOpen`  | `BingImagePreviewOpenPayload`  | 预览入口激活时发出，src 为 previewSrc 或当前图地址，不报告图库切换。                    |
| `previewClose` | `BingImagePreviewClosePayload` | 内置预览发出关闭操作时转发原因。禁用 preview 或卸载组件不补发。                          |

## 属性

| 属性                    | 类型                                                         | 默认值         | 说明                                                                     |
| --------------------- | ---------------------------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| `src`                 | `string`                                                   | `undefined` | 图片地址。为空时组件保持 idle 状态。                                                  |
| `alt`                 | `string`                                                   | `''`        | 图片替代文本；装饰性图片可以传空字符串。                                                   |
| `srcset`              | `string`                                                   | `undefined` | 原生 img srcset。只有当前 src 是主图时会透传；进入 fallback 后会移除。                       |
| `sizes`               | `string`                                                   | `undefined` | 原生 img sizes。只有当前 src 是主图时会透传。                                         |
| `width`               | `number \| string`                                         | `undefined` | CSS 宽度；number 转 px。number 或全数字字符串还写入 img width；百分比、px 等 CSS 字符串不写原生属性。 |
| `height`              | `number \| string`                                         | `undefined` | CSS 高度；number 转 px。number 或全数字字符串还写入 img height。                       |
| `aspectRatio`         | `number \| string`                                         | `undefined` | CSS aspect-ratio，用于构造稳定的图片占位盒。                                         |
| `fit`                 | `'contain' \| 'cover' \| 'fill' \| 'none' \| 'scale-down'` | `'cover'`   | 图片 object-fit。                                                         |
| `position`            | `string`                                                   | `'center'`  | 图片 object-position。                                                    |
| `radius`              | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'`         | `'md'`      | 圆角等级。                                                                  |
| `block`               | `boolean`                                                  | `false`     | 是否占满父容器宽度。                                                             |
| `loading`             | `'lazy' \| 'eager'`                                        | `'lazy'`    | 原生 img loading。                                                        |
| `decoding`            | `'async' \| 'sync' \| 'auto'`                              | `'async'`   | 原生 img decoding。                                                       |
| `fetchPriority`       | `'high' \| 'low' \| 'auto'`                                | `'auto'`    | 原生 fetchpriority。                                                      |
| `fallbackSrc`         | `string`                                                   | `undefined` | 每轮主图失败后尝试一次不同地址的回退图；回退失败不继续循环。重试或 src 改变时重新开始。                         |
| `placeholderSrc`      | `string`                                                   | `undefined` | 模糊占位图；未 loaded 时可在 idle/loading/error 阶段存在。                            |
| `showLoading`         | `boolean`                                                  | `true`      | 是否显示整个 loading 层；false 也隐藏自定义 loading 插槽，不改变加载过程。                      |
| `showError`           | `boolean`                                                  | `true`      | 是否显示整个 error 层；false 也隐藏自定义 error 插槽，不改变 error 状态与事件。                  |
| `errorText`           | `string`                                                   | `'图片加载失败'`  | 内置错误态文案。                                                               |
| `crossorigin`         | `'' \| 'anonymous' \| 'use-credentials'`                   | `undefined` | 原生 img crossorigin。                                                    |
| `referrerPolicy`      | `BingImageReferrerPolicy`                                  | `undefined` | 原生 img referrerpolicy。                                                 |
| `preview`             | `boolean`                                                  | `false`     | 图片加载成功后是否可点击打开 BingImagePreview。                                       |
| `previewSrc`          | `string`                                                   | `undefined` | 单图预览时使用的高清图。                                                           |
| `previewItems`        | `BingImagePreviewItem[]`                                   | `undefined` | 预览图库列表。为空时会用当前图片生成单图预览。                                                |
| `previewInitialIndex` | `number`                                                   | `0`         | 使用 previewItems 时的初始预览索引。                                              |
| `previewDownloadable` | `boolean`                                                  | `false`     | 预览层是否显示下载动作。                                                           |
| `previewDownloadUrl`  | `string`                                                   | `undefined` | 单图预览下载地址。                                                              |
| `previewDownloadName` | `string`                                                   | `undefined` | 单图预览下载文件名。                                                             |
| `previewAriaLabel`    | `string`                                                   | `'预览图片'`    | 加载成功后的外层预览按钮名称；图库中建议每张图单独设置。传空字符串才会回退到 “预览 ”加 alt。                     |

## 公开类型与事件载荷

以下类型都从 `@moubing/bing-ui` 根入口导入，无需依赖包内路径。

| 类型                                | 取值或说明                                                                                                                                                                   |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BingImageProps / BingImageEmits` | 组件属性与事件载荷元组声明。                                                                                                                                                          |
| `BingImageFit`                    | contain \| cover \| fill \| none \| scale-down。                                                                                                                         |
| `BingImageRadius`                 | none \| sm \| md \| lg \| xl \| full。                                                                                                                                   |
| `BingImageLoading`                | lazy \| eager。                                                                                                                                                          |
| `BingImageDecoding`               | async \| sync \| auto。                                                                                                                                                  |
| `BingImageFetchPriority`          | high \| low \| auto。                                                                                                                                                    |
| `BingImageCrossOrigin`            | '' \| anonymous \| use-credentials。                                                                                                                                     |
| `BingImageReferrerPolicy`         | '' \| no-referrer \| no-referrer-when-downgrade \| origin \| origin-when-cross-origin \| same-origin \| strict-origin \| strict-origin-when-cross-origin \| unsafe-url。 |
| `BingImageStatus`                 | idle \| loading \| loaded \| error。                                                                                                                                     |

### 事件载荷

| 类型                             | 字段                                                                           | 说明                                                              |
| ------------------------------ | ---------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `BingImageLoadPayload`         | `{ event: Event; src: string; naturalWidth: number; naturalHeight: number }` | 原生事件及图片自然尺寸；可从 event.currentTarget 的 img.currentSrc 读取浏览器选择的地址。 |
| `BingImageErrorPayload`        | `{ event: Event; src: string; isFallback: boolean }`                         | 每个失败地址分别通知；isFallback 标识此次失败是否来自回退图。                            |
| `BingImageStatusChangePayload` | `{ status: BingImageStatus; src?: string }`                                  | 状态及发出事件时的当前地址。                                                  |
| `BingImagePreviewOpenPayload`  | `{ src: string }`                                                            | 入口激活时的预览地址提示，不等同图库当前项。                                          |
| `BingImagePreviewClosePayload` | `{ reason: 'close' \| 'overlay' \| 'escape' }`                               | 内置预览关闭来源。                                                       |

### BingImagePreviewItem

| 字段             | 类型       | 说明                   |
| -------------- | -------- | -------------------- |
| `src`          | `string` | 必填，图片原地址。            |
| `alt`          | `string` | 可选，图片替代文本。           |
| `previewSrc`   | `string` | 可选，预览高清图，优先于 src 显示。 |
| `downloadUrl`  | `string` | 可选，该项下载地址。           |
| `downloadName` | `string` | 可选，该项下载文件名。          |
| `caption`      | `string` | 可选，预览说明文字。           |
