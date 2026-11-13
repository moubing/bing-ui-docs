# BingSelect

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export select；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。七个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

options 是示例参数，所有选项数据与事件处理器完整内置。模型使用原始 value，搜索是本地筛选；全选只作用于当前可选结果。虚拟行高和磨砂参数默认随尺寸及主题变化，listbox/option ID 按实例唯一生成。面板位置类型从公开 Props 推导。

BingSelect 是选择器组件，用于单选、多选、搜索筛选和大量选项选择。它内置清除、全选、默认 Tag 展示、键盘导航、选项详情浮层和虚拟列表，适合表单、筛选器和配置面板。

## 基础配置

通过 `options` 提供选项，使用 `v-model` 绑定选中值。`size`、`searchable`、`status` 和 `clearable`是最常用的配置。

示例中的 options 是演示配置。值使用严格相等比较；单选空值为 null，多选空值为 。未知模型值不会自动清除，显示与 change.options 只包含能在选项表中找到的项。请保证每个 value 唯一，业务负责同步 v-model。

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingSelect } from '@moubing/bing-ui'
import type { BingSelectModelValue, BingSelectOption, BingSelectProps } from '@moubing/bing-ui'

type ExampleOptions = Pick<BingSelectProps, 'placeholder' | 'size' | 'searchable' | 'typeahead' | 'highlightMatches' | 'status' | 'clearable' | 'block' | 'glass' | 'disabled'>
const options: ExampleOptions = {
  "placeholder": "请选择城市",
  "size": "md",
  "searchable": "auto",
  "typeahead": true,
  "highlightMatches": true,
  "status": "default",
  "clearable": true,
  "block": true,
  "glass": true,
  "disabled": false
}

const cityOptions: BingSelectOption[] = [
  {
    label: '上海',
    value: 'shanghai',
    description: '华东业务中心',
    detail: '适合放置销售、交付和活动运营团队。',
    meta: {
      区域: '华东',
      等级: '核心',
    },
  },
  {
    label: '深圳',
    value: 'shenzhen',
    description: '产品与研发中心',
    detail: '适合放置研发、设计和增长团队。',
    meta: {
      区域: '华南',
      等级: '核心',
    },
  },
  {
    label: '成都',
    value: 'chengdu',
    description: '内容与支持中心',
    detail: '适合放置内容运营和客户支持团队。',
    meta: {
      区域: '西南',
      等级: '扩展',
    },
  },
  {
    label: '杭州',
    value: 'hangzhou',
    description: '生态合作中心',
    detail: '适合放置生态合作、渠道和社区团队。',
    meta: {
      区域: '华东',
      等级: '扩展',
    },
  },
  {
    label: '北京',
    value: 'beijing',
    description: '暂不可选',
    disabled: true,
  },
]

const singleValue = ref<BingSelectModelValue>('shenzhen')

const selectedCityLabel = computed(() => getSelectedLabels(singleValue.value, cityOptions))

function getSelectedLabels(value: BingSelectModelValue, options: BingSelectOption[]) {
  const values = Array.isArray(value) ? value : value === null ? [] : [value]
  const labels = options
    .filter((option) => values.includes(option.value))
    .map((option) => option.label)

  return labels.length ? labels.join('、') : '未选择'
}
</script>

<template>
  <div class="select-example">
    <BingSelect
      id="select-singleValue"
      v-model="singleValue"
      :options="cityOptions"
      :placeholder="options.placeholder"
      :size="options.size"
      :searchable="options.searchable"
      :status="options.status"
      :clearable="options.clearable"
      :block="options.block"
      :glass="options.glass"
      :disabled="options.disabled"
      search-placeholder="搜索城市或区域"
      no-search-results-text="没有匹配城市"
      empty-text="暂无城市"
      ariaLabel="选择城市"
    />
    <p class="select-feedback">
      <span>当前选择： {{ selectedCityLabel }}</span>
    </p>
  </div>
</template>

