# BingColorPicker

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export color-picker；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。四个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

options 是演示配置，色板数据完整内置。v-model 只更新六位 HEX；事件示例用 change.rgba 保存透明度。面板的格式切换只影响展示和复制。实例方法通过挂载后的 ref 调用。

BingColorPicker 是颜色选择器，用于品牌色、主题变量、图表色板和可视化配置。它提供色域、色相、透明度、格式化文本、预设色板和复制反馈，并支持表单状态与玻璃效果。

## 基础配置

使用 `v-model` 绑定颜色值，`presets` 提供常用色板。下面的示例可以调整尺寸、状态、宽度和禁用状态。

接受 3/4/6/8 位 HEX（可省略 #）、RGB(A) 和 HSL(A)。RGB 通道会取整并限制到 0–255，透明度保留两位小数；不是浏览器完整 CSS 颜色解析器，red、transparent、CSS 变量和 color() 等不可直接使用。无效外部值或空字符串会显示默认粉色，但不主动修正父级模型。

面板默认展示八位 HEX（不透明时结尾为 ff）；切换 HEX/RGBA/HSL 只影响显示与复制，不改变 v-model 的输出格式。**update:modelValue 和 change.value 始终是六位 HEX。** 简单不透明颜色可使用下面的 v-model；要完整保存透明度，请使用事件示例中的 change.rgba。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingColorPicker, type BingColorPickerProps, type BingColorPickerPresetInput } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const productPresets: BingColorPickerPresetInput[] = [
  { label: '冰粉', value: '#ec4899' },
  { label: '玫瑰红', value: '#f43f5e' },
  { label: '琥珀橙', value: '#f59e0b' },
  { label: '柔金', value: '#eab308' },
  { label: '青柠绿', value: '#84cc16' },
  { label: '翡翠绿', value: '#10b981' },
  { label: '青色', value: '#06b6d4' },
  { label: '天蓝', value: '#0ea5e9' },
  { label: '亮蓝', value: '#3b82f6' },
  { label: '靛蓝', value: '#6366f1' },
  { label: '紫罗兰', value: '#8b5cf6' },
  { label: '品红', value: '#d946ef' },
  { label: '蓝灰', value: '#334155' },
  { label: '石墨黑', value: '#111827' },
  { label: '瓷白', value: '#f8fafc' },
  { label: '浅粉', value: '#fdf2f8' },
]
const options: BingColorPickerProps = {
  "size": "md",
  "status": "default",
  "block": true,
  "glass": true,
  "disabled": false,
  "minWidth": 180,
  "panelWidth": 320
}
const color = ref('#ec4899')
</script>

<template>
  <BingColorPicker v-model="color" :presets="productPresets" v-bind="options" ariaLabel="选择主题颜色" />
  <p class="summary" role="status"><span class="swatch" :style="{ background: color }" />当前颜色：{{ color }}</p>
</template>

<style scoped>
.stack { display: grid; justify-items: start; gap: 18px; max-width: 100%; }
.stack :deep(.bing-color-picker) { max-width: 100%; }
.summary { display: flex; align-items: center; gap: 12px; margin: 16px 0; overflow-wrap: anywhere; }
.swatch { width: 40px; height: 40px; flex: 0 0 auto; border: 1px solid var(--bing-border); border-radius: 10px; }
.actions { display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0; }
</style>
```

## 预设色板

`presets` 可以传字符串数组，也可以传带 `label` 的对象数组。对象的 label 用于色块 title 和 “选择”加名称的可访问文本；复制的是颜色字符串。无效预设被过滤，空数组表示不显示色板。预设会归一化到六位 HEX，重复颜色需自行去重以避免 key 冲突。预设中的透明度会丢弃，点击预设保留当前面板透明度，不代表采用预设原有 alpha。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingColorPicker, type BingColorPickerPresetInput } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const neutralPresets: BingColorPickerPresetInput[] = [
  '#111827',
  '#334155',
  '#64748b',
  '#94a3b8',
  '#cbd5e1',
  '#f8fafc',
  '#ffffff',
  '#ec4899',
]
const color = ref('#0ea5e9')
</script>

<template>
  <BingColorPicker v-model="color" :presets="neutralPresets" copyLabel="复制颜色" copiedLabel="已复制" block ariaLabel="选择中性色" />
  <p class="summary" role="status"><span class="swatch" :style="{ background: color }" />当前颜色：{{ color }}</p>
</template>

<style scoped>
.stack { display: grid; justify-items: start; gap: 18px; max-width: 100%; }
.stack :deep(.bing-color-picker) { max-width: 100%; }
.summary { display: flex; align-items: center; gap: 12px; margin: 16px 0; overflow-wrap: anywhere; }
.swatch { width: 40px; height: 40px; flex: 0 0 auto; border: 1px solid var(--bing-border); border-radius: 10px; }
.actions { display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0; }
</style>
```

