# BingConfigProvider

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export config-provider；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。三个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

Provider 自 0.12.0 起提供，只给未显式传入对应 props 的组件提供默认值；嵌套 Provider 只覆盖自身设置的字段。层级示例的第三方挂件只在弹窗打开时显示。reducedMotion 只影响 JS 动效，CSS 媒体查询仍跟随系统。useBingConfig / useReducedMotion 需在 Provider 的后代组件中调用。

BingConfigProvider 为一棵子树统一设置默认尺寸、浮层层级基准和 JS 动效策略。它只提供上下文，不渲染额外的 DOM 元素，可以包住整个应用，也可以只包住某个区域。自 0.12.0 起提供。

优先级始终是“组件显式 props 优先”：Provider 只给没有自己指定值的组件提供默认值。嵌套 Provider 只覆盖自己设置的字段，未设置的字段继续继承外层；最外层没有 Provider 时，组件保持各自原来的默认值。

## 全局尺寸

`size` 作用于未显式传入尺寸的组件。下例外层 Provider 可在 sm / md / lg 之间切换：输入框、选择器、继承尺寸的按钮和标签随之变化，显式 `size="sm"` 的按钮保持不变；嵌套的 Provider 只把 `size` 覆盖为 sm，其余配置仍继承外层。

在表单中，BingForm / BingFormItem 的尺寸上下文比 Provider 更近，因此优先于 Provider；Form 自身未设置 `size` 时再读取 Provider。Provider 的 `size` 只接受 sm / md / lg，Button 的 xs / xl 需要在按钮上显式设置。各组件的完整解析顺序见下方的“尺寸解析顺序”。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingConfigProvider, BingInput, BingRadioGroup, BingSelect, BingTag } from '@moubing/bing-ui'
import type { BingConfigSize, BingRadioGroupOption, BingRadioValue, BingSelectModelValue, BingSelectOption } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const size = ref<BingConfigSize>('lg')
const sizeOptions: BingRadioGroupOption[] = [
  { label: 'sm', value: 'sm' },
  { label: 'md', value: 'md' },
  { label: 'lg', value: 'lg' },
]
const keyword = ref<string | number | null>('')
const owner = ref<BingSelectModelValue>('design')
const ownerOptions: BingSelectOption[] = [
  { label: '设计', value: 'design' },
  { label: '前端', value: 'frontend' },
  { label: '文档', value: 'docs' },
]

function updateSize(value: BingRadioValue) {
  size.value = value as BingConfigSize
}
</script>

<template>
  <div class="config-demo">
    <BingRadioGroup :model-value="size" :options="sizeOptions" direction="row" ariaLabel="全局尺寸" @update:model-value="updateSize" />

    <BingConfigProvider :size="size">
      <section class="config-demo__group" aria-label="外层 Provider">
        <p class="config-demo__label">外层 Provider：size="{{ size }}"</p>
        <div class="config-demo__row">
          <BingInput v-model="keyword" placeholder="继承全局尺寸" ariaLabel="搜索文档" />
          <BingSelect v-model="owner" :options="ownerOptions" ariaLabel="负责方向" />
        </div>
        <div class="config-demo__row">
          <BingButton :throttle="false">继承尺寸</BingButton>
          <BingButton size="sm" variant="secondary" :throttle="false">显式 sm</BingButton>
          <BingTag label="继承尺寸" tone="neutral" />
        </div>
      </section>

      <BingConfigProvider size="sm">
        <section class="config-demo__group" aria-label="嵌套 Provider">
          <p class="config-demo__label">嵌套 Provider：只覆盖 size="sm"</p>
          <div class="config-demo__row">
            <BingInput placeholder="内层固定 sm" ariaLabel="内层输入框" />
            <BingButton variant="secondary" :throttle="false">内层按钮</BingButton>
          </div>
        </section>
      </BingConfigProvider>
    </BingConfigProvider>
  </div>
</template>