<style scoped>
.select-example { display: grid; gap: 16px; max-width: 640px; padding: 16px; }
.select-feedback { overflow-wrap: anywhere; }
.select-option-row { display: grid; gap: 4px; }
</style>
```

## 多选与全选

设置 `multiple` 后，`modelValue` 使用数组。默认展示已选 Tag，选项较多时会自动折叠成 `+N`。

0.17.0 将全选入口移入面板头部，显示三态复选框和“已选 / 可用总数”。搜索时文案为“全选结果”，作用范围同步收窄。选中项使用勾选与字重区分，背景只表示当前高亮项。标签以 0.18 秒进入、0.12 秒离开，`+N` 滚动更新；减少动态效果时直接切换。

大量选项全选时，触发器直接显示容器内可见的标签和 `+N`，不会先展开全部标签再折叠。调整宽度或标签内容后会重新计算可见数量。清空时标签原地退场，结束后再显示占位文字；减少动态效果时直接切换。

全选和清空当前结果只影响搜索结果中未禁用的项，保留结果外、禁用和未知的已有值。触发器右侧清除按钮则清空整个模型。clearable=false 只隐藏该按钮，仍可删除 Tag 或清空结果。

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingSelect } from '@moubing/bing-ui'
import type { BingSelectModelValue, BingSelectOption, BingSelectProps } from '@moubing/bing-ui'

type ExampleOptions = Pick<BingSelectProps, 'showSelectAll' | 'searchable' | 'clearable'>
const options: ExampleOptions = {
  "showSelectAll": true,
  "searchable": true,
  "clearable": true
}

const roleOptions: BingSelectOption[] = [
  { label: '设计系统', value: 'design-system', description: '组件规范、主题和交互标准。' },
  { label: '前端开发', value: 'frontend', description: '页面开发和组件接入。' },
  { label: '后端接口', value: 'backend', description: '接口、权限和数据模型。' },
  { label: '产品运营', value: 'operation', description: '内容配置和活动上线。' },
  { label: '质量保障', value: 'qa', description: '测试计划和回归验证。' },
]

const multipleValue = ref<BingSelectModelValue>(['design-system', 'frontend'])

const selectedRoleLabel = computed(() => getSelectedLabels(multipleValue.value, roleOptions))

function getSelectedLabels(value: BingSelectModelValue, options: BingSelectOption[]) {
  const values = Array.isArray(value) ? value : value === null ? [] : [value]
  const labels = options
    .filter((option) => values.includes(option.value))
    .map((option) => option.label)

  return labels.length ? labels.join('、') : '未选择'
}
</script>

<template>
  <div class="select-example">
    <BingSelect
      id="select-multipleValue"
      v-model="multipleValue"
      :options="roleOptions"
      multiple
      placeholder="选择参与团队"
      select-all-text="选择全部团队"
      clear-all-text="清空已选团队"
      :show-select-all="options.showSelectAll"
      :searchable="options.searchable"
      :clearable="options.clearable"
      block
      ariaLabel="选择参与团队"
    />
    <p class="select-feedback">
      <span>已选： {{ selectedRoleLabel }}</span>
    </p>
  </div>
</template>

<style scoped>
.select-example { display: grid; gap: 16px; max-width: 640px; padding: 16px; }
.select-feedback { overflow-wrap: anywhere; }
.select-option-row { display: grid; gap: 4px; }
</style>
```

## 搜索与选项详情

选项可以带 `description`、`detail` 和 `meta`。当选项有详情信息或传入 `option-detail` 插槽时，悬停选项会显示详情面板。

搜索是内置同步筛选，覆盖 label、value、description、detail 与非空 meta 的键和值；忽略大小写和拉丁重音，多个词需全部匹配，支持英文单词首字母。0.17.0 起支持中文拼音首字母，例如 `cq` 匹配“重庆”。不做任意散字模糊匹配，也没有远程搜索事件。auto 根据原始选项数大于 8 决定是否出现搜索框。

0.17.0 新增 `highlightMatches`（默认 `true`），默认标签用 `<mark class="bing-picker__match">` 标记文字或首字母对应的原文。若只命中详情或 meta，标签不强行高亮。自定义 `#option` 不会被改写，插槽额外收到 `matchRanges: Array<{ start: number; end: number }>`；区间使用 UTF-16 偏移，end 不包含在内，可用 `option.label.slice(start, end)` 读取。

详情浮层仅供视觉补充，aria-hidden=true。关键说明应同时出现在普通选项或正文中，勿在详情内放按钮或表单。

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingSelect } from '@moubing/bing-ui'
import type { BingSelectModelValue, BingSelectOption } from '@moubing/bing-ui'

