# BingDatePicker

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export date-picker；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。五个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

options 是演示配置。模型保存字符串或完整二元组，null 表示空值。每个实例提供唯一 id；配置变化时关闭或重建面板。日期规则与营业时间边界完整内置，清空方法示例先关闭面板。

BingDatePicker 是日期时间选择器，用于选择日期、日期时间、月份、年份或时间。它支持单值和范围模式、内置快捷选择、最小最大值、禁用日期/时间规则，并且可以接入 BingFormItem 的尺寸、禁用和校验状态。

## 类型和范围

`type` 决定面板结构和输出格式；`range` 会把值变成二元组。单值 `date/month/year` 选择后直接提交，`datetime/time` 和所有范围选择都需要点击“确定”。`smoothScroll` 默认只作用于 `time` 和 `datetime` 面板的时、分、秒选项列；设为 `false` 可关闭。

新版 sm/md/lg 触发器高度为 32/36/40px。日历默认语言为 zh-CN，月份和星期显示中文；可切换 locale 观察差异，操作按钮仍使用中文。空间不足时快捷选择移入面板内部，窄屏也可以保持开启。

单值与范围的空值统一使用 null。示例根据 type/range 初始化匹配格式，并在切换类型、范围或禁用配置时用 key 重建面板。每个实例显式提供唯一 id，避免当前版本自动生成 id 重复。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingDatePicker, type BingDatePickerModelValue, type BingDatePickerProps, type BingDatePickerChangePayload, type BingDatePickerType } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const options: BingDatePickerProps = {
  "type": "date",
  "range": false,
  "size": "md",
  "status": "default",
  "placeholder": "选择日期",
  "clearable": true,
  "showShortcuts": true,
  "block": true,
  "disabled": false,
  "locale": "zh-CN"
}
function createSampleValue(type: BingDatePickerType, range: boolean): BingDatePickerModelValue {
  const singleMap: Record<BingDatePickerType, string> = {
    date: '2026-07-01',
    datetime: '2026-07-01 09:30:00',
    month: '2026-07',
    year: '2026',
    time: '09:30:00',
  }

  const rangeMap: Record<BingDatePickerType, [string, string]> = {
    date: ['2026-07-01', '2026-07-15'],
    datetime: ['2026-07-01 09:30:00', '2026-07-15 18:00:00'],
    month: ['2026-07', '2026-09'],
    year: ['2026', '2028'],
    time: ['09:00:00', '18:00:00'],
  }

  return range ? rangeMap[type] : singleMap[type]
}
const value = ref<BingDatePickerModelValue>(createSampleValue(options.type ?? 'date', options.range ?? false))
const feedback = ref('等待选择')
function changed(payload: BingDatePickerChangePayload) { feedback.value = 'change：' + JSON.stringify(payload.value) }
function confirmed(payload: BingDatePickerChangePayload) { feedback.value = 'confirm：' + JSON.stringify(payload.value) }
</script>

<template>
  <BingDatePicker id="date-picker-basic" :key="JSON.stringify([options.type, options.range, options.disabled])" v-model="value" v-bind="options" startPlaceholder="开始" endPlaceholder="结束" ariaLabel="选择日期值" @change="changed" @confirm="confirmed" />
  <p class="feedback" role="status">当前值：{{ JSON.stringify(value) }}；{{ feedback }}</p>
</template>

