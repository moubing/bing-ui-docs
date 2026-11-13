# BingDragDrop

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export drag-drop；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。两个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

数据、事件处理和样式完整内置。组件只报告来源与目标，示例在 drop 中自行修改数据。拖动只支持指针，基础示例用下拉菜单提供键盘可用的移动入口。

BingDragDrop 用于把条目从一个区域拖到另一个区域，例如看板换列、归档、移入分组或拖到删除区。它由四个组件组合：`BingDragDrop` 管理一次拖动，`BingDraggable` 包住可拖动的条目，`BingDropZone` 声明放置区域，`BingDragOverlay` 渲染跟随指针的浮层。组件只报告“哪个条目从哪里放到了哪里”，数据更新、保存和撤销由业务完成。

同一区域内调整顺序请使用 BingSortableList。BingDragDrop 不处理区域内排序，也不提供键盘拖动。

## 跨区域拖动

`BingDraggable` 的 `zone` 写条目当前所在区域的 id，`BingDropZone` 的 `id` 与之对应。松手时指针在另一个区域上方，`BingDragDrop` 发出 `drop`，载荷包含条目 `id`、`data`、来源 `from` 和目标 `to`；业务据此修改数据，条目随数据重新渲染到新区域。

落点只按指针位置判断：松手时指针不在任何区域内，条目回到原处；放回原区域默认只发出 `drag-end`，不发出 `drop`。区域嵌套时取最内层的区域。`BingDragOverlay` 可选，提供后原条目留在原处作为占位，浮层带轻微倾斜跟随指针，松手后先回到落点，再在同一帧内把位置交还给条目（浮层收起、占位样式解除），不会闪出空槽；放下后条目不再显示时（例如 `drop` 里把它移出列表、落到「已完成」「回收站」或当前隐藏的列），浮层保持拖动时的尺寸，缩小淡出地收进它落下的区域，区域也已移除时就地收拢；浮层带有 `aria-hidden` 和 `inert`。

鼠标和触控笔按下后移动超过 `dragThreshold`（默认 6px）才开始拖动，单击条目中的链接仍正常打开。触屏需要长按 `touchDelay`（默认 300ms）才开始，长按前滑动照常滚动页面。按下点落在条目内的按钮、输入框、下拉框、可编辑区域或带 `data-bing-drag-ignore` 的元素上时不会开始拖动；条目本身是链接或按钮时不受影响。拖动中按 Escape 取消。拖到滚动容器或窗口边缘时自动滚动，可用 `autoScroll` 关闭。

拖动只支持指针，没有键盘操作和读屏说明。示例在每张卡片上放了“移到…”菜单，键盘和读屏用户通过它完成同样的移动；业务中请始终提供这样的非拖动入口。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  BingButton, BingDragDrop, BingDraggable, BingDragOverlay, BingDropDown, BingDropDownItem, BingDropZone,
  type BingDragDropDropPayload,
} from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

type Status = 'queued' | 'doing' | 'testing'
type Task = { id: string; title: string; status: Status }

const columns: { id: Status; name: string }[] = [
  { id: 'queued', name: '待处理' },
  { id: 'doing', name: '进行中' },
  { id: 'testing', name: '测试中' },
]
const tasks = ref<Task[]>([
  { id: 'REQ-12', title: '导出筛选结果为表格', status: 'queued' },
  { id: 'REQ-15', title: '评论支持提及成员', status: 'queued' },
  { id: 'REQ-9', title: '首页改为个人工作台', status: 'doing' },
  { id: 'BUG-4', title: '粘贴图片偶发丢失', status: 'doing' },
  { id: 'REQ-3', title: '版本对比支持表格', status: 'testing' },
])
const log = ref('拖动卡片到其他列，或用卡片右侧的菜单移动')

