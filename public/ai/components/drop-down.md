# BingDropDown

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export drop-down；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。六个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

options 是演示配置。带图标的示例依赖 lucide-vue-next 1.0.0。使用 v-model:open 接收受控更新，context 先做类型检查；除示例链接外，操作仅记录本地反馈。shortcut 不注册快捷键。

BingDropDown 是浮层菜单组件，用于按钮菜单、工具栏操作、资源右键菜单和带子菜单的复杂操作面板。组件负责触发方式、定位、键盘导航、关闭逻辑和 GSAP 入场动画，菜单内容通过 BingDropDownItem 或自定义插槽组织。

独立使用需导入 `BingDropDown`、`BingDropDownItem` 和 `@moubing/bing-ui/style.css`。带图标的示例还需显式安装 `lucide-vue-next`，这里验证版本为 1.0.0。示例中的删除、复制、下载和发布仅记录本地操作，不会处理文件、写剪贴板或发送请求；链接项单独展示真实链接的语义。

## 基础菜单

`trigger` 控制菜单打开方式，`placement` 控制首选面板方向，`size` 控制菜单密度。普通按钮菜单把 `triggerProps` 整体绑定到 BingButton 或原生按钮，包含事件与 aria-expanded/aria-haspopup，不要只取 click。示例禁用 BingButton 节流以便连续开关。

hover 默认进入 80ms 后打开、离开 110ms 后关闭，可通过 hoverOpenDelay / hoverCloseDelay 调整。触摸不触发悬停；contextmenu 支持 500ms 长按，移动超过 8px、滚动或第二指取消。主菜单支持上下键、Home/End 并跳过禁用项；触发器方向键打开并聚焦首尾项，普通点击 autoFocus 默认 false。

主菜单在 body 上定位，空间不足时可翻转，窗口滚动与 resize 会重新定位。普通模式使用整个 DropDown 根节点的矩形，多触发器共享根节点时不能假定跟随最后点击按钮；资源行应使用下方的右键模式。

卡片右侧的操作入口可用 `placement="bottom-end"`：菜单优先在按钮下方展开，右边缘与锚点右边缘对齐。`top-end` 同样右对齐，`left-end` / `right-end` 则让菜单底边与锚点底边对齐；靠近视口边缘时会避让。下方基础示例默认演示右侧按钮和 `bottom-end`。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingDropDown, BingDropDownItem, type BingDropDownProps } from '@moubing/bing-ui'
import { FilePlus2, FolderOpen, PenLine, Trash2 } from 'lucide-vue-next'
import '@moubing/bing-ui/style.css'

const options: BingDropDownProps = {
  "trigger": "click",
  "placement": "bottom-end",
  "size": "md",
  "minWidth": "220px",
  "closeOnOutside": true,
  "closeOnEscape": true,
  "autoFocus": false,
  "loop": true,
  "glass": true
}
const open = ref(false)
const events = ref<string[]>([])
function record(action: string) { events.value = [...events.value, action].slice(-6) }
</script>

<template>
  <div class="stage">
    <BingDropDown v-model:open="open" v-bind="options" ariaLabel="文档操作"
      @open="record('菜单已打开')" @close="record('菜单已关闭')">
      <template #trigger="{ triggerProps, open: visible }">
        <BingButton v-bind="triggerProps" variant="secondary" :throttle="false">{{ visible ? '关闭菜单' : '打开菜单' }}</BingButton>
      </template>
      <BingDropDownItem title="新建页面" description="创建一个文档页" :icon="FilePlus2" shortcut="Ctrl+N" @click="record('点击：新建页面')" />
      <BingDropDownItem title="打开目录" description="查看当前组件分组" :icon="FolderOpen" shortcut="Ctrl+O" @click="record('点击：打开目录')" />
      <BingDropDownItem title="重命名" :icon="PenLine" shortcut="F2" @click="record('点击：重命名')" />
      <BingDropDownItem title="删除草稿" tone="danger" :icon="Trash2" shortcut="Del" @click="record('点击：删除草稿')" />
    </BingDropDown>
    <p role="status">{{ events.join(' → ') || '等待打开菜单' }}</p>
  </div>
</template>