const detailOptions: BingSelectOption[] = [
  {
    label: '柔和入场',
    value: 'soft-enter',
    description: '低干扰的页面进入动效。',
    detail: '适合数据面板、设置页和需要保持安静的业务页面。',
    meta: {
      时长: '0.72s',
      层级: '页面',
    },
  },
  {
    label: '点击反馈',
    value: 'click-feedback',
    description: '快速确认用户操作。',
    detail: '适合按钮、标签、列表项这类频繁交互元素。',
    meta: {
      时长: '0.18s',
      层级: '控件',
    },
  },
  {
    label: '悬停提示',
    value: 'hover-detail',
    description: '在不打断流程的情况下展示补充信息。',
    detail: '适合选项很多、但每个选项都需要解释的选择器。',
    meta: {
      时长: '0.24s',
      层级: '浮层',
    },
  },
  {
    label: '危险操作',
    value: 'danger-action',
    description: '需要二次确认的操作。',
    detail: '这里作为禁用项示例，真实业务中可搭配权限或状态判断。',
    disabled: true,
    meta: {
      状态: '禁用',
    },
  },
]

const detailValue = ref<BingSelectModelValue>('soft-enter')

const selectedDetailLabel = computed(() => getSelectedLabels(detailValue.value, detailOptions))

function getSelectedLabels(value: BingSelectModelValue, options: BingSelectOption[]) {
  const values = Array.isArray(value) ? value : value === null ? [] : [value]
  const labels = options
    .filter((option) => values.includes(option.value))
    .map((option) => option.label)

  return labels.length ? labels.join('、') : '未选择'
}
</script>

<template>
  <div class="select-example">
    <BingSelect
      id="select-detailValue"
      v-model="detailValue"
      :options="detailOptions"
      searchable
      block
      placeholder="选择动效方案"
      search-placeholder="搜索方案"
      ariaLabel="选择动效方案"
    >
      <template #option="{ option, selected }">
        <span class="select-option-row">
          <span class="bing-select__option-label">
            {{ option.label }}
            <span v-if="selected">已选</span>
          </span>
          <span v-if="option.description" class="bing-select__option-description">{{ option.description }}</span>
        </span>
      </template>
      <template #option-detail="{ option, selected }">
        <span class="bing-select__option-detail-title">
          {{ option.label }}
          <span v-if="selected">已选</span>
        </span>
        <span class="bing-select__option-detail-text">{{ option.detail || option.description }}</span>
        <span v-for="(value, key) in option.meta || {}" :key="key" class="bing-select__option-detail-meta">
          <span class="bing-select__option-detail-meta-key">{{ key }}</span>
          <span class="bing-select__option-detail-meta-value">{{ value }}</span>
        </span>
      </template>
    </BingSelect>
    <p class="select-feedback">
      <span>当前方案： {{ selectedDetailLabel }}</span>
    </p>
  </div>
</template>

<style scoped>
.select-example { display: grid; gap: 16px; max-width: 640px; padding: 16px; }
.select-feedback { overflow-wrap: anywhere; }
.select-option-row { display: grid; gap: 4px; }
</style>
```

## 虚拟列表

当选项数量很多时，可以开启 `virtual`，只渲染视口附近的选项。`virtualItemHeight` 需要和选项实际高度接近，滚动体验才会稳定。

`smoothScroll` 默认只作用于下拉面板的选项区；设为 `false` 可回退为即时滚动。键盘导航的选项定位始终即时，不会等待平滑动画。

auto 以过滤后的条目数严格大于阈值为准；搜索后可能回到普通列表。虚拟列表只减少 DOM，搜索仍遍历完整 options。默认行高随 sm / md / lg 为 28 / 32 / 36px，自定义 option 插槽增加 16px；description 显示在详情浮层，不增加默认行高。显式 virtualItemHeight 最小为 28px，向下取整；本例留空时使用组件默认值，自定义内容需约束高度。

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingSelect } from '@moubing/bing-ui'
import type { BingSelectModelValue, BingSelectOption, BingSelectProps } from '@moubing/bing-ui'

type ExampleOptions = Pick<BingSelectProps, 'virtual' | 'virtualItemHeight' | 'panelMaxHeight'>
const options: ExampleOptions = {
  "virtual": true,
  "panelMaxHeight": 320
}

const virtualOptions: BingSelectOption[] = Array.from({ length: 160 }, (_, index) => ({
  label: `虚拟选项 ${index + 1}`,
  value: `virtual-${index + 1}`,
  description: index % 2 === 0 ? '高频选项' : '低频选项',
  detail: `这是第 ${index + 1} 个选项，面板只渲染当前视口附近的行。`,
  meta: {
    序号: index + 1,
    分组: index % 2 === 0 ? 'A' : 'B',
  },
  disabled: index % 23 === 0,
}))

const virtualValue = ref<BingSelectModelValue>(['virtual-2', 'virtual-18'])

const selectedVirtualLabel = computed(() => getSelectedLabels(virtualValue.value, virtualOptions))

function getSelectedLabels(value: BingSelectModelValue, options: BingSelectOption[]) {
  const values = Array.isArray(value) ? value : value === null ? [] : [value]
  const labels = options
    .filter((option) => values.includes(option.value))
    .map((option) => option.label)

  return labels.length ? labels.join('、') : '未选择'
}
</script>

<template>
  <div class="select-example">
    <BingSelect
      id="select-virtualValue"
      v-model="virtualValue"
      :options="virtualOptions"
      multiple
      searchable
      :virtual="options.virtual"
      :virtual-item-height="options.virtualItemHeight"
      :virtual-overscan="5"
      :panel-max-height="options.panelMaxHeight"
      placeholder="选择大量选项"
      select-all-text="全选当前结果"
      clear-all-text="清空当前结果"
      block
      ariaLabel="选择大量选项"
    />
    <p class="select-feedback">
      <span>已选： {{ selectedVirtualLabel }}</span>
    </p>
  </div>
</template>

<style scoped>
.select-example { display: grid; gap: 16px; max-width: 640px; padding: 16px; }
.select-feedback { overflow-wrap: anywhere; }
.select-option-row { display: grid; gap: 4px; }
</style>
```

