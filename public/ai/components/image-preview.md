# BingImagePreview

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export image-preview；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。四个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

options 是演示配置。图片全部内置，预览与外部索引用 v-model 同步。change 表示切图请求，不是图片加载完成；download 只通知将发起原生链接下载。关闭工具栏和遮罩入口时，行为示例会保留 Escape 退出。

BingImagePreview 是图片预览层，用于把一张或多张图片放进全屏查看器。它内置缩放、拖拽、旋转、重置、上一张/下一张、下载、键盘操作、滚动锁定和 Teleport 渲染。

## 基础打开

使用 `v-model` 控制预览层显示，`items` 传入图片列表。`initialIndex` 只决定打开时的初始图片，适合从固定入口打开预览。

索引从 0 开始；有 `currentIndex` 时优先使用它，否则使用 `initialIndex`。组件过滤地址为空的项并限制索引上下界，不负责取整或处理非有限数值；业务应传有限整数。空列表显示 暂无图片；加载失败显示 图片加载失败，没有重试插槽或 load/error 事件。

四份示例的 SVG 图片均内置。下面的封面有空值判断，业务列表尚未加载时也可以渲染。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingImagePreview, BingImage, type BingImagePreviewProps, type BingImagePreviewItem } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const previewItems: BingImagePreviewItem[] = [
  {
    src: createSvgImage('Preview 01', '#fee2e2', '#fb7185', '#7f1d1d'),
    alt: '预览图片一',
    caption: '第一张图片：横向封面图。',
    downloadName: 'preview-01.svg',
  },
  {
    src: createSvgImage('Preview 02', '#dbeafe', '#60a5fa', '#1e3a8a'),
    alt: '预览图片二',
    caption: '第二张图片：用于测试切换和计数器。',
    downloadName: 'preview-02.svg',
  },
  {
    src: createSvgImage('Preview 03', '#ede9fe', '#a78bfa', '#312e81', 'portrait'),
    alt: '预览图片三',
    caption: '第三张图片：竖向图片会完整适配预览空间。',
    downloadName: 'preview-03.svg',
  },
]

const options: BingImagePreviewProps = {
  "initialIndex": 0
}
const open = ref(false)
const cover = previewItems[options.initialIndex ?? 0]

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
  <circle cx="${width * 0.76}" cy="${height * 0.2}" r="${Math.min(width, height) * 0.22}" fill="${accent}" opacity="0.52"/>
  <circle cx="${width * 0.22}" cy="${height * 0.78}" r="${Math.min(width, height) * 0.28}" fill="${accent}" opacity="0.22"/>
  <path d="M0 ${height * 0.72} C ${width * 0.22} ${height * 0.44}, ${width * 0.5} ${height * 0.9}, ${width} ${height * 0.58} L ${width} ${height} L 0 ${height} Z" fill="${accent}" opacity="0.34"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${text}" font-family="Maple Mono NF CN, Consolas, monospace" font-size="${Math.round(width / 12)}" font-weight="800">${label}</text>
</svg>`

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}
</script>

<template>
  <div class="cover">
    <BingImage v-if="cover" :src="cover.src" :alt="cover.alt" width="100%" aspect-ratio="16 / 9" block radius="lg" />
  </div>
  <BingButton :throttle="false" @click="open = true">打开预览</BingButton>
  <BingImagePreview v-model="open" :items="previewItems" v-bind="options" ariaLabel="图片预览" />
</template>

<style scoped>
.cover { width: min(100%, 460px); margin-bottom: 16px; }
</style>
```

## 受控图库

当预览入口来自缩略图列表时，用 `v-model:current-index` 控制当前图片。用户在预览层切换图片后，外部索引也会同步更新。

打开时不发送 `change` 或 `update:currentIndex`。导航或外部索引变化会先发送目标索引和图片项，再异步预加载目标图片；计数器可能已经变化，而旧图和说明仍显示。计数器使用补零的数字（如 01/03），并通过中文名称“第 1 张，共 3 张”和状态区域播报。等待期间再次切换会取消旧请求的结果，返回原图也会通知索引。`change` 不能用来判断图片加载成功。