<style scoped>
.stage { min-height: 360px; padding: 24px; text-align: right; }
</style>
```

## 右键菜单

当 `trigger` 为 `contextmenu` 时，触发器 slot 提供 `getTriggerProps(context)`。每行绑定自己的数据，默认插槽据此渲染操作。右键鼠标、Shift+F10 和 ContextMenu 键均可打开；键盘操作以当前触发器左下角定位并聚焦首项，鼠标以指针定位，面板还会增加偏移并避让视口边缘。默认在仍有焦点的编辑区内鼠标右键时保留正文焦点，防止入场结束后光标消失；autoFocus=true 可显式转移焦点。

`context` 类型是 unknown，示例验证字段后再访问。内部会先更新上下文，再发出 `update:context` 和 `context-open`；菜单已打开时右键另一行会就地更新内容。关闭动画结束后上下文清为 null，业务若要长期保留选择结果，应在自己的状态中另存一份。

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingDropDown, BingDropDownItem, type BingDropDownContextOpenPayload } from '@moubing/bing-ui'
import { Copy, FilePlus2, FolderOpen, PenLine, Trash2 } from 'lucide-vue-next'
import '@moubing/bing-ui/style.css'

type Asset = { id: string; name: string; kind: 'folder' | 'image' | 'package' | 'document'; locked: boolean; deletable: boolean }
const assets: Asset[] = [
  { id: 'brand-kit', name: '品牌资源', kind: 'folder', locked: false, deletable: false },
  { id: 'cover-image', name: '首页封面图', kind: 'image', locked: false, deletable: true },
  { id: 'release', name: 'release-candidate.zip', kind: 'package', locked: true, deletable: false },
  { id: 'handoff', name: '交付说明.md', kind: 'document', locked: false, deletable: true },
]
// 插槽、更新事件和 context-open 的 context 类型都是 unknown，先检查再使用。
const context = ref<unknown>(null)
const feedback = ref('等待右键操作')
function asAsset(value: unknown): Asset | null {
  if (typeof value !== 'object' || value === null) return null
  const record = value as Record<string, unknown>
  return typeof record.id === 'string' && typeof record.name === 'string'
    && typeof record.kind === 'string' && ['folder', 'image', 'package', 'document'].includes(record.kind)
    && typeof record.locked === 'boolean' && typeof record.deletable === 'boolean'
    ? record as Asset : null
}
const selected = computed(() => asAsset(context.value)?.name ?? '未选择资源')
function opened(payload: BingDropDownContextOpenPayload) { feedback.value = `右键打开：${asAsset(payload.context)?.name ?? '未知资源'}` }
function action(label: string, value: unknown) { feedback.value = `${label}：${asAsset(value)?.name ?? '未知资源'}（仅本地演示）` }
</script>

<template>
  <BingDropDown v-model:context="context" trigger="contextmenu" min-width="292px" ariaLabel="资源右键菜单" @context-open="opened">
    <template #trigger="{ getTriggerProps }">
      <div class="resources">
        <button v-for="asset in assets" :key="asset.id" type="button" v-bind="getTriggerProps(asset)">{{ asset.name }}</button>
      </div>
    </template>
    <template #default="{ context: current }">
      <BingDropDownItem v-if="asAsset(current)?.kind === 'folder'" title="打开文件夹" :description="asAsset(current)?.name" :icon="FolderOpen" @click="action('打开', current)" />
      <BingDropDownItem v-else title="预览资源" :description="asAsset(current)?.name" :icon="FilePlus2" @click="action('预览', current)" />
      <BingDropDownItem title="重命名" :disabled="asAsset(current)?.locked ?? true" :icon="PenLine" shortcut="F2" @click="action('重命名', current)" />
      <BingDropDownItem title="复制路径" :icon="Copy" shortcut="Ctrl+Shift+C" @click="action('复制路径', current)" />
      <BingDropDownItem title="删除" tone="danger" :disabled="!asAsset(current)?.deletable" :icon="Trash2" shortcut="Del" @click="action('删除', current)" />
    </template>
  </BingDropDown>
  <p role="status">当前上下文：{{ selected }}；{{ feedback }}</p>
</template>

<style scoped>
.resources { display: grid; gap: 8px; max-width: 420px; }
.resources button { padding: 14px; border: 1px solid var(--bing-border); border-radius: 10px; text-align: left; background: transparent; color: inherit; font: inherit; cursor: context-menu; }
</style>
```

## 菜单项能力

BingDropDownItem 支持图标、说明、快捷键、语义色、链接和子菜单。带 `submenu` 的菜单项默认不会点击后关闭，适合继续展开二级操作。

