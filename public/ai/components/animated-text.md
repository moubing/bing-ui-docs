# BingAnimatedText

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export animated-text；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。五个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

options 是演示配置，text 通过默认插槽显示。文字、禁用和参数变化由同一实例直接响应，拆字仅操作装饰副本。组件已封装 GSAP/SplitText，无需在业务示例中注册插件；hover 支持父容器与键盘聚焦，once 等待进入视口；swap 默认关闭，play 可手动播放。disabled 不保留播放进度。

BingAnimatedText 是文本动效层，用于给标题、按钮文案、运营语句这类短文本添加 shine 扫光、shimmer 状态光带或 jump 字符跳动效果。它把 GSAP 动画、SplitText 拆字、hover/once/always 触发和低动态偏好处理封装在组件内部，使用时只需要通过 props 描述效果。

## 效果类型

通过 `effect` 选择文本效果。下面的示例可以直接切换`none`、`shine`、`shimmer` 和 `jump`，同时修改文案。

组件不接收 text prop，文字通过默认插槽传入，外观字号和颜色继承上下文。示例的 options.text 是演示数据；不应把整个 options 当成组件原生属性直接传入。

0.6.0 会在同一实例中响应文字、effect、disabled 和动画参数变化，清理旧动画后重新初始化，无需为正常更新强制修改 key。jump 保留 Vue 管理的原始文字，只拆分装饰副本，避免切换效果或更新文案时丢字。

```vue
<script setup lang="ts">
import { BingAnimatedText, type BingAnimatedTextProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

type ExampleOptions = BingAnimatedTextProps & { text: string }
const options: ExampleOptions = {
  "text": "让文字动起来",
  "effect": "shine",
  "trigger": "always",
  "disabled": false
}
</script>

<template>
  <p class="title">
    <BingAnimatedText :effect="options.effect" :trigger="options.trigger" :disabled="options.disabled">{{ options.text }}</BingAnimatedText>
  </p>
</template>

<style scoped>
.title { margin: 0; color: inherit; font-size: clamp(1.8rem, 4vw, 3.8rem); font-weight: 400; line-height: 1.4; }
</style>
```

## 触发方式

`trigger` 控制动画何时播放。`always` 适合持续吸引注意，`hover` 适合交互反馈，`once` 适合首屏进入动效。

always 在视口内循环、离开视口暂停；once 等待首次进入视口播放。hover 同时支持指针进入与键盘焦点，可用 hoverTarget 将感应区域扩展到父按钮；组件自身仍不会自动成为焦点目标。followPointer 默认开启：jump 从最近字符向两侧扩散，shine 从指针进入侧扫入；固定方向演示显式设置 false。

shineSpeed 默认 1.6 秒，最少 0.1 秒；shineInterval 默认 2.4 秒，负值按 0。shineDelay 用于首轮及每次 hover，always 后续只等 shineInterval。shine 保留原文字颜色叠加高光；shimmer 让常态文字减淡，用原色光带表示持续状态。关闭 followPointer 后，left 从右向左、right 反向。

```vue
<script setup lang="ts">
import { BingAnimatedText, type BingAnimatedTextProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

type ExampleOptions = BingAnimatedTextProps & { text: string }
const options: ExampleOptions = {
  "text": "细腻的扫光文字",
  "shineDirection": "left",
  "shineColor": "#d4d4d8",
  "shineBaseColor": "#71717a",
  "shineSpeed": 2.4,
  "shineInterval": 1.2
}
</script>

<template>
  <p class="title">
    <BingAnimatedText :follow-pointer="false" effect="shine" trigger="always" :shine-direction="options.shineDirection"
      :shine-color="options.shineColor" :shine-base-color="options.shineBaseColor" :shine-speed="options.shineSpeed" :shine-interval="options.shineInterval">{{ options.text }}</BingAnimatedText>
  </p>
</template>

<style scoped>
.title { margin: 0; font-size: clamp(1.8rem, 4vw, 3.8rem); font-weight: 400; line-height: 1.4; }
</style>
```

## Jump 字符跳动

`jump` 会把文本拆成字符并错峰播放。它适合按钮文案、空状态标题、短促提示语这类需要轻微反馈的内容。

