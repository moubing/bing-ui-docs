# BingTooltip

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export tooltip；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。五个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

options 是演示配置。多个实例共享浮层，实际可见性用默认插槽 open 判断；显式模型需同步更新。提示自动关联实际目标，多目标使用 triggerProps 指定。外部手动切换示例关闭 closeOnOutside，保留 Escape。

BingTooltip 是轻量提示浮层，用于给按钮、图标、表单字段和状态标签补充说明。它支持 hover、click、manual 三种触发方式，能根据视口空间自动调整位置，并把浮层 Teleport 到 body 共享渲染，适合页面里频繁出现的短说明和轻量交互内容。

独立使用需导入 `BingTooltip` 以及 `@moubing/bing-ui/style.css`；下方五个示例均包含完整导入与处理函数。

## 交互总览

通过 `trigger` 控制打开方式，通过 `placement` 和 `align` 控制首选位置。下面的示例可以直接修改提示内容、触发方式、延迟和关闭行为。

基础示例默认使用两个字的“斜体”，便于检查短提示的留白；可在“提示内容”中输入长文本，检查换行和滚动。面板按内容收紧，`maxWidth` 只限制最大宽度，不要求短文案占满面板。

短提示直接渲染内容，溢出后才使用 BingScrollbar；从短内容变成长内容可能重挂内容插槽。需要保持富内容组件状态时显式开启 scrollable。maxWidth 限制整体宽度，长提示恢复短内容后仍收紧高度。

省略 modelValue 时内部管理；显式传入时用 v-model 同步。hover 支持键盘可见焦点，鼠标点击后关闭并抑制到离开；触屏长按 500ms 打开、松手后 1500ms 关闭。disabled 隐藏提示并阻止打开，保留受控模型；恢复启用不会自动重开，需要再次触发或调用 show。

多个 Tooltip 共用面板，接管时旧实例立即发出 close('replaced') 与 update:modelValue(false)。click / manual 固定提示会阻止其他 hover / focus 抢占，显式点击可切换。ARIA 自动关联实际可聚焦目标，提示与目标名称相同时不重复添加描述；多目标可用默认插槽 triggerProps 指定。suppressWhenExpanded 默认 true，菜单按钮展开后自动抑制提示，无需重复绑定 disabled。

从 0.12.4 起，共享面板的打开和移动遵循当前触发器所在 `BingConfigProvider` 的 `reducedMotion`，关闭遵循正在退场的触发器配置。不同区域分别设置 `always` 和 `never` 时互不覆盖，不会再沿用首个 Tooltip 实例的动效策略；可在 [ConfigProvider 动效示例](/docs/components/config-provider#motion) 连续悬停比较。`always` 跳过动画，触发延迟仍由 `openDelay` / `closeDelay` 控制。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingTooltip, type BingTooltipProps, type BingTooltipOpenReason, type BingTooltipCloseReason } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const options: BingTooltipProps = {
  "content": "斜体",
  "trigger": "click",
  "placement": "top",
  "align": "center",
  "openDelay": 0,
  "closeDelay": 80,
  "offset": 10,
  "maxWidth": 280,
  "interactive": true,
  "disabled": false,
  "closeOnOutside": true,
  "closeOnEsc": true
}
const open = ref(false)
const feedback = ref('等待操作')
function opened(reason: BingTooltipOpenReason) { feedback.value = `打开：${reason}` }
function closed(reason: BingTooltipCloseReason) { feedback.value = `关闭：${reason}` }
</script>

<template>
  <div class="stage">
    <BingTooltip id="basic-tooltip" v-model="open" v-bind="options" @open="opened" @close="closed">
      <template #default="{ triggerProps }">
        <button type="button" class="anchor" v-bind="triggerProps"
         >查看提示</button>
      </template>
    </BingTooltip>
    <BingButton v-if="options.trigger === 'manual'" :throttle="false" @click="open = !open">手动切换</BingButton>
    <p role="status">{{ open ? '已打开' : '已关闭' }}；{{ feedback }}</p>
  </div>
</template>