`shortcut` 仅显示键帽，不注册快捷键；`active` 只是当前项的样式和 ARIA 标记，不是选择模型。普通项在 click 回调后自动关闭，设置 `closeOnClick=false` 或对点击事件调用 preventDefault 可保留菜单。preventDefault 还会阻止链接的默认跳转，closeOnClick=false 本身不拦截链接。无需在每个普通菜单项的 click 中再调用 close。

带 submenu 的父项即使 closeOnClick=true 也不会自动关闭。悬停延迟后打开；键盘聚焦本身不展开，ArrowRight 或 Enter 展开并进入首项。子菜单支持上下键、Home/End，ArrowLeft 返回父项；斜向移动到子菜单时保留安全进入区域。

Escape 在子菜单只返回上一层，主菜单关闭并恢复触发器焦点；Dialog 中先关闭菜单。Tab / Shift+Tab 关闭整棵菜单，继续触发器后的或前面的焦点顺序。typeahead 默认开启，可用 textValue 提供拼音或别名；输入框和外部编辑器的文本输入保留原行为。链接 target=\_blank 默认补 noreferrer noopener，disabled 项不能跳转或发出 click。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingDropDown, BingDropDownItem } from '@moubing/bing-ui'
import { Archive, Download, ExternalLink, Link2, Share2, ShieldAlert, Star, Trash2, Upload } from 'lucide-vue-next'
import '@moubing/bing-ui/style.css'

const feedback = ref('等待选择')
function action(value: string) { feedback.value = `已选择：${value}（仅本地演示）` }
</script>

<template>
  <div class="stage">
    <BingDropDown min-width="286px" placement="bottom-start" ariaLabel="资源操作">
      <template #trigger="{ triggerProps }">
        <BingButton v-bind="triggerProps" :throttle="false">资源操作</BingButton>
      </template>
      <BingDropDownItem title="分享" :icon="Share2" :close-on-click="false">
        <template #submenu>
          <BingDropDownItem title="复制链接" description="任何成员可访问" :icon="Link2" @click="action('复制链接')" />
          <BingDropDownItem title="邀请评审" description="仅评论权限" :icon="Share2" @click="action('邀请评审')" />
          <BingDropDownItem title="权限提醒" tone="warning" :icon="ShieldAlert" @click="action('权限提醒')" />
        </template>
      </BingDropDownItem>
      <BingDropDownItem title="下载" description="打包当前资源" :icon="Download" shortcut="Ctrl+D" @click="action('下载')" />
      <BingDropDownItem title="发布" tone="success" :icon="Upload" shortcut="Ctrl+Enter" @click="action('发布')" />
      <BingDropDownItem title="示例链接" description="渲染为 a 标签" :icon="ExternalLink" href="https://example.com" target="_blank" />
      <BingDropDownItem title="已收藏" type="checkbox" checked :icon="Star" @click="action('已收藏')" />
      <BingDropDownItem title="归档" :icon="Archive" disabled @click="action('归档')" />
      <BingDropDownItem title="删除资源" tone="danger" :icon="Trash2" shortcut="Del" @click="action('删除资源')" />
    </BingDropDown>
    <p role="status">{{ feedback }}</p>
  </div>
</template>