## 尺寸

`size` 控制触发器高度和内容密度，sm/md/lg 分别为 32/36/40px；表单内默认继承尺寸。默认磨砂跟随主题，浅色不透明度 0.86、深色 0.92，模糊 16px、饱和度 1.05。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingColorPicker, type BingColorPickerPresetInput } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const productPresets: BingColorPickerPresetInput[] = [
  { label: '冰粉', value: '#ec4899' },
  { label: '玫瑰红', value: '#f43f5e' },
  { label: '琥珀橙', value: '#f59e0b' },
  { label: '柔金', value: '#eab308' },
  { label: '青柠绿', value: '#84cc16' },
  { label: '翡翠绿', value: '#10b981' },
  { label: '青色', value: '#06b6d4' },
  { label: '天蓝', value: '#0ea5e9' },
  { label: '亮蓝', value: '#3b82f6' },
  { label: '靛蓝', value: '#6366f1' },
  { label: '紫罗兰', value: '#8b5cf6' },
  { label: '品红', value: '#d946ef' },
  { label: '蓝灰', value: '#334155' },
  { label: '石墨黑', value: '#111827' },
  { label: '瓷白', value: '#f8fafc' },
  { label: '浅粉', value: '#fdf2f8' },
]
const small = ref('#f43f5e')
const medium = ref('#10b981')
const large = ref('#6366f1')
</script>

<template>
  <div class="stack">
    <BingColorPicker v-model="small" :presets="productPresets" size="sm" ariaLabel="小号颜色" />
    <BingColorPicker v-model="medium" :presets="productPresets" size="md" ariaLabel="中号颜色" />
    <BingColorPicker v-model="large" :presets="productPresets" size="lg" ariaLabel="大号颜色" />
  </div>
</template>