当前索引带有内部状态：只写 `:current-index="0"` 并忽略更新，用户仍能切图。用双向绑定保持一致，不要把固定属性当成切图禁用开关。外部替换列表会按新长度限制内部索引，不会因此补发索引或 change 事件。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingImagePreview, BingImage, type BingImagePreviewItem } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const previewItems: BingImagePreviewItem[] = [
  {
    src: createSvgImage('Preview 01', '#fee2e2', '#fb7185', '#7f1d1d'),
    alt: '预览图片一',
    caption: '第一张图片：横向封面图。',
    downloadName: 'preview-01.svg',
  },
  {
    src: createSvgImage('Preview 02', '#dbeafe', '#60a5fa', '#1e3a8a'),
    alt: '预览图片二',
    caption: '第二张图片：用于测试切换和计数器。',
    downloadName: 'preview-02.svg',
  },
  {
    src: createSvgImage('Preview 03', '#ede9fe', '#a78bfa', '#312e81', 'portrait'),
    alt: '预览图片三',
    caption: '第三张图片：竖向图片会完整适配预览空间。',
    downloadName: 'preview-03.svg',
  },
]

const open = ref(false)
const currentIndex = ref(0)
function openGallery(index: number) { currentIndex.value = index; open.value = true }

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
  <circle cx="${width * 0.76}" cy="${height * 0.2}" r="${Math.min(width, height) * 0.22}" fill="${accent}" opacity="0.52"/>
  <circle cx="${width * 0.22}" cy="${height * 0.78}" r="${Math.min(width, height) * 0.28}" fill="${accent}" opacity="0.22"/>
  <path d="M0 ${height * 0.72} C ${width * 0.22} ${height * 0.44}, ${width * 0.5} ${height * 0.9}, ${width} ${height * 0.58} L ${width} ${height} L 0 ${height} Z" fill="${accent}" opacity="0.34"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${text}" font-family="Maple Mono NF CN, Consolas, monospace" font-size="${Math.round(width / 12)}" font-weight="800">${label}</text>
</svg>`

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}
</script>

<template>
  <div class="gallery">
    <button v-for="(item, index) in previewItems" :key="item.src" type="button" class="thumb" :aria-label="item.alt" @click="openGallery(index)">
      <BingImage :src="item.src" :alt="item.alt" width="100%" aspect-ratio="4 / 3" block radius="lg" />
      <span>{{ item.caption }}</span>
    </button>
  </div>
  <p role="status">当前索引：{{ currentIndex }}</p>
  <BingImagePreview v-model="open" v-model:current-index="currentIndex" :items="previewItems" ariaLabel="受控图片预览" />
</template>

<style scoped>
.gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr)); gap: 14px; max-width: 960px; }
.thumb { display: grid; gap: 8px; min-width: 0; border: 0; padding: 0; background: transparent; color: inherit; text-align: left; cursor: pointer; }
.thumb:focus-visible { outline: 3px solid #a78bfa; outline-offset: 4px; }
</style>
```

## 工具栏与行为

预览层的工具栏负责切换、缩放、旋转、重置和下载；行为类 props 则控制是否循环、是否锁定页面滚动、是否允许 Escape 或遮罩关闭。

左右方向键切图，`+`/`=` 放大，`-` 缩小，`0` 重置。滚轮改变缩放；拖动平移，双击在放大和 1 倍之间切换。旋转通过工具栏每次改变 90°；打开、成功切图和重置会恢复 1 倍、零位移和零旋转。缩放区间建议包含 1，因为打开和重置不会把 1 再限制到区间内。

关闭按钮、遮罩、Escape 依次发送 `update:modelValue(false)` 和 `close(reason)`，父组件必须接收模型更新。忽略更新时弹层仍开着；外部直接赋值 false 不发送 close。正常关闭后恢复滚动和打开前的焦点，关闭动画结束没有单独事件。

`showToolbar=false` 也会隐藏关闭按钮、计数器和加载指示，但键盘、滚轮和桌面两侧导航仍可用。手机布局隐藏两侧导航。本示例在关闭工具栏和遮罩退出后保留 Escape，确保键盘仍可退出。业务不要同时禁用所有关闭入口，也不要依赖模态焦点范围之外的按钮提供键盘退出。