## 弹层定位

`panelPlacement` 控制面板优先出现的位置，`panelAlign` 控制相对触发器的对齐方式，`panelGap` 控制两者间距。`auto` 会根据视口空间自动翻转到可见区域。

磨砂参数默认继承主题：模糊 16px、浅色不透明度 0.86、深色 0.92、饱和度 1.05。通常只需设置 glass；显式 glassOpacity 会固定不透明度，无法自动跟随主题。

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingSelect } from '@moubing/bing-ui'
import type { BingSelectModelValue, BingSelectOption, BingSelectProps } from '@moubing/bing-ui'

type ExampleOptions = Pick<BingSelectProps, 'panelPlacement' | 'panelAlign' | 'panelGap'>
const options: ExampleOptions = {
  "panelPlacement": "auto",
  "panelAlign": "start",
  "panelGap": 10
}

const cityOptions: BingSelectOption[] = [
  {
    label: '上海',
    value: 'shanghai',
    description: '华东业务中心',
    detail: '适合放置销售、交付和活动运营团队。',
    meta: {
      区域: '华东',
      等级: '核心',
    },
  },
  {
    label: '深圳',
    value: 'shenzhen',
    description: '产品与研发中心',
    detail: '适合放置研发、设计和增长团队。',
    meta: {
      区域: '华南',
      等级: '核心',
    },
  },
  {
    label: '成都',
    value: 'chengdu',
    description: '内容与支持中心',
    detail: '适合放置内容运营和客户支持团队。',
    meta: {
      区域: '西南',
      等级: '扩展',
    },
  },
  {
    label: '杭州',
    value: 'hangzhou',
    description: '生态合作中心',
    detail: '适合放置生态合作、渠道和社区团队。',
    meta: {
      区域: '华东',
      等级: '扩展',
    },
  },
  {
    label: '北京',
    value: 'beijing',
    description: '暂不可选',
    disabled: true,
  },
]

const panelValue = ref<BingSelectModelValue>('shanghai')

const selectedPanelLabel = computed(() => getSelectedLabels(panelValue.value, cityOptions))

function getSelectedLabels(value: BingSelectModelValue, options: BingSelectOption[]) {
  const values = Array.isArray(value) ? value : value === null ? [] : [value]
  const labels = options
    .filter((option) => values.includes(option.value))
    .map((option) => option.label)

  return labels.length ? labels.join('、') : '未选择'
}
</script>

<template>
  <div class="select-example">
    <BingSelect
      id="select-panelValue"
      v-model="panelValue"
      :options="cityOptions"
      :panel-placement="options.panelPlacement"
      :panel-align="options.panelAlign"
      :panel-gap="options.panelGap"
      placeholder="测试弹层位置"
      block
      ariaLabel="测试选择器弹层位置"
    />
    <p class="select-feedback">
      <span>当前选择： {{ selectedPanelLabel }}</span>
    </p>
  </div>
</template>

