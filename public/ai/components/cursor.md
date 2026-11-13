# BingCursor

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export cursor；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。五个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

示例自带控件与样式，局部光标只影响演示区；全局示例默认关闭并在缓存页面停用时卸载。元素 data-bing-cursor 不是组件属性。图片由浏览器原生绘制，不提供跟随层、形变或自定义 cursor 插槽；控件仍需真实语义、焦点与可访问名称。

BingCursor 提供 16 种内置光标外观，通过 CSS cursor 交给浏览器原生绘制。鼠标位置由浏览器更新，组件只在状态、作用域或外观变化时切换图片，不创建随鼠标移动的 DOM 层。默认仅作用于包裹的内容。

0.7.0 移除了 DOM 跟随、连续形变与自定义 cursor 插槽。旧项目请参考[升级指南](/docs/upgrade#cursor)，删除 mode、followDuration、transitionDuration、zIndex 和 data-bing-cursor-label 等旧用法。

## 自动识别

默认 type=auto 会读取元素的 CSS cursor，并结合输入框、链接、禁用等语义解析状态。下面的按钮可以正常点击，输入框和 contenteditable 正文可以正常编辑；抓取区域只展示按压反馈，不实现拖拽功能。

鼠标进入作用域后接管光标；触摸或笔输入不接管。按 Tab 或 Escape 会暂停接管，下一次鼠标输入可恢复。组件不拦截点击，也不代替控件原有的名称与焦点反馈。

```vue
<script setup lang="ts">
import { onActivated, onDeactivated, ref } from 'vue'
import { BingButton, BingCursor, BingInput, type BingCursorType } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const mounted = ref(true)
const count = ref(0)
const text = ref('可正常输入')
const type = ref<BingCursorType>('default')
const visible = ref(false)
const longDocument = ref(false)
onActivated(() => { mounted.value = true })
onDeactivated(() => { mounted.value = false })
</script>

<template>
  <BingCursor v-if="mounted" @change="type = $event" @visibility-change="visible = $event">
    <div class="cursor-basic-zone">
      <div class="row">
        <BingButton @click="count++">点击计数：{{ count }}</BingButton>
        <BingButton disabled>禁用按钮</BingButton>
      </div>
      <BingInput :model-value="text" @update:model-value="text = String($event)" ariaLabel="光标示例输入" block />
      <BingButton :throttle="false" @click="longDocument = !longDocument">{{ longDocument ? '收起长正文' : '展开长正文' }}</BingButton>
      <div class="tile editable" :class="{ 'editable--long': longDocument }" contenteditable="true" role="textbox" aria-label="可编辑正文" aria-multiline="true">
        <p>这里可以直接编辑文字。</p>
        <a href="#overview">移到链接查看手形光标</a>
        <template v-if="longDocument">
          <template v-for="line in 100" :key="line">
            <p>第 {{ line }} 段：滚动时可继续选择、复制和编辑正文。</p>
            <div v-if="line % 5 === 0" contenteditable="false"><button class="image-control" v-bind="{ 'data-bing-cursor': 'zoom-in' }">图片交互区域</button></div>
          </template>
        </template>
      </div>
      <div class="tile" v-bind="{ 'data-bing-cursor': 'grab' }">按住鼠标主键观察抓取状态</div>
      <div class="tile" v-bind="{ 'data-bing-cursor': 'native' }">原生光标区域</div>
    </div>
  </BingCursor>
  <p class="feedback" role="status">光标：{{ type }}；显示：{{ visible ? '是' : '否' }}</p>
</template>

<style scoped>
.cursor-basic-zone { display: grid; gap: 16px; width: 100%; }
.row { display: flex; flex-wrap: wrap; gap: 12px; }
.tile { padding: 20px; border: 1px dashed var(--bing-border); border-radius: 8px; background: var(--bing-surface-soft); }
.editable p { margin: 0 0 8px; }
.editable--long { max-height: 260px; overflow: auto; }
.image-control { width: 240px; max-width: 100%; height: 100px; margin-block: 12px; border: 1px solid var(--bing-border); background: var(--bing-surface-soft); color: var(--bing-text); cursor: zoom-in; }
.editable a { cursor: pointer; color: var(--bing-text); text-decoration: underline; }
.feedback { margin: 16px 0 0; color: var(--bing-text-secondary); font-size: 14px; }
</style>
```

## 16 种状态

在不同状态之间直接切换内置图片，不附加移动延迟或形变动画。图片按类型、尺寸和配色缓存，相同外观可以复用。系统开启减少动态效果时，这些静态光标仍然可用。

有效的 data-bing-cursor 声明优先于固定 type；disabled、aria-disabled=true 和 inert 等禁用语义仍优先。grab 在主键按下时变成 grabbing。该判断不改变控件本身的可用性。

native、cursor:none 及原生控件排除规则先于状态覆盖。auto 遇到 wait、progress、图片光标等未内置 CSS 状态会保留原有光标。CSS 方向别名会归并，例如 n/s-resize 到 ns-resize、all-scroll 到 move。

```vue
<script setup lang="ts">
import { onActivated, onDeactivated, ref } from 'vue'
import { BingCursor, BingInput, BingSelect, type BingCursorType } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const mounted = ref(true)
const fixedType = ref<BingCursorType | 'auto'>('auto')
const size = ref(28)
const types: BingCursorType[] = ['default', 'pointer', 'not-allowed', 'text', 'grab', 'grabbing', 'move', 'crosshair', 'col-resize', 'row-resize', 'ew-resize', 'ns-resize', 'nwse-resize', 'nesw-resize', 'zoom-in', 'zoom-out']
const choices = ['auto', ...types].map(value => ({ label: value, value }))
onActivated(() => { mounted.value = true })
onDeactivated(() => { mounted.value = false })
</script>

<template>
  <div class="controls">
    <label>固定类型<BingSelect :model-value="fixedType" :options="choices" :clearable="false" ariaLabel="固定光标类型" @update:model-value="fixedType = $event as BingCursorType | 'auto'" /></label>
    <label>尺寸（px）<BingInput :model-value="size" type="number" block :min="8" :max="128" ariaLabel="光标尺寸" @update:model-value="size = Number($event)" /></label>
  </div>
  <BingCursor v-if="mounted" :type="fixedType" :size="size">
    <div class="fixed-zone">固定状态体验区：{{ fixedType }}</div>
    <div class="states">
      <div v-for="type in types" :key="type" class="state" v-bind="{ 'data-bing-cursor': type }">{{ type }}</div>
    </div>
  </BingCursor>
  <p>在方格之间移动查看光标状态；方格的显式状态优先于固定类型，图片由浏览器直接切换。</p>
</template>

<style scoped>
.controls { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; }
.controls label { display: grid; gap: 8px; font-size: 14px; }
.fixed-zone { margin: 16px 0; padding: 24px 16px; background: var(--bing-surface-soft); border-radius: 8px; }
.states { display: grid; grid-template-columns: repeat(auto-fit, minmax(126px, 1fr)); gap: 8px; }
.state { border: 1px solid var(--bing-border); border-radius: 6px; padding: 18px 12px; font-size: 14px; }
p { color: var(--bing-text-secondary); font-size: 14px; line-height: 1.6; }
</style>
```

## 配色、尺寸与热点

color、outlineColor 和 size 调整内置图片外观。也可在祖先元素设置 --bing-cursor-color 与 --bing-cursor-outline；局部实例会继承这些变量，无需将配色提升到 body。

hotspot 是图片内部真正对应点击位置的坐标。通常保留各状态的默认热点；自定义时坐标会取整并限制在画布内。光标尺寸限制在 8–128px，浏览器自身还可能限制图片尺寸或在窗口边缘使用系统光标。

```vue
<script setup lang="ts">
import { onActivated, onDeactivated, ref } from 'vue'
import { BingButton, BingCursor, BingInput } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const mounted = ref(true)
const color = ref('#2563eb')
const outline = ref('#ffffff')
const size = ref(36)
const customHotspot = ref(false)
const count = ref(0)
onActivated(() => { mounted.value = true })
onDeactivated(() => { mounted.value = false })
</script>

<template>
  <div class="controls">
    <label>主体色<input v-model="color" type="color" aria-label="光标主体色" /></label>
    <label>描边色<input v-model="outline" type="color" aria-label="光标描边色" /></label>
    <label>尺寸（px）<BingInput :model-value="size" type="number" :min="8" :max="128" ariaLabel="外观光标尺寸" block @update:model-value="size = Number($event)" /></label>
    <BingButton @click="customHotspot = !customHotspot">{{ customHotspot ? '恢复默认热点' : '使用热点 [8, 8]' }}</BingButton>
  </div>
  <BingCursor v-if="mounted" :color="color" :outline-color="outline" :size="size" :hotspot="customHotspot ? [8, 8] : undefined">
    <div class="appearance-zone">
      <BingButton @click="count++">测试点击：{{ count }}</BingButton>
      <div class="appearance-target" v-bind="{ 'data-bing-cursor': 'zoom-in' }">移动到此处查看放大光标</div>
    </div>
  </BingCursor>
  <p>热点是图片中对应点击位置的坐标，通常使用内置默认值。尺寸或颜色变化后无需重新挂载组件。</p>
</template>

<style scoped>
.controls { display: flex; flex-wrap: wrap; gap: 16px; align-items: end; }
.controls label { display: grid; gap: 8px; max-width: 180px; font-size: 14px; }
input[type="color"] { width: 56px; height: 36px; padding: 3px; border: 1px solid var(--bing-border); border-radius: 6px; background: var(--bing-surface-solid); }
.appearance-zone { display: grid; gap: 16px; margin-top: 16px; }
.appearance-zone .bing-button { justify-self: start; }
.appearance-target { padding: 24px; border: 1px dashed var(--bing-border); border-radius: 8px; }
p { color: var(--bing-text-secondary); font-size: 14px; line-height: 1.6; }
</style>
```

## 停用与系统光标

disabled 停用整个实例；data-bing-cursor=native 只让指定区域使用原本的 CSS 光标。auto 模式遇到 wait 等不支持的状态时会自动保留它。每个图片光标同时提供同语义的系统关键字，图片被浏览器或 CSP 拒绝时可以回退。

```vue
<script setup lang="ts">
import { onActivated, onDeactivated, ref } from 'vue'
import { BingButton, BingCursor } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const mounted = ref(true)
const disabled = ref(false)
const visible = ref(false)
onActivated(() => { mounted.value = true })
onDeactivated(() => { mounted.value = false })
</script>

<template>
  <BingButton @click="disabled = !disabled">{{ disabled ? '启用光标' : '停用光标' }}</BingButton>
  <BingCursor v-if="mounted" :disabled="disabled" @visibility-change="visible = $event">
    <div class="native-zones">
      <div class="native-zone themed">十字光标：使用 BingCursor 外观</div>
      <div class="native-zone system" v-bind="{ 'data-bing-cursor': 'native' }">系统十字：显式保留原本的 CSS cursor</div>
      <div class="native-zone busy">忙碌光标：auto 保留未内置的 wait 状态</div>
    </div>
  </BingCursor>
  <p role="status">当前由 BingCursor 接管：{{ visible ? '是' : '否' }}。停用后仍可正常移动鼠标与点击。</p>
</template>

<style scoped>
.native-zones { display: grid; gap: 12px; margin-top: 16px; }
.native-zone { padding: 24px; border: 1px dashed var(--bing-border); border-radius: 8px; background: var(--bing-surface-soft); }
.themed, .system { cursor: crosshair; }
.busy { cursor: wait; }
p { color: var(--bing-text-secondary); font-size: 14px; line-height: 1.6; }
</style>
```

## 全局与局部作用域

global=false 仅匹配默认插槽的 DOM 后代，根节点使用 display:contents，不产生额外布局盒。global=true 覆盖当前文档，可以在应用根部放一个无默认插槽的实例。局部优先于全局，嵌套局部以内层优先；同一位置只由一个有效实例接管，多个全局实例以后注册的为准。

长文档可以在应用根部复用一个全局实例，无需为每个段落、图片或列表项挂载 Cursor。global 描述接管范围，不承诺未被鼠标命中的元素也具有相同的计算样式；不要依赖内部标记或读取祖先的 cursor 判断当前鼠标外观。

局部范围按实际 DOM 判断。Teleport 到 body 的 Dialog 或下拉面板不自动属于局部实例；可在弹层内容中另包局部实例，或让全局实例接管。global 不跨 iframe 文档。文档站默认使用系统光标；下面的全局开关仅用于演示，默认关闭，离开页面后自动关闭。

```vue
<script setup lang="ts">
import { onActivated, onDeactivated, ref } from 'vue'
import { BingButton, BingCursor, BingDialog, BingInput } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const mounted = ref(true)
const globalEnabled = ref(false)
const open = ref(false)
const text = ref('Teleport 内容')
onActivated(() => { mounted.value = true })
onDeactivated(() => { globalEnabled.value = false; open.value = false; mounted.value = false })
</script>

<template>
  <BingButton @click="globalEnabled = !globalEnabled">{{ globalEnabled ? '关闭全局光标' : '开启全局光标' }}</BingButton>
  <p role="status">全局光标：{{ globalEnabled ? '已开启，离开页面时关闭' : '已关闭' }}</p>
  <BingCursor v-if="mounted && globalEnabled" global :size="28" />
  <p>混排长页面可复用一个全局实例，无需为每个段落或图片重复挂载。</p>
  <BingCursor v-if="mounted" type="crosshair" :size="36">
    <div class="local-zone">
      <p>外层局部：十字，36px</p>
      <BingCursor type="zoom-in" :size="44"><div class="inner-zone">内层局部：放大，44px</div></BingCursor>
      <BingButton @click="open = true">打开作用域弹窗</BingButton>
      <BingDialog v-model="open" title="Teleport 作用域" :show-footer="false">
        <p>弹窗在 body 下，局部光标不自动覆盖它。开启全局光标后，可在这里观察文本状态。</p>
        <BingInput :model-value="text" @update:model-value="text = String($event)" ariaLabel="弹窗中的光标输入" block />
      </BingDialog>
    </div>
  </BingCursor>
  <div class="outside-zone">局部作用域之外；只受已启用的全局光标影响。</div>
</template>

<style scoped>
.local-zone { display: grid; gap: 16px; padding: 20px; border: 1px solid var(--bing-border); border-radius: 8px; }
.local-zone .bing-button { justify-self: start; }
.inner-zone { padding: 24px 16px; background: var(--bing-surface-soft); border: 1px dashed var(--bing-border); border-radius: 6px; }
.outside-zone { padding: 20px 0; color: var(--bing-text-secondary); }
p { margin: 16px 0; font-size: 14px; line-height: 1.6; }
</style>
```

## 原生边界与清理

iframe、开放的 Shadow DOM 宿主、原生 select、video/audio、原生 dialog 与 popover、滚动条、原生 HTML 拖放等场景保留原有行为；封闭 Shadow DOM 无法自动识别，应在宿主显式设置 native。强制颜色模式、触摸/笔输入或设备不支持精确悬停指针时不接管。

自动读取 CSS 状态需要样式表可被浏览器读取。跨域 CSSOM 无法读取时，可用 data-bing-cursor 指定支持的状态。窗口失焦、离开文档、页面隐藏、改变窗口尺寸、禁用或卸载都会停止接管；指针捕获期间保持捕获控件的语义。

**0.9.3 性能修复：** 0.9.1 的全局模式在形状变化时修改覆盖整页的 CSS 规则，长文档滚动经过文本和图片时可能反复重算全页样式。新版预生成 16 种状态，普通区域仅标记命中元素及捕获控件；contenteditable 区域将光标标记留在编辑根节点，并用悬停规则匹配内容，避免触发 ProseMirror 重建段落。常规状态切换不改写样式表；配色、尺寸或热点变化时重建实例样式。公开 API、图片外观与接管优先级不变。0.9.2 的编辑区处理存在上述兼容问题，富文本应用应直接升级至 0.9.3。

**0.11.1 性能补丁：** 全部实例停用时不再执行滚动命中、CSSOM 扫描或帧调度。编辑区 auto 模式用稳定的根标记及样式源镜像处理文字、链接、图片控件和禁用状态，沿悬停路径解析各元素的光标；普通状态切换不再不断更新编辑根属性，也不通过关系选择器扫描悬停后代。编辑器切到只读后仍保护正文 DOM，段落、表格及 NodeView 内容不写入光标属性。行内 cursor、CSS 变量解析出的特殊值、固定 type 及指针按压/捕获保留既有根映射路径，优先保证语义与兼容性。公开属性和事件不变。

自动识别示例可展开长正文，直接检查滚动、文字编辑和图片控件的状态切换。自定义指针始终由浏览器绘制，测试中读到的 rAF 时间不能视为屏幕最终呈现时间。

最后一个实例卸载后移除共享监听、观察器及注入样式，恢复原先保存的属性。KeepAlive 只停用而不卸载子组件时，业务应显式停用或卸载 Cursor；本页独立示例使用 onActivated/onDeactivated 管理挂载，全局示例同时重置开关和弹窗。

组件没有公开实例方法。不要把内部 DOM、私有 CSS 变量或控制器当作公共 API。

## 属性

| 属性             | 类型                          | 默认值         | 说明                                                                  |
| -------------- | --------------------------- | ----------- | ------------------------------------------------------------------- |
| `type`         | `BingCursorType \| 'auto'`  | `'auto'`    | 自动读取 CSS cursor 与交互语义，或固定状态；有效 data-bing-cursor 覆盖固定值，禁用语义优先。       |
| `global`       | `boolean`                   | `false`     | false 仅包含默认插槽的 DOM 后代；true 可接管当前文档中的命中元素。作用域不代表所有后代的计算样式都会改变。       |
| `disabled`     | `boolean`                   | `false`     | 停用该实例并恢复系统光标；有其他有效实例时可由其接管。全部停用后不调度命中测试或 CSS 扫描。                    |
| `size`         | `number`                    | `28`        | 光标图片尺寸，px；有限数取整并限制到 8–128，非有限数回退 28。浏览器可能有额外的图片尺寸限制。                |
| `color`        | `string`                    | `undefined` | 主体颜色；支持 CSS 颜色及变量，未传入时继承 --bing-cursor-color，最终回退 #171717。          |
| `outlineColor` | `string`                    | `undefined` | 外描边颜色；未传入时继承 --bing-cursor-outline，最终回退 #ffffff。                    |
| `hotspot`      | `readonly [number, number]` | `undefined` | 图片中的点击热点，相对于图片左上角，单位 px。默认按 size 缩放各状态的内置热点；自定义坐标取整并限制在画布内，非有限数按 0。 |

## 插槽

| 插槽        | 参数  | 说明                                                  |
| --------- | --- | --------------------------------------------------- |
| `default` | `-` | 局部作用域内容；根节点 display: contents，不增加布局盒。global 可不提供内容。 |

## 事件

| 事件                  | 参数                     | 说明                                                        |
| ------------------- | ---------------------- | --------------------------------------------------------- |
| `change`            | `type: BingCursorType` | 解析后的类型变化时发送；不逐次发送鼠标移动事件，首次 default 不一定发送。                 |
| `visibility-change` | `visible: boolean`     | 组件开始或停止接管光标时发送；模板使用 @visibility-change。不是浏览器已成功解码图片的确认事件。 |

## 元素属性

| HTML 属性            | 值                            | 说明                                                        |
| ------------------ | ---------------------------- | --------------------------------------------------------- |
| `data-bing-cursor` | `BingCursorType \| 'native'` | 当前元素或最近祖先的声明。native 保留该元素原本的 CSS 光标；不是 BingCursor 的 prop。 |

## 公开类型

所有公开类型从 @moubing/bing-ui 导入。

| 公开类型              | 定义或用途                                                                                                                                                                                          |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BingCursorType`  | default \| pointer \| not-allowed \| text \| grab \| grabbing \| move \| crosshair \| col-resize \| row-resize \| ew-resize \| ns-resize \| nwse-resize \| nesw-resize \| zoom-in \| zoom-out。 |
| `BingCursorProps` | 上表中的 7 个可选属性。                                                                                                                                                                                  |
| `BingCursorSlots` | 仅声明 default 插槽。                                                                                                                                                                                |
| `BingCursorEmits` | change 与 visibility-change 事件载荷元组。                                                                                                                                                             |