<style scoped>
.stack { display: grid; justify-items: start; gap: 18px; max-width: 100%; }
.stack :deep(.bing-color-picker) { max-width: 100%; }
.summary { display: flex; align-items: center; gap: 12px; margin: 16px 0; overflow-wrap: anywhere; }
.swatch { width: 40px; height: 40px; flex: 0 0 auto; border: 1px solid var(--bing-border); border-radius: 10px; }
.actions { display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0; }
</style>
```

## 事件反馈

`change` 会返回颜色的多种格式和变更来源；复制按钮会触发 `copy` 或 `copyError`，适合做提示或埋点。

色域、色相、透明度和有效文本输入先更新面板草稿，停止输入约 180ms 后提交；指针结束、滑条 change、文本 blur/Enter、选择预设或关闭面板可以立即提交。已安排输入即使结果颜色相同仍可能发出 change，业务应按需去重。来源 field 为色域，slider 为色相，alpha 为透明度。

输入非法文本时用 aria-invalid 标记，失焦恢复有效内容；Escape 不是完整的撤销操作，关闭前仍可能提交有效草稿。事件示例用 `:modelValue="color"` 和 `@change` 保存 `payload.rgba`，用于持久化完整透明度。0.6.0 会保留本次提交经 v-model 回传时的面板 alpha，但父级模型仍是六位 HEX，重新挂载后不能恢复未保存的透明度。实例方法只能在挂载后通过组件 ref 调用。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingColorPicker, BingButton, type BingColorPickerPresetInput, type BingColorPickerChangePayload, type BingColorPickerCopyPayload, type BingColorPickerExpose } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const productPresets: BingColorPickerPresetInput[] = [
  { label: '冰粉', value: '#ec4899' },
  { label: '玫瑰红', value: '#f43f5e' },
  { label: '琥珀橙', value: '#f59e0b' },
  { label: '柔金', value: '#eab308' },
  { label: '青柠绿', value: '#84cc16' },
  { label: '翡翠绿', value: '#10b981' },
  { label: '青色', value: '#06b6d4' },
  { label: '天蓝', value: '#0ea5e9' },
  { label: '亮蓝', value: '#3b82f6' },
  { label: '靛蓝', value: '#6366f1' },
  { label: '紫罗兰', value: '#8b5cf6' },
  { label: '品红', value: '#d946ef' },
  { label: '蓝灰', value: '#334155' },
  { label: '石墨黑', value: '#111827' },
  { label: '瓷白', value: '#f8fafc' },
  { label: '浅粉', value: '#fdf2f8' },
]
const picker = ref<BingColorPickerExpose | null>(null)
const color = ref('#8b5cf6')
const feedback = ref('等待操作')
function changed(payload: BingColorPickerChangePayload) {
  // 更新事件只返回六位 HEX；用 change.rgba 保存透明度。
  color.value = payload.rgba
  feedback.value = 'change(' + payload.source + ')：' + payload.rgba
}
function copied(payload: BingColorPickerCopyPayload) { feedback.value = 'copy(' + payload.format + ')：' + payload.value }
function copyError(error: Error) { feedback.value = 'copyError：' + error.message }
</script>

<template>
  <BingColorPicker ref="picker" :modelValue="color" :presets="productPresets" block ariaLabel="事件颜色" @change="changed" @copy="copied" @copyError="copyError" @open="feedback = 'open：面板已打开'" @close="feedback = 'close：面板已关闭'" />
  <p role="status">{{ feedback }}</p>
  <p>保存的颜色：{{ color }}</p>
  <div class="actions">
    <BingButton :throttle="false" @click="picker?.focus()">聚焦</BingButton>
    <BingButton :throttle="false" @click="picker?.blur()">失焦</BingButton>
    <BingButton :throttle="false" @click="picker?.openPanel()">打开面板</BingButton>
    <BingButton :throttle="false" @click="picker?.closePanel()">关闭面板</BingButton>
  </div>
</template>

<style scoped>
.stack { display: grid; justify-items: start; gap: 18px; max-width: 100%; }
.stack :deep(.bing-color-picker) { max-width: 100%; }
.summary { display: flex; align-items: center; gap: 12px; margin: 16px 0; overflow-wrap: anywhere; }
.swatch { width: 40px; height: 40px; flex: 0 0 auto; border: 1px solid var(--bing-border); border-radius: 10px; }
.actions { display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0; }
</style>
```

## 属性