<style scoped>
.select-example { display: grid; gap: 16px; max-width: 640px; padding: 16px; }
.select-feedback { overflow-wrap: anywhere; }
.select-option-row { display: grid; gap: 4px; }
</style>
```

## 尺寸与状态

触发器 sm / md / lg 高度为 32 / 36 / 40px，选项行高另行计算。`status` 可以和表单校验状态同步。在 `BingForm` 里使用时，Select 会继承表单项的尺寸、禁用和状态，显式属性优先。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingSelect } from '@moubing/bing-ui'
import type { BingSelectModelValue, BingSelectOption } from '@moubing/bing-ui'

const cityOptions: BingSelectOption[] = [
  {
    label: '上海',
    value: 'shanghai',
    description: '华东业务中心',
    detail: '适合放置销售、交付和活动运营团队。',
    meta: {
      区域: '华东',
      等级: '核心',
    },
  },
  {
    label: '深圳',
    value: 'shenzhen',
    description: '产品与研发中心',
    detail: '适合放置研发、设计和增长团队。',
    meta: {
      区域: '华南',
      等级: '核心',
    },
  },
  {
    label: '成都',
    value: 'chengdu',
    description: '内容与支持中心',
    detail: '适合放置内容运营和客户支持团队。',
    meta: {
      区域: '西南',
      等级: '扩展',
    },
  },
  {
    label: '杭州',
    value: 'hangzhou',
    description: '生态合作中心',
    detail: '适合放置生态合作、渠道和社区团队。',
    meta: {
      区域: '华东',
      等级: '扩展',
    },
  },
  {
    label: '北京',
    value: 'beijing',
    description: '暂不可选',
    disabled: true,
  },
]

const smallValue = ref<BingSelectModelValue>('shanghai')

const mediumValue = ref<BingSelectModelValue>('shenzhen')

const largeValue = ref<BingSelectModelValue>('chengdu')
</script>

<template>
  <div class="select-example">
    <BingSelect
      id="select-smallValue"
      v-model="smallValue"
      ariaLabel="小尺寸城市"
      :options="cityOptions"
      size="sm"
      status="success"
      placeholder="小尺寸"
    />
    <BingSelect
      id="select-mediumValue"
      v-model="mediumValue"
      ariaLabel="中尺寸城市"
      :options="cityOptions"
      size="md"
      status="warning"
      placeholder="中尺寸"
    />
    <BingSelect
      id="select-largeValue"
      v-model="largeValue"
      ariaLabel="大尺寸城市"
      :options="cityOptions"
      size="lg"
      status="error"
      placeholder="大尺寸"
    />
  </div>
</template>

<style scoped>
.select-example { display: grid; gap: 16px; max-width: 640px; padding: 16px; }
.select-feedback { overflow-wrap: anywhere; }
.select-option-row { display: grid; gap: 4px; }
</style>
```

## 事件反馈

`change` 会返回当前值、触发选项和所有已选选项。`open`、`close` 和 `clear` 适合做埋点或轻量状态反馈。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingSelect } from '@moubing/bing-ui'
import type { BingSelectChangePayload, BingSelectModelValue, BingSelectOption } from '@moubing/bing-ui'

const detailOptions: BingSelectOption[] = [
  {
    label: '柔和入场',
    value: 'soft-enter',
    description: '低干扰的页面进入动效。',
    detail: '适合数据面板、设置页和需要保持安静的业务页面。',
    meta: {
      时长: '0.72s',
      层级: '页面',
    },
  },
  {
    label: '点击反馈',
    value: 'click-feedback',
    description: '快速确认用户操作。',
    detail: '适合按钮、标签、列表项这类频繁交互元素。',
    meta: {
      时长: '0.18s',
      层级: '控件',
    },
  },
  {
    label: '悬停提示',
    value: 'hover-detail',
    description: '在不打断流程的情况下展示补充信息。',
    detail: '适合选项很多、但每个选项都需要解释的选择器。',
    meta: {
      时长: '0.24s',
      层级: '浮层',
    },
  },
  {
    label: '危险操作',
    value: 'danger-action',
    description: '需要二次确认的操作。',
    detail: '这里作为禁用项示例，真实业务中可搭配权限或状态判断。',
    disabled: true,
    meta: {
      状态: '禁用',
    },
  },
]

const eventValue = ref<BingSelectModelValue>('soft-enter')

const eventLog = ref('等待选择')

function handleChange(payload: BingSelectChangePayload) {
  const labels = payload.options.map((option) => option.label).join('、') || '无'
  eventLog.value += ' → ' + `change：${labels}`
}

function handleClear() {
  eventLog.value += ' → ' + 'clear：已清空'
}

function handleOpen() {
  eventLog.value += ' → ' + 'open：面板已打开'
}

function handleClose() {
  eventLog.value += ' → ' + 'close：面板已关闭'
}
</script>