jump 使用内置 SplitText 拆成词和字符，插槽文字不需要自行拆分或注册插件。单字符上行和回落合计 jumpDuration，整轮另加字符错峰；jumpStagger/jumpRepeatDelay 负值按 0。jumpY 正值向下，向下的额外空间需要业务布局预留。

原始文字保留在文档中；装饰副本整体设置 aria-hidden 和 inert，避免重复朗读或取得焦点。中文、日文词组允许换行。组件本身是 span，不是按钮，不自动获得焦点。建议使用短纯文本，将链接/按钮等交互元素放在拆字区域外，并在实际页面核对辅助技术表现。

```vue
<script setup lang="ts">
import { BingAnimatedText, type BingAnimatedTextProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

type ExampleOptions = BingAnimatedTextProps & { text: string }
const options: ExampleOptions = {
  "text": "悬停让每个字符跳动",
  "jumpY": -10,
  "jumpStagger": 0.028,
  "jumpDuration": 0.36
}
</script>

<template>
  <p class="title">
    <BingAnimatedText effect="jump" trigger="hover" :jump-y="options.jumpY"
      :jump-stagger="options.jumpStagger" :jump-duration="options.jumpDuration">{{ options.text }}</BingAnimatedText>
  </p>
</template>

<style scoped>
.title { margin: 0; font-size: clamp(1.8rem, 4vw, 3.8rem); font-weight: 400; line-height: 1.4; }
</style>
```

## 禁用动画

使用 disabled 可以停止 shine 或 jump，清理当前动画及拆字副本，原始文字继续显示。

这里演示 shine 的停止和重新初始化，不会从原进度继续播放。基础示例切换到 jump 后也可直接禁用，无需卸载实例。

减少动态效果偏好会在初始化、播放和媒体查询 change 事件中处理，BingConfigProvider 的 `reducedMotion` 变化也会触发同样的处理；偏好切换后停止动画并显示普通文本，恢复动态效果后按当前 trigger 重新初始化。本页缓存停用时卸载示例，以清理循环、计时任务、媒体查询监听和 SplitText。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingAnimatedText, BingCheckbox, type BingAnimatedTextProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const options: BingAnimatedTextProps = {
  "disabled": false
}
const disabled = ref(options.disabled ?? false)
</script>

<template>
  <p class="title"><BingAnimatedText effect="shine" trigger="always" :disabled="disabled">动画可以暂停</BingAnimatedText></p>
  <BingCheckbox v-model="disabled" label="禁用扫光" />
</template>

<style scoped>
.title { margin: 0 0 20px; font-size: clamp(1.8rem, 4vw, 3.8rem); font-weight: 400; line-height: 1.4; }
</style>
```

## 状态光带、文字切换与手动播放

swap 默认关闭。开启后，保留字符移动到新位置，新旧字符分别进出；适合计数、上传状态和短按钮文案。连续更新会收敛到最新内容，减少动态效果时直接显示终态。示例使用本地计数模拟上传，不发送文件。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingAnimatedText, BingButton, type BingAnimatedTextExpose } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const count = ref(15)
const uploaded = ref(0)
const manual = ref<BingAnimatedTextExpose | null>(null)
</script>

<template>
  <div class="motion-demo">
    <BingAnimatedText effect="shimmer">正在同步内容</BingAnimatedText>
    <div class="row">
      <BingButton variant="secondary" ariaLabel="减少未读" @click="count = Math.max(0, count - 1)">−</BingButton>
      <BingButton variant="secondary" ariaLabel="增加未读" @click="count++">+</BingButton>
      <span role="status"><BingAnimatedText swap>{{ count }} 条未读消息</BingAnimatedText></span>
    </div>
    <div class="row">
      <BingButton variant="tertiary" @click="uploaded++">模拟上传</BingButton>
      <span role="status"><BingAnimatedText swap>{{ uploaded ? uploaded + ' 个文件已上传' : '等待上传' }}</BingAnimatedText></span>
    </div>
    <button class="motion-trigger" type="button" @click="manual?.play($event)">
      <BingAnimatedText ref="manual" effect="jump" trigger="hover" hover-target=".motion-trigger">悬停、聚焦或点击播放</BingAnimatedText>
    </button>
  </div>
</template>

<style scoped>
.motion-demo { display: grid; gap: 24px; }
.row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
.motion-trigger { padding: 20px; color: inherit; background: transparent; border: 1px solid currentColor; border-radius: 12px; font: inherit; cursor: pointer; }
</style>
```