<style scoped>
.stage { padding: 110px 20px; text-align: center; }
.anchor { padding: 10px 16px; border: 1px solid var(--bing-border); border-radius: 8px; color: inherit; background: transparent; font: inherit; cursor: pointer; }
</style>
```

## 富内容提示

简单文案用 `content`，复杂说明用 `content` 插槽。当 `interactive` 为 true 时，用户可以把鼠标移进浮层并点击里面的按钮。

浮层仍为 `role="tooltip"`，不会自动移入或限制焦点。在 Dialog 内显示时，提示内容纳入弹窗的可聚焦范围，Escape 先关闭提示；重要的表单和确认流程使用 Dialog；此处仅演示少量内容和本地点击反馈。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingTooltip } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const count = ref(0)
</script>

<template>
  <div class="stage">
    <BingTooltip id="rich-tooltip" trigger="click" placement="right" :open-delay="0" max-width="320px" interactive>
      <template #default="{ triggerProps }"><button type="button" class="anchor" v-bind="triggerProps">字段说明</button></template>
      <template #content>
        <div class="content"><strong>价格策略</strong><span>用于解释字段、状态和操作后果。</span>
          <BingButton size="xs" :throttle="false" @click="count++">标记已读</BingButton>
        </div>
      </template>
    </BingTooltip>
    <p role="status">已读操作：{{ count }} 次</p>
  </div>
</template>

<style scoped>
.stage { padding: 110px 20px; text-align: center; }
.content { display: grid; gap: 10px; }
.anchor { padding: 10px 16px; border: 1px solid var(--bing-border); border-radius: 8px; color: inherit; background: transparent; font: inherit; cursor: pointer; }
</style>
```

## 定位与边界

`placement` 是首选方向，不是绝对方向。组件会读取锚点和浮层尺寸，在空间不足时翻转方向，并通过 `viewportPadding` 保留与视口边缘的距离。

组件依次尝试首选方向、反方向和剩余方向；没有方向放得下时选择空间最多的一侧并修正坐标。窗口 resize 和滚动会触发重新定位，单纯修改内容或移动锚点后可等待 DOM 更新再调用 `updatePosition()`。

此例只有纯文本，设置 `interactive=false` 让浮层不拦截指针，便于继续点击相邻方向按钮。

```vue
<script setup lang="ts">
import { BingTooltip, type BingTooltipPlacement } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const items: Array<{ placement: BingTooltipPlacement; label: string }> = [
  { placement: 'top', label: '上方' }, { placement: 'right', label: '右侧' },
  { placement: 'bottom', label: '下方' }, { placement: 'left', label: '左侧' },
]
</script>

<template>
  <div class="board">
    <BingTooltip v-for="item in items" :id="`placement-${item.placement}`" :key="item.placement"
      :content="`优先方向：${item.placement}，空间不足时自动选择其他方向。`" trigger="click"
      :placement="item.placement" align="center" :open-delay="0" :offset="12" :interactive="false">
      <template #default="{ triggerProps }"><button type="button" class="anchor" v-bind="triggerProps">{{ item.label }}</button></template>
    </BingTooltip>
  </div>
</template>

<style scoped>
.board { display: flex; justify-content: center; flex-wrap: wrap; gap: 24px; padding: 110px 20px; }
.anchor { padding: 10px 16px; border: 1px solid var(--bing-border); border-radius: 8px; color: inherit; background: transparent; font: inherit; cursor: pointer; }
</style>
```

## 手动控制与事件

`trigger="manual"` 适合引导流程、校验提示和外部状态驱动的说明。组件通过 `show`、`hide`、`toggle` 和 `updatePosition` 暴露方法，同时会把打开和关闭原因传给事件。

manual 仍支持外部点击与 Escape 关闭。示例关闭 closeOnOutside，避免外部切换按钮的 pointerdown 先关闭提示；Escape 保留。再次点击 click 锚点的关闭原因为 click。open / close 表示有效状态变化，不表示动画完成；初始模型 true 不发送初次 open。

缓存页面停用时不会触发卸载。使用 KeepAlive 的文档页在 `onDeactivated` 中移除预览 Tooltip 并清空打开状态，避免未显示的页面继续留下共享浮层或计时任务；返回时保留参数配置。

```vue
<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { BingButton, BingTooltip, type BingTooltipExpose, type BingTooltipOpenReason, type BingTooltipCloseReason } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const tooltip = ref<BingTooltipExpose | null>(null)
const open = ref(false)
const shifted = ref(false)
const feedback = ref('等待手动控制')
function opened(reason: BingTooltipOpenReason) { feedback.value = `打开：${reason}` }
function closed(reason: BingTooltipCloseReason) { feedback.value = `关闭：${reason}` }
async function move() { shifted.value = !shifted.value; await nextTick(); tooltip.value?.updatePosition() }
</script>

<template>
  <div class="stage">
    <div :style="{ marginLeft: shifted ? '80px' : '0px' }">
      <BingTooltip id="manual-tooltip" ref="tooltip" v-model="open" trigger="manual" :close-on-outside="false"
        content="这个提示由外部按钮控制。" @open="opened" @close="closed">
        <span>被控制的锚点</span>
      </BingTooltip>
    </div>
    <div class="actions">
      <BingButton :throttle="false" @click="tooltip?.show('manual')">打开</BingButton>
      <BingButton :throttle="false" @click="tooltip?.toggle('manual')">切换</BingButton>
      <BingButton :throttle="false" @click="tooltip?.hide('manual')">关闭</BingButton>
      <BingButton :throttle="false" @click="move">移动并重新定位</BingButton>
    </div>
    <p role="status">{{ open ? '已打开' : '已关闭' }}；{{ feedback }}</p>
  </div>
</template>

<style scoped>
.stage { padding: 110px 20px; text-align: center; }
.actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 40px; }
</style>
```

