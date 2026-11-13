# BingDialog

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export dialog；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。七个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

options 是演示配置。Dialog 使用受控模型，默认确认只发送通知；close 表示关闭请求，业务直接设置模型不会补发事件。示例仅有本地反馈。支持初始焦点、嵌套 inert、busy、异步 beforeClose 与移动端下滑；自定义标题仍需显式名称。

BingDialog 是模态弹窗组件，用于确认流程、编辑表单、发布提示和需要用户明确处理的内容。它会 Teleport 到 body，渲染为 `role="dialog"` 且带 `aria-modal`，默认锁定页面滚动，并提供默认标题、内容区、关闭按钮、底部取消/确定按钮和遮罩氛围效果。

独立使用需导入 `BingDialog` 和 `@moubing/bing-ui/style.css`。下方七个示例包含完整的导入、状态和处理函数；操作仅产生本地反馈，不会发送发布请求。表单组合示例另外使用 Zod 定义校验规则。

打开时优先聚焦内容区 autofocus 或表单控件，没有合适控件则聚焦面板；initialFocus 支持选择器、元素或 false。Tab/Shift+Tab 在当前弹窗及子浮层间循环，关闭后恢复触发器。嵌套弹窗会将下层设为 inert 并减少重复模糊；Escape 只作用于顶层，最后一个弹窗退出后恢复滚动锁。

## 基础配置

使用 `v-model` 控制打开状态。默认确认按钮只触发 `confirm`，不会自动关闭；需要点击确定后关闭时，打开 `closeOnConfirm`。 内容区默认启用 `smoothScroll`；嵌套可滚动元素会优先消费滚轮，到达内容边界后弹窗会阻止事件继续滚动背景页面，设为 `false` 可关闭平滑处理。

`modelValue` 是受控值，若只传值却不接收 `update:modelValue`，点击关闭仍会发出事件，但弹窗继续打开。`smoothScroll=false` 不会取消边界滚轮拦截；对象配置使用公开的 `BingScrollbarSmoothOptions`，详见 [BingScrollbar](/docs/components/scrollbar)。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingDialog, type BingDialogProps, type BingDialogCloseReason } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const options: BingDialogProps = {
  "title": "发布组件文档",
  "width": "560px",
  "showFooter": true,
  "showClose": true,
  "showPeek": true,
  "lockScroll": true,
  "closeOnOverlay": true,
  "closeOnEsc": true,
  "closeOnConfirm": false,
  "confirmLoading": false,
  "confirmDisabled": false
}
const open = ref(false)
const loading = ref(options.confirmLoading ?? false)
const lastCloseReason = ref<BingDialogCloseReason | '未关闭'>('未关闭')
const confirmCount = ref(0)
const cancelCount = ref(0)
function handleConfirm() { confirmCount.value += 1 }
function handleCancel() { cancelCount.value += 1 }
function handleClose(reason: BingDialogCloseReason) { lastCloseReason.value = reason }
</script>

<template>
  <BingButton :throttle="false" @click="open = true">打开弹窗</BingButton>
  <BingDialog v-model="open" v-bind="options" :confirm-loading="loading" cancel-text="稍后" confirm-text="确认发布"
    @confirm="handleConfirm" @cancel="handleCancel" @close="handleClose">
    <p>这里展示本地文档发布摘要，不会发送发布请求。</p>
    <ul><li>文档页：BingDialog</li><li>状态：等待确认</li><li>默认确认不会自动关闭</li></ul>
    <BingButton v-if="loading" variant="secondary" @click="loading = false">结束模拟加载</BingButton>
  </BingDialog>
  <p role="status">最后关闭：{{ lastCloseReason }}；confirm：{{ confirmCount }}；cancel：{{ cancelCount }}；状态：{{ open ? '已打开' : '已关闭' }}</p>