<style scoped>
.stack { display: grid; gap: 20px; max-width: 100%; }
.stack :deep(.bing-date-picker) { max-width: 100%; }
.actions { display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0; }
.feedback { overflow-wrap: anywhere; }
</style>
```

## 值格式

组件对外始终提交字符串或字符串二元组。`valueFormat` 既决定提交格式，也决定传入的 `modelValue/min/max` 如何被严格解析；`format` 只影响展示。

| 类型         | 默认 valueFormat          | 说明                                                     |
| ---------- | ----------------------- | ------------------------------------------------------ |
| `date`     | `'YYYY-MM-DD'`          | 单值示例：'2026-07-01'；范围示例：\['2026-07-01', '2026-07-15'\]。 |
| `datetime` | `'YYYY-MM-DD HH:mm:ss'` | 包含日期和时间，需要点击确定后提交。                                     |
| `month`    | `'YYYY-MM'`             | 按月份归一化，选择月份后单值会直接提交。                                   |
| `year`     | `'YYYY'`                | 按年份归一化，选择年份后单值会直接提交。                                   |
| `time`     | `'HH:mm:ss'`            | 内部会归一到 '2000-01-01'，只对外输出时间字符串。                        |

下面的日期实例用 `valueFormat="YYYY/MM/DD"` 保存值，用 `format="YYYY年MM月DD日"` 展示；其余实例使用默认格式。组件内部包含严格格式解析；不要把 Date 对象、时间戳或与 valueFormat 不匹配的字符串当成合法模型。非法外部单值可能原样显示，但打开后没有有效草稿，组件不会自动修正业务数据。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingDatePicker, type BingDatePickerModelValue, type BingDatePickerProps, type BingDatePickerType } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const date = ref<BingDatePickerModelValue>("2026/07/01")
const datetime = ref<BingDatePickerModelValue>("2026-07-01 09:30:00")
const month = ref<BingDatePickerModelValue>("2026-07")
const year = ref<BingDatePickerModelValue>("2026")
const time = ref<BingDatePickerModelValue>("09:30:00")
</script>

<template>
  <div class="stack">
    <div><p>date 单值</p><BingDatePicker id="date-picker-singles-date" v-model="date" type="date" valueFormat="YYYY/MM/DD" format="YYYY年MM月DD日" :showShortcuts="false" block ariaLabel="date单值" /><p>保存值：{{ JSON.stringify(date) }}</p></div>
    <div><p>datetime 单值</p><BingDatePicker id="date-picker-singles-datetime" v-model="datetime" type="datetime"  :showShortcuts="false" block ariaLabel="datetime单值" /><p>保存值：{{ JSON.stringify(datetime) }}</p></div>
    <div><p>month 单值</p><BingDatePicker id="date-picker-singles-month" v-model="month" type="month"  :showShortcuts="false" block ariaLabel="month单值" /><p>保存值：{{ JSON.stringify(month) }}</p></div>
    <div><p>year 单值</p><BingDatePicker id="date-picker-singles-year" v-model="year" type="year"  :showShortcuts="false" block ariaLabel="year单值" /><p>保存值：{{ JSON.stringify(year) }}</p></div>
    <div><p>time 单值</p><BingDatePicker id="date-picker-singles-time" v-model="time" type="time"  :showShortcuts="false" block ariaLabel="time单值" /><p>保存值：{{ JSON.stringify(time) }}</p></div>
  </div>
</template>

<style scoped>
.stack { display: grid; gap: 20px; max-width: 100%; }
.stack :deep(.bing-date-picker) { max-width: 100%; }
.actions { display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0; }
.feedback { overflow-wrap: anywhere; }
</style>
```

范围输出为两个完整字符串。日期类会按先后排序；time 范围只比较同一天的时分秒，不能表示跨午夜。范围只验证起终点，不保证中间每一天满足 disabledDate；整段可用性需业务另外判断。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingDatePicker, type BingDatePickerModelValue, type BingDatePickerProps, type BingDatePickerType } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const date = ref<BingDatePickerModelValue>(["2026-07-01","2026-07-15"])
const datetime = ref<BingDatePickerModelValue>(["2026-07-01 09:30:00","2026-07-15 18:00:00"])
const time = ref<BingDatePickerModelValue>(["09:00:00","18:00:00"])
</script>