function nameOf(status: Status) {
  return columns.find(column => column.id === status)!.name
}
function move(id: string, status: Status, via: string) {
  const task = tasks.value.find(item => item.id === id)
  if (!task || task.status === status) return
  task.status = status
  log.value = `${via}：${id} 移到${nameOf(status)}`
}
// drop 只在落到其他区域时触发；放回原列或松手在区域外只会归位。
function handleDrop(payload: BingDragDropDropPayload<Task>) {
  move(String(payload.id), payload.to as Status, '拖动')
}
</script>

<template>
  <BingDragDrop @drop="handleDrop">
    <div class="board">
      <BingDropZone v-for="column in columns" :id="column.id" :key="column.id" v-slot="{ state }"
        tag="section" class="column" :ariaLabel="column.name">
        <h3>{{ column.name }}<span v-if="state === 'over'">松手移到这里</span></h3>
        <BingDraggable v-for="task in tasks.filter(item => item.status === column.id)" :id="task.id" :key="task.id"
          :zone="column.id" :data="task" class="card">
          <a :href="'#' + task.id" @click.prevent="log = '打开 ' + task.id"><small>{{ task.id }}</small>{{ task.title }}</a>
          <!-- 拖动只支持指针，菜单为键盘和读屏用户提供同样的移动能力；按钮内按下不会开始拖动。 -->
          <BingDropDown :ariaLabel="task.id + ' 移动到'" placement="bottom-end">
            <template #trigger="{ triggerProps }">
              <BingButton v-bind="triggerProps" variant="ghost" size="sm" :throttle="false" :ariaLabel="task.id + ' 操作'">⋯</BingButton>
            </template>
            <BingDropDownItem v-for="target in columns.filter(item => item.id !== task.status)" :key="target.id"
              :title="'移到' + target.name" @click="move(task.id, target.id, '菜单')" />
          </BingDropDown>
        </BingDraggable>
      </BingDropZone>
    </div>
    <BingDragOverlay v-slot="{ data }">
      <div class="card card--overlay"><small>{{ data.id }}</small>{{ data.title }}</div>
    </BingDragOverlay>
  </BingDragDrop>
  <p role="status" class="log">{{ log }}</p>
</template>