</template>
```

## 自定义标题与底部

通过 `title` 插槽替换标题区，通过 `footer` 插槽替换默认操作区。footer 插槽会暴露 `close`、`cancel` 和 `confirm` 方法。

confirm() 发出 confirm，是否关闭仍由 closeOnConfirm 决定；close('confirm') 只请求关闭，不额外发出 confirm。cancel() 发出 cancel 后请求关闭。这些回调遵守 busy 和关闭守卫；自定义 footer 应通过插槽 busy 绑定按钮禁用和加载。直接赋值模型绕过关闭守卫，适用于业务明确完成后的收起。

使用自定义 title 插槽时，示例省略 title 属性并设置 `ariaLabel`。当前同时设置 title 属性与自定义插槽会留下指向已被替换标题节点的 `aria-labelledby`，不能依靠它提供名称。`ariaDescribedby` 则应指向业务真实渲染的描述元素。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingDialog, type BingDialogCloseReason } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const open = ref(false)
const feedback = ref('等待操作')
const confirmCount = ref(0)
function saveDraft() { feedback.value = '已保存草稿，弹窗保持打开' }
function closed(reason: BingDialogCloseReason) { feedback.value = `关闭来源：${reason}` }
</script>

<template>
  <BingButton variant="secondary" :throttle="false" @click="open = true">打开自定义 footer</BingButton>
  <!-- 自定义 title 插槽时省略 title prop，用 ariaLabel 提供名称。 -->
  <BingDialog v-model="open" width="620px" ariaLabel="生成组件发布记录"
    :show-footer="false" @close="closed" @confirm="confirmCount += 1">
    <template #title>
      <div class="heading"><span>流程确认</span><strong>生成组件发布记录</strong></div>
    </template>
    <p>标题和底部都可以通过插槽替换；这里的操作仅更新本地状态。</p>
    <template #footer="{ cancel, confirm, close }">
      <div class="actions">
      <BingButton variant="ghost" @click="cancel">稍后再说</BingButton>
      <BingButton variant="secondary" @click="saveDraft">保存草稿</BingButton>
      <BingButton variant="tertiary" @click="confirm">确认但保留</BingButton>
      <BingButton @click="close('confirm')">发布</BingButton>
      </div>
    </template>
  </BingDialog>
  <p role="status">{{ feedback }}；confirm：{{ confirmCount }}</p>
</template>

<style scoped>
.heading { display: grid; gap: 4px; }
.heading span { font-size: 12px; opacity: .65; }
.actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; }
</style>
```

## 遮罩氛围

`overlayBlur` 控制遮罩背景模糊，`glassBlur` 和 `glassSaturation` 会作用到遮罩模糊层；`overlayOrbs` 控制光圈颜色、位置和尺寸。`overlayOrbsAnimated` 开启后，组件会使用 GSAP 让光圈轻微漂移。

关闭 `overlayBlur` 会移除光圈，动画遵循减少动态效果偏好。glass 已弃用且无视觉效果，下个大版本移除；glassOpacity 保留兼容。光圈表中的默认值是自定义光圈省略字段时的回退值，默认 overlayOrbs 为空数组，不会显示光圈；下例显式配置三枚彩色光圈用于演示。

`showPeek` 显示“按住查看背景”按钮，支持指针按住或键盘 Enter/空格。按住期间面板缩小并降至 `peekOpacity`，遮罩透明，松开或失焦后恢复；模型仍为 true，滚动锁仍保留，并未关闭弹窗。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingDialog, type BingDialogOverlayOrb } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const open = ref(false)
const customOrbs: BingDialogOverlayOrb[] = [
  { id: 'rose', color: '#fb7185', x: 24, y: 28, size: 320, opacity: .26, blur: 58, motionX: 64, motionY: 40, duration: 12 },
  { id: 'cyan', color: '#38bdf8', x: 78, y: 26, size: 300, opacity: .22, blur: 54, motionX: -72, motionY: 48, duration: 14 },
  { id: 'violet', color: '#a78bfa', x: 58, y: 78, size: 260, opacity: .2, blur: 60, motionX: 42, motionY: -56, duration: 16 },
]
</script>

<template>
  <BingButton variant="tertiary" :throttle="false" @click="open = true">打开氛围弹窗</BingButton>
  <BingDialog v-model="open" title="带氛围遮罩的弹窗" width="620px"
    :overlay-orbs="customOrbs" overlay-orbs-animated overlay-blur>
    <p>光圈提供背景氛围，按住标题栏的查看背景按钮可暂时隐藏面板与遮罩。</p>
  </BingDialog>