下载先发出 `{ item, index }`，再用原生链接打开 `downloadUrl || previewSrc || src`。没有取消参数、进度或成功通知；文件名只是 `a.download` 建议值。切图等待期间下载针对仍显示的旧图，不能用先行变化的外部索引代替 payload.index。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingImagePreview, type BingImagePreviewProps, type BingImagePreviewCloseReason, type BingImagePreviewDownloadPayload, type BingImagePreviewItem } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const previewItems: BingImagePreviewItem[] = [
  {
    src: createSvgImage('Preview 01', '#fee2e2', '#fb7185', '#7f1d1d'),
    alt: '预览图片一',
    caption: '第一张图片：横向封面图。',
    downloadName: 'preview-01.svg',
  },
  {
    src: createSvgImage('Preview 02', '#dbeafe', '#60a5fa', '#1e3a8a'),
    alt: '预览图片二',
    caption: '第二张图片：用于测试切换和计数器。',
    downloadName: 'preview-02.svg',
  },
  {
    src: createSvgImage('Preview 03', '#ede9fe', '#a78bfa', '#312e81', 'portrait'),
    alt: '预览图片三',
    caption: '第三张图片：竖向图片会完整适配预览空间。',
    downloadName: 'preview-03.svg',
  },
]

const options: BingImagePreviewProps = {
  "showToolbar": true,
  "showCounter": true,
  "downloadable": true,
  "loop": true,
  "closeOnEsc": true,
  "closeOnOverlay": true,
  "lockScroll": true
}
const open = ref(false)
const lastChangeText = ref('还没有切换')
const lastCloseReason = ref<BingImagePreviewCloseReason | '未关闭'>('未关闭')
const downloadCount = ref(0)
function handleChange(index: number, item: BingImagePreviewItem) { lastChangeText.value = (index + 1) + '：' + (item.caption || item.alt || item.src) }
function handleClose(reason: BingImagePreviewCloseReason) { lastCloseReason.value = reason }
function handleDownload(payload: BingImagePreviewDownloadPayload) { downloadCount.value += 1; lastChangeText.value = '下载：' + (payload.item.downloadName || payload.item.src) }

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
  <circle cx="${width * 0.76}" cy="${height * 0.2}" r="${Math.min(width, height) * 0.22}" fill="${accent}" opacity="0.52"/>
  <circle cx="${width * 0.22}" cy="${height * 0.78}" r="${Math.min(width, height) * 0.28}" fill="${accent}" opacity="0.22"/>
  <path d="M0 ${height * 0.72} C ${width * 0.22} ${height * 0.44}, ${width * 0.5} ${height * 0.9}, ${width} ${height * 0.58} L ${width} ${height} L 0 ${height} Z" fill="${accent}" opacity="0.34"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${text}" font-family="Maple Mono NF CN, Consolas, monospace" font-size="${Math.round(width / 12)}" font-weight="800">${label}</text>
</svg>`

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}
</script>

<template>
  <BingButton :throttle="false" @click="open = true">打开带事件的预览</BingButton>
  <p role="status">最后切换：{{ lastChangeText }}；关闭来源：{{ lastCloseReason }}；下载次数：{{ downloadCount }}</p>
  <BingImagePreview v-model="open" :items="previewItems" v-bind="options" ariaLabel="带事件的图片预览" @change="handleChange" @close="handleClose" @download="handleDownload" />
</template>
```

## 玻璃效果

预览层默认跟随主题：blur 为 16、opacity 为浅色 0.86 / 深色 0.92、saturation 为 1.05。参数留空时使用主题默认值。关闭 `glass` 会令模糊为 0、饱和度为 1、浮动控件背景不透明，深色遮罩仍保留。`glassOpacity` 改变工具栏、说明等浮动区域的背景，不改变遮罩的底色透明度。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingImagePreview, type BingImagePreviewProps, type BingImagePreviewItem } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const previewItems: BingImagePreviewItem[] = [
  {
    src: createSvgImage('Preview 01', '#fee2e2', '#fb7185', '#7f1d1d'),
    alt: '预览图片一',
    caption: '第一张图片：横向封面图。',
    downloadName: 'preview-01.svg',
  },
  {
    src: createSvgImage('Preview 02', '#dbeafe', '#60a5fa', '#1e3a8a'),
    alt: '预览图片二',
    caption: '第二张图片：用于测试切换和计数器。',
    downloadName: 'preview-02.svg',
  },
  {
    src: createSvgImage('Preview 03', '#ede9fe', '#a78bfa', '#312e81', 'portrait'),
    alt: '预览图片三',
    caption: '第三张图片：竖向图片会完整适配预览空间。',
    downloadName: 'preview-03.svg',
  },
]