<style scoped>
.board { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; }
.column { display: grid; align-content: start; gap: 8px; min-height: 220px; padding: 12px; border: 1px dashed transparent; border-radius: 8px; background: var(--bing-surface); transition: border-color 160ms, background 160ms; }
.column.is-target { border-color: var(--bing-border); }
.column.is-over { border-color: var(--bing-accent); background: color-mix(in srgb, var(--bing-accent) 6%, var(--bing-surface)); }
h3 { display: flex; gap: 8px; margin: 0 0 4px; color: var(--bing-heading); font-size: 14px; }
h3 span { margin-left: auto; color: var(--bing-accent); font-size: 12px; font-weight: 400; }
.card { display: flex; align-items: center; gap: 8px; min-height: 44px; padding: 8px 8px 8px 12px; border: 1px solid var(--bing-border); border-radius: 8px; background: var(--bing-surface-solid); color: var(--bing-text); }
.card.is-drag-source { opacity: 0.35; border-style: dashed; }
.card a { flex: 1; min-width: 0; color: inherit; text-decoration: none; }
small { display: block; color: var(--bing-muted); font-size: 12px; }
.card--overlay { display: block; height: 100%; box-sizing: border-box; box-shadow: var(--bing-popover-shadow); }
.log { margin: 12px 0 0; color: var(--bing-muted); font-size: 13px; }
</style>
```

## 放置规则与事件

`BingDropZone` 的 `accept(item)` 返回 false 时不接受该条目，拖动期间区域状态为 `disabled`，松手也不会落到这里；来源区域不调用 `accept`，总是可以放回。`disabled` 的区域不接受任何条目。`BingDraggable` 的 `disabled` 让单个条目不能拖动，`BingDragDrop` 的 `disabled` 停用整组拖动。

区域通过默认插槽的 `state` 和 `is-${state}` 类名显示状态：`idle` 没有拖动，`source` 是条目来源，`target` 可以放置，`over` 指针正在上方、松手即放置，`disabled` 不接受当前条目。元素上同时带有 `data-bing-drop-state`。

事件顺序为 `drag-start` → 若干 `drag-over` → `drop`（仅在落到其他区域时）→ `drag-end`。`drag-over` 只在指针所在的可放置区域变化时发出，离开所有区域时 `over` 为 null。`drag-end` 总会发出，`canceled` 表示按 Escape 或其他方式取消，此时 `to` 为 null。开启 `dropOnSource` 后，放回原区域也会发出 `drop`。

`BingDragDrop` 默认插槽的 `active` 在拖动期间为当前条目，可用来只在拖动时显示删除区等额外区域；后代组件也可以调用 `useBingDragDrop()` 读取同样的状态并调用 `cancel()`。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  BingCheckbox, BingDragDrop, BingDraggable, BingDropZone,
  type BingDragDropDropPayload, type BingDragDropEndPayload, type BingDragDropItem, type BingDragDropOverPayload,
} from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

type Task = { id: string; title: string; zone: 'testing' | 'doing' | 'done'; locked?: boolean }

const tasks = ref<Task[]>([
  { id: 'REQ-3', title: '版本对比支持表格', zone: 'testing' },
  { id: 'REQ-7', title: '发布说明定稿', zone: 'testing', locked: true },
  { id: 'BUG-4', title: '粘贴图片偶发丢失', zone: 'doing' },
])
const notes = ref<Record<string, string>>({})
const dropOnSource = ref(false)
const events = ref<string[]>([])

function record(text: string) {
  events.value = [...events.value, text].slice(-5)
}
// 源区域总是接受自己的条目；其他区域由 accept 决定。
const onlyFromTesting = (item: BingDragDropItem) => item.zone === 'testing'

function handleOver(payload: BingDragDropOverPayload) {
  record(`over ${payload.over ?? '区域外'}`)
}
function handleDrop(payload: BingDragDropDropPayload) {
  record(`drop ${payload.id}：${payload.from} → ${payload.to}`)
  if (payload.to === 'trash') {
    tasks.value = tasks.value.filter(task => task.id !== payload.id)
    return
  }
  const task = tasks.value.find(item => item.id === payload.id)
  if (task) task.zone = payload.to as Task['zone']
}
function handleEnd(payload: BingDragDropEndPayload) {
  record(payload.canceled ? 'drag-end 已取消' : `drag-end 落点 ${payload.to ?? '区域外'}`)
}
</script>

<template>
  <div class="rules">
    <BingCheckbox v-model="dropOnSource" label="放回原区域也触发 drop" />
    <BingDragDrop v-slot="{ active }" :dropOnSource="dropOnSource"
      @drag-start="record(`drag-start ${$event.id}`)" @drag-over="handleOver" @drop="handleDrop" @drag-end="handleEnd">
      <div class="zones">
        <BingDropZone v-for="zone in (['doing', 'testing'] as const)" :id="zone" :key="zone" v-slot="{ state }" class="zone"
          :ariaLabel="zone === 'doing' ? '进行中' : '测试中'">
          <h3>{{ zone === 'doing' ? '进行中' : '测试中' }} <em>{{ state }}</em></h3>
          <BingDraggable v-for="task in tasks.filter(item => item.zone === zone)" :id="task.id" :key="task.id"
            :zone="zone" :disabled="task.locked" class="card">
            <strong>{{ task.id }} {{ task.title }}</strong>
            <span v-if="task.locked">已锁定，不能拖动</span>
            <!-- 输入框内按下不会开始拖动，可以正常选中文字。 -->
            <input v-else v-model="notes[task.id]" :aria-label="task.id + ' 备注'" placeholder="备注">
          </BingDraggable>
        </BingDropZone>
        <BingDropZone id="done" v-slot="{ state }" :accept="onlyFromTesting" class="zone zone--done" ariaLabel="已完成">
          <h3>已完成 <em>{{ state }}</em></h3>
          <p>{{ state === 'disabled' ? '只接受测试中的条目' : '从测试中拖到这里' }}</p>
          <div v-for="task in tasks.filter(item => item.zone === 'done')" :key="task.id" class="card">{{ task.id }} 已完成</div>
        </BingDropZone>
      </div>
      <!-- 根插槽的 active 在拖动期间非空，可以只在拖动时显示额外的放置区域。 -->
      <BingDropZone v-if="active" id="trash" v-slot="{ state }" class="trash" ariaLabel="删除">
        {{ state === 'over' ? '松手删除' : '拖到这里删除' }}
      </BingDropZone>
    </BingDragDrop>
    <ol class="events" aria-label="事件记录">
      <li v-for="(event, index) in events" :key="index">{{ event }}</li>
    </ol>
  </div>
</template>

<style scoped>
.rules { display: grid; gap: 12px; color: var(--bing-text); }
.zones { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px; }
.zone { display: grid; align-content: start; gap: 8px; min-height: 180px; padding: 12px; border: 1px dashed var(--bing-border); border-radius: 8px; }
.zone.is-over { border-color: var(--bing-accent); }
.zone.is-disabled { opacity: 0.5; }
h3 { display: flex; justify-content: space-between; margin: 0; color: var(--bing-heading); font-size: 14px; }
em { color: var(--bing-muted); font-size: 12px; font-style: normal; font-weight: 400; }
.zone p { margin: 0; color: var(--bing-muted); font-size: 13px; }
.card { display: grid; gap: 6px; padding: 8px 12px; border: 1px solid var(--bing-border); border-radius: 8px; background: var(--bing-surface-solid); }
.card.is-drag-source { opacity: 0.35; }
.card.is-disabled { cursor: not-allowed; }
.card strong { font-weight: 500; }
.card span { color: var(--bing-muted); font-size: 12px; }
.card input { min-height: 32px; padding: 0 8px; border: 1px solid var(--bing-border); border-radius: 6px; background: transparent; color: inherit; font: inherit; }
.trash { display: grid; place-items: center; min-height: 56px; margin-top: 12px; border: 1px dashed var(--bing-danger, #d92d20); border-radius: 8px; color: var(--bing-danger, #d92d20); }
.trash.is-over { background: color-mix(in srgb, var(--bing-danger, #d92d20) 8%, transparent); }
.events { min-height: 100px; margin: 0; padding-left: 20px; color: var(--bing-muted); font-size: 13px; }
</style>
```