</template>
```

## 关闭行为

`close` 事件会返回关闭请求的来源。关闭按钮是 `close`，取消按钮是 `cancel`，点击遮罩是 `overlay`，Escape 是 `escape`，确认自动关闭时是 `confirm`，移动端下滑是 `swipe`。

取消时顺序是 `cancel → update:modelValue(false) → close('cancel')`；自动确认关闭时是 `confirm → update:modelValue(false) → close('confirm')`。这些事件在关闭动画结束前发出，不能把 close 当作“已销毁”回调。直接将业务模型设为 false 不会补发这些事件。

beforeClose(reason) 可返回布尔值或 Promise。false、异常或超过 30 秒会保留弹窗并发出 close-prevented；等待期间不会重复调用。confirmLoading 默认同时启用 busy，拦截取消、关闭按钮、遮罩、Escape 和移动端下滑关闭；显式 busy=false 可保留加载时关闭。默认确认行为仍由 closeOnConfirm 决定。

在 KeepAlive 缓存页面停用时主动将打开状态设为 false，避免 Teleport 弹窗留在页面外；文档预览保留此处理。普通独立组件卸载时，Dialog 会清理动画、监听器并恢复自己的滚动锁。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingDialog, type BingDialogCloseReason } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const open = ref(false)
const events = ref<string[]>([])
function update(value: boolean) { events.value.push(`update:${value}`); open.value = value }
function closed(reason: BingDialogCloseReason) { events.value.push(`close:${reason}`) }
</script>

<template>
  <BingButton :throttle="false" @click="open = true; events = []">打开关闭行为示例</BingButton>
  <BingDialog :model-value="open" title="关闭行为"
    :close-on-overlay="false" :close-on-esc="false" close-on-confirm
    @update:model-value="update" @close="closed"
    @confirm="events.push('confirm')" @cancel="events.push('cancel')">
    <p>遮罩点击和 Escape 不会关闭；确认会依次发出 confirm、update:false 和 close:confirm。</p>
    <BingButton variant="secondary" @click="open = false">直接设置模型关闭</BingButton>
  </BingDialog>
  <p role="status">状态：{{ open ? '已打开' : '已关闭' }}；事件：{{ events.join(' → ') || '无' }}</p>
</template>
```

## 表单与多层浮层

在默认插槽内组合 Form、Input、Select 和子 Dialog。先提交空名称可观察默认错误聚焦；选择器打开后，Escape 只关闭选择面板并返回触发器。二次确认弹窗退出后返回“二次确认”按钮，父弹窗和滚动锁继续保留。

子浮层保持在父 Dialog 的 Vue 组件树中，即使实际 DOM 经 Teleport 渲染，也能参与同一套焦点管理。请为每层提供明确名称，避免让焦点恢复目标在弹窗打开期间被业务删除。

```vue
<script setup lang="ts">
import { onDeactivated, reactive, ref } from 'vue'
import { z } from 'zod'
import { BingButton, BingDialog, BingForm, BingFormItem, BingInput, BingSelect, type BingFormSubmitPayload } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const open = ref(false)
const confirmOpen = ref(false)
const model = reactive({ name: '', visibility: 'private' })
const feedback = ref('请完成项目名称')
const schema = z.object({ name: z.string().min(2, '项目名称至少 2 个字符'), visibility: z.enum(['private', 'team']) })
const options = [{ label: '仅自己', value: 'private' }, { label: '团队可见', value: 'team' }]
function submit(payload: BingFormSubmitPayload) { feedback.value = payload.valid ? '表单校验通过' : '请修正项目名称' }
onDeactivated(() => { confirmOpen.value = false; open.value = false })
</script>

<template>
  <BingButton @click="open = true">编辑项目设置</BingButton>
  <BingDialog v-model="open" title="项目设置" :show-footer="false">
    <BingForm :model="model" :schema="schema" layout="stack" @submit="submit">
      <BingFormItem prop="name" label="项目名称" required>
        <BingInput :model-value="model.name" @update:model-value="model.name = String($event)" />
      </BingFormItem>
      <BingFormItem prop="visibility" label="可见范围">
        <BingSelect :model-value="model.visibility" @update:model-value="model.visibility = String($event)" :options="options" :clearable="false" ariaLabel="可见范围" />
      </BingFormItem>
      <BingButton html-type="submit">检查表单</BingButton>
    </BingForm>
    <p class="feedback" role="status">{{ feedback }}</p>
    <BingButton variant="secondary" @click="confirmOpen = true">二次确认</BingButton>
    <BingDialog v-model="confirmOpen" title="确认项目范围" close-on-confirm @confirm="feedback = '已确认范围：' + model.visibility">
      <p>这是第二层弹窗，关闭后返回项目设置。</p>
    </BingDialog>
  </BingDialog>
</template>

<style scoped>
.feedback { margin-block: 12px; color: var(--bing-text-secondary); }
</style>
```

## 固定尺寸与头部分类

通过 `height` 指定整体高度，`maxHeight` 设上限；数字单位为 px，字符串需带有效 CSS 单位。头部和 footer 保持可见，只有中部内容滚动。`header-addon` 位于标题行下方，适合放置分类 Tabs，不能把固定分类放进默认内容插槽。

