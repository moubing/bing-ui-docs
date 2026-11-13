# BingCard

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export card；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。六个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

options 为演示参数。翻面由组件内部管理，flip 只通知当前面；interactive=false 不关闭翻面。disabled 阻止表面指针事件，但子按钮仍需显式禁用。0.6.0 的反面仍一直 aria-hidden，重要说明需另有可访问入口。

BingCard 是内容容器，用于承载信息卡片、功能入口、数据摘要和可翻面的展示面板。它把标题、描述、媒体区、正文、底部操作和反面内容拆成清晰插槽，同时内置玻璃效果、指针倾斜、高光、入场动画和翻面交互。

## 基础配置

通过 `variant`、`padding` 和 `rounded`调整卡片外观；`glass`、`tilt` 和 `glare`控制卡片的质感和指针反馈。

此组件无 v-model，也没有公开的翻面实例方法；flip 事件用于接收当前面。`interactive=false` 只影响交互类名和倾斜处理，关闭翻面应设置 `flipTrigger="none"`。disabled 会阻止卡片表面的指针事件，但不会设置插槽按钮的 disabled，键盘仍可激活按钮；需要完全禁用业务操作时，请显式禁用子控件。玻璃参数的实际默认值已在 API 表展开。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingCard, type BingCardProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const options: BingCardProps = {
  "title": "洞察面板",
  "description": "把信息、操作和轻量动效放在同一个内容容器里。",
  "variant": "soft",
  "padding": "md",
  "rounded": "md",
  "glass": true,
  "tilt": true,
  "glare": true,
  "disabled": false
}
const message = ref('')
</script>

<template>
  <BingCard v-bind="options">
    <p>转化率 <strong>18.6%</strong></p>
    <p>活跃用户 <strong>4,280</strong></p>
    <template #footer>
      <div @pointerdown.stop @click.stop>
        <BingButton size="sm" variant="ghost" :disabled="options.disabled" @click="message = '已查看详情'">查看详情</BingButton>
      </div>
    </template>
  </BingCard>
  <p role="status">{{ message }}</p>
</template>
```

## 类型与空间

`plain` 和 `soft` 使用中性实色表面，`accent` 加入轻微强调色，`sky` 保留淡蓝色。开启 glass 后，磨砂只作用于卡片正反面的单层表面。模糊默认为 16px，不透明度随浅色 / 深色主题为 0.86 / 0.92，饱和度为 1.05；无需显式传入这些值。示例背景网格用于观察透明效果。

```vue
<script setup lang="ts">
import { BingCard, type BingCardVariant } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const variants: BingCardVariant[] = ['plain', 'soft', 'accent', 'sky']
</script>

<template>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 230px), 1fr)); gap: 20px">
    <BingCard v-for="variant in variants" :key="variant" :title="variant" :variant="variant"
      :glass="variant !== 'plain'" entrance="bubble">
      <p>{{ variant }} 适合不同层级的信息展示。</p>
    </BingCard>
  </div>
</template>
```

## 入场动画

`entrance` 用于设置卡片进入视口时的 GSAP 动画。文档中切换选项后，预览卡片会以新的 `key` 重新挂载，方便直接观察动画差异。

enter 表示准备入场，并非动画完成事件；entrance=none 或系统偏好减少动态效果时仍会通知。减少动态效果会跳过入场动画并关闭倾斜。entranceOnce 限制当前实例是否重复入场，重新挂载会创建新实例。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingCard, type BingCardProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const options: BingCardProps = {
  "entrance": "fade-up",
  "entranceOnce": false,
  "entranceDuration": 0.72,
  "entranceDelay": 0
}
const revision = ref(0)
const count = ref(0)
</script>

<template>
  <BingCard :key="revision" v-bind="options" title="入场动画" description="滚动进入视口或重新挂载时观察动画。"
    variant="accent" rounded="lg" @enter="count++">
    <p>这张卡片在进入视口时播放当前入场动画。</p>
  </BingCard>
  <BingButton size="sm" :throttle="false" @click="revision++">重新挂载</BingButton>
  <p role="status">进入次数：{{ count }}</p>
</template>
```