<template>
  <div class="stack">
    <div><p>date 范围</p><BingDatePicker id="date-picker-ranges-date" v-model="date" type="date" range :showShortcuts="false" block ariaLabel="date范围" /><p>保存值：{{ JSON.stringify(date) }}</p></div>
    <div><p>datetime 范围</p><BingDatePicker id="date-picker-ranges-datetime" v-model="datetime" type="datetime" range :showShortcuts="false" block ariaLabel="datetime范围" /><p>保存值：{{ JSON.stringify(datetime) }}</p></div>
    <div><p>time 范围</p><BingDatePicker id="date-picker-ranges-time" v-model="time" type="time" range :showShortcuts="false" block ariaLabel="time范围" /><p>保存值：{{ JSON.stringify(time) }}</p></div>
  </div>
</template>

<style scoped>
.stack { display: grid; gap: 20px; max-width: 100%; }
.stack :deep(.bing-date-picker) { max-width: 100%; }
.actions { display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0; }
.feedback { overflow-wrap: anywhere; }
</style>
```

## 禁用规则

`min/max` 会先做范围限制，之后再执行 `disabledDate` 和`disabledTime`。时间禁用函数会拿到当前 unit 和 value，适合做营业时间、分钟步进等规则。

规则示例同时使用 min/max 精确限定营业边界，防止仅限制 hour 导致 18:45 仍可选。步进只生成列表，不强制外部值或快捷操作为步进倍数；外部赋值也不会自动按禁用规则清除。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingDatePicker, type BingDatePickerModelValue, type BingDatePickerProps, type BingDatePickerType } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
type RuleOptions = Pick<BingDatePickerProps, 'min' | 'max'>
const options: RuleOptions = {
  "min": "2026-07-01",
  "max": "2026-07-31"
}
const date = ref<BingDatePickerModelValue>('2026-07-08')
const time = ref<BingDatePickerModelValue>('09:30:00')
const disabledDate: NonNullable<BingDatePickerProps['disabledDate']> = value => value.day() === 0 || value.day() === 6
const disabledTime: NonNullable<BingDatePickerProps['disabledTime']> = (_value, context) => context.unit === 'hour' && (context.value < 9 || context.value > 18)

</script>

<template>
  <div class="stack">
    <BingDatePicker id="date-picker-rule-date" v-model="date" v-bind="options" type="date" :disabledDate="disabledDate" :showShortcuts="false" block ariaLabel="工作日日期" />
    <BingDatePicker id="date-picker-rule-time" v-model="time" type="time" min="09:00:00" max="18:00:00" :minuteStep="15" :secondStep="30" :disabledTime="disabledTime" :showShortcuts="false" block ariaLabel="营业时间" />
  </div>
  <p class="feedback" role="status">日期：{{ JSON.stringify(date) }}；时间：{{ JSON.stringify(time) }}</p>
</template>

<style scoped>
.stack { display: grid; gap: 20px; max-width: 100%; }
.stack :deep(.bing-date-picker) { max-width: 100%; }
.actions { display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0; }
.feedback { overflow-wrap: anywhere; }
</style>
```

## 实例方法

通过 ref 可以控制触发器和面板，适合在表单校验失败后自动聚焦，或从外部按钮打开日期面板。

clear() 不关闭面板，打开中的旧草稿也不一定随 null 模型重置；本例先 closePanel() 再 clear()。外部点击或方法关闭没有 cancel 事件。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingDatePicker, BingButton, type BingDatePickerExpose, type BingDatePickerModelValue, type BingDatePickerProps, type BingDatePickerType } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const picker = ref<BingDatePickerExpose | null>(null)
const value = ref<BingDatePickerModelValue>('2026-07-01')
const feedback = ref('等待操作')
function open() { picker.value?.openPanel(); feedback.value = '已调用 openPanel()' }
function focus() { picker.value?.focus(); feedback.value = '已调用 focus()' }
function clear() { picker.value?.closePanel(); picker.value?.clear(); feedback.value = '已调用 clear()' }
</script>

<template>
  <BingDatePicker id="date-picker-methods" ref="picker" v-model="value" block ariaLabel="方法日期" />
  <div class="actions">
    <BingButton :throttle="false" variant="secondary" @click="open">打开面板</BingButton>
    <BingButton :throttle="false" variant="ghost" @click="focus">聚焦触发器</BingButton>
    <BingButton :throttle="false" variant="danger" @click="clear">清空</BingButton>
  </div>
  <p role="status">当前值：{{ JSON.stringify(value) }}；{{ feedback }}</p>
