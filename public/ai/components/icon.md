# BingIcon

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export icon；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。四个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

完整示例使用 lucide-vue-next 1.0.0，需要项目显式安装该依赖；也可以传入支持属性透传的本地 SVG/Vue 组件。options 是演示配置；语义图标需要 decorative=false 和非空 label，图标本身不是按钮。

BingIcon 是图标规范层，用来把具体图标组件统一成一套尺寸、语义色、描边和可访问性规则。它不内置图标全集，也不把组件库绑定到某个图标库；项目里可以传入 lucide-vue-next 或本地 SVG/Vue 图标。

下方完整示例使用 `lucide-vue-next 1.0.0`，需要显式安装：`pnpm add lucide-vue-next@1.0.0`。自 0.12.0 起组件库内置图标已固化为本地 SVG，不再依赖或附带 lucide-vue-next；图标库并不是 BingIcon 的必选依赖，本地图标组件也可使用，但须把 class、style、role 和 aria 属性透传给实际 SVG 元素。静态导入的图标无需 markRaw；只有将组件对象放入深层响应式数据时才需要避免它被代理。

## 基础配置

通过 `icon` 传入图标组件，再用 `size`、`tone` 和`strokeWidth` 控制视觉表现。图标有明确语义时，关闭 `decorative` 并提供`label`。

0.6.0 默认描边为 1.75，与新版控件中的图标一致。需要其他线宽时显式设置 strokeWidth；演示中的 lg 尺寸和 primary 颜色用于便于观察，组件默认仍为 md 和 inherit。

```vue
<script setup lang="ts">
import { BingIcon, type BingIconProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
import { Bell, CheckCircle, CircleAlert, Sparkles, Star } from 'lucide-vue-next'

const icons = { star: Star, sparkles: Sparkles, bell: Bell, alert: CircleAlert, check: CheckCircle }
type DemoOptions = Omit<BingIconProps, 'icon'> & { iconName: keyof typeof icons }
const options: DemoOptions = {
  "iconName": "sparkles",
  "size": "lg",
  "tone": "primary",
  "strokeWidth": 1.75,
  "decorative": true,
  "label": "精选功能"
}
</script>

<template>
  <BingIcon :icon="icons[options.iconName]" :size="options.size" :tone="options.tone"
    :stroke-width="options.strokeWidth" :decorative="options.decorative" :label="options.label" />
</template>
```

## 尺寸

`size` 支持五个 token，也可以传数字或 px 字符串。数字会被转换为 px，适合临时对齐某个局部视觉规格。

五个尺寸依次为 `xs=14px`、`sm=16px`、`md=20px`、`lg=24px`、`xl=32px`。

```vue
<script setup lang="ts">
import { BingIcon, type BingIconSize } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
import { Star } from 'lucide-vue-next'

const sizes: BingIconSize[] = ['xs', 'sm', 'md', 'lg', 'xl', 28, '36px']
</script>

<template>
  <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 20px">
    <span v-for="size in sizes" :key="size" style="display: inline-flex; align-items: center; gap: 6px">
      <BingIcon :icon="Star" :size="size" tone="primary" /><code>{{ size }}</code>
    </span>
  </div>
</template>
```

## 语义色

`tone` 用来表达图标语义，避免每个业务页面重复写颜色。`inherit`会继承当前文字颜色，适合跟随按钮、标签或普通文本。

```vue
<script setup lang="ts">
import { BingIcon, type BingIconTone } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
import { Sparkles } from 'lucide-vue-next'

const tones: BingIconTone[] = ['inherit', 'muted', 'primary', 'secondary', 'danger', 'success', 'warning']
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; gap: 20px; color: rebeccapurple">
    <span v-for="tone in tones" :key="tone" style="display: inline-flex; align-items: center; gap: 6px">
      <BingIcon :icon="Sparkles" size="lg" :tone="tone" /><code>{{ tone }}</code>
    </span>
  </div>
</template>
```

## 可访问性

只用来装饰文字或按钮时，让图标保持装饰性即可。图标本身承担信息时，需要设置`decorative=false` 并提供 `label`。

当前版本在 label 为空字符串或未提供时仍会隐藏图标，即使 decorative=false。仅传 label 不会覆盖 decorative=true。图标不提供按钮行为；“打开通知”在此只是名称示例，如果需要点击操作，应放入有可访问名称的按钮，并让内部图标保持装饰性。

```vue
<script setup lang="ts">
import { BingIcon } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
import { Bell, Search } from 'lucide-vue-next'
</script>

<template>
  <div style="display: flex; align-items: center; gap: 24px">
    <span><BingIcon :icon="Search" tone="muted" decorative />搜索</span>
    <BingIcon :icon="Bell" tone="warning" :decorative="false" label="打开通知" />
  </div>
</template>
```

## 属性

| 属性            | 类型                                                                                       | 默认值         | 说明                                                          |
| ------------- | ---------------------------------------------------------------------------------------- | ----------- | ----------------------------------------------------------- |
| `icon`        | `Component`                                                                              | `必填`        | 具体图标组件，通常来自 lucide-vue-next 或项目内固化的 SVG/Vue 图标。             |
| `size`        | `` 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| number \| `${number}px` ``                    | `'md'`      | 图标尺寸。token 会映射为固定 px，数字会转成 px，px 字符串会直接使用。                  |
| `tone`        | `'inherit' \| 'muted' \| 'primary' \| 'secondary' \| 'danger' \| 'success' \| 'warning'` | `'inherit'` | 图标语义颜色。inherit 会继承当前文字颜色，其余值使用主题变量。                         |
| `strokeWidth` | `number`                                                                                 | `1.75`      | 线性图标描边粗细，通过图标元素的 CSS stroke-width 设置。                       |
| `decorative`  | `boolean`                                                                                | `true`      | 是否为装饰性图标。装饰性图标会设置 aria-hidden。                              |
| `label`       | `string`                                                                                 | `undefined` | 非装饰性图标的可访问名称。decorative=false 且提供 label 时，组件会渲染 role="img"。 |
