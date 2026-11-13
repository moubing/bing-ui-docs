# BingButton

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export button；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。八个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

基础与文字效果示例的 options 是演示配置；label 通过默认插槽展示，customShine 只决定是否覆盖主题配色。throttle 默认 false，节流示例显式开启；它按时间间隔拦截重复点击，不代表异步请求完成。示例只显示本地反馈，没有网络请求。

BingButton 是基础操作按钮，负责承载页面里的主操作、次操作、危险操作和状态反馈。它内置尺寸、圆角、加载态、禁用态、点击节流、prefix/suffix 插槽，以及基于 BingAnimatedText 的文字动效。

## 基础配置

通过 `variant`、`size` 和 `rounded`控制按钮的视觉层级、尺寸和圆角。下面的示例可以直接修改按钮文案和常用状态。

按钮文案使用默认插槽；下方 options 的 label 是示例参数，不是 Button 属性。`htmlType` 默认为 `button`，需要提交表单时显式设置 `html-type="submit"`。按钮不会自动执行保存请求。

```vue
<script setup lang="ts">
import { BingButton } from '@moubing/bing-ui'
import type { BingButtonProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

type DemoOptions = BingButtonProps & { label: string }
const options: DemoOptions = {
  "label": "提交订单",
  "variant": "primary",
  "size": "md",
  "rounded": "md",
  "loading": false,
  "disabled": false,
  "block": false
}

// label 是示例的文字参数；BingButton 的文字通过默认插槽传入。
const { label, ...buttonProps } = options
</script>

<template>
  <BingButton v-bind="buttonProps">{{ label }}</BingButton>
</template>
```

## 类型与语义

`variant` 用于表达操作语义。主按钮使用中性实色，并默认带文字扫光；其它类型默认保持静态文字，悬停时从指针位置铺开波纹。点击时播放短促碎屑反馈，按钮本体保持稳定。禁用、加载、节流拦截和减少动态效果时不播放新的点击反馈。

```vue
<script setup lang="ts">
import { BingButton } from '@moubing/bing-ui'
import type { BingButtonVariant } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const variants: BingButtonVariant[] = ['primary', 'secondary', 'tertiary', 'ghost', 'danger', 'success', 'warning']
</script>

<template>
  <div class="button-row">
    <BingButton v-for="variant in variants" :key="variant" :variant="variant" :text-effect="variant === 'primary' ? undefined : 'none'">{{ variant }}</BingButton>
  </div>
</template>

<style scoped>
.button-row { display: flex; flex-wrap: wrap; gap: 12px; }
</style>
```

## 繁忙页面的点击反馈

从 0.19.0 起，共享碎屑使用浏览器原生 `transform` / `opacity` 动画，保留 12 粒、540ms 的散开与淡出。动画提交后无需 JavaScript 逐帧驱动；组件卸载、清空键隐藏或菜单关闭不会打断已接受的反馈。整个应用卸载、来源滚动、窗口缩放、页面隐藏会清理反馈，连续操作最多保留三组。浏览器不支持 Web Animations 时跳过装饰，不影响操作。

`click` 仍在原事件中同步触发，不等待动画结束，因此剪贴板、文件选择和原生表单语义不变。若业务马上同步挂载大量 DOM，仍会推迟动画的首次绘制；路由或视图切换可以先给浏览器一次绘制机会，再执行重渲染。不要延迟需要用户激活的剪贴板和文件选择，也不要把网络等待、固定 540ms 延迟当成解决办法。

下面刻意模拟 300ms 主线程工作，先提交点击反馈，再开始计算；这种忙循环只用于观察动效，不应放入实际业务。减少动态效果时不播放碎屑。文字扫光和悬停波纹是独立效果。

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { BingButton } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const accepted = ref(0)
const completed = ref(0)
const pending = ref(false)
let frame = 0
function simulateWork() {
  accepted.value++ // click 同步生效，反馈不推迟业务事件。
  pending.value = true
  frame = requestAnimationFrame(() => {
    frame = requestAnimationFrame(() => {
      // 仅为演示模拟繁忙页面；实际项目应拆分长任务或减少挂载量。
      const until = performance.now() + 300
      while (performance.now() < until) { /* 模拟计算 */ }
      completed.value++
      pending.value = false
    })
  })
}
onBeforeUnmount(() => cancelAnimationFrame(frame))
</script>