</template>

<style scoped>
.stack { display: grid; gap: 20px; max-width: 100%; }
.stack :deep(.bing-date-picker) { max-width: 100%; }
.actions { display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0; }
.feedback { overflow-wrap: anywhere; }
</style>
```

| 方法             | 类型           | 说明                                                             |
| -------------- | ------------ | -------------------------------------------------------------- |
| `focus()`      | `() => void` | 挂载后聚焦触发器。                                                      |
| `blur()`       | `() => void` | 移除触发器焦点。                                                       |
| `openPanel()`  | `() => void` | 打开并把焦点移到面板；禁用或已打开时无操作。返回 void，不是动画 Promise。                    |
| `closePanel()` | `() => void` | 关闭，不发 cancel、confirm 或提交草稿，也不主动把焦点移回触发器。                       |
| `clear()`      | `() => void` | 满足 clearable、未禁用、有值后提交 null；建议先 closePanel() 再清空，防止已打开面板保留旧草稿。 |

## 属性

| 属性                 | 类型                                                                      | 默认值                                                    | 说明                                                                       |
| ------------------ | ----------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------ |
| `id`               | `string`                                                                | `自动生成 / FormItem controlId`                            | 应用到触发按钮；默认生成唯一值，FormItem 内自动关联字段标签。                                      |
| `modelValue`       | `BingDatePickerModelValue`                                              | `null`                                                 | 单值 string \| null，范围为完整 \[string, string\] \| null。组件始终提交字符串，不提交原生 Date。 |
| `type`             | `BingDatePickerType`                                                    | `'date'`                                               | date、datetime、month、year、time，决定面板与默认 valueFormat。                       |
| `range`            | `boolean`                                                               | `false`                                                | 五种类型均可选择范围，完整有效的两端才能确认。                                                  |
| `placeholder`      | `string`                                                                | `undefined`                                            | 单值空态，未传时显示“请选择日期”。                                                       |
| `startPlaceholder` | `string`                                                                | `'开始'`                                                 | 范围起点空态。                                                                  |
| `endPlaceholder`   | `string`                                                                | `'结束'`                                                 | 范围终点空态。                                                                  |
| `disabled`         | `boolean`                                                               | `undefined（继承 Form，否则 false）`                          | 未设置时继承 Form，最终默认 false，显式 false 可覆盖继承；阻止打开与清空，但当前仍不会自动关闭已打开的面板，详见正文。     |
| `clearable`        | `boolean`                                                               | `true`                                                 | 有值且未禁用时显示清除按钮，也是 clear() 的执行条件。                                          |
| `size`             | `BingDatePickerSize`                                                    | `undefined（继承 FormItem / Form / ConfigProvider，否则 md）` | 触发器高度依次为 32/36/40px。                                                     |
| `block`            | `boolean`                                                               | `false`                                                | 撑满容器，FormItem 内自动开启。                                                     |
| `minWidth`         | `string \| number`                                                      | `220`                                                  | 数字按 px，字符串作为 CSS 长度；数字字符串不自动补单位。                                         |
| `format`           | `string`                                                                | `undefined（使用 valueFormat）`                            | 仅影响展示，不改变保存值。                                                            |
| `valueFormat`      | `string`                                                                | `按 type 决定，见值格式表`                                      | 严格解析 modelValue/min/max 并格式化提交值，建议常用 Dayjs 格式标记。                         |
| `locale`           | `string`                                                                | `'zh-CN'`                                              | Intl.DateTimeFormat 使用的日历月份、年月标题及星期语言；操作按钮与快捷文案仍为中文。                     |
| `firstDayOfWeek`   | `number`                                                                | `1`                                                    | 周起始日，建议 0–6 的有限整数；0 为周日。                                                 |
| `min`              | `string`                                                                | `undefined`                                            | 最小允许值，按 valueFormat 严格解析；解析失败忽略该限制。                                      |
| `max`              | `string`                                                                | `undefined`                                            | 最大允许值，按 valueFormat 严格解析；上下界包含边界。                                        |
| `disabledDate`     | `(value: Dayjs, context: BingDatePickerDisabledDateContext) => boolean` | `undefined`                                            | 日期、月份、年份的禁用判断；time 类型不调用。范围只验证端点。                                        |
| `disabledTime`     | `(value: Dayjs, context: BingDatePickerDisabledTimeContext) => boolean` | `undefined`                                            | datetime/time 的候选时间判断，包含角色、单位与候选数值。                                      |
| `hourStep`         | `number`                                                                | `1`                                                    | 小时选项间隔，建议正的有限整数；仅限制列表，不校验外部值是否为步进倍数。                                     |
| `minuteStep`       | `number`                                                                | `1`                                                    | 分钟选项间隔。                                                                  |
| `secondStep`       | `number`                                                                | `1`                                                    | 秒选项间隔。                                                                   |
| `smoothScroll`     | `SmoothScrollValue`                                                     | `true`                                                 | 仅时、分、秒列表使用；false 关闭组件插值，配置见下表。                                           |
| `showShortcuts`    | `boolean`                                                               | `true`                                                 | 显示内置快捷操作，无法传入自定义列表；侧边空间不足时快捷区移入面板内。                                      |
| `panelMaxHeight`   | `string \| number`                                                      | `420`                                                  | 面板 CSS 最大高度，数字按 px。                                                      |
| `ariaLabel`        | `string`                                                                | `undefined`                                            | 触发按钮可访问名称。                                                               |
| `ariaDescribedby`  | `string`                                                                | `undefined`                                            | 与 FormItem 描述 id 合并。                                                     |
| `status`           | `'default' \| 'error' \| 'success' \| 'warning'`                        | `undefined（继承 FormItem，否则 default）`                    | 样式状态，error 使触发器 aria-invalid=true。                                       |
| `glass`            | `boolean`                                                               | `true`                                                 | 玻璃效果。                                                                    |
| `glassBlur`        | `string \| number`                                                      | `undefined（主题默认 16）`                                   | 模糊 CSS 长度，数字按 px；省略时跟随主题。                                                |
| `glassOpacity`     | `number`                                                                | `undefined（浅色 0.86 / 深色 0.92）`                         | 玻璃底色不透明度，省略时跟随主题。                                                        |
| `glassSaturation`  | `number`                                                                | `undefined（主题默认 1.05）`                                 | 玻璃饱和度，省略时跟随主题。                                                           |

## 事件

| 事件                  | 参数                            | 说明                                                               |
| ------------------- | ----------------------------- | ---------------------------------------------------------------- |
| `update:modelValue` | `BingDatePickerModelValue`    | 提交时先发送；外部赋值不触发。相同值也可能再次提交。                                       |
| `change`            | `BingDatePickerChangePayload` | 更新模型后发送，包含 value、parsedValue、type、range。                         |
| `clear`             | `无`                           | 满足清空条件时最先发送，随后 update:modelValue(null)、change；不自动关闭面板。           |
| `open`              | `无`                           | 打开时发送，动画尚未结束。                                                    |
| `close`             | `无`                           | 请求关闭时发送，不代表动画结束。                                                 |
| `confirm`           | `BingDatePickerChangePayload` | 点击确定或成功使用快捷操作时，在 change 后、close 前发送。单值 date/month/year 点单元格不会发送。 |
| `cancel`            | `无`                           | 面板内 Escape 或取消按钮触发，然后 close；外部点击、触发器收起或 closePanel() 只发送 close。  |

## 类型和状态边界

| 公开类型                                | 定义或用途                                                                                                                           |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `BingDatePickerType`                | 'date' \| 'datetime' \| 'month' \| 'year' \| 'time'                                                                             |
| `BingDatePickerSize`                | 'sm' \| 'md' \| 'lg'                                                                                                            |
| `BingDatePickerSingleValue`         | string \| null                                                                                                                  |
| `BingDatePickerRangeValue`          | \[string, string\] \| null                                                                                                      |
| `BingDatePickerModelValue`          | BingDatePickerSingleValue \| BingDatePickerRangeValue                                                                           |
| `BingDatePickerRangeRole`           | 'start' \| 'end'                                                                                                                |
| `BingDatePickerTimeUnit`            | 'hour' \| 'minute' \| 'second'                                                                                                  |
| `BingDatePickerDisabledDateContext` | \{ type: BingDatePickerType; range: boolean; role?: BingDatePickerRangeRole \}                                                  |
| `BingDatePickerDisabledTimeContext` | BingDatePickerDisabledDateContext & \{ unit: BingDatePickerTimeUnit; value: number \}                                           |
| `BingDatePickerChangePayload`       | \{ value: BingDatePickerModelValue; parsedValue: Dayjs \| \[Dayjs, Dayjs\] \| null; type: BingDatePickerType; range: boolean \} |
| `BingDatePickerProps`               | 上表 33 个可选属性，包含继承的玻璃效果属性。                                                                                                        |
| `BingDatePickerEmits`               | 上表 7 个事件及其参数。                                                                                                                   |
| `BingDatePickerExpose`              | 上表 5 个返回 void 的实例方法。                                                                                                            |
| `Dayjs`                             | 来自 dayjs 的日期对象，回调可使用 day()、hour()、format() 等。示例通过 BingDatePickerProps 的回调类型获取参数，不依赖额外运行时导入。                                     |
| `SmoothScrollValue`                 | boolean \| SmoothScrollOptions                                                                                                  |
| `SmoothScrollOptions`               | 下表可选配置；DatePicker 默认关闭 keyboard、尊重减少动态效果且 smoothTouchpad=false。                                                                 |

组件类型从 `@moubing/bing-ui` 导入，没有自定义插槽、受控 open、弹层位置或 teleportTo 属性。面板与快捷栏传送到 body，定位随视口变化；打开后面板获得焦点，Tab 不限制在面板中，日历没有方向键网格导航。Enter 在需要确认的面板提交，面板 Escape 取消并返回触发器。

当前版本在面板打开时仍不会同步外部 modelValue 到草稿，也不会因 disabled=true 自动关闭面板并禁用所有候选项。业务要变更模型、类型、范围或禁用状态时，先关闭面板，必要时用 key 重建。本页基础配置保留 key，缓存页面离开时卸载所有实例，清理面板、快捷栏、滚动和动画。

format/valueFormat 不包含时区转换约定；time 的 parsedValue 基准日为 2000-01-01。locale 影响星期、月份和年月标题，不改变值格式或中文操作按钮。内置快捷选择按当前本地日期计算，确认时仍校验端点；相同值重复操作仍可能发送 change，业务按需去重。

## 时间列滚动配置

| SmoothScrollOptions 字段 | 类型        | 默认值     | 说明              |
| ---------------------- | --------- | ------- | --------------- |
| `duration`             | `number`  | `400`   | 动画时长，毫秒；0 立即更新。 |
| `stepSize`             | `number`  | `100`   | 滚轮归一化步长。        |
| `pulseScale`           | `number`  | `4`     | 脉冲缓动强度。         |
| `accelerationDelta`    | `number`  | `50`    | 连续输入加速间隔，毫秒。    |
| `accelerationMax`      | `number`  | `3`     | 最大加速倍率。         |
| `keyboardStep`         | `number`  | `50`    | 键盘基础滚动距离。       |
| `keyboard`             | `boolean` | `false` | 内部滚动区的键盘插值。     |
| `smoothTouchpad`       | `boolean` | `false` | 是否对触控板应用插值。     |
| `respectReducedMotion` | `boolean` | `true`  | 减少动态效果偏好下关闭插值。  |

这些配置仅作用于时、分、秒列表。示例无需直接引入滚动库。