## 属性

| 属性                | 类型                                         | 默认值               | 说明                                                    |
| ----------------- | ------------------------------------------ | ----------------- | ----------------------------------------------------- |
| `hoverTarget`     | `string \| HTMLElement \| null`            | `undefined`       | hover 与键盘焦点的感应区域；选择器从文字向上 closest 查找，默认文字自身。          |
| `followPointer`   | `boolean`                                  | `true`            | hover 时 jump 从最近字符扩散，shine 从指针进入侧扫入；false 使用固定方向。     |
| `swap`            | `boolean`                                  | `false`           | 纯文本更新时保留字符平移、删除字符淡出、新增字符翻入；不延迟数据更新。                   |
| `effect`          | `'none' \| 'shine' \| 'shimmer' \| 'jump'` | `'none'`          | shine 保持原色扫光；shimmer 减淡常态文字并扫过原色光带；jump 逐字跳跃。         |
| `trigger`         | `'always' \| 'hover' \| 'once'`            | `'always'`        | 控制动画播放时机。                                             |
| `disabled`        | `boolean`                                  | `false`           | 停止动画并清理装饰副本，保留原始文本。                                   |
| `shineColor`      | `string`                                   | `undefined`       | shine 高光颜色。                                           |
| `shineBaseColor`  | `string`                                   | `undefined`       | shine 基础文字颜色。                                         |
| `shineSpeed`      | `number`                                   | `1.6`             | shine 扫光时长，秒，最小 0.1。                                  |
| `shineDelay`      | `number`                                   | `0`               | 首轮扫光等待时间，单位秒，负值按 0；hover 每次触发也等待此值，always 后续轮次不使用此延迟。 |
| `shineInterval`   | `number`                                   | `2.4`             | always 下两轮扫光之间的间隔，秒，最小 0。                             |
| `shineDirection`  | `'left' \| 'right'`                        | `'left'`          | shine 扫光方向。                                           |
| `shineAngle`      | `number`                                   | `120`             | shine 渐变角度。                                           |
| `jumpY`           | `number`                                   | `-6`              | 字符跳动偏移，单位 px；负值向上，正值向下。组件只按向上的距离预留空间。                 |
| `jumpStagger`     | `number`                                   | `0.035`           | 字符之间的错峰，秒，最小 0。                                       |
| `jumpDuration`    | `number`                                   | `0.34`            | 单字符一轮时长，秒，至少 0.1；上行占 45%，回落占 55%，全轮另加错峰时间。            |
| `jumpEase`        | `string`                                   | `'power2.out'`    | 字符上行时使用的 GSAP ease。                                   |
| `jumpReturnEase`  | `string`                                   | `'back.out(2.4)'` | 字符回落时使用的 GSAP ease。                                   |
| `jumpRepeatDelay` | `number`                                   | `1.2`             | always 下两轮 jump 之间的间隔，秒，最小 0。                         |

## 插槽与公开类型

通过组件 ref 的 play(origin?) 手动播放一次；origin 接收 ，也可以直接传入鼠标或指针事件。公开类型 BingAnimatedTextExpose 与 BingAnimatedTextPlayOrigin 从包根入口导入。没有 pause/restart 或完成事件；无需为普通文案变化更换 key。

| 插槽        | 参数  | 说明                                        |
| --------- | --- | ----------------------------------------- |
| `default` | `-` | 文本内容；jump 拆成词/字符。优先用短纯文本，避免把交互控件放进被拆分的区域。 |

| 公开类型                             | 取值或说明                                                                  |
| -------------------------------- | ---------------------------------------------------------------------- |
| `BingAnimatedTextExpose`         | play(origin?: BingAnimatedTextPlayOrigin): void，手动播放当前效果。              |
| `BingAnimatedTextPlayOrigin`     | \{ clientX: number; clientY: number \}；可直接传 MouseEvent / PointerEvent。 |
| `BingAnimatedTextProps`          | 19 项可选属性，见上表。                                                          |
| `BingAnimatedTextEffect`         | 'none' \| 'shine' \| 'shimmer' \| 'jump'。                              |
| `BingAnimatedTextTrigger`        | 'always' \| 'hover' \| 'once'。                                         |
| `BingAnimatedTextShineDirection` | 'left' \| 'right'。                                                     |