```vue
<script setup lang="ts">
import { BingCard, type BingCardEntrance } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const entrances: BingCardEntrance[] = ['fade-up', 'bubble', 'rotate-up', 'soft-pop']
</script>

<template>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 230px), 1fr)); gap: 20px">
    <BingCard v-for="entrance in entrances" :key="entrance" :title="entrance" :entrance="entrance"
      :variant="entrance === 'rotate-up' ? 'sky' : 'soft'">
      <p>不同入场动画适合不同的信息密度。</p>
    </BingCard>
  </div>
</template>
```

## 翻面交互

`flipTrigger` 支持 `click` 和 `press`。点击翻面适合显式查看详情，长按翻面适合带确认感的探索式内容。

默认是 press，示例选择 click。长按等待至少 120ms，移动超过 10px 或提前松开会取消；restore 在松开后恢复正面，stay 保持当前面。flip 在切换目标面时通知，并非动画结束后。flipAxis=z 只对入场旋转保留 z 轴，正反面切换回退为 y 轴。

0.6.0 的翻面仍依赖指针事件，卡片不是可聚焦按钮，反面始终带 aria-hidden。因此关键说明应同时提供普通正文或带按钮的可访问详情入口，不能只放在 back 插槽。点击翻面会忽略内部原生按钮、链接和输入控件等目标；包含长按或自定义交互时，仍可停止 pointerdown/click 冒泡，明确隔离业务操作。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingCard, type BingCardProps, type BingCardFlipSide } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const options: BingCardProps = {
  "flipTrigger": "click",
  "flipAxis": "y",
  "longPressRelease": "stay"
}
const side = ref<BingCardFlipSide>('front')
const presses = ref(0)
function handleFlip(value: BingCardFlipSide) { side.value = value }
function handleLongPress() { presses.value++ }
</script>

<template>
  <BingCard v-bind="options" title="可翻面的卡片" variant="sky" rounded="lg"
    @flip="handleFlip" @long-press="handleLongPress">
    <p>正面展示摘要内容。</p>
    <template #back><div>反面展示更多细节。</div></template>
  </BingCard>
  <p role="status">当前面：{{ side }}；长按触发：{{ presses }}</p>
  <p>此例演示指针翻面；关键说明同时放在普通正文中：反面展示更多细节。</p>
</template>
```

## 插槽组合

复杂卡片可以通过 `media`、`header`、`footer`和 `back` 插槽拆分结构，让页面里的展示面板保持清晰。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingCard } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const action = ref('等待操作')
</script>

<template>
  <BingCard title="任务卡片" description="使用多个插槽组织复杂内容。" variant="accent" rounded="lg">
    <template #media><div style="padding: 32px; text-align: center; background: linear-gradient(120deg, #93c5fd, #fbcfe8)">media</div></template>
    <template #header><strong>自定义头部</strong><p>可替代默认 title 与 description。</p></template>
    <p>默认插槽承载正文内容，适合放说明、指标或简短列表。</p>
    <template #footer>
      <div style="display: flex; flex-wrap: wrap; gap: 12px" @pointerdown.stop @click.stop>
        <BingButton size="sm" @click="action = '开始处理'">开始处理</BingButton>
        <BingButton size="sm" variant="ghost" @click="action = '稍后查看'">稍后查看</BingButton>
      </div>
    </template>
    <template #back><div>用于承载翻面后的扩展内容。</div></template>
  </BingCard>
  <p role="status">{{ action }}</p>
</template>
```

## 属性