<template>
  <div class="busy-example">
    <BingButton variant="secondary" text-effect="none" :disabled="pending" @click="simulateWork">模拟繁忙页面</BingButton>
    <p role="status">接受点击：{{ accepted }}；完成计算：{{ completed }}</p>
  </div>
</template>

<style scoped>
.busy-example { display: grid; justify-items: start; gap: 12px; padding: 32px; }
.busy-example p { margin: 0; }
</style>
```

## 尺寸与圆角

`size` 控制按钮高度、内边距和字号，`rounded`控制圆角等级。两者可以组合用于表单、工具栏、卡片操作区等不同密度的场景。

五档高度为 `xs=28`、`sm=32`、`md=36`、`lg=40`、`xl=44px`。未传入 size 时按 FormItem → Form → md 继承；disabled 同样支持表单继承，显式值优先。尺寸示例显式设置参数，便于横向对照。

```vue
<script setup lang="ts">
import { BingButton } from '@moubing/bing-ui'
import type { BingButtonRounded, BingButtonSize } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const sizes: BingButtonSize[] = ['xs', 'sm', 'md', 'lg', 'xl']
const roundedItems: BingButtonRounded[] = ['none', 'sm', 'md', 'lg', 'full']
</script>

<template>
  <p>尺寸</p>
  <div class="button-row">
    <BingButton v-for="size in sizes" :key="size" :size="size">{{ size.toUpperCase() }}</BingButton>
  </div>
  <p>圆角</p>
  <div class="button-row">
    <BingButton v-for="rounded in roundedItems" :key="rounded" variant="secondary" :rounded="rounded">{{ rounded }}</BingButton>
  </div>
</template>