<template>
  <div class="select-example">
    <BingSelect
      id="select-eventValue"
      v-model="eventValue"
      ariaLabel="选择事件方案"
      :options="detailOptions"
      placeholder="触发事件"
      block
      @change="handleChange"
      @clear="handleClear"
      @open="handleOpen"
      @close="handleClose"
    />
    <p class="select-feedback">
      <span>{{ eventLog }}</span>
    </p>
  </div>
</template>

<style scoped>
.select-example { display: grid; gap: 16px; max-width: 640px; padding: 16px; }
.select-feedback { overflow-wrap: anywhere; }
.select-option-row { display: grid; gap: 4px; }
</style>
```

## 属性

| 属性                    | 类型                                                 | 默认值                                           | 说明                                                                       |
| --------------------- | -------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------ |
| `id`                  | `string`                                           | `自动生成 / FormItem controlId`                   | 触发按钮 id；内部 listbox 和 option ID 按实例唯一生成。自定义 id 时仍需业务保证唯一。                 |
| `modelValue`          | `BingSelectModelValue`                             | `null`                                        | 单选 string \| number \| null，多选数组；值按严格 === 比较，数字 1 与字符串 1 不同。未知值不会自动删除。   |
| `options`             | `BingSelectOption[]`                               | `[]`                                          | 选项列表。                                                                    |
| `multiple`            | `boolean`                                          | `false`                                       | 开启多选模式。                                                                  |
| `placeholder`         | `string`                                           | `'请选择选项'`                                     | 未选择时的占位文案。                                                               |
| `disabled`            | `boolean`                                          | `继承 FormItem / Form，否则 false`                 | 显式属性优先于表单禁用状态；切换为 true 会关闭打开的面板。                                         |
| `clearable`           | `boolean`                                          | `true`                                        | 仅控制触发器清除按钮；不关闭 Tag 删除或多选全选/清空当前结果。                                       |
| `showSelectAll`       | `boolean`                                          | `true`                                        | 多选模式下是否显示全选操作。0.17.0 起移至面板头部，显示三态与当前结果计数。                                |
| `selectAllText`       | `string`                                           | `'全选'`                                        | 全选操作文案。                                                                  |
| `clearAllText`        | `string`                                           | `'清空已选'`                                      | 全部当前结果已选时的清空操作无障碍文案；可见行标题保持全选/全选结果。                                      |
| `emptyText`           | `string`                                           | `'暂无选项'`                                      | 无选项时的空状态文案。                                                              |
| `searchable`          | `boolean \| 'auto'`                                | `'auto'`                                      | auto 在原始 options.length \> 8 时开启；关闭时通过 Vue 动态绑定传入布尔值 false，不要传字符串 false。 |
| `typeahead`           | `boolean`                                          | `true`                                        | 0.17.0 新增：面板打开且焦点不在搜索框时，按 500ms 缓冲匹配标签前缀、英文/拼音首字母。重复字符循环，跳过禁用项；关闭时不改值。   |
| `highlightMatches`    | `boolean`                                          | `true`                                        | 0.17.0 新增：标记默认选项标签的搜索命中。自定义 option 插槽自行处理 matchRanges；关闭后提供空区间。          |
| `searchPlaceholder`   | `string`                                           | `'搜索选项（/）'`                                   | 搜索框占位文案。                                                                 |
| `noSearchResultsText` | `string`                                           | `'未找到匹配选项'`                                   | 搜索无结果时的空状态文案。                                                            |
| `smoothScroll`        | `BingSelectSmoothScroll`                           | `true`                                        | 仅为下拉面板的选项区启用平滑滚动；设为 false 可关闭。键盘导航仍会即时定位当前选项。                            |
| `size`                | `'sm' \| 'md' \| 'lg'`                             | `继承 FormItem / Form / ConfigProvider，否则 'md'` | 触发器高度分别为 32 / 36 / 40px；选项行高单独计算。                                        |
| `block`               | `boolean`                                          | `false`                                       | 宽度是否撑满父容器。                                                               |
| `width`               | `string \| number`                                 | `undefined`                                   | 选择器固定宽度。                                                                 |
| `minWidth`            | `string \| number`                                 | `180`                                         | 选择器最小宽度。                                                                 |
| `glass`               | `boolean`                                          | `true`                                        | 是否开启玻璃效果。                                                                |
| `glassBlur`           | `string \| number`                                 | `主题变量，默认 16px`                                | 玻璃模糊强度。                                                                  |
| `glassOpacity`        | `number`                                           | `主题变量，浅色 0.86 / 深色 0.92`                      | 磨砂底色不透明度；显式设置会覆盖主题默认值。                                                   |
| `glassSaturation`     | `number`                                           | `主题变量，默认 1.05`                                | 玻璃饱和度。                                                                   |
| `panelMinHeight`      | `string \| number`                                 | `0`                                           | 数字或字符串 parseFloat 后按 px；不是视口百分比。最终受最大高度和可用空间限制。                          |
| `panelMaxHeight`      | `string \| number`                                 | `320`                                         | 数字或字符串 parseFloat 后按 px，包含搜索区；视口可用空间会进一步限制高度。                            |
| `panelPlacement`      | `'auto' \| 'top' \| 'bottom' \| 'left' \| 'right'` | `'auto'`                                      | auto 只选择上/下；显式方向不会自动翻面，但坐标与高度仍限制在视口内。                                    |
| `panelAlign`          | `'start' \| 'middle' \| 'end'`                     | `'start'`                                     | 下拉面板相对触发器的对齐方式。                                                          |
| `panelGap`            | `number`                                           | `10`                                          | 下拉面板和触发器之间的间距，单位 px。                                                     |
| `virtual`             | `boolean \| 'auto'`                                | `'auto'`                                      | true 对非空结果启用；auto 在过滤后的结果数严格大于 virtualThreshold 时启用。                     |
| `virtualThreshold`    | `number`                                           | `80`                                          | auto 模式下启用虚拟列表的选项数量阈值。                                                   |
| `virtualItemHeight`   | `number`                                           | `随尺寸 28 / 32 / 36px；option 插槽另加 16px`         | 显式值最小 28px，向下取整；非有限值使用默认高度。description 不增加行高，自定义插槽需控制内容高度。               |
| `virtualOverscan`     | `number`                                           | `4`                                           | 虚拟列表额外渲染的缓冲项数量。                                                          |
| `ariaLabel`           | `string`                                           | `undefined`                                   | 触发按钮的可访问名称。                                                              |
| `ariaDescribedby`     | `string`                                           | `undefined`                                   | 关联额外说明元素。                                                                |
| `status`              | `'default' \| 'error' \| 'success' \| 'warning'`   | `undefined`                                   | 选择器状态；在表单内可继承 FormItem 状态。                                               |

## 选项结构

| 字段              | 类型                                                                 | 说明                                      |
| --------------- | ------------------------------------------------------------------ | --------------------------------------- |
| `label`         | `string`                                                           | 选项展示名称。                                 |
| `value`         | `string \| number`                                                 | 选项值。                                    |
| `disabled`      | `boolean`                                                          | 是否禁用该选项。                                |
| `description`   | `string`                                                           | 选项的辅助说明，默认选项详情也会读取它。                    |
| `detail`        | `string`                                                           | 更长的选项详情说明。                              |
| `meta`          | `Record<string, string \| number \| boolean \| null \| undefined>` | 额外元信息，会在默认详情面板中展示。                      |
| `[key: string]` | `unknown`                                                          | 可带业务字段；插槽读取额外字段前应做类型收窄。value 必须唯一，不能重复。 |

## 插槽与事件

### 插槽

| 插槽              | 参数                                  | 说明                                                                                                                  |
| --------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `value`         | `{ selectedOptions, placeholder }`  | 自定义触发器里的已选值展示。                                                                                                      |
| `option`        | `{ option, selected, matchRanges }` | 自定义选项内容；0.17.0 新增 matchRanges: Array\<\{ start: number; end: number \}\>，为 label 的 UTF-16 区间（end 不包含），组件不会改写插槽 DOM。 |
| `option-detail` | `{ option, selected, index }`       | 悬停或方向键高亮时的纯展示详情；index 为原始 options 索引。浮层 aria-hidden=true，不应放交互控件或仅在此呈现必需信息。                                         |

### 事件

| 事件                  | 参数                        | 说明                                                                                         |
| ------------------- | ------------------------- | ------------------------------------------------------------------------------------------ |
| `update:modelValue` | `BingSelectModelValue`    | 选择/移除/全选时先发送；外部赋值不发送。单选点击同一项仍可重复发送。                                                        |
| `change`            | `BingSelectChangePayload` | 随后发送 \{ value, option?, options \}；options 是完整选项表中匹配新值的项，按选项表顺序。清空/全选时 option 为 undefined。 |
| `clear`             | `无`                       | 仅触发器清除按钮发送：clear → update:modelValue → change。多选清空结果或删除 Tag 不发送 clear。                     |
| `open`              | `无`                       | 请求打开时发送，早于面板动画与搜索聚焦结束。                                                                     |
| `close`             | `无`                       | 请求关闭时发送；单选选择顺序为 update:modelValue → change → close，多选选择保持面板打开。                             |

## 公开类型与键盘行为

| 公开类型或推导方式                                        | 定义或用途                                                                                       |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `BingSelectValue`                                | string \| number                                                                            |
| `BingSelectModelValue`                           | BingSelectValue \| BingSelectValue\[\] \| null                                              |
| `BingSelectSize`                                 | 'sm' \| 'md' \| 'lg'                                                                        |
| `BingSelectVirtualMode`                          | boolean \| 'auto'                                                                           |
| `BingSelectSmoothScroll`                         | SmoothScrollValue                                                                           |
| `BingSelectOption`                               | 上表选项结构，含业务扩展字段。                                                                             |
| `BingSelectChangePayload`                        | \{ value: BingSelectModelValue; option?: BingSelectOption; options: BingSelectOption\[\] \} |
| `BingSelectProps`                                | 上表 35 项可选属性，含玻璃效果。                                                                          |
| `BingSelectEmits`                                | 上表 5 个事件。                                                                                   |
| `NonNullable<BingSelectProps['panelPlacement']>` | 'auto' \| 'top' \| 'bottom' \| 'left' \| 'right'；包入口不导出 BingSelectPanelPlacement。           |
| `NonNullable<BingSelectProps['panelAlign']>`     | 'start' \| 'middle' \| 'end'；包入口不导出 BingSelectPanelAlign。                                   |
| `NonNullable<BingSelectProps['searchable']>`     | boolean \| 'auto'；包入口不导出 BingSelectSearchable。                                              |
| `SmoothScrollValue`                              | boolean \| SmoothScrollOptions                                                              |
| `SmoothScrollOptions`                            | 下表滚动参数；来自组件包入口。                                                                             |

触发器使用 button 元素，0.17.0 增加 `role="combobox"`，带 aria-haspopup="listbox"。Enter、Space、上下键打开；面板中上下键循环跳过禁用项，Home/End 到首尾，Enter 选择。可搜索时打开后聚焦搜索框，斜杠键可以重新聚焦；打开动画期间焦点若已被移到组件外，不会被拉回搜索框（0.12.3 起；此前版本会在随后两帧内抢回焦点）。搜索框内第一次 Escape 清除非空查询，查询为空时 Escape 关闭并返回触发器。0.17.0 起选项均为 tabindex=-1，由触发器或搜索框通过 aria-activedescendant 管理高亮；全选行可通过 Tab 到达并用空格/Enter 操作，继续 Tab 离开时关闭面板，没有焦点陷阱。

0.17.0 新增 `typeahead`（默认 `true`）。面板打开且焦点不在搜索框时，输入可打印字符定位选项：500ms 内连续字符组成前缀，重复同一字符循环匹配，先匹配 label 前缀再匹配英文/拼音首字母，跳过禁用项并滚动到可见位置。关闭面板时输入不改变值；输入法组词和 Ctrl/Cmd/Alt 组合键不会被接管。可用 `:typeahead="false"` 关闭。

键盘导航后，静止鼠标不会因为列表滚动而抢走高亮；指针实际移动超过 2px、且键盘滚动结束后才接管。虚拟选项带 aria-setsize / aria-posinset，表示筛选后完整集合中的总数和位置。

面板和详情浮层传送到 body。0.17.0 起全选行位于面板内部，`.bing-select__action-rail` 保留为新行容器的别名；现有 `bing-select__*` 类名保留，同一外壳元素增加 `bing-picker__*`。0.6.0 按实例生成唯一的 listbox / option ID，触发器的 aria-controls 与当前列表对应；业务自定义 id 时仍应保证唯一。本页在缓存页面离开时卸载预览以清理浮层、监听器与滚动任务。

可在组件根节点覆盖 `--bing-select-option-height`（默认 sm / md / lg 为 28 / 32 / 36px）和 `--bing-select-panel-radius`（默认 `var(--bing-radius-popover, 8px)`）；打开面板时同步到 Teleport 浮层。虚拟列表需要与实际行高一致，显式 `virtualItemHeight` 优先。

没有公开 focus/openPanel/closePanel 实例方法、受控 open 或 teleportTo 属性。额外业务字段在 BingSelectOption 上为 unknown，先做类型判断再传给其他组件。

## 面板滚动配置

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

仅选项滚动区域使用这些配置；键盘选项定位即时完成。示例无需另外导入滚动库。