<style scoped>
.stage { min-height: 480px; padding: 24px; }
</style>
```

## 受控状态与方法

省略 open 或传 null 使用内部状态；传 boolean 进入受控模式，使用 `v-model:open` 接收更新，不能写成普通 v-model。若没有接收更新，触发器和方法仅发出请求，面板状态不会改变，也不会发出对应的 open/close。

通过 ref 调用 `openPanel()`、`close()`、`toggle()` 和 `focusFirstItem()`。实例在挂载后可用，focusFirstItem 不会自动打开菜单；需要先打开并等待 DOM 更新，或者开启 autoFocus。下方工具栏阻止自身 pointerdown 冒泡，避免外部关闭先发生、随后 toggle 又把菜单打开。

菜单关闭会清理监听器和动画；在 KeepAlive 页面停用时，文档站卸载全部预览实例并清空受控状态，避免 body 中的菜单继续显示。重新进入页面保留配置。没有“全局唯一菜单”保证，多个实例可独立打开。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingDropDown, BingDropDownItem, type BingDropDownExpose } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const open = ref(false)
const dropdown = ref<BingDropDownExpose | null>(null)
const feedback = ref('等待操作')
function record(value: string) { feedback.value = value }
</script>

<template>
  <div class="stage">
    <!-- 控制按钮在菜单外，阻止 pointerdown 冒泡以免先关闭后又切换打开。 -->
    <div class="actions" @pointerdown.stop>
      <BingButton :throttle="false" @click="dropdown?.openPanel()">打开</BingButton>
      <BingButton :throttle="false" @click="dropdown?.close()">关闭</BingButton>
      <BingButton :throttle="false" @click="dropdown?.toggle()">切换</BingButton>
      <BingButton :throttle="false" @click="dropdown?.focusFirstItem()">聚焦第一项</BingButton>
    </div>
    <BingDropDown ref="dropdown" v-model:open="open" min-width="260px" auto-focus ariaLabel="受控菜单"
      @open="record('事件：open')" @close="record('事件：close')">
      <template #trigger="{ triggerProps }">
        <BingButton v-bind="triggerProps" :throttle="false">更多发布操作</BingButton>
      </template>
      <BingDropDownItem title="发布当前版本" tone="success" @click="record('选择：发布当前版本')" />
      <BingDropDownItem title="生成变更记录" @click="record('选择：生成变更记录')" />
      <BingDropDownItem title="复制 npm 命令" @click="record('选择：复制 npm 命令')" />
      <BingDropDownItem title="删除草稿" tone="danger" @click="record('选择：删除草稿')" />
    </BingDropDown>
    <p role="status">状态：{{ open ? '已打开' : '已关闭' }}；{{ feedback }}</p>
  </div>
</template>

<style scoped>
.stage { min-height: 340px; padding: 24px; }
.actions { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
</style>
```

## 光标锚点与局部视口（0.15.0）

`anchor` 接收真实元素或带 `getBoundingClientRect()` 的虚拟对象，矩形使用客户端视口坐标。可用于光标、文字选区或画布命中区域；无需添加隐藏触发器或合成右键事件。`boundary` 指定主菜单的可用区域，组件与窗口取交集，留出 12px 边距并限制宽高，空间不足时翻到上方，过长选项在 BingScrollbar 内滚动。子菜单仍按窗口定位。

业务通过 `v-model:open` 控制显示；替换锚点对象或窗口滚动/resize 会重测。默认不抢输入焦点，输入型菜单可在内容容器上使用 `@mousedown.prevent`，自行处理方向键、Enter/Tab 和输入法，使用 Item 的 `active` 标记当前项。当前项变化仅滚动菜单内部，不调用页面的 scrollIntoView。锚点滚出业务区域、编辑器隐藏或进入只读时由业务关闭菜单。

```vue
<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { BingDropDown, BingDropDownItem } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const boundary = shallowRef<HTMLElement>()
const anchor = shallowRef<{ getBoundingClientRect: () => DOMRect }>()
const open = ref(false)
const selected = ref('尚未选择')
function show(event: MouseEvent) {
  const rect = new DOMRect(event.clientX, event.clientY, 1, 20)
  anchor.value = { getBoundingClientRect: () => rect }
  open.value = true
}
</script>

<template>
  <div ref="boundary" class="caret-stage" @click="show">
    <p>点击区域内任意位置，按矩形锚点打开菜单；靠近底部时向上展开。</p>
    <BingDropDown v-model:open="open" :anchor="anchor" :boundary="boundary" :width="280" :min-width="0" ariaLabel="虚拟锚点菜单">
      <div @mousedown.prevent>
        <BingDropDownItem v-for="index in 16" :key="index" :title="`块命令 ${index}`" shortcut="Enter" @click="selected = `块命令 ${index}`" />
      </div>
    </BingDropDown>
  </div>
  <p role="status">{{ selected }}</p>
</template>

<style scoped>
.caret-stage { height: 360px; padding: 16px; border: 1px dashed var(--bing-border); border-radius: 8px; }
</style>
```

## 分组、勾选与滑动高亮

BingDropDownGroup 使用 label 或 label 插槽标注分组，BingDropDownDivider 提供分隔线。业务当前值使用 type="radio" 与 checked，开关使用 checkbox；点击后由业务更新值。active 继续表示导航高亮，外部编辑器命令菜单保留它，不应转成选中态。highlightMotion 可选 slide；所有面板使用 BingScrollbar 并受可用尺寸约束。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingDropDown, BingDropDownDivider, BingDropDownGroup, BingDropDownItem } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const view = ref('列表')
const hidden = ref(false)
</script>