<style scoped>
.button-row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
</style>
```

## 文字动效

Button 内部复用了 BingAnimatedText。通过 `textEffect`和 `textEffectTrigger` 可以控制文字扫光或字符跳动。

非加载状态下，显式 textEffect 优先于 textShine；text-effect="none" 关闭普通文字动效。Button 支持 none / shine / jump，shimmer 请单独使用 BingAnimatedText。hover 感应覆盖整个按钮，包括内边距与图标，键盘聚焦也能播放；扫光与跳动从指针进入位置起势。默认扫光时长为 1.6 秒、间隔为 2.4 秒。

```vue
<script setup lang="ts">
import { BingButton } from '@moubing/bing-ui'
import type { BingButtonProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

type DemoOptions = BingButtonProps & { label: string; customShine: boolean }
const options: DemoOptions = {
  "label": "悬停看看动效",
  "variant": "primary",
  "textEffect": "jump",
  "textEffectTrigger": "hover",
  "customShine": false,
  "shineColor": "#ffffff",
  "shineBaseColor": "#71717a",
  "textJumpY": -7,
  "textJumpStagger": 0.04
}
const { label, customShine, shineColor, shineBaseColor, ...props } = options
const buttonProps: BingButtonProps = {
  ...props,
  shineColor: customShine ? shineColor : undefined,
  shineBaseColor: customShine ? shineBaseColor : undefined,
}
</script>

<template>
  <BingButton v-bind="buttonProps">{{ label }}</BingButton>
</template>
```

## 状态与点击节流

`loading` 和 `disabled` 都会让按钮不可点击。0.6.0 默认关闭 `throttle`，需要防止短时间重复操作时显式开启，并通过 `throttled` 事件读取剩余等待时间。

loading 保留文字并临时循环播放 jump，沿用 `textJump` 参数，结束后恢复原先效果；带文字按钮仍保留前后图标，纯图标按钮改用加载图标。显式禁用及减少动态效果时保留静态文字。即使设置 textEffect=none，有文字的加载状态仍会使用 jump。

节流从上一次有效点击计时，间隔结束后允许下一次点击，不会等待异步请求完成。需要等待请求时，由业务在 try/finally 中设置 loading；`:throttle="false"` 或不大于 0 的 throttleDelay 可关闭节流。throttled 的参数是一个包含 event 和 remaining 的对象，remaining 是本次拦截时的剩余毫秒数，不是自动递减的倒计时。

Toast 示例只显示本地反馈。独立运行时挂载一个 BingToast；若应用根部已有 Toast 容器，可复用根部容器。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingToast, bingToast } from '@moubing/bing-ui'
import type { BingButtonThrottledPayload } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const clickCount = ref(0)
const throttledCount = ref(0)
const remainingMs = ref(0)
function handleAcceptedClick() {
  clickCount.value += 1
  // 仅演示反馈，不发送业务请求。
  bingToast.success({ title: '点击已生效', message: `第 ${clickCount.value} 次有效点击已通过节流校验。`, duration: 5000 })
}
function handleThrottled(payload: BingButtonThrottledPayload) {
  throttledCount.value += 1
  remainingMs.value = Math.ceil(payload.remaining)
}
</script>

<template>
  <div class="button-stack">
    <BingButton throttle :throttle-delay="1200" @click="handleAcceptedClick" @throttled="handleThrottled">连续点击试试</BingButton>
    <BingButton loading variant="secondary">加载中</BingButton>
    <BingButton disabled variant="ghost">不可用</BingButton>
  </div>
  <p role="status">有效点击：{{ clickCount }}；被节流：{{ throttledCount }}；剩余等待：{{ remainingMs }}ms</p>
  <!-- 应用根部通常只挂一个 Toast 容器；独立运行本例时在此挂载。 -->
  <BingToast viewport-position="all" />
</template>

<style scoped>
.button-stack { display: grid; justify-items: start; gap: 12px; }
</style>
```

## 动态文案

textSwap 默认 false，按需开启后，文案变化与按钮宽度平滑过渡。它独立于 textEffect；禁用及减少动态效果仍保留正确终态。下面只模拟复制结果，不访问剪贴板；关注状态保存在当前示例内。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const copied = ref(false)
const following = ref(false)
</script>

<template>
  <div class="buttons">
    <BingButton variant="tertiary" text-swap text-effect="none" @click="copied = !copied">{{ copied ? '已复制' : '复制链接' }}</BingButton>
    <BingButton variant="secondary" text-swap text-effect="none" @click="following = !following">{{ following ? '已关注' : '关注' }}</BingButton>
    <BingButton text-effect="jump" text-effect-trigger="hover" size="lg">整个按钮都能感应</BingButton>
  </div>
</template>

<style scoped>
.buttons { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; }
</style>
```

## 并排布局与长文字

0.18.0 起按钮默认 `flex-shrink: 0`，仍保留 `max-width: 100%`。与输入框并排时输入侧设置 `min-width: 0`；确需收缩的按钮显式设置 `flex-shrink: 1; min-width: 0`。省略号位于实际文字层，前后缀图标及加载状态继续保留。

键盘焦点使用全局 `--bing-focus-ring` 实色轮廓；自定义主题应分别验证亮暗表面上的辨识度，柔和光晕仍由 `--bing-focus` 控制。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingInput, type BingInputValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const value = ref<BingInputValue>('')
</script>
<template>
  <div style="display: grid; gap: 16px; min-width: 0">
    <div class="button-flex-demo"><BingInput v-model="value" block ariaLabel="并排搜索" placeholder="输入内容" /><BingButton>搜索</BingButton></div>
    <div class="button-flex-demo"><BingButton class="button-flex-demo__shrink">允许主动收缩的一段很长的操作文字</BingButton><BingButton variant="secondary">取消</BingButton></div>
    <p>按钮默认 flex-shrink: 0；输入侧 min-width: 0。确需收缩的按钮显式设置 flex-shrink: 1 和 min-width: 0，长文显示省略号。</p>
  </div>
</template>
<style scoped>
.button-flex-demo { display: flex; gap: 8px; min-width: 0; max-width: 320px; }
.button-flex-demo :deep(.bing-input) { flex: 1; min-width: 0; }
.button-flex-demo__shrink { flex-shrink: 1; min-width: 0; }
</style>
```

## 属性

| 属性                    | 类型                                                                                        | 默认值                                           | 说明                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------ |
| `textSwap`            | `boolean`                                                                                 | `false`                                       | 文案变化时逐字过渡，按钮宽度平滑伸缩；独立于 textEffect，默认关闭。                                              |
| `variant`             | `'primary' \| 'secondary' \| 'tertiary' \| 'ghost' \| 'danger' \| 'success' \| 'warning'` | `'primary'`                                   | 控制按钮视觉类型。                                                                            |
| `size`                | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                                                    | `继承 FormItem / Form / ConfigProvider，否则 'md'` | 高度依次为 28 / 32 / 36 / 40 / 44px；显式设置优先。ConfigProvider 只提供 sm / md / lg，xs / xl 需显式设置。 |
| `rounded`             | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'`                                                | `'md'`                                        | 控制圆角等级。                                                                              |
| `htmlType`            | `'button' \| 'submit' \| 'reset'`                                                         | `'button'`                                    | 映射原生 button 的 type。                                                                  |
| `disabled`            | `boolean`                                                                                 | `继承 FormItem / Form，否则 false`                 | 禁用按钮并阻止 click；显式 false 可覆盖继承。                                                        |
| `loading`             | `boolean`                                                                                 | `false`                                       | 按钮不可点击；有文字时临时使用循环 jump，纯图标按钮显示加载图标。                                                  |
| `block`               | `boolean`                                                                                 | `false`                                       | 按钮宽度撑满父容器。                                                                           |
| `throttle`            | `boolean`                                                                                 | `false`                                       | 显式开启后拦截间隔内的重复点击。                                                                     |
| `throttleDelay`       | `number`                                                                                  | `600`                                         | 点击节流间隔，单位毫秒。                                                                         |
| `textEffect`          | `'none' \| 'shine' \| 'jump'`                                                             | `undefined`                                   | 未设置时 primary 默认 shine；有文字的 loading 状态临时覆盖为 jump。                                     |
| `textEffectTrigger`   | `'always' \| 'hover'`                                                                     | `undefined`                                   | 文字动效触发方式。jump 默认 hover，shine 会根据 textShine 推导。                                       |
| `textShine`           | `'none' \| 'hover' \| 'always'`                                                           | `primary: always; others: none`               | shine 文字效果的快捷配置。                                                                     |
| `shineColor`          | `string`                                                                                  | `undefined`                                   | 文字扫光高光颜色。                                                                            |
| `shineBaseColor`      | `string`                                                                                  | `undefined`                                   | 文字扫光基础颜色。                                                                            |
| `shineSpeed`          | `number`                                                                                  | `1.6`                                         | 文字扫光单次时长，单位秒。                                                                        |
| `shineDelay`          | `number`                                                                                  | `0`                                           | 文字扫光首次播放前的延迟，单位秒。                                                                    |
| `shineInterval`       | `number`                                                                                  | `2.4`                                         | always 模式下每次扫光之间的间隔，单位秒。                                                             |
| `shineDirection`      | `'left' \| 'right'`                                                                       | `'left'`                                      | 文字扫光方向。                                                                              |
| `shineAngle`          | `number`                                                                                  | `120`                                         | 文字扫光渐变角度。                                                                            |
| `textJumpY`           | `number`                                                                                  | `-6`                                          | 字符跳动的垂直位移，单位 px。                                                                     |
| `textJumpStagger`     | `number`                                                                                  | `0.035`                                       | 字符之间的错峰时间，单位秒。                                                                       |
| `textJumpDuration`    | `number`                                                                                  | `0.34`                                        | 单个字符跳起并回落的总时长。                                                                       |
| `textJumpEase`        | `string`                                                                                  | `'power2.out'`                                | 字符上跳阶段使用的 GSAP ease。                                                                 |
| `textJumpReturnEase`  | `string`                                                                                  | `'back.out(2.4)'`                             | 字符回落阶段使用的 GSAP ease。                                                                 |
| `textJumpRepeatDelay` | `number`                                                                                  | `1.2`                                         | always 模式下每轮跳动之间的间隔。                                                                 |
| `ariaLabel`           | `string`                                                                                  | `undefined`                                   | 图标按钮或无可见文本按钮的可访问名称。                                                                  |

## 插槽与事件

### 插槽

| 插槽        | 说明                             |
| --------- | ------------------------------ |
| `default` | 按钮主内容，会经过 BingAnimatedText 渲染。 |
| `prefix`  | 按钮左侧内容，通常放图标或状态标记。             |
| `suffix`  | 按钮右侧内容，通常放箭头或辅助图标。             |

### 事件

| 事件          | 参数                                         | 说明                                |
| ----------- | ------------------------------------------ | --------------------------------- |
| `click`     | `MouseEvent`                               | 按钮可用且未被节流拦截时，在原事件中同步触发；不等待碎屑播放结束。 |
| `throttled` | `{ event: MouseEvent; remaining: number }` | 连续点击被节流拦截时触发。                     |
| `focus`     | `FocusEvent`                               | 按钮获得焦点时触发。                        |
| `blur`      | `FocusEvent`                               | 按钮失去焦点时触发。                        |
