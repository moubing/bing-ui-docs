# BingTag

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export tag；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。五个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

基础示例中的 options 是演示参数，不代表默认值。close 只通知业务，不会自动删除标签；列表示例通过更新数据移除和恢复标签。插槽替代 label 时按需设置关闭按钮的可访问名称。

BingTag 是轻量状态标签，用于展示分类、状态、数量摘要和可移除筛选项。它支持三种尺寸、六种语义 tone、glass/soft 两种视觉风格、可关闭状态、禁用状态和默认插槽自定义内容。

## 基础配置

使用 `label` 设置文案，`tone` 表达语义颜色，`variant` 控制边框与圆角风格。开启 `closable` 后会显示关闭按钮并触发 `close` 事件。

基础示例仅统计关闭次数，标签会继续显示。要真正移除标签，在 close 回调中更新列表或控制组件是否渲染；Tag 没有 visible/v-model 协议。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingTag } from '@moubing/bing-ui'
import type { BingTagProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const options: BingTagProps = {
  "label": "Aurora",
  "size": "md",
  "tone": "primary",
  "variant": "glass",
  "closable": true,
  "disabled": false
}
const closeCount = ref(0)
function handleClose(_event: MouseEvent) { closeCount.value += 1 }
</script>

<template>
  <!-- close 只通知业务；本例只计数，所以标签仍然显示。 -->
  <BingTag v-bind="options" @close="handleClose" />
  <p role="status">关闭事件：{{ closeCount }}</p>
</template>
```

## 颜色与风格

`tone` 用于表达状态含义。默认 `glass` 在新版中采用细边框和紧凑圆角；`soft` 使用无可见边框的胶囊形状。两者都使用主题语义底色，Tag 没有 Card 那样的背景模糊参数。

```vue
<script setup lang="ts">
import { BingTag } from '@moubing/bing-ui'
import type { BingTagTone } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const tones: BingTagTone[] = ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger']
</script>

<template>
  <div class="tags">
    <BingTag v-for="tone in tones" :key="tone" :tone="tone" :variant="tone === 'primary' || tone === 'secondary' ? 'glass' : 'soft'" :label="tone" />
  </div>
</template>

<style scoped>
.tags { display: flex; flex-wrap: wrap; gap: 12px; }
</style>
```

## 尺寸

`sm/md/lg` 的高度分别为 20/24/28px。`sm` 适合表格单元格和状态列表，`md` 是默认尺寸，`lg` 适合强调当前筛选或页面摘要。

```vue
<script setup lang="ts">
import { BingTag } from '@moubing/bing-ui'
import type { BingTagSize } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const sizes: BingTagSize[] = ['sm', 'md', 'lg']
</script>

<template>
  <div class="tags">
    <BingTag v-for="size in sizes" :key="size" :size="size" tone="secondary" variant="soft" :label="`${size} 标签`" />
  </div>
</template>

<style scoped>
.tags { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
</style>
```

## 可关闭标签

可关闭标签不会自己删除，需要业务侧在 `close` 事件里移除数据。当 `disabled` 为 true 时，关闭按钮会禁用，也不会触发 `close`。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingTag } from '@moubing/bing-ui'
import type { BingTagTone } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

type FilterTag = { id: string; label: string; tone: BingTagTone }
const initial: FilterTag[] = [
  { id: 'docs', label: '文档', tone: 'primary' },
  { id: 'demo', label: '示例', tone: 'secondary' },
  { id: 'api', label: 'API', tone: 'success' },
]
const tags = ref<FilterTag[]>([...initial])
function removeTag(id: string) { tags.value = tags.value.filter(tag => tag.id !== id) }
function restoreTags() { tags.value = [...initial] }
</script>

<template>
  <div class="tags">
    <BingTag v-for="tag in tags" :key="tag.id" :label="tag.label" :tone="tag.tone" closable @close="removeTag(tag.id)" />
    <BingTag label="禁用" tone="neutral" closable disabled close-aria-label="移除禁用标签" />
  </div>
  <BingButton size="sm" variant="secondary" @click="restoreTags">恢复标签</BingButton>
  <p role="status">当前筛选：{{ tags.map(tag => tag.id).join(',') || '无' }}</p>
</template>

<style scoped>
.tags { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 12px; }
</style>
```

## 自定义内容

默认插槽可以覆盖 `label`，适合放入状态点、图标或组合文本。组件内部会对标签内容做省略处理，避免长文本撑破布局。

关闭按钮的默认名称只读取 label，不会读取插槽文字：有 label 时是 `移除 <label>`，否则为 `移除标签`。仅通过插槽显示文案且可关闭时，建议显式设置 `closeAriaLabel`。

```vue
<script setup lang="ts">
import { BingTag } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
</script>

<template>
  <div class="tags">
    <BingTag tone="success" variant="soft">
      <span class="tag-content"><span class="tag-dot" aria-hidden="true"></span>已发布</span>
    </BingTag>
    <BingTag tone="neutral" variant="soft" size="sm">+3</BingTag>
    <BingTag tone="warning" variant="glass" label="这是一个很长的标签文案，会被省略展示" />
  </div>
</template>

<style scoped>
.tags { display: flex; flex-wrap: wrap; gap: 12px; max-width: 300px; }
.tag-content { display: inline-flex; align-items: center; gap: 6px; }
.tag-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex: none; }
</style>
```

## 属性

| 属性               | 类型                                                                            | 默认值                                    | 说明                                                   |
| ---------------- | ----------------------------------------------------------------------------- | -------------------------------------- | ---------------------------------------------------- |
| `label`          | `string`                                                                      | `undefined`                            | 标签文案；如果传入默认插槽，插槽内容会替代 label。                         |
| `size`           | `'sm' \| 'md' \| 'lg'`                                                        | `undefined（继承 ConfigProvider，否则 'md'）` | 标签高度分别为 20/24/28px。                                  |
| `tone`           | `'primary' \| 'secondary' \| 'neutral' \| 'success' \| 'danger' \| 'warning'` | `'primary'`                            | 标签语义颜色。                                              |
| `variant`        | `'glass' \| 'soft'`                                                           | `'glass'`                              | glass 为细边框圆角标签；soft 为无可见边框的胶囊标签。                     |
| `closable`       | `boolean`                                                                     | `false`                                | 是否显示关闭按钮。                                            |
| `disabled`       | `boolean`                                                                     | `false`                                | 是否禁用关闭按钮，并降低整体透明度。                                   |
| `closeAriaLabel` | `string`                                                                      | `undefined`                            | 关闭按钮名称；默认是“移除 ”加 label，无 label 时为“移除标签”，不会从默认插槽提取文案。 |

## 插槽与事件

### 插槽

| 插槽        | 参数  | 说明                      |
| --------- | --- | ----------------------- |
| `default` | `-` | 自定义标签内容；可放入图标、状态点或组合文本。 |

### 事件

| 事件      | 参数           | 说明                                 |
| ------- | ------------ | ---------------------------------- |
| `close` | `MouseEvent` | 点击关闭按钮且未 disabled 时触发；组件内部会阻止事件冒泡。 |