<template>
  <BingDropDown highlight-motion="slide" ariaLabel="视图设置">
    <template #trigger="{ triggerProps }"><BingButton v-bind="triggerProps" variant="secondary">视图设置</BingButton></template>
    <BingDropDownGroup label="排列方式">
      <BingDropDownItem v-for="item in ['列表', '看板']" :key="item" :title="item" type="radio" :checked="view === item" :text-value="item === '列表' ? 'liebiao' : 'kanban'" :close-on-click="false" @click="view = item" />
    </BingDropDownGroup>
    <BingDropDownDivider />
    <BingDropDownGroup label="显示内容">
      <BingDropDownItem title="显示归档" type="checkbox" :checked="hidden" :close-on-click="false" @click="hidden = !hidden" />
    </BingDropDownGroup>
  </BingDropDown>
  <p role="status">{{ view }}；归档：{{ hidden ? '显示' : '隐藏' }}</p>
</template>
```

## 属性

| 属性                | 类型                                    | 默认值                                    | 说明                                                                                           |
| ----------------- | ------------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------- |
| `hoverOpenDelay`  | `number`                              | `80`                                   | 主菜单悬停打开延迟，单位毫秒；子菜单独立等待 100ms，防止掠过误开。                                                         |
| `hoverCloseDelay` | `number`                              | `110`                                  | 悬停离开关闭延迟，单位毫秒；向子菜单斜向移动时保留进入机会。                                                               |
| `typeahead`       | `boolean`                             | `true`                                 | 菜单项聚焦时按文字前缀定位；自定义输入框的按键不拦截。外部编辑器管理键盘时可关闭。                                                    |
| `highlightMotion` | `BingDropDownHighlightMotion`         | `'liquid'`                             | 菜单高亮使用 liquid 或 slide；减少动态效果时直接更新。                                                           |
| `open`            | `boolean \| null`                     | `null`                                 | 控制菜单打开状态。null 表示内部自管理，boolean 表示受控模式。                                                        |
| `context`         | `unknown \| null`                     | `undefined（内部为 null）`                  | 上下文数据；内部会立即更新，再发送 update:context。关闭动画结束后清为 null。                                             |
| `trigger`         | `'click' \| 'hover' \| 'contextmenu'` | `'click'`                              | 触发方式。contextmenu 需要使用 getTriggerProps(context)。                                              |
| `placement`       | `BingDropDownPlacement`               | `'bottom-start'`                       | 面板相对锚点的方向和对齐方式。bottom/top 的 end 右边缘对齐，left/right 的 end 底边对齐；空间不足时翻转或避让边缘。                    |
| `anchor`          | `BingDropDownAnchor \| null`          | `undefined`                            | 0.15.0：真实元素或提供 getBoundingClientRect() 的虚拟锚点，优先于根节点/右键坐标。返回客户端视口矩形；替换对象、滚动或 resize 后重新定位。    |
| `boundary`        | `BingDropDownAnchor \| null`          | `undefined`                            | 0.15.0：菜单可用区域，与窗口取交集、四周留 12px；限制宽度和高度，空间不足时翻转，选项通过 BingScrollbar 滚动。仅限制主菜单，不限制 Teleport 子菜单。 |
| `size`            | `'sm' \| 'md' \| 'lg'`                | `undefined（继承 ConfigProvider，否则 'md'）` | 菜单项最小高度 sm/md/lg 为 28/32/36px；说明等额外内容可增高。                                                    |
| `width`           | `string \| number`                    | `undefined`                            | 面板固定宽度，数字会转成 px。                                                                             |
| `minWidth`        | `string \| number`                    | `undefined`                            | 面板最小宽度，数字会转成 px；主题回退为 220px，内部 body 不再强制 264px 最小宽度。                                         |
| `maxWidth`        | `string \| number`                    | `undefined`                            | 默认最大 380px；与 minWidth、width 一起受可用区域限制，长内容在 BingScrollbar 中滚动。                                |
| `panelClass`      | `string`                              | `undefined`                            | 追加到浮层面板上的 class，适合局部覆盖菜单宽度、阴影或内部间距。                                                          |
| `block`           | `boolean`                             | `false`                                | 根节点是否撑满父容器。                                                                                  |
| `closeOnOutside`  | `boolean`                             | `true`                                 | 外部 pointerdown 是否请求关闭；同一菜单的子菜单也算内部。                                                          |
| `closeOnEscape`   | `boolean`                             | `true`                                 | 按 Escape 时是否关闭。                                                                              |
| `autoFocus`       | `boolean`                             | `false`                                | 开启后聚焦第一项。方向键、键盘右键及普通区域右键会主动聚焦；默认在编辑区鼠标右键时保留输入焦点。                                             |
| `loop`            | `boolean`                             | `true`                                 | 当前菜单上下键到边界时循环；跳过 disabled 项。                                                                 |
| `ariaLabel`       | `string`                              | `'下拉菜单'`                               | 传给菜单面板的可访问名称。                                                                                |
| `glass`           | `boolean`                             | `true`                                 | 是否开启玻璃效果。                                                                                    |
| `glassBlur`       | `string \| number`                    | `undefined（主题默认 16）`                   | 玻璃模糊强度；数字转换为 px。                                                                             |
| `glassOpacity`    | `number`                              | `undefined（浅色 0.86 / 深色 0.92）`         | 玻璃底色不透明度。                                                                                    |
| `glassSaturation` | `number`                              | `undefined（主题默认 1.05）`                 | 玻璃饱和度。                                                                                       |

## DropDownItem 属性

| 属性             | 类型                                                                            | 默认值         | 说明                                                                                |
| -------------- | ----------------------------------------------------------------------------- | ----------- | --------------------------------------------------------------------------------- |
| `type`         | `BingDropDownItemType`                                                        | `'item'`    | item 普通操作；radio 互斥当前值；checkbox 开关。选中值由业务维护。                                       |
| `checked`      | `boolean`                                                                     | `false`     | radio / checkbox 的选中状态及 aria-checked；点击只通知业务，不自动修改。                               |
| `textValue`    | `string`                                                                      | `undefined` | 前缀匹配文本，默认 title；可填写拼音或别名。                                                         |
| `title`        | `string`                                                                      | `undefined` | 菜单项主标题，也可以直接用默认插槽替代。                                                              |
| `description`  | `string`                                                                      | `undefined` | 菜单项辅助说明。                                                                          |
| `shortcut`     | `string \| string[]`                                                          | `undefined` | 用键帽展示快捷键；不注册快捷键操作。                                                                |
| `icon`         | `Component`                                                                   | `undefined` | 左侧图标组件。                                                                           |
| `href`         | `string`                                                                      | `undefined` | 存在 href 且未禁用时，菜单项会渲染为链接。                                                          |
| `target`       | `string`                                                                      | `undefined` | 链接打开方式。                                                                           |
| `rel`          | `string`                                                                      | `undefined` | 链接 rel；target 为 \_blank 时默认补 noreferrer noopener。                                 |
| `tone`         | `'default' \| 'primary' \| 'secondary' \| 'danger' \| 'success' \| 'warning'` | `'default'` | 菜单项语义色。                                                                           |
| `disabled`     | `boolean`                                                                     | `false`     | 禁用菜单项。                                                                            |
| `active`       | `boolean`                                                                     | `false`     | 样式与 aria-current 标记；不维护选中模型。0.15.0 起指定 boundary 时，当前项变化会在菜单内部滚动揭示，不移动输入焦点。        |
| `closeOnClick` | `boolean`                                                                     | `undefined` | 无子菜单时默认关闭，false 保留；click 中 preventDefault 也可阻止自动关闭。当前有 submenu 时即使传 true 也不会自动关闭。 |
| `ariaLabel`    | `string`                                                                      | `undefined` | 菜单项可访问名称。                                                                         |

## 插槽、事件与方法

### 插槽

| 插槽                                  | 参数                                                                           | 说明                                                          |
| ----------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `BingDropDownGroup.default / label` | `-`                                                                          | 默认插槽包含菜单项；label 插槽替代同名 label 属性，提供可访问分组标题。                  |
| `BingDropDownDivider`               | `-`                                                                          | 分隔线组件，无业务属性或插槽，渲染 separator。                                |
| `trigger`                           | `{ open, context, triggerProps, getTriggerProps, openPanel, close, toggle }` | 渲染触发器。普通模式直接绑定 triggerProps；右键菜单用 getTriggerProps(context)。 |
| `default`                           | `{ context: unknown; close: (restoreFocus?: boolean) => void }`              | 渲染菜单内容；context 先做类型检查。close(true) 可请求恢复最近记录的触发器焦点。          |
| `header`                            | `-`                                                                          | 面板头部区域。                                                     |
| `footer`                            | `-`                                                                          | 面板底部区域。                                                     |
| `BingDropDownItem.default`          | `-`                                                                          | 替代 title 属性展示标题内容。                                          |
| `BingDropDownItem.prefix`           | `-`                                                                          | 自定义菜单项左侧内容。                                                 |
| `BingDropDownItem.description`      | `-`                                                                          | 自定义菜单项说明。                                                   |
| `BingDropDownItem.suffix`           | `-`                                                                          | 自定义菜单项右侧内容。                                                 |
| `BingDropDownItem.submenu`          | `-`                                                                          | 渲染子菜单内容。                                                    |

### 事件

| 事件                       | 参数                               | 说明                                                                |
| ------------------------ | -------------------------------- | ----------------------------------------------------------------- |
| `update:open`            | `boolean`                        | 组件请求改变状态时触发；受控模式需接收更新。外部直接修改 open 不补发。                            |
| `update:context`         | `unknown \| null`                | 右键打开或换目标时发出；关闭动画完成后非空上下文会再更新为 null。                               |
| `open`                   | `-`                              | 有效打开状态从 false 变为 true 时触发；初始 open=true 不发出初次 open。                |
| `close`                  | `-`                              | 有效打开状态从 true 变为 false 时触发，早于关闭动画结束。                               |
| `context-open`           | `BingDropDownContextOpenPayload` | 每次右键或键盘右键打开时触发，包含事件、上下文及原始 clientX/clientY 或触发器左下角坐标；实际面板还会偏移和避让。 |
| `after-enter`            | `-`                              | 打开动画结束后触发。                                                        |
| `after-leave`            | `-`                              | 关闭动画结束后触发。                                                        |
| `BingDropDownItem.click` | `MouseEvent`                     | 未禁用时点击触发，先于自动关闭；只通知业务，不自动执行同名操作。                                  |

### 暴露方法

| 方法                 | 说明                                                      |
| ------------------ | ------------------------------------------------------- |
| `openPanel()`      | 打开面板。                                                   |
| `close()`          | 关闭面板。                                                   |
| `toggle()`         | 切换打开状态。                                                 |
| `focusFirstItem()` | 聚焦已挂载主菜单的第一个启用项；不负责打开，方法打开后等 nextTick 再调用或使用 autoFocus。 |

## 公开类型

以下类型都从 `@moubing/bing-ui` 根入口导入，无需引用包内私有路径。trigger 插槽的 close 与 default 插槽一致，可传 restoreFocus；公开实例类型的 close 只声明无参调用。

| 类型                                          | 说明                                                                                                                                          |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `BingDropDownHighlightMotion`               | 'liquid' \| 'slide'。                                                                                                                        |
| `BingDropDownItemType`                      | 'item' \| 'radio' \| 'checkbox'。                                                                                                            |
| `BingDropDownGroupProps`                    | \{ label?: string \}，组名也可用 label 插槽；默认插槽放置菜单项。                                                                                              |
| `BingDropDownAnchor`                        | 0.15.0：\{ getBoundingClientRect: () =\> Pick\<DOMRect, "top" \| "right" \| "bottom" \| "left" \| "width" \| "height"\> \}，可直接传 HTMLElement。 |
| `BingDropDownPlacement`                     | bottom-start \| bottom-end \| top-start \| top-end \| left-start \| left-end \| right-start \| right-end。                                   |
| `BingDropDownSize`                          | sm \| md \| lg。                                                                                                                             |
| `BingDropDownTrigger`                       | click \| hover \| contextmenu。                                                                                                              |
| `BingDropDownItemTone`                      | default \| primary \| secondary \| danger \| success \| warning。                                                                            |
| `BingDropDownProps / BingDropDownItemProps` | 菜单与菜单项属性类型。                                                                                                                                 |
| `BingDropDownEmits / BingDropDownItemEmits` | 菜单与菜单项事件载荷元组。                                                                                                                               |
| `BingDropDownExpose`                        | 公开实例方法；其中 close 类型为 () =\> void。                                                                                                            |
| `BingDropDownContextOpenPayload`            | \{ event: MouseEvent \| KeyboardEvent; context: unknown \| null; x: number; y: number \}。                                                   |
