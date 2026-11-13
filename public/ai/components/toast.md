# BingToast

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export toast；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。五个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

options 是演示配置。每个示例单独运行；业务应用只保留一个全局视口。服务入口共享队列，同 id 更新是整条替换；示例取消定时任务并在卸载时关闭自己创建的提示。操作示例用定时器模拟异步撤销，勾选时下一次撤销失败，用来演示保留提示供重试。

BingToast 是全局消息提示系统，用于保存成功、提交失败、异步处理中、警告和信息提醒。页面中挂载 `BingToast` 作为视口，然后通过 `bingToast` 或 `useBingToast()` 创建、更新、关闭和清空消息。两种入口返回同一个服务，共享消息队列。

## 视口和服务

`BingToast` 本身只负责渲染消息视口；真正创建消息的是 `bingToast` 服务。一个页面通常只需要挂载一个 `viewportPosition="all"` 的视口。 `smoothScroll` 默认作用于各位置的消息堆叠滚动区域；设为 `false` 可关闭。

当前同时挂载多个视口时，只有最先注册的视口显示消息，它卸载后才由下一个接替。因此不要用多个视口分别承载不同位置；使用一个 `all` 视口即可。创建消息时不要求已有视口，计时器从服务调用时开始，可能在视口挂载前到期。

从包根导入组件与服务，并导入 `@moubing/bing-ui/style.css`。在浏览器事件或挂载后创建提示；Nuxt 可将视口放入 `ClientOnly`，不要在服务端渲染期间调用共享服务创建业务消息。下方每个示例可单独运行；业务应用已有视口时，只保留一个全局视口。示例卸载时仅关闭自己创建的消息。