| 属性                | 类型                                                   | 默认值                                         | 说明                                                                 |
| ----------------- | ---------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------ |
| `id`              | `string`                                             | `自动生成 / FormItem controlId`                 | 应用到触发按钮，支持外部 label 的 for 关联。                                       |
| `modelValue`      | `string`                                             | `'#ec4899'`                                 | 可解析的 HEX、RGB(A)、HSL(A) 字符串。更新模型只返回六位 HEX；保留透明度使用 change.rgba，详见正文。 |
| `presets`         | `Array<string \| { label?: string; value: string }>` | `默认色板`                                      | 预设色板。传对象时 label 会作为色块的可访问名称。                                       |
| `disabled`        | `boolean`                                            | `undefined（继承 Form，否则 false）`               | 禁用时关闭面板；显式 false 可覆盖表单继承。                                          |
| `size`            | `'sm' \| 'md' \| 'lg'`                               | `undefined（继承 Form / ConfigProvider，否则 md）` | 触发器高度为 32/36/40px。                                                 |
| `block`           | `boolean`                                            | `false`                                     | 撑满父容器；置于 FormItem 时也会自动撑满。                                         |
| `width`           | `string \| number`                                   | `undefined`                                 | 触发器 CSS 宽度，数字按 px；未传时内部宽度为 280px，受 block 和容器影响。                    |
| `minWidth`        | `string \| number`                                   | `180`                                       | 触发器最小宽度。                                                           |
| `panelWidth`      | `string \| number`                                   | `320`                                       | 用 parseFloat 读取为像素，100% 会被读作 100；实际宽度至少为触发器宽度，并限制在视口内侧 12px。       |
| `copyLabel`       | `string`                                             | `'复制'`                                      | 复制按钮默认文案，实际名称附加当前格式。                                               |
| `copiedLabel`     | `string`                                             | `'已复制'`                                     | 复制成功后的文案。                                                          |
| `copyResetDelay`  | `number`                                             | `1400`                                      | 复制成功状态恢复的延迟，单位毫秒。                                                  |
| `ariaLabel`       | `string`                                             | `undefined`                                 | 触发按钮的可访问名称。                                                        |
| `ariaDescribedby` | `string`                                             | `undefined`                                 | 关联额外说明元素。                                                          |
| `status`          | `'default' \| 'error' \| 'success' \| 'warning'`     | `undefined`                                 | 表单状态；在 FormItem 中可继承校验状态。                                          |
| `glass`           | `boolean`                                            | `true`                                      | 是否开启玻璃效果。                                                          |
| `glassBlur`       | `string \| number`                                   | `undefined（主题默认 16）`                        | 玻璃模糊强度，省略时跟随主题。                                                    |
| `glassOpacity`    | `number`                                             | `undefined（浅色 0.86 / 深色 0.92）`              | 玻璃底色不透明度，省略时跟随主题。                                                  |
| `glassSaturation` | `number`                                             | `undefined（主题默认 1.05）`                      | 玻璃饱和度，省略时跟随主题。                                                     |

## 预设结构

| 写法       | 示例                                  | 说明                |
| -------- | ----------------------------------- | ----------------- |
| `string` | `'#ec4899'`                         | 只传颜色值，色块名称由颜色值兜底。 |
| `object` | `{ label: '冰粉', value: '#ec4899' }` | 同时提供颜色值和可读名称。     |

## 事件与方法

### 事件

| 事件                  | 参数                             | 说明                                                                  |
| ------------------- | ------------------------------ | ------------------------------------------------------------------- |
| `update:modelValue` | `string`                       | 提交颜色时先发出六位 HEX，不含透明度；外部直接赋值不触发。                                     |
| `change`            | `BingColorPickerChangePayload` | 更新模型后发出，包含完整颜色、value（六位 HEX）与 source；需要透明度读取 rgba、hexAlpha 或 rgb.a。 |
| `copy`              | `BingColorPickerCopyPayload`   | 点击复制按钮并成功写入剪贴板时触发。                                                  |
| `copyError`         | `Error`                        | 复制失败时触发。                                                            |
| `open`              | `-`                            | 颜色面板打开时触发。                                                          |
| `close`             | `-`                            | 颜色面板关闭时触发。                                                          |

### 实例方法