## 连续工具栏与快捷键

skipDelay 默认 300ms，提示关闭后在此窗口内移向相邻项可跳过等待。shortcut 展示键帽及 aria-keyshortcuts，不注册业务快捷键；tone="inverse" 使用反色面板。原生禁用按钮不能接收焦点，使用有名称、tabindex="0" 的包装作为提示目标。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingDropDown, BingDropDownItem, BingTooltip } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const actions = ref(0)
</script>

<template>
  <div class="toolbar" role="toolbar" aria-label="提示工具栏">
    <BingTooltip content="加粗" :shortcut="['Ctrl', 'B']" tone="inverse">
      <BingButton variant="secondary" ariaLabel="加粗" @click="actions++">B</BingButton>
    </BingTooltip>
    <BingTooltip content="斜体" :shortcut="['Ctrl', 'I']" tone="inverse">
      <BingButton variant="secondary" ariaLabel="斜体" @click="actions++">I</BingButton>
    </BingTooltip>
    <BingTooltip content="需要先选择文档">
      <template #default="{ triggerProps }">
        <span v-bind="triggerProps" tabindex="0" aria-label="发布（不可用）"><BingButton disabled>发布</BingButton></span>
      </template>
    </BingTooltip>
    <BingDropDown ariaLabel="工具栏更多操作">
      <template #trigger="{ triggerProps }">
        <BingTooltip content="更多操作">
          <BingButton v-bind="triggerProps" variant="secondary">更多</BingButton>
        </BingTooltip>
      </template>
      <BingDropDownItem title="复制格式" @click="actions++" />
    </BingDropDown>
  </div>
  <p role="status">操作次数：{{ actions }}</p>
</template>