需要 900×600 设置框时传 width=900、maxWidth=900、height=600；账号表单使用 width=480、height=480。显式尺寸受可用视口限制，桌面每侧留白 24px，宽度不超过 560px 时铺满宽度并贴底显示；视口缩小不会撑开页面。移动端为底部弹窗，支持从标题区域下滑关闭，并跟随 visualViewport 避让键盘；短距离拖动会回弹，busy 或守卫拒绝时保留弹窗。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingDialog, BingInput, BingTabs } from '@moubing/bing-ui'
import type { BingTabValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const open = ref(false)
const compact = ref(false)
const tab = ref<BingTabValue>('members')
const tabs = [{ value: 'members', label: '项目成员' }, { value: 'preferences', label: '显示偏好' }]
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; gap: 12px;">
    <BingButton @click="compact = false; open = true">打开项目设置</BingButton>
    <BingButton variant="secondary" @click="compact = true; open = true">打开账号表单</BingButton>
    <BingDialog v-model="open" :title="compact ? '修改密码' : '项目设置'" :width="compact ? 480 : 900"
      :max-width="900" :height="compact ? 480 : 600" :show-peek="false">
      <template v-if="!compact" #header-addon>
        <BingTabs v-model="tab" :items="tabs" ariaLabel="设置分类" />
      </template>
      <div v-if="compact" style="display: grid; gap: 20px;">
        <BingInput type="password" placeholder="当前密码" block />
        <BingInput type="password" placeholder="新密码" block />
      </div>
      <div v-else style="display: grid; gap: 16px;">
        <p v-for="index in 24" :key="index">{{ tab === 'members' ? '成员' : '偏好' }}设置 {{ index }}：头部分类和底部操作保持可见。</p>
      </div>
    </BingDialog>
  </div>
</template>
```

## 方向入场与关闭拦截

transitionOrigin 默认 auto，从当前焦点元素浮起；可设 center、元素或客户端坐标。关闭被拒绝时默认播放反馈，已有自定义反馈的业务可设置 rejectFeedback=false。示例使用即时 Promise 模拟关闭检查，不发送请求。面板圆角由 --bing-dialog-radius 控制，内容滚动时显示头尾分隔提示。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingCheckbox, BingDialog, BingInput, type BingDialogCloseReason } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const open = ref(false)
const centered = ref(false)
const allowClose = ref(false)
const busy = ref(false)
const name = ref<string | number | null>('草稿')
const rejected = ref<BingDialogCloseReason | ''>('')
async function beforeClose() { return allowClose.value }
</script>

<template>
  <div class="guard">
    <BingCheckbox v-model="centered" label="居中入场" />
    <BingButton @click="open = true">打开关闭拦截示例</BingButton>
    <p role="status">上次拦截：{{ rejected || '无' }}</p>
    <BingDialog v-model="open" title="关闭前检查" :transition-origin="centered ? 'center' : 'auto'" :busy="busy" :before-close="beforeClose" :show-peek="false" @close-prevented="rejected = $event">
      <div class="guard">
        <label for="guard-name">草稿名称</label>
        <BingInput id="guard-name" v-model="name" />
        <BingCheckbox v-model="allowClose" label="允许关闭" />
        <BingCheckbox v-model="busy" label="模拟忙碌" />
      </div>
      <template #footer="{ cancel, busy: pending }">
        <BingButton variant="secondary" :disabled="pending" @click="cancel">取消</BingButton>
        <BingButton :disabled="pending" @click="open = false">保存并收起</BingButton>
      </template>
    </BingDialog>
  </div>
</template>

<style scoped>
.guard { display: grid; gap: 16px; }
.guard p { margin: 0; }
</style>
```

## Props

| Prop                  | Type                                                             | Default                        | 说明                                                                                          |
| --------------------- | ---------------------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------- |
| `transitionOrigin`    | `BingDialogTransitionOrigin`                                     | `'auto'`                       | auto 从当前焦点元素浮起；center 居中，或传元素 / 客户端坐标 \{ x, y \}。                                           |
| `initialFocus`        | `BingDialogInitialFocus`                                         | `'auto'`                       | 优先内容区 autofocus、表单控件，再聚焦面板；支持选择器、元素，false 沿用浮层默认焦点。                                         |
| `busy`                | `boolean`                                                        | `undefined（跟随 confirmLoading）` | 拦截用户关闭和重复确认；显式 false 允许加载期间关闭。程序修改模型不受限制。                                                   |
| `rejectFeedback`      | `boolean`                                                        | `true`                         | 关闭受阻时播放缩放及描边反馈；自带拒绝反馈的业务可关闭。                                                                |
| `beforeClose`         | `(reason: BingDialogCloseReason) => boolean \| Promise<boolean>` | `undefined`                    | 用户关闭前检查；false、异常或超过 30 秒均保留弹窗。等待中不重复调用；程序改模型绕过此钩子。                                          |
| `modelValue`          | `boolean`                                                        | `false`                        | 受控打开状态；接收 update:modelValue 或使用 v-model 才会响应关闭请求。                                           |
| `title`               | `string`                                                         | `undefined`                    | 默认标题及 aria-labelledby；自定义标题示例省略此属性，改用 ariaLabel。                                            |
| `width`               | `string \| number`                                               | `'520px'`                      | 弹窗宽度；数字会转为 px。移动端会自动撑满可用宽度。                                                                 |
| `maxWidth`            | `string \| number`                                               | `undefined（CSS 默认 720px）`      | 覆盖最大宽度，仍受容器和视口约束。900px 宽弹窗需同时设置 width=900、maxWidth=900。                                     |
| `height`              | `string \| number`                                               | `undefined`                    | 固定整体高度，数字为 px；头部和 footer 固定，中部内容滚动。显式高度受可用视口限制。                                             |
| `maxHeight`           | `string \| number`                                               | `undefined`                    | 最大高度，数字为 px，不能超过可视视口减去留白。height/maxHeight 均省略时默认桌面 min(82vh, 760px)、移动端 min(88dvh, 可视视口高度)。 |
| `zIndex`              | `number`                                                         | `undefined（基准 + 0，默认 2000）`    | 根节点 z-index；未传时使用 ConfigProvider 的 zIndex 基准。                                               |
| `lockScroll`          | `boolean`                                                        | `true`                         | 打开时锁定 body/html 滚动并补偿滚动条宽度；关闭动画结束后恢复。多个实例共同维护滚动锁，最后一个退出后恢复。                                 |
| `smoothScroll`        | `boolean \| BingScrollbarSmoothOptions`                          | `true`                         | 内容区平滑滚动；false 关闭插值，对象参数见 BingScrollbar。边界滚轮仍会阻止背景滚动。                                        |
| `closeOnOverlay`      | `boolean`                                                        | `true`                         | 点击遮罩层是否关闭。                                                                                  |
| `closeOnEsc`          | `boolean`                                                        | `true`                         | 按 Escape 是否关闭。                                                                              |
| `closeOnConfirm`      | `boolean`                                                        | `false`                        | 默认确定按钮或 footer confirm() 是否在发出 confirm 后请求关闭。                                               |
| `showClose`           | `boolean`                                                        | `true`                         | 是否显示右上角关闭按钮。                                                                                |
| `showFooter`          | `boolean`                                                        | `true`                         | 是否显示默认底部操作区。传入 footer 插槽时仍会渲染自定义底部。                                                         |
| `cancelText`          | `string`                                                         | `'关闭'`                         | 默认取消按钮文案。                                                                                   |
| `confirmText`         | `string`                                                         | `'确定'`                         | 默认确定按钮文案。                                                                                   |
| `confirmLoading`      | `boolean`                                                        | `false`                        | 默认确定按钮加载态，且 busy 未指定时同时保护所有用户关闭入口。                                                          |
| `confirmDisabled`     | `boolean`                                                        | `false`                        | 仅禁用默认确定按钮；自定义 footer 按钮需自行禁用。                                                               |
| `glass`               | `boolean`                                                        | `true`                         | 已弃用，无视觉效果，下个大版本移除；背景模糊使用 overlayBlur。                                                       |
| `glassBlur`           | `string \| number`                                               | `undefined（主题默认 16）`           | overlayBlur 开启时遮罩模糊强度。数字会转为 px。                                                             |
| `glassOpacity`        | `number`                                                         | `undefined`                    | 兼容字段；当前主体面板渲染不读取此值。                                                                         |
| `glassSaturation`     | `number`                                                         | `undefined（主题默认 1.05）`         | overlayBlur 开启时遮罩饱和度。                                                                       |
| `overlayBlur`         | `boolean`                                                        | `true`                         | 是否启用遮罩背景模糊。关闭后不会渲染 overlayOrbs。                                                             |
| `overlayOrbs`         | `BingDialogOverlayOrb[]`                                         | `[]`                           | 遮罩光圈配置；默认无光圈，传入数组后显示。                                                                       |
| `overlayOrbsAnimated` | `boolean`                                                        | `false`                        | 是否使用 GSAP 让遮罩光圈小幅漂移。                                                                        |
| `showPeek`            | `boolean`                                                        | `true`                         | 是否显示“按住查看背景”的按钮。                                                                            |
| `peekOpacity`         | `number`                                                         | `0`                            | 按住查看背景时面板保留的不透明度，限制在 0 到 1；遮罩暂时透明，不改变模型与滚动锁。                                                |
| `ariaLabel`           | `string`                                                         | `undefined`                    | 无 title 或自定义标题时提供 dialog 名称；二者均省略时回退为“对话框”。                                                 |
| `ariaDescribedby`     | `string`                                                         | `undefined`                    | 描述元素的 id，业务必须渲染对应元素；可用空格分隔多个 id。                                                            |

## BingDialogOverlayOrb

| 字段         | Type               | 说明                     |
| ---------- | ------------------ | ---------------------- |
| `id`       | `string`           | 可选唯一标识，用作 v-for key。   |
| `color`    | `string`           | 必填，光圈颜色；其余字段可选。        |
| `x`        | `number`           | 横向位置百分比；默认 50。         |
| `y`        | `number`           | 纵向位置百分比；默认 50。         |
| `size`     | `number \| string` | 光圈大小；数字会转成 px。默认 360。  |
| `opacity`  | `number`           | 默认 0.18；限制在 0 到 1。     |
| `blur`     | `number`           | 模糊半径 px，默认 64，最小 0。    |
| `motionX`  | `number`           | 动画横向漂移 px，默认 48，可为负数。  |
| `motionY`  | `number`           | 动画纵向漂移 px，默认 34，可为负数。  |
| `duration` | `number`           | 动画时长秒，默认 12，最小 4。      |
| `delay`    | `number`           | 动画延迟秒，默认索引乘 0.28，最小 0。 |

## Slots

| Slot           | 参数                                                                                                           | 说明                                                             |
| -------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| `default`      | `-`                                                                                                          | 弹窗主体内容。                                                        |
| `title`        | `-`                                                                                                          | 替换整个默认标题节点；需另外提供有效可访问名称。                                       |
| `header-addon` | `-`                                                                                                          | 标题行下方的固定区域，适合分类栏、搜索和摘要，不随正文内容滚动。                               |
| `footer`       | `{ close: (reason: BingDialogCloseReason) => void; cancel: () => void; confirm: () => void; busy: boolean }` | showFooter=false 时仍渲染。回调遵守 busy 与关闭守卫；自定义按钮仍需用插槽 busy 绑定禁用及加载。 |

## Events

| Event               | Payload                 | 说明                                                 |
| ------------------- | ----------------------- | -------------------------------------------------- |
| `close-prevented`   | `BingDialogCloseReason` | 用户关闭因 busy、关闭选项或 beforeClose 被拦截；不代表发生模型更新。        |
| `update:modelValue` | `boolean`               | 组件请求关闭时传 false，先于 close。业务直接改变模型不会触发此事件。           |
| `close`             | `BingDialogCloseReason` | 关闭请求的原因；即使父级没有接收更新也触发，不表示 DOM 已移除或动画已结束。直接设置模型不触发。 |
| `cancel`            | `-`                     | 点击默认取消按钮或调用 footer slot 的 cancel 时触发。              |
| `confirm`           | `-`                     | 点击默认确定按钮或调用 footer slot 的 confirm 时触发。             |

## 公开类型

| 类型                           | 说明                                                                    |
| ---------------------------- | --------------------------------------------------------------------- |
| `BingDialogTransitionOrigin` | 'auto' \| 'center' \| HTMLElement \| \{ x: number; y: number \}。      |
| `BingDialogInitialFocus`     | 'auto' \| string \| HTMLElement \| false。                             |
| `BingDialogProps`            | 组件属性类型；从 @moubing/bing-ui 根入口导入。                                      |
| `BingDialogEmits`            | update:modelValue、close、close-prevented、cancel、confirm 的载荷元组声明。       |
| `BingDialogCloseReason`      | 'close' \| 'cancel' \| 'overlay' \| 'escape' \| 'confirm' \| 'swipe'。 |
| `BingDialogOverlayOrb`       | 遮罩光圈类型，color 必填，其余字段可选。                                               |

没有公开的 Dialog 实例方法；打开、关闭使用模型，footer 回调仅在插槽作用域内有效。