| 方法           | 签名           | 说明                                          |
| ------------ | ------------ | ------------------------------------------- |
| `focus`      | `() => void` | 聚焦触发器。                                      |
| `blur`       | `() => void` | 移除触发器焦点。                                    |
| `openPanel`  | `() => void` | 挂载后打开面板，已打开或禁用时无操作；返回 void，不是等待动画的 Promise。 |
| `closePanel` | `() => void` | 提交待处理颜色后关闭，关闭动画结束聚焦触发器；已经关闭时无操作。            |

## 类型与交互边界

| 公开类型                           | 定义或用途                                                                                                                           |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `BingColorPickerSize`          | 'sm' \| 'md' \| 'lg'                                                                                                            |
| `BingColorPickerFormat`        | 'hex' \| 'rgba' \| 'hsl'；影响面板展示与复制，没有 format 属性。                                                                                |
| `BingColorPickerChangeSource`  | 'field' \| 'slider' \| 'alpha' \| 'preset' \| 'input'                                                                           |
| `BingColorPickerModelValue`    | string                                                                                                                          |
| `BingColorPickerPreset`        | \{ label?: string; value: string \}                                                                                             |
| `BingColorPickerPresetInput`   | string \| BingColorPickerPreset                                                                                                 |
| `BingColorPickerRgbValue`      | \{ r: number; g: number; b: number; a: number \}；RGB 为 0–255 整数，alpha 为 0–1。                                                    |
| `BingColorPickerHslValue`      | \{ h: number; s: number; l: number; a: number \}；h 为 0–359，s/l 为 0–100，alpha 为 0–1。                                             |
| `BingColorPickerColorValue`    | \{ hex: string; hexAlpha: string; rgba: string; hsl: string; rgb: BingColorPickerRgbValue; hslParts: BingColorPickerHslValue \} |
| `BingColorPickerChangePayload` | BingColorPickerColorValue & \{ value: string; source: BingColorPickerChangeSource \}                                            |
| `BingColorPickerCopyPayload`   | \{ format: BingColorPickerFormat; value: string; color: BingColorPickerColorValue \}                                            |
| `BingColorPickerProps`         | 上表 19 个可选属性，包括继承的 4 个玻璃效果属性。                                                                                                    |
| `BingColorPickerEmits`         | 上表 6 个事件及其参数。                                                                                                                   |
| `BingColorPickerExpose`        | \{ focus: () =\> void; blur: () =\> void; openPanel: () =\> void; closePanel: () =\> void \}                                    |

类型从 `@moubing/bing-ui` 导入。组件不提供自定义插槽，也没有受控 open、format、teleportTo 或 panelPlacement 属性。面板传送到 body，使用固定定位，z-index 默认 2900（BingConfigProvider 的 zIndex 基准 + 900）；按视口空间自动选择上下位置。panelWidth 建议传像素数，触发器 width/minWidth 才是 CSS 长度。

触发器可用 Enter、空格、ArrowDown 打开，Escape 在触发器或普通面板控件上关闭并返回触发器；颜色文本框中的 Escape 会先恢复格式化内容并结束编辑，面板仍保持打开。色域方向键按 2% 调节，Shift 加方向键按 10%；色相和透明度使用原生范围输入。打开不会自动把焦点移入面板，也没有独立的 Tab 焦点陷阱；Dialog 中可继续操作颜色面板及其格式选择器，Escape 按当前浮层逐层关闭。外部点击关闭，禁用也会关闭。

复制使用所选格式：HEX 为八位 hexAlpha，RGBA 为 rgba 字符串，HSL 在透明时为 hsla。优先 Clipboard API，失败再尝试浏览器复制命令，全部失败才发 copyError；成功才发 copy。copyLabel/copiedLabel 会附加格式名，copyResetDelay 只控制反馈恢复，不能表示复制耗时。

FormItem 可提供 id、尺寸、禁用、状态和说明关联，颜色提交与失焦通知表单校验；status 只表示样式，不自动保证颜色符合业务规则。文档站离开缓存页面时卸载全部选择器和格式浮层，清理监听器与计时器；返回保留已提交颜色，未提交草稿在卸载时取消。