<style scoped>
.config-demo { display: grid; gap: 16px; min-width: 0; }
.config-demo__group { display: grid; min-width: 0; gap: 12px; padding: 14px; border: 1px solid var(--bing-border); border-radius: 12px; }
.config-demo__label { margin: 0; color: var(--bing-muted); font-size: 13px; }
.config-demo__row { display: flex; min-width: 0; flex-wrap: wrap; align-items: center; gap: 10px; }
.config-demo__row > .bing-input, .config-demo__row > .bing-select { flex: 1 1 200px; min-width: 0; }
</style>
```

## 浮层层级

`zIndex` 是浮层的层级基准，默认 2000。Dialog、Toast、预览、选择器面板和提示在基准上加固定偏移，所以抬高基准时它们之间的相对顺序不变。没有 Provider 时得到的层级与 0.12.0 之前完全一致。

当页面里已有层级较高的固定元素（例如第三方客服挂件或宿主应用的顶栏）时，用 Provider 整体抬高 Bing UI 的浮层，比逐个组件设置 `zIndex` 更不容易遗漏。下例中挂件固定为 2500：基准为 2000 时，弹窗遮罩位于挂件下方；切换到 3000 后遮罩会盖住挂件。示例只在弹窗打开时显示挂件，以免遮挡文档页面。

组件显式传入的 `zIndex` 仍然优先。同时打开多个浮层时，后打开的浮层不会低于先打开的浮层，例如弹窗内展开的选择器面板始终位于弹窗上方。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingConfigProvider, BingDialog, BingRadioGroup, BingTooltip } from '@moubing/bing-ui'
import type { BingRadioGroupOption, BingRadioValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

// 业务里已有一个 z-index 为 2500 的第三方挂件。
const widgetZIndex = 2500
const zIndex = ref(2000)
const layerOptions: BingRadioGroupOption[] = [
  { label: '默认 2000', value: 2000, description: 'Dialog 为 2000，被挂件盖住' },
  { label: '提高到 3000', value: 3000, description: 'Dialog 为 3000，盖住挂件' },
]
const open = ref(false)

function updateZIndex(value: BingRadioValue) {
  zIndex.value = Number(value)
}
</script>

<template>
  <div class="layer-demo">
    <BingRadioGroup :model-value="zIndex" :options="layerOptions" direction="row" ariaLabel="浮层层级基准" @update:model-value="updateZIndex" />

    <BingConfigProvider :z-index="zIndex">
      <div class="layer-demo__actions">
        <BingButton :throttle="false" @click="open = true">打开弹窗</BingButton>
        <BingTooltip :content="`提示层级：${zIndex + 1200}`">
          <BingButton variant="secondary" :throttle="false">悬停查看提示层级</BingButton>
        </BingTooltip>
      </div>

      <BingDialog v-model="open" title="确认发布" width="420px" :show-footer="false">
        <p>弹窗层级 = 基准 {{ zIndex }} + 0。第三方挂件固定为 {{ widgetZIndex }}，基准为 3000 时被遮罩盖住。</p>
      </BingDialog>
    </BingConfigProvider>

    <p role="status">当前基准：{{ zIndex }}；弹窗 {{ zIndex }}，提示 {{ zIndex + 1200 }}；挂件 {{ widgetZIndex }}</p>

    <!-- 为了不遮挡文档页面，示例只在弹窗打开时显示挂件。 -->
    <aside v-if="open" class="layer-demo__widget" :style="{ zIndex: widgetZIndex }" aria-label="第三方客服挂件">
      第三方客服挂件 · z-index {{ widgetZIndex }}
    </aside>
  </div>
</template>

<style scoped>
.layer-demo { display: grid; gap: 16px; min-width: 0; }
.layer-demo__actions { display: flex; flex-wrap: wrap; gap: 10px; }
.layer-demo__widget {
  position: fixed;
  right: 24px;
  bottom: 24px;
  padding: 12px 16px;
  border-radius: 12px;
  background: #ea580c;
  color: #fff;
  font-size: 14px;
  box-shadow: 0 12px 32px rgb(0 0 0 / 0.24);
}
</style>
```

## 动效策略

`reducedMotion` 控制 GSAP 等 JS 驱动的动效：`user`（默认）跟随系统的减少动态效果设置；`always` 始终减少，适合在应用内提供“关闭动画”开关；`never` 忽略系统设置，始终完整播放。下例切换策略后，拆字跳动、Tabs 指示器和按钮点击碎屑会一起响应，常驻动画会立即重建。

该策略只影响 JS 动效。组件样式里通过 CSS 媒体查询 `prefers-reduced-motion` 实现的降级（例如部分过渡和流光渐变的隐藏）仍跟随系统设置。Scrollbar、Tabs 和转场组件的 `respectReducedMotion` 等组件级开关继续生效：关闭后该组件不再减少动效，开启时才读取 Provider 策略。

从 0.12.4 起，Tooltip 即使共用一个浮层，也会在打开、切换和关闭时使用对应触发器的局部策略。下例两个提示分别固定为 `never` 和 `always`，可连续悬停比较完整动画与立即显示；它们覆盖外层策略，其他演示仍跟随上方选项。