const options: BingImagePreviewProps = {
  "glass": true
}
const open = ref(false)

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
  <circle cx="${width * 0.76}" cy="${height * 0.2}" r="${Math.min(width, height) * 0.22}" fill="${accent}" opacity="0.52"/>
  <circle cx="${width * 0.22}" cy="${height * 0.78}" r="${Math.min(width, height) * 0.28}" fill="${accent}" opacity="0.22"/>
  <path d="M0 ${height * 0.72} C ${width * 0.22} ${height * 0.44}, ${width * 0.5} ${height * 0.9}, ${width} ${height * 0.58} L ${width} ${height} L 0 ${height} Z" fill="${accent}" opacity="0.34"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${text}" font-family="Maple Mono NF CN, Consolas, monospace" font-size="${Math.round(width / 12)}" font-weight="800">${label}</text>
</svg>`

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}
</script>

<template>
  <BingButton :throttle="false" @click="open = true">查看玻璃效果</BingButton>
  <BingImagePreview v-model="open" :items="previewItems" v-bind="options" ariaLabel="玻璃效果预览" />
</template>
```

## 焦点与生命周期

根节点提供 `role="dialog"`、`aria-modal="true"` 和 `ariaLabel`，正常打开后聚焦根节点，正常关闭后尝试恢复先前焦点。Tab/Shift+Tab 在模态范围内循环，背景焦点会被引导回当前预览，但不会给背景统一设置 inert。图片快捷键仍不自动排除输入控件，业务扩展需注意事件处理。

`lockScroll` 在打开时读取，打开期间修改不会立即加锁/解锁。预览与 Dialog、FilePreview 共享浮层顺序和滚动锁；Escape 由最上层处理，最后一个持锁浮层退出后才恢复滚动。卸载会清理监听、计时器和本实例的滚动锁，浮层管理器会尝试恢复仍存在的先前焦点，不补发关闭事件。缓存页面离开时也应关闭或卸载；本页停用时关闭并卸载四个预览，切回可重新使用。

组件没有公开插槽和实例方法。自定义工具栏、加载/错误内容或下载拦截不是当前 API 支持的能力。

## 属性