## Props

### BingDragDrop

| 属性               | 类型        | 默认值     | 说明                                  |
| ---------------- | --------- | ------- | ----------------------------------- |
| `disabled`       | `boolean` | `false` | 停用整组拖动，所有条目都不能开始拖动。                 |
| `dragThreshold`  | `number`  | `6`     | 鼠标与触控笔按下后移动超过该距离（px）才开始拖动，单击保持原有行为。 |
| `touchDelay`     | `number`  | `300`   | 触屏长按多久（ms）开始拖动；长按前滑动视为滚动页面。         |
| `touchTolerance` | `number`  | `8`     | 长按期间允许的手指移动距离（px），超过即放弃这次拖动。        |
| `autoScroll`     | `boolean` | `true`  | 拖到滚动容器或窗口边缘时自动滚动。                   |
| `dropOnSource`   | `boolean` | `false` | 放回原区域时是否也发出 drop；默认只发出 drag-end。    |

### BingDraggable

| 属性         | 类型                | 默认值                                                                                                            | 说明                                        |
| ---------- | ----------------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `id`       | `BingDragDropKey` | `必填`                                                                                                           | 条目 id，同一个 BingDragDrop 内唯一。               |
| `zone`     | `BingDragDropKey` | `undefined`                                                                                                    | 条目当前所在区域的 id，用于识别来源区域和载荷中的 from。          |
| `data`     | `T`               | `undefined`                                                                                                    | 业务数据，原样出现在事件载荷与浮层插槽中。                     |
| `disabled` | `boolean`         | `false`                                                                                                        | 该条目不能开始拖动，并带有 is-disabled 类名。             |
| `tag`      | `string`          | `'div'`                                                                                                        | 渲染的元素标签，例如 li、article。                    |
| `ignore`   | `string`          | `'button, input, textarea, select, [contenteditable]:not([contenteditable="false"]), [data-bing-drag-ignore]'` | 按下点命中这些后代元素时不开始拖动；传入后整体替换默认值。条目根元素本身不受影响。 |