```vue
<script setup lang="ts">
import { ref, useId } from 'vue'
import { BingAnimatedText, BingButton, BingConfigProvider, BingRadioGroup, BingTabs, BingTooltip } from '@moubing/bing-ui'
import type { BingRadioGroupOption, BingRadioValue, BingReducedMotion, BingTabItem, BingTabValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const mode = ref<BingReducedMotion>('user')
const modeOptions: BingRadioGroupOption[] = [
  { label: 'user', value: 'user', description: '跟随系统设置' },
  { label: 'always', value: 'always', description: '始终减少动效' },
  { label: 'never', value: 'never', description: '始终完整播放' },
]
const tabs: BingTabItem[] = [
  { value: 'overview', label: '概览' },
  { value: 'motion', label: '动效' },
  { value: 'history', label: '记录' },
]
const tab = ref<BingTabValue>('overview')
const clicks = ref(0)
const animatedTooltipId = useId()
const reducedTooltipId = useId()

function updateMode(value: BingRadioValue) {
  mode.value = value as BingReducedMotion
}
</script>

<template>
  <div class="motion-demo">
    <BingRadioGroup :model-value="mode" :options="modeOptions" direction="row" ariaLabel="动效策略" @update:model-value="updateMode" />

    <BingConfigProvider :reduced-motion="mode">
      <div class="motion-demo__stage">
        <BingAnimatedText effect="jump" trigger="always" class="motion-demo__title">跟随全局动效策略</BingAnimatedText>
        <BingTabs v-model="tab" :items="tabs" ariaLabel="动效演示标签" />
        <BingButton :throttle="false" style="justify-self: start" @click="clicks += 1">点击反馈</BingButton>
        <div class="motion-demo__tooltips">
          <BingConfigProvider reduced-motion="never">
            <BingTooltip :id="animatedTooltipId" content="这个提示始终完整播放动画。" :open-delay="0" :close-delay="140">
              <template #default="{ open }">
                <button type="button" class="motion-demo__trigger" :aria-describedby="open ? animatedTooltipId : undefined">局部完整动效</button>
              </template>
            </BingTooltip>
          </BingConfigProvider>
          <BingConfigProvider reduced-motion="always">
            <BingTooltip :id="reducedTooltipId" content="这个提示不播放过渡动画。" :open-delay="0" :close-delay="140">
              <template #default="{ open }">
                <button type="button" class="motion-demo__trigger" :aria-describedby="open ? reducedTooltipId : undefined">局部减少动效</button>
              </template>
            </BingTooltip>
          </BingConfigProvider>
        </div>
      </div>
    </BingConfigProvider>

    <p role="status">当前策略：{{ mode }}；按钮点击 {{ clicks }} 次</p>
  </div>
</template>

<style scoped>
.motion-demo { display: grid; gap: 16px; min-width: 0; }
.motion-demo__stage { display: grid; min-width: 0; gap: 14px; padding: 16px; border: 1px solid var(--bing-border); border-radius: 12px; }
.motion-demo__tooltips { display: flex; flex-wrap: wrap; gap: 10px; }
.motion-demo__trigger { padding: 8px 12px; border: 1px solid var(--bing-control-border); border-radius: 6px; background: var(--bing-control-bg); color: var(--bing-text); font: inherit; cursor: pointer; }
.motion-demo__trigger:focus-visible { outline: 2px solid var(--bing-focus); outline-offset: 2px; }
.motion-demo__title { font-size: 22px; font-weight: 600; }
</style>
```

自定义组件需要与 Bing UI 使用同一策略时，在 Provider 的后代组件中调用 `useReducedMotion()`。它返回一个实时判断函数；传入 `onChange` 可以在系统设置或 Provider 策略变化时重建常驻动画。

```ts
// FloatingBadge.vue 的 <script setup lang="ts">，模板中为 <span ref="badge">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'
import { gsap } from 'gsap'
import { useReducedMotion } from '@moubing/bing-ui'

const badge = useTemplateRef<HTMLElement>('badge')
const shouldReduceMotion = useReducedMotion({ onChange: () => setupLoop() })
let loop: gsap.core.Tween | undefined

function setupLoop() {
  loop?.kill()
  loop = undefined
  if (badge.value) gsap.set(badge.value, { clearProps: 'transform' })
  if (!badge.value || shouldReduceMotion()) return
  loop = gsap.to(badge.value, { y: -4, repeat: -1, yoyo: true, duration: 0.6 })
}

onMounted(setupLoop)
onBeforeUnmount(() => loop?.kill())
```

## 属性

| 属性              | 类型                              | 默认值                  | 说明                                                                                                               |
| --------------- | ------------------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `size`          | `'sm' \| 'md' \| 'lg'`          | `undefined`          | 子树内未显式传入 size 的组件使用的默认尺寸。未设置时继承外层 Provider，最外层回落到组件自身的 md。Form / FormItem 的尺寸上下文优先于 Provider。                    |
| `zIndex`        | `number`                        | `undefined（基准 2000）` | 浮层层级基准；各类浮层在基准上加固定偏移，见下方层级表。组件显式传入的 zIndex 优先。                                                                   |
| `reducedMotion` | `'user' \| 'always' \| 'never'` | `undefined（'user'）`  | JS 驱动动效的减弱策略。user 跟随系统 prefers-reduced-motion，always 始终减少，never 始终完整播放。0.12.4 起共享 Tooltip 面板按对应触发器的局部策略打开、切换和关闭。 |