| 属性                | 类型                       | 默认值                            | 说明                                                         |
| ----------------- | ------------------------ | ------------------------------ | ---------------------------------------------------------- |
| `modelValue`      | `boolean`                | `false`                        | 控制预览层是否打开，支持 v-model。                                      |
| `items`           | `BingImagePreviewItem[]` | `[]`                           | 图片列表；类型要求 src。运行时过滤 src 和 previewSrc 都为空的项，索引针对过滤后列表。      |
| `initialIndex`    | `number`                 | `0`                            | 每次打开时的默认索引；currentIndex 优先。打开期间改变此值不切图。                    |
| `currentIndex`    | `number`                 | `undefined`                    | 与外部同步当前索引，支持 v-model:current-index；组件切图也会更新内部索引，即使业务未接收更新。 |
| `zIndex`          | `number`                 | `undefined（基准 + 400，默认 2400）`  | 预览层根节点 z-index；未传时使用 ConfigProvider 的 zIndex 基准加 400。      |
| `minScale`        | `number`                 | `0.5`                          | 缩放操作的最小值按 max(0.1, min(minScale, maxScale)) 计算；打开和重置仍使用 1。 |
| `maxScale`        | `number`                 | `5`                            | 最大值至少为规范化后的最小值；使用有限数值，建议缩放区间包含 1。                          |
| `zoomStep`        | `number`                 | `0.25`                         | 工具栏、滚轮和键盘缩放步长，至少 0.05。                                     |
| `downloadable`    | `boolean`                | `false`                        | 有当前图片且 showToolbar=true 时显示下载按钮。                           |
| `loop`            | `boolean`                | `true`                         | 是否循环；false 时边界按钮仍可点击，但不切换。                                 |
| `lockScroll`      | `boolean`                | `true`                         | 打开时锁定 body/html 滚动；打开期间单独改变此值不重新应用锁。                       |
| `closeOnEsc`      | `boolean`                | `true`                         | 按 Escape 是否关闭预览。                                           |
| `closeOnOverlay`  | `boolean`                | `true`                         | 点击遮罩层是否关闭预览。                                               |
| `showToolbar`     | `boolean`                | `true`                         | 显示顶部工具栏；false 同时隐藏关闭、缩放、旋转、下载、计数器和加载指示，不关闭键盘/滚轮操作。         |
| `showCounter`     | `boolean`                | `true`                         | 有图片且 showToolbar=true 时显示索引和总数；等待切图时先显示目标索引。               |
| `teleportTo`      | `string \| HTMLElement`  | `'body'`                       | Teleport 目标，需在组件挂载时存在；根节点仍 position:fixed。                 |
| `ariaLabel`       | `string`                 | `'图片预览'`                       | 预览层 dialog 的可访问名称。                                         |
| `glass`           | `boolean`                | `true`                         | false 时设 blur=0px、opacity=1、saturation=1；深色遮罩仍保留。          |
| `glassBlur`       | `string \| number`       | `undefined（主题默认 16）`           | 背景模糊。数值/数值字符串转非负 px，也可传 CSS 长度。                            |
| `glassOpacity`    | `number`                 | `undefined（浅色 0.86 / 深色 0.92）` | 工具栏、说明、导航和空/错误提示的背景透明度，限制在 0 到 1；不改变遮罩底色透明度。               |
| `glassSaturation` | `number`                 | `undefined（主题默认 1.05）`         | 背景饱和度，最小 0。                                                |

## 图片项与事件

### 图片项

| 字段             | 类型       | 说明                                    |
| -------------- | -------- | ------------------------------------- |
| `src`          | `string` | 必填，原图地址；previewSrc 未提供或为空时显示此地址。      |
| `alt`          | `string` | 可选，图片替代文本，默认空字符串。                     |
| `previewSrc`   | `string` | 可选，优先显示的高清图地址。                        |
| `downloadUrl`  | `string` | 可选，下载地址；回退到 previewSrc 或 src。         |
| `downloadName` | `string` | 可选，原生 a.download 建议文件名；实际下载受浏览器与响应控制。 |
| `caption`      | `string` | 可选，底部说明，以文本显示。                        |

### 事件

| 事件                    | 参数                                          | 说明                                       |
| --------------------- | ------------------------------------------- | ---------------------------------------- |
| `update:modelValue`   | `value: boolean`                            | 关闭操作先发出 false；组件不发出 true。外部直接修改模型不触发此事件。 |
| `update:currentIndex` | `value: number`                             | 请求切图时立即通知目标索引；初始打开不发出。                   |
| `close`               | `reason: BingImagePreviewCloseReason`       | 紧跟关闭模型请求，不代表关闭完成；业务直接设 false 或卸载不补发。     |
| `change`              | `index: number, item: BingImagePreviewItem` | 紧跟索引通知，发生在目标图片预加载完成之前；不是 load 成功事件。      |
| `download`            | `payload: BingImagePreviewDownloadPayload`  | 创建 a 链接之前通知当前实际图片及索引；不能取消，不表示下载成功。       |

### 公开类型

| 公开类型                                            | 定义或说明                                                                |
| ----------------------------------------------- | -------------------------------------------------------------------- |
| `BingImagePreviewProps / BingImagePreviewEmits` | 属性与事件载荷元组声明。                                                         |
| `BingImagePreviewItem`                          | 图片项，完整字段见上表。                                                         |
| `BingImagePreviewCloseReason`                   | 'close' \| 'overlay' \| 'escape'。                                    |
| `BingImagePreviewDownloadPayload`               | \{ item: BingImagePreviewItem; index: number \}。index 为过滤后列表的实际显示索引。 |