| 属性                 | 类型                                                             | 默认值                      | 说明                                                        |
| ------------------ | -------------------------------------------------------------- | ------------------------ | --------------------------------------------------------- |
| `title`            | `string`                                                       | `undefined`              | 默认头部标题。                                                   |
| `description`      | `string`                                                       | `undefined`              | 默认头部描述。                                                   |
| `variant`          | `'plain' \| 'soft' \| 'accent' \| 'sky'`                       | `'soft'`                 | 控制卡片视觉类型。                                                 |
| `padding`          | `'none' \| 'sm' \| 'md' \| 'lg'`                               | `'md'`                   | 控制内容区内边距。                                                 |
| `rounded`          | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'`             | `'md'`                   | 控制圆角等级。                                                   |
| `glass`            | `boolean`                                                      | `true`                   | 开启玻璃拟态背景和模糊。                                              |
| `glassBlur`        | `string \| number`                                             | `主题变量，默认 16px`           | 玻璃模糊长度；数字转换为非负 px，也可传 CSS 长度字符串。                          |
| `glassOpacity`     | `number`                                                       | `主题变量，浅色 0.86 / 深色 0.92` | 玻璃底色不透明度，限制在 0 到 1；显式设置会覆盖主题默认值。                          |
| `glassSaturation`  | `number`                                                       | `主题变量，默认 1.05`           | 玻璃饱和度，最小为 0。                                              |
| `interactive`      | `boolean`                                                      | `true`                   | 控制交互类名和倾斜处理；不会关闭翻面，也不会自动提供按钮或键盘语义。                        |
| `tilt`             | `boolean`                                                      | `true`                   | 开启指针跟随的 3D 倾斜。                                            |
| `tiltMax`          | `number`                                                       | `8`                      | 最大倾斜角度，单位 deg。                                            |
| `tiltScale`        | `number`                                                       | `1.015`                  | 指针悬停时的缩放比例。                                               |
| `glare`            | `boolean`                                                      | `true`                   | 开启跟随指针的高光。                                                |
| `entrance`         | `'none' \| 'fade-up' \| 'bubble' \| 'rotate-up' \| 'soft-pop'` | `'fade-up'`              | 进入视口时的动画预设。                                               |
| `entranceOnce`     | `boolean`                                                      | `true`                   | 入场动画是否只播放一次。                                              |
| `entranceDelay`    | `number`                                                       | `0`                      | 入场动画延迟，单位秒。                                               |
| `entranceDuration` | `number`                                                       | `0.72`                   | 入场动画时长，单位秒。                                               |
| `flipAxis`         | `'x' \| 'y' \| 'z'`                                            | `'x'`                    | 翻转轴。z 轴在反面渲染时会回退到 y 轴。                                    |
| `flipTurns`        | `number`                                                       | `2.5`                    | rotate-up 入场动画的翻转圈数。                                      |
| `flipEase`         | `string`                                                       | `'power4.out'`           | rotate-up 入场动画使用的 GSAP ease。                              |
| `flipTrigger`      | `'none' \| 'click' \| 'press'`                                 | `'press'`                | 翻面触发方式。                                                   |
| `longPressDelay`   | `number`                                                       | `560`                    | 长按触发翻面前的等待时间，单位毫秒，实际最小为 120。                              |
| `longPressRelease` | `'restore' \| 'stay'`                                          | `'restore'`              | 长按翻面后，松开时恢复正面或停留当前面。                                      |
| `disabled`         | `boolean`                                                      | `false`                  | 禁用自身翻面、倾斜与入场，卡片表面禁止指针事件；不会设置子控件的 disabled，仍需显式禁止子按钮的键盘操作。 |

## 插槽与事件

### 插槽

| 插槽        | 说明                                      |
| --------- | --------------------------------------- |
| `default` | 卡片正文内容。                                 |
| `media`   | 卡片顶部媒体区域。                               |
| `header`  | 自定义头部，会替代 title 和 description 渲染出的默认头部。 |
| `footer`  | 底部操作区。                                  |
| `back`    | 翻面后的反面内容。未传入时会显示默认反面占位。                 |

### 事件

| 事件           | 参数                  | 说明                                      |
| ------------ | ------------------- | --------------------------------------- |
| `enter`      | `()`                | 准备入场时触发；entrance=none 或减少动态效果时也会触发，无参数。 |
| `long-press` | `()`                | 长按达到触发时间时触发，无参数。                        |
| `flip`       | `'front' \| 'back'` | 卡片翻面后触发，参数表示当前面。                        |