<style scoped>
.toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
</style>
```

## Props

| 属性                     | 类型                                           | 默认值                            | 说明                                                                      |
| ---------------------- | -------------------------------------------- | ------------------------------ | ----------------------------------------------------------------------- |
| `skipDelay`            | `number`                                     | `300`                          | 上一个提示关闭后免去悬停等待的时间窗口，单位毫秒。                                               |
| `scrollable`           | `boolean`                                    | `false`                        | 默认仅溢出时启用滚动；富内容可显式开启以保持滚动容器结构稳定。                                         |
| `suppressWhenExpanded` | `boolean`                                    | `true`                         | 实际触发器 aria-expanded=true 时自动关闭并抑制提示；业务特殊策略可显式关闭。                        |
| `shortcut`             | `string \| string[]`                         | `undefined`                    | 显示快捷键键帽并向触发器提供 aria-keyshortcuts，不注册按键动作。                               |
| `tone`                 | `BingTooltipTone`                            | `'surface'`                    | surface 使用普通表面色；inverse 使用反色提示。                                         |
| `modelValue`           | `boolean`                                    | `false`                        | 省略时内部维护；显式传入需同步更新。共享面板被替换时旧实例发出 false 与 close(replaced)。                |
| `content`              | `string`                                     | `undefined`                    | 提示内容。需要复杂结构时使用 content 插槽。                                              |
| `trigger`              | `BingTooltipTrigger \| BingTooltipTrigger[]` | `'hover'`                      | hover 响应指针与键盘可见焦点；鼠标点击后抑制到离开。click / manual 固定面板，阻止其他 hover / focus 接管。 |
| `placement`            | `'top' \| 'right' \| 'bottom' \| 'left'`     | `'top'`                        | 首选展示方向；空间不足时会自动翻转或贴边。                                                   |
| `align`                | `'start' \| 'center' \| 'end'`               | `'center'`                     | 上/下方向控制水平对齐，左/右方向控制垂直对齐；边缘约束可能修正坐标。                                     |
| `disabled`             | `boolean`                                    | `false`                        | 隐藏并阻止打开，发出 close(disabled)；受控模型保留，恢复启用不会自动重开，需要再次触发或调用 show。            |
| `interactive`          | `boolean`                                    | `true`                         | 内容区是否可交互。开启后鼠标进入浮层不会立即关闭。                                               |
| `openDelay`            | `number`                                     | `180`                          | hover/focus 初次打开的延迟，最小为 0；已有活动提示时切换到另一个提示会跳过此延迟。click 和实例方法立即请求打开。      |
| `closeDelay`           | `number`                                     | `90`                           | hover/focus 离开后的关闭延迟，单位毫秒。                                              |
| `offset`               | `number`                                     | `10`                           | 浮层与锚点之间的距离，单位像素。                                                        |
| `viewportPadding`      | `number`                                     | `12`                           | 浮层贴近视口边缘时保留的最小间距。                                                       |
| `maxWidth`             | `string \| number`                           | `280`                          | 浮层最大宽度（含边框与内边距）；数字会转为 px，不固定短内容的宽高。自 0.9.1 起滚动轨道复用内边距，短提示没有额外滚动槽留白。     |
| `zIndex`               | `number`                                     | `undefined（基准 + 1200，默认 3200）` | 浮层 z-index；未传时使用 ConfigProvider 的 zIndex 基准加 1200。                      |
| `closeOnOutside`       | `boolean`                                    | `true`                         | 任何触发方式打开后，浮层和触发器之外的 pointerdown 是否请求关闭。手动外部切换按钮建议设为 false。              |
| `closeOnEsc`           | `boolean`                                    | `true`                         | 按 Escape 是否关闭。                                                          |
| `id`                   | `string`                                     | `undefined`                    | 自定义 tooltip id；未传时自动生成。                                                 |
| `ariaLabel`            | `string`                                     | `undefined`                    | 浮层 role="tooltip" 的可访问名称。                                               |
| `glass`                | `boolean`                                    | `true`                         | 是否启用玻璃质感背景变量。                                                           |
| `glassBlur`            | `string \| number`                           | `undefined（主题默认 16）`           | 玻璃模糊强度。数字会转为 px。                                                        |
| `glassOpacity`         | `number`                                     | `undefined（浅色 0.86 / 深色 0.92）` | 玻璃层不透明度。                                                                |
| `glassSaturation`      | `number`                                     | `undefined（主题默认 1.05）`         | 玻璃层饱和度。                                                                 |

## Slots

| 插槽        | 参数                                                                                                                                                                | 说明                                                              |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `default` | `{ open: boolean; show: BingTooltipExpose['show']; hide: BingTooltipExpose['hide']; toggle: BingTooltipExpose['toggle']; triggerProps: BingTooltipTriggerProps }` | open 表示实际显示。自动关联首个可聚焦目标；多目标时将 triggerProps 绑定到指定按钮，禁用按钮使用可聚焦包装。 |
| `content` | `-`                                                                                                                                                               | 自定义浮层内容；传入后优先于 content 字符串。                                     |

## Events 与 Expose

事件会带上打开或关闭来源，方便在业务层记录用户如何触发提示；Expose 方法则用于完全受控的提示场景。

| 事件                  | 参数                       | 说明                                                                |
| ------------------- | ------------------------ | ----------------------------------------------------------------- |
| `update:modelValue` | `boolean`                | 内部交互请求改变状态时触发；外部赋值不重复发出更新。受控父组件不接收时不会改变打开状态。                      |
| `open`              | `BingTooltipOpenReason`  | 有效打开状态变为 true 时触发；初始 modelValue=true 不发送初次 open，外部后续切换默认为 manual。 |
| `close`             | `BingTooltipCloseReason` | 关闭原因包括 replaced（共享面板换主）；点击 hover 提示关闭后不会因鼠标焦点重新打开。                |

| 方法                 | 签名                                                                   | 说明                                             |
| ------------------ | -------------------------------------------------------------------- | ---------------------------------------------- |
| `show(reason?)`    | `(reason?: BingTooltipOpenReason) => void`                           | 立即请求打开，默认原因 manual；已打开但失去共享浮层时重新接管。受控模式仍需同步模型。 |
| `hide(reason?)`    | `(reason?: BingTooltipCloseReason) => void`                          | 立即请求关闭并取消待打开计时器，默认原因 manual。                   |
| `toggle(reason?)`  | `(reason?: BingTooltipOpenReason \| BingTooltipCloseReason) => void` | 按当前是否占用共享浮层切换。手动操作使用默认或 manual 原因。             |
| `updatePosition()` | `() => void`                                                         | 仅实际显示时生效；DOM 内容或布局变化后先 await nextTick() 再调用。   |

## 公开类型

| 类型                        | 定义                                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------------ |
| `BingTooltipTone`         | `'surface' \| 'inverse'`                                                                         |
| `BingTooltipTriggerProps` | `触发目标标记及可选 aria-describedby、aria-controls、aria-expanded、aria-keyshortcuts。`                      |
| `BingTooltipTrigger`      | `'hover' \| 'click' \| 'manual'`                                                                 |
| `BingTooltipPlacement`    | `'top' \| 'right' \| 'bottom' \| 'left'`                                                         |
| `BingTooltipAlign`        | `'start' \| 'center' \| 'end'`                                                                   |
| `BingTooltipOpenReason`   | `'hover' \| 'click' \| 'focus' \| 'manual'`                                                      |
| `BingTooltipCloseReason`  | `'hover' \| 'click' \| 'focus' \| 'outside' \| 'escape' \| 'manual' \| 'disabled' \| 'replaced'` |