使用 `KeepAlive` 时，离开缓存页面只会触发 `onDeactivated`，不会卸载页面。推荐将唯一视口放在缓存页面之外，并在业务页停用时清理自己的异步演示任务；如果视口必须跟随页面，停用时用 `v-if` 卸载它，否则 Teleport 内容和活动视口资格仍会保留。文档站按后一种方式处理。

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { BingButton, BingToast, bingToast, type BingToastItem, type BingToastOptions, type BingToastProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

type DemoOptions = BingToastOptions & BingToastProps
const options: DemoOptions = {
  "type": "success",
  "title": "保存成功",
  "message": "新的组件文档已经写入本地页面。",
  "position": "top-right",
  "duration": 2800,
  "closable": true,
  "viewportPosition": "all",
  "width": "360px",
  "offset": "18px",
  "gap": "10px",
  "max": 5
}
const ownedIds = new Set<string>()
const lastId = ref<string>()
const feedback = ref('等待操作')
const count = computed(() => bingToast.getToasts().length)
function notify() {
  lastId.value = bingToast.show({ type: options.type, title: options.title, message: options.message,
    position: options.position, duration: options.duration, closable: options.closable })
  ownedIds.add(lastId.value)
}
function closeLast() { if (lastId.value) bingToast.close(lastId.value); feedback.value = '服务关闭' }
function handleClose(item: BingToastItem) { feedback.value = `用户关闭：${item.type}` }
onBeforeUnmount(() => ownedIds.forEach(id => bingToast.close(id)))
</script>

<template>
  <div class="actions">
    <BingButton :throttle="false" @click="notify">创建提示</BingButton>
    <BingButton :throttle="false" @click="closeLast">关闭上一条</BingButton>
    <BingButton :throttle="false" @click="bingToast.clear(options.position)">清空当前位置</BingButton>
    <BingButton :throttle="false" @click="bingToast.clear()">清空全部</BingButton>
  </div>
  <p role="status">队列：{{ count }}；{{ feedback }}</p>
  <BingToast :viewport-position="options.viewportPosition" :width="options.width" :offset="options.offset"
    :gap="options.gap" :max="options.max" @close="handleClose" />
</template>

<style scoped>
.actions { display: flex; gap: 10px; flex-wrap: wrap; }
</style>
```

## 消息类型

服务方法会预设消息类型。`success`、`error`、`warning` 和`info` 会使用不同图标和强调色；`loading` 默认不会自动关闭。

0.6.0 使用中性卡片、细边框和更轻的阴影，各消息类型通过图标及局部颜色区分。下方“当前调用”卡展示配置内容；点击创建后，实际 Toast 出现在所选视口位置。

默认持续时间为 default 3200、success 2600、error 4200、loading 0、warning 3600、info 3200 毫秒。有限负值按 0 处理，0 表示不自动关闭；非有限值使用类型默认值。error、warning 使用 `role="alert"` 和 assertive，其他类型使用 status 和 polite；`closable=false` 只隐藏关闭按钮，不阻止计时器或服务关闭。

```vue
<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { BingButton, BingToast, useBingToast, type BingToastType } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const toast = useBingToast()
const types: BingToastType[] = ['default', 'success', 'error', 'loading', 'warning', 'info']
const methods = { default: toast.show, success: toast.success, error: toast.error,
  loading: toast.loading, warning: toast.warning, info: toast.info }
const ownedIds = new Set<string>()
function show(type: BingToastType) { ownedIds.add(methods[type]({ message: `${type} 消息`, ariaLabel: type })) }
onBeforeUnmount(() => ownedIds.forEach(id => toast.close(id)))
</script>

<template>
  <div class="actions"><BingButton v-for="type in types" :key="type" :throttle="false" @click="show(type)">{{ type }}</BingButton></div>
  <BingToast viewport-position="all" />
</template>

<style scoped>
.actions { display: flex; gap: 10px; flex-wrap: wrap; }
</style>
```

## Loading 更新

传入固定 `id` 可以更新同一条 Toast。常见用法是先创建 loading，请求完成后用同一个 id 更新为 success 或 error。

同 id 更新会按新输入重新生成整条消息，仅保留创建时间和排序编号；它不会合并旧字段。位置、标题、关闭按钮等需要重新提供，否则回到默认值。若该 id 已被关闭，再调用就会重新创建；示例先检查消息是否存在，并在取消或卸载时清理模拟定时器。

新增或更新任一消息会重启整个队列的自动关闭计时器。同位置按旧到新顺序额外错开 120ms；悬停提示区域或让提示获得焦点会暂停整个队列，离开后按完整 duration 重新计时，不是继续剩余时间。按钮关闭还会重启剩余队列；服务 `close`、`clear` 和自动到期不触发组件的 `close` 事件。

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { BingButton, BingToast, bingToast } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const busy = ref(false)
let id: string | undefined
let timer: ReturnType<typeof setTimeout> | undefined
function cancel() {
  if (timer !== undefined) clearTimeout(timer)
  timer = undefined
  if (id !== undefined) bingToast.close(id)
  busy.value = false
}
function start() {
  cancel()
  busy.value = true
  id = bingToast.loading({ title: '处理中', message: '正在同步组件元数据。', position: 'top-right' })
  const currentId = id
  // 仅模拟耗时，没有网络请求；用户已关闭的提示不再重新创建。
  timer = setTimeout(() => {
    timer = undefined
    busy.value = false
    if (!bingToast.getToasts().some(item => item.id === currentId)) return
    // 同 id 是整条替换，所需参数需要重新提供。
    bingToast.success({ id: currentId, title: '同步完成', message: '组件元数据已经更新。',
      position: 'top-right', duration: 2600, closable: true })
  }, 1200)
}
onBeforeUnmount(cancel)
</script>

<template>
  <div class="actions">
    <BingButton :disabled="busy" :throttle="false" @click="start">模拟 loading 到成功</BingButton>
    <BingButton :throttle="false" @click="cancel">取消演示</BingButton>
  </div>
  <BingToast viewport-position="all" />
</template>

<style scoped>
.actions { display: flex; gap: 10px; flex-wrap: wrap; }
</style>
```

## 操作按钮

`action` 在提示内放一个操作按钮，常用于“已移动 / 已删除，撤销”这类可以马上反悔的操作。按钮位于正文和关闭按钮之间，`label` 是按钮文字，`ariaLabel` 可补充更完整的可访问名称。

`onClick` 同步返回时立即按 `closeOnClick`（默认 true）关闭提示。返回 Promise 时，按钮显示加载并禁用重复点击，这条提示暂停自动关闭；兑现后关闭，`closeOnClick=false` 时恢复按钮并重新计时。Promise 拒绝表示操作没有成功：提示和按钮保留供重试，组件不额外报错，失败原因由调用方另行提示。同步抛出的异常视为代码缺陷，会交给应用的 errorHandler。

未指定 `duration` 时，带操作的提示至少保留 6000 毫秒，loading 仍不自动关闭；显式传入的 duration 不受影响。处理中用同 id 更新文字且传入同一个 action 对象时，处理中状态保留；原对象和它的 Vue 响应式代理视为同一个 action。重新创建配置对象表示更换操作，即使按钮文字和回调函数相同也不延续 loading。

换成新的 action，或关闭提示后重新创建同 id 的提示，旧 Promise 的成功或失败都不会改变新提示的 loading、计时或关闭状态。该规则也适用于 `onClick` 在第一次 `await` 之前同步替换提示的情况。下面的示例在撤销期间复用原 action 更新进度文字。

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { BingButton, BingCheckbox, BingToast, bingToast, type BingToastAction } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const status = ref('测试中')
const failNext = ref(true)
const log = ref('等待操作')
const timers = new Set<ReturnType<typeof setTimeout>>()

function wait(ms: number) {
  return new Promise<void>(resolve => {
    const timer = setTimeout(() => { timers.delete(timer); resolve() }, ms)
    timers.add(timer)
  })
}

function finish() {
  if (status.value === '已完成') return
  const previous = status.value
  status.value = '已完成'
  log.value = '已完成，可在提示中撤销'
  const action: BingToastAction = {
    label: '撤销',
    ariaLabel: '撤销 REQ-26 的状态修改',
    // 返回 Promise：处理中显示加载并暂停计时；兑现后关闭提示，拒绝时保留提示供重试。
    async onClick() {
      await wait(150)
      if (!bingToast.getToasts().some(toast => toast.id === 'toast-action-demo')) return
      // 复用同一个 action 更新文字，按钮继续加载，不能重复提交。
      show('REQ-26 已改为已完成，正在撤销…')
      await wait(450)
      if (failNext.value) {
        failNext.value = false
        log.value = '撤销失败，提示仍保留，可以再试一次'
        if (bingToast.getToasts().some(toast => toast.id === 'toast-action-demo')) show('REQ-26 已改为已完成')
        bingToast.error({ id: 'toast-action-demo-error', message: '撤销失败：状态已被他人修改', position: 'bottom' })
        throw new Error('conflict')
      }
      status.value = previous
      log.value = '已撤销，恢复为' + previous
    },
  }
  function show(message: string) {
    bingToast.success({ id: 'toast-action-demo', message, position: 'bottom', action })
  }
  show('REQ-26 已改为已完成')
}

onBeforeUnmount(() => {
  timers.forEach(timer => clearTimeout(timer))
  timers.clear()
  bingToast.close('toast-action-demo')
  bingToast.close('toast-action-demo-error')
})
</script>

<template>
  <div class="action-example">
    <p class="action-status">REQ-26：<strong>{{ status }}</strong></p>
    <div class="action-row">
      <BingButton :disabled="status === '已完成'" :throttle="false" @click="finish">标记完成</BingButton>
      <BingCheckbox v-model="failNext" label="下一次撤销失败" />
    </div>
    <p role="status">{{ log }}</p>
  </div>
  <BingToast viewport-position="all" />
</template>

<style scoped>
.action-example { display: grid; gap: 12px; }
.action-row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
.action-status, p { margin: 0; color: var(--bing-text); }
p[role=status] { color: var(--bing-muted); font-size: 13px; }
</style>
```

## 位置

`position` 控制单条消息出现的位置。`top-center` 会映射为 `top`，`bottom-center` 会映射为 `bottom`，用于兼容更直观的命名。

固定位置视口只显示对应消息，其他消息仍在全局队列中并参与计时。`max` 仅控制视觉深度，不限制队列长度或实际渲染条数；重复点击可看到全部消息保留在可滚动区域。`clear('top-center')` 会清空归一化后的 top 位置。

```vue
<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { BING_TOAST_POSITION_OPTIONS, BingButton, BingToast, bingToast, type BingToastPosition } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const ownedIds = new Set<string>()
function show(position: BingToastPosition) {
  ownedIds.add(bingToast.success({ message: `位置：${position}`, position, duration: 0, ariaLabel: position }))
}
onBeforeUnmount(() => ownedIds.forEach(id => bingToast.close(id)))
</script>

<template>
  <div class="actions">
    <BingButton v-for="position in BING_TOAST_POSITION_OPTIONS" :key="position" :throttle="false" @click="show(position)">{{ position }}</BingButton>
    <BingButton :throttle="false" @click="bingToast.clear('top-center')">清空顶部中央</BingButton>
    <BingButton :throttle="false" @click="bingToast.clear()">清空全部</BingButton>
  </div>
  <p>max=2 只限制视觉深度，所有消息仍保留在队列和滚动区域中。</p>
  <BingToast viewport-position="all" :max="2" />
</template>

<style scoped>
.actions { display: flex; gap: 10px; flex-wrap: wrap; max-width: 440px; margin: 140px auto 24px; }
</style>
```

## Props

| 属性                 | 类型                                      | 默认值                           | 说明                                                                        |
| ------------------ | --------------------------------------- | ----------------------------- | ------------------------------------------------------------------------- |
| `viewportPosition` | `BingToastViewportPosition`             | `'all'`                       | 当前活动视口渲染的位置，支持别名。只有最先注册的视口活动，建议只挂载一个 all 视口。                              |
| `zIndex`           | `number`                                | `undefined（基准 + 100，默认 2100）` | Toast 根节点 z-index；未传时使用 ConfigProvider 的 zIndex 基准加 100，Provider 需包住视口组件。 |
| `offset`           | `string \| number`                      | `18`                          | Toast 区域距离视口边缘的距离；数字会转为 px。                                               |
| `gap`              | `string \| number`                      | `10`                          | 同一位置内 Toast 之间的间距；数字会转为 px。                                               |
| `width`            | `string \| number`                      | `360`                         | Toast 卡片宽度；移动端会自动适配可用宽度。                                                  |
| `max`              | `number`                                | `5`                           | 视觉堆叠深度上限；不会裁剪多余 Toast，多余内容仍在滚动区域内。                                        |
| `smoothScroll`     | `boolean \| BingScrollbarSmoothOptions` | `true`                        | 为各位置中可溢出的消息堆叠启用平滑滚动；配置结构与 Scrollbar 相同。                                   |

## BingToastOptions

| 字段               | 类型                  | 默认值           | 说明                                                                                                                                        |
| ---------------- | ------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `id`             | `string \| number`  | `自动生成`        | 转为字符串的唯一 id；已有 id 整条替换且保留 createdAt/order，省略字段使用新消息默认值。                                                                                   |
| `title`          | `string`            | `undefined`   | Toast 标题。只传 title 不传 message 时，title 会作为 message 展示。                                                                                      |
| `message`        | `string`            | `undefined`   | Toast 正文。                                                                                                                                 |
| `type`           | `BingToastType`     | `'default'`   | 消息类型：default、success、error、loading、warning、info。调用 success/error 等方法时会覆盖 type。                                                            |
| `duration`       | `number`            | `按类型决定`       | 毫秒。default 3200、success 2600、error 4200、loading 0、warning 3600、info 3200；带 action 时至少 6000，loading 仍为 0。0 不自动关闭；负数按 0，非有限值回退默认。队列变化会重启计时。 |
| `action`         | `BingToastAction`   | `undefined`   | 提示内的单个操作按钮，例如撤销。同 id 更新并复用同一对象（含其 Vue 响应式代理）时保留处理中状态；新对象表示更换操作。                                                                           |
| `closable`       | `boolean`           | `true`        | 是否显示关闭按钮；false 不阻止自动关闭或服务关闭。                                                                                                              |
| `position`       | `BingToastPosition` | `'top-right'` | 消息出现的位置。top-center 映射到 top，bottom-center 映射到 bottom。                                                                                      |
| `ariaLabel`      | `string`            | `undefined`   | Toast article 的可访问名称。                                                                                                                     |
| `closeAriaLabel` | `string`            | `'关闭消息'`      | 关闭按钮的可访问名称。                                                                                                                               |

### BingToastAction

| 字段             | 类型                                  | 默认值         | 说明                                                                                                                            |
| -------------- | ----------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `label`        | `string`                            | `必填`        | 按钮文字。                                                                                                                         |
| `onClick`      | `(toast: BingToastItem) => unknown` | `必填`        | 点击回调。返回 Promise 时显示处理中并暂停计时，兑现后按 closeOnClick 处理，拒绝时保留提示供重试；同步抛错交给应用的 errorHandler。回调内更换 action 或关闭后重建同 id 提示时，旧操作不会改动新提示的状态。 |
| `closeOnClick` | `boolean`                           | `true`      | 操作完成后是否关闭提示；false 时恢复按钮并重新计时。                                                                                                 |
| `ariaLabel`    | `string`                            | `undefined` | 按钮的可访问名称，未传时使用 label。                                                                                                         |

## 服务 API

| 方法                            | 签名                                       | 说明                                                 |
| ----------------------------- | ---------------------------------------- | -------------------------------------------------- |
| `show(input)`                 | `(input: BingToastInput) => string`      | 保留对象中的 type，未提供时为 default；字符串作为 message。返回归一化的 id。 |
| `success(input)`              | `(input: BingToastInput) => string`      | 创建或替换为 success，覆盖输入中的 type。                        |
| `error(input)`                | `(input: BingToastInput) => string`      | 创建或替换为 error，覆盖输入中的 type。                          |
| `fail(input) / failed(input)` | `(input: BingToastInput) => string`      | error 的两个别名。                                       |
| `loading(input)`              | `(input: BingToastInput) => string`      | 创建或替换为 loading，默认 duration 为 0。                    |
| `warning(input)`              | `(input: BingToastInput) => string`      | 创建或替换为 warning。                                    |
| `info(input)`                 | `(input: BingToastInput) => string`      | 创建或替换为 info。                                       |
| `close(id)`                   | `(id: string \| number) => void`         | 按字符串 id 移除消息，不触发组件 close 事件。                       |
| `clear(position?)`            | `(position?: BingToastPosition) => void` | 清空全部消息，或指定归一化位置的消息；不触发组件 close 事件。                 |
| `getToasts()`                 | `() => BingToastItem[]`                  | 返回当前队列数组的浅拷贝，元素未深拷贝；请勿直接修改。                        |
| `useBingToast()`              | `() => BingToastService`                 | 公开函数，返回与 bingToast 相同的全局服务，不创建独立队列。                |

## Events

| 事件      | 参数              | 说明                                        |
| ------- | --------------- | ----------------------------------------- |
| `close` | `BingToastItem` | 仅用户点击关闭按钮触发；事件发出时消息仍在队列，随后组件将其移除并重启剩余计时器。 |

## 公开类型

| 类型                          | 定义                                                                                                          | 说明                                                |
| --------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `BingToastType`             | `'default' \| 'success' \| 'error' \| 'loading' \| 'warning' \| 'info'`                                     | 消息类型。                                             |
| `BingToastRenderPosition`   | `'top' \| 'bottom' \| 'left' \| 'right' \| 'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'`    | 归一化后的八个位置，也可从 BING\_TOAST\_POSITIONS 读取。          |
| `BingToastPosition`         | `BingToastRenderPosition \| 'top-center' \| 'bottom-center'`                                                | 包含两个别名，BING\_TOAST\_POSITION\_OPTIONS 包含全部十个输入位置。 |
| `BingToastViewportPosition` | `BingToastPosition \| 'all'`                                                                                | 视口筛选范围。                                           |
| `BingToastInput`            | `string \| BingToastOptions`                                                                                | 服务创建或更新方法的入参。                                     |
| `BingToastAction`           | `{ label: string; onClick: (toast: BingToastItem) => unknown; closeOnClick?: boolean; ariaLabel?: string }` | 操作按钮配置。                                           |

`BingToastItem` 是 `getToasts()` 数组元素和 `close` 事件参数。返回数组是浅拷贝，不应直接修改其中对象；通过服务方法更新队列。

| 字段               | 类型                             | 说明                                          |
| ---------------- | ------------------------------ | ------------------------------------------- |
| `id`             | `string`                       | 输入 id 字符串化，或自动生成。                           |
| `type`           | `BingToastType`                | 实际消息类型。                                     |
| `title`          | `string \| undefined`          | 仅在有非空 message 时单独保留标题。                      |
| `message`        | `string`                       | 正文；message 缺失或空字符串时回退 title，再回退空字符串。        |
| `duration`       | `number`                       | 归一化后的持续时间。                                  |
| `closable`       | `boolean`                      | 是否显示关闭按钮。                                   |
| `position`       | `BingToastRenderPosition`      | 归一化后的显示位置。                                  |
| `createdAt`      | `number`                       | 创建时间戳，更新已有 id 时保留。                          |
| `order`          | `number`                       | 创建顺序，更新已有 id 时保留；显示时新消息在前。                  |
| `ariaLabel`      | `string \| undefined`          | 提示的可访问名称。                                   |
| `closeAriaLabel` | `string`                       | 关闭按钮的可访问名称。                                 |
| `action`         | `BingToastAction \| undefined` | 创建时传入的操作按钮配置，读取时可能是 Vue 响应式代理；原对象与代理视为同一操作。 |
| `actionPending`  | `boolean`                      | 操作按钮返回的 Promise 尚未完成。                       |