### BingDropZone

| 属性          | 类型                                       | 默认值         | 说明                                         |
| ----------- | ---------------------------------------- | ----------- | ------------------------------------------ |
| `id`        | `BingDragDropKey`                        | `必填`        | 区域 id，对应条目的 zone 和载荷中的 to。                 |
| `accept`    | `(item: BingDragDropItem<T>) => boolean` | `undefined` | 返回 false 时不接受该条目；来源区域不调用，总是可以放回。未传时接受全部条目。 |
| `disabled`  | `boolean`                                | `false`     | 不接受任何条目，包括来源区域内的条目。                        |
| `tag`       | `string`                                 | `'div'`     | 渲染的元素标签，例如 section、ul。                     |
| `ariaLabel` | `string`                                 | `undefined` | 区域的可访问名称，例如列名；配合 section 等标签使用。            |

### BingDragOverlay

| 属性             | 类型       | 默认值   | 说明                                                              |
| -------------- | -------- | ----- | --------------------------------------------------------------- |
| `tilt`         | `number` | `1.5` | 拖动时的倾斜角度（deg）；减少动态效果时为 0。                                       |
| `dropDuration` | `number` | `180` | 松手后浮层回到落点的动画时长（ms）；条目放下后不再显示时，按约 1.3 倍时长收进落下的区域；0 或减少动态效果时直接消失。 |

## 插槽与事件

### 事件

| 事件           | 载荷                            | 说明                                            |
| ------------ | ----------------------------- | --------------------------------------------- |
| `drag-start` | `BingDragDropStartPayload<T>` | 越过阈值或长按完成、开始拖动时发出；触屏同时轻微振动（设备支持时）。            |
| `drag-over`  | `BingDragDropOverPayload<T>`  | 指针所在的可放置区域变化时发出；离开所有区域时 over 为 null。          |
| `drop`       | `BingDragDropDropPayload<T>`  | 松手落到可放置区域时发出；放回原区域仅在 dropOnSource 为 true 时发出。 |
| `drag-end`   | `BingDragDropEndPayload<T>`   | 每次拖动结束都会发出，位于 drop 之后；取消或落在区域外时 to 为 null。    |

### 插槽参数

| 插槽                     | 参数                                                                                         | 说明                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `BingDragDrop 默认插槽`    | `{ active: BingDragDropActive<T> \| null; cancel: () => void }`                            | 拖动期间 active 为当前条目，可据此显示额外区域。                                       |
| `BingDraggable 默认插槽`   | `{ dragging: boolean; active: boolean; disabled: boolean }`                                | dragging 表示该条目正在被拖动（含落位动画，浮层落到位的那一帧变为 false），active 表示组内有任意条目正在拖动。 |
| `BingDropZone 默认插槽`    | `{ state: BingDropZoneState; over: boolean; active: BingDragDropActive<T> \| null }`       | over 表示指针在区域上方，包括来源区域。                                             |
| `BingDragOverlay 默认插槽` | `{ id: BingDragDropKey; zone?: BingDragDropKey; data?: T; over: BingDragDropKey \| null }` | 被拖动条目的信息；落位动画期间保留最后一次的内容。                                          |

### 实例方法与组合式函数