### 插槽

| 插槽        | 参数  | 说明                                     |
| --------- | --- | -------------------------------------- |
| `default` | `-` | 配置作用的子树。Provider 只提供上下文，不渲染额外的 DOM 元素。 |

## 尺寸解析顺序

箭头左侧优先。未列出的组件不读取 Provider 的 `size`，例如 BingIcon 仍默认为 md，BingCard 没有尺寸档位。

| 组件                                                                                                             | 尺寸解析顺序                                                                       |
| -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `BingInput / BingTextarea / BingSelect / BingTreeSelect / BingAutocomplete / BingDatePicker / BingColorPicker` | 组件 size → FormItem → Form → Provider → md                                    |
| `BingButton / BingCheckbox / BingCheckboxGroup / BingRadio / BingRadioGroup`                                   | 组件 size（或所在 Group）→ FormItem → Form → Provider → md；Button 的 xs / xl 只能显式设置。 |
| `BingForm / BingFormItem`                                                                                      | Form 的 size → Provider → md；FormItem 继承所在 Form 的解析结果。                        |
| `BingTag / BingTabs / BingTable / BingDropDown`                                                                | 组件 size → Provider → md（0.12.0 起 props 不再预填 md）。                             |

## 浮层层级表

默认值对应基准 2000。设置 `zIndex` 为 3000 时，表中每一项都增加 1000，例如 Tooltip 为 4200。

| 层级             | 默认值    | 偏移      | 使用的组件                                                       |
| -------------- | ------ | ------- | ----------------------------------------------------------- |
| `dialog`       | `2000` | `+0`    | BingDialog                                                  |
| `toast`        | `2100` | `+100`  | BingToast 视口                                                |
| `filePreview`  | `2300` | `+300`  | BingFilePreview                                             |
| `imagePreview` | `2400` | `+400`  | BingImagePreview                                            |
| `colorPicker`  | `2900` | `+900`  | BingColorPicker 面板                                          |
| `popover`      | `3000` | `+1000` | BingSelect、BingTreeSelect、BingAutocomplete、BingDropDown 的面板 |
| `datePicker`   | `3100` | `+1100` | BingDatePicker 面板                                           |
| `tooltip`      | `3200` | `+1200` | BingTooltip                                                 |

## 组合式函数

均从 `@moubing/bing-ui` 导入。`useBingConfig` 与 `useReducedMotion` 读取的是调用位置所在组件的上层 Provider，因此不能在放置 Provider 的同一个组件里读取它提供的配置，需要在其后代组件中调用。

| 函数                            | 类型                                                                                                                                     | 说明                                                                                                                    |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `useBingConfig()`             | `() => { size: ComputedRef<BingConfigSize \| undefined>; zIndex: ComputedRef<number>; reducedMotion: ComputedRef<BingReducedMotion> }` | 读取最近一层 Provider 合并后的配置；没有 Provider 时 size 为 undefined、zIndex 为 2000、reducedMotion 为 user。需在 Provider 的后代组件 setup 中调用。 |
| `useReducedMotion(options?)`  | `(options?: { onChange?: () => void }) => (view?: Pick<Window, 'matchMedia'> \| null) => boolean`                                      | 返回实时判断函数，结合 Provider 策略与系统设置。onChange 在系统设置或 reducedMotion 变化时调用，用于重建常驻动画；必须在组件 setup 中调用。                            |
| `prefersReducedMotion(view?)` | `(view?: Pick<Window, 'matchMedia'> \| null) => boolean`                                                                               | 只读取系统的 prefers-reduced-motion，不考虑 Provider；服务端或缺少 matchMedia 时返回 false。                                               |

## 公开类型

| 类型                        | 说明                                                                              |
| ------------------------- | ------------------------------------------------------------------------------- |
| `BingConfigProviderProps` | Provider 的属性类型，等同 BingConfig。                                                   |
| `BingConfig`              | \{ size?: BingConfigSize; zIndex?: number; reducedMotion?: BingReducedMotion \} |
| `BingConfigSize`          | 'sm' \| 'md' \| 'lg'                                                            |
| `BingReducedMotion`       | 'user' \| 'always' \| 'never'                                                   |

Provider 基于 Vue 的 provide / inject，Teleport 到 `body` 的浮层同样能读取配置。配置不会跨越独立创建的 Vue 应用实例；多个应用需要各自放置 Provider。