| 名称                     | 签名                                                                                                                   | 说明                                                          |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `cancel()`             | `() => void`                                                                                                         | BingDragDrop 实例方法：取消进行中的拖动，条目归位，drag-end 的 canceled 为 true。 |
| `active`               | `Readonly<Ref<BingDragDropActive \| null>>`                                                                          | BingDragDrop 实例属性：当前拖动的条目。                                  |
| `useBingDragDrop<T>()` | `() => { active: Readonly<Ref<BingDragDropActive<T> \| null>>; disabled: ComputedRef<boolean>; cancel: () => void }` | 在 BingDragDrop 后代组件中读取拖动状态；在外部调用会抛错。                        |

## 类型与使用边界

| 类型                                                                                                                                  | 定义                                                                                                                         | 说明                                        |
| ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `BingDragDropKey`                                                                                                                   | `string \| number`                                                                                                         | 条目与区域 id。                                 |
| `BingDragDropItem<T>`                                                                                                               | `{ id: BingDragDropKey; zone?: BingDragDropKey; data?: T }`                                                                | accept 收到的条目。                             |
| `BingDragDropActive<T>`                                                                                                             | `BingDragDropItem<T> & { over: BingDragDropKey \| null; pointerType?: string }`                                            | 正在拖动的条目；pointerType 为 mouse、pen 或 touch。  |
| `BingDragDropStartPayload<T>`                                                                                                       | `BingDragDropItem<T> & { event?: Event }`                                                                                  | drag-start 载荷。                            |
| `BingDragDropOverPayload<T>`                                                                                                        | `BingDragDropItem<T> & { over: BingDragDropKey \| null }`                                                                  | drag-over 载荷。                             |
| `BingDragDropDropPayload<T>`                                                                                                        | `{ id: BingDragDropKey; data?: T; from?: BingDragDropKey; to: BingDragDropKey; event?: Event }`                            | drop 载荷；from 来自条目的 zone。                  |
| `BingDragDropEndPayload<T>`                                                                                                         | `{ id: BingDragDropKey; data?: T; from?: BingDragDropKey; to: BingDragDropKey \| null; canceled: boolean; event?: Event }` | drag-end 载荷。                              |
| `BingDropZoneState`                                                                                                                 | `'idle' \| 'source' \| 'target' \| 'over' \| 'disabled'`                                                                   | 区域状态，同时写入 is-\* 类名与 data-bing-drop-state。 |
| `BingDragDropProps / BingDraggableProps<T> / BingDropZoneProps<T> / BingDragOverlayProps`                                           | `见上方 Props 表`                                                                                                              | 各组件的 Props 类型。                            |
| `BingDragDropEmits<T> / BingDragDropSlotProps<T> / BingDraggableSlotProps / BingDropZoneSlotProps<T> / BingDragOverlaySlotProps<T>` | `见上方事件与插槽表`                                                                                                                | 事件与插槽参数类型。                                |
| `BingDragDropContext`                                                                                                               | `{ active; disabled; cancel }`                                                                                             | useBingDragDrop 返回值的类型。                   |

组件与类型均从 @moubing/bing-ui 导入。`BingDraggable`、`BingDropZone` 和 `BingDragOverlay` 必须放在 `BingDragDrop` 内部，否则抛错；服务端渲染时只输出条目和区域，浮层在客户端拖动时才出现。

`zone` 只用于识别来源区域和填写载荷中的 `from`，不会自动让条目在区域之间移动；没有 `zone` 的条目不会被识别为任何区域的来源。条目 id 在同一个 `BingDragDrop` 内必须唯一，区域 id 同样如此。

`data` 会原样出现在事件载荷和浮层插槽中，组件不复制也不修改它。拖动期间不要卸载正在被拖动的条目；需要清空时先调用 `cancel()`。减少动态效果时浮层不倾斜，也不播放落位动画；该设置在每次松手时读取，运行中切换立即生效。
