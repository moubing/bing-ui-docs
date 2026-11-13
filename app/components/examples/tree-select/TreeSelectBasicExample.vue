<script setup lang="ts">
import { BingRadio, BingCheckbox, BingCodeBlock, BingInput, BingRadioGroup, BingTreeSelect } from '@moubing/bing-ui'
import { onActivated, onDeactivated, ref } from 'vue'
import { useExamples } from './state'
const { sizeOptions, searchableOptions, statusOptions, workspaceTree, basicDemo, singleValue, eventLog, basicSearchable, selectedSingleText, formatValue, handleBasicChange, handleTreeEvent, handleExpand, updateControl1, updateControl2, updateControl3, toNumberText, basicCode } = useExamples()
const examplesActive = ref(true)
onActivated(() => { examplesActive.value = true })
onDeactivated(() => { examplesActive.value = false })
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example demo-grid tree-select-demo-grid">
    <div class="doc-example__preview demo-panel tree-select-demo-stage">
      <p class="preview-label">实时预览</p>
      <p style="font-size:13px;color:var(--bing-muted);">搜索框光标在边界时用左右键导航；Alt + 左右键随时操作树。无搜索框时连续输入标签前缀或拼音首字母。</p>
        <BingTreeSelect
          id="tree-select-singleValue" ariaLabel="选择组件节点" v-model="singleValue"
          :options="workspaceTree"
          :placeholder="basicDemo.placeholder"
          :size="basicDemo.size"
          :searchable="basicSearchable"
          :typeahead="basicDemo.typeahead"
          :highlight-matches="basicDemo.highlightMatches"
          :status="basicDemo.status"
          :block="basicDemo.block"
          :clearable="basicDemo.clearable"
          :show-tree-actions="basicDemo.showTreeActions"
          :disabled="basicDemo.disabled"
          :panel-max-height="toNumberText(basicDemo.panelMaxHeight)"
          :default-expanded-values="['library', 'form']"
          @change="handleBasicChange"
          @clear="handleTreeEvent('clear：已清空')"
          @open="handleTreeEvent('open：面板已打开')"
          @close="handleTreeEvent('close：面板已关闭')"
          @expand="handleExpand('expand', $event)"
          @collapse="handleExpand('collapse', $event)"
        />
      <div class="tree-select-feedback">
        <span>当前值：{{ formatValue(singleValue) }}</span>
        <span>当前文本：{{ selectedSingleText }}</span>
        <span>事件：{{ eventLog }}</span>
      </div>
    </div>

    <div class="doc-example__controls demo-panel tree-select-control-panel">
      <label class="demo-control">
        <span>占位文案</span>
        <BingInput ariaLabel="占位文案" v-model="basicDemo.placeholder" clearable />
      </label>
      <div class="demo-control">
        <span>尺寸</span>
        <BingRadioGroup direction="wrap" id="tree-select-control-1" name="tree-select-control-1" ariaLabel="尺寸"
          :model-value="basicDemo.size"
          @update:model-value="updateControl1">
          <BingRadio v-for="option in sizeOptions" :id="`tree-select-control-1-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>
      <div class="demo-control">
        <span>搜索策略</span>
        <BingRadioGroup direction="wrap" id="tree-select-control-2" name="tree-select-control-2" ariaLabel="搜索策略"
          :model-value="basicDemo.searchable"
          @update:model-value="updateControl2">
          <BingRadio v-for="option in searchableOptions" :id="`tree-select-control-2-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>
      <div class="demo-control">
        <span>状态</span>
        <BingRadioGroup direction="wrap" id="tree-select-control-3" name="tree-select-control-3" ariaLabel="状态"
          :model-value="basicDemo.status"
          @update:model-value="updateControl3">
          <BingRadio v-for="option in statusOptions" :id="`tree-select-control-3-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>
      <label class="demo-control">
        <span>面板最大高度</span>
        <BingInput ariaLabel="面板最大高度" v-model="basicDemo.panelMaxHeight" clearable />
      </label>
      <div class="tree-select-toggle-list">
        <BingCheckbox v-model="basicDemo.typeahead" label="typeahead 连续字符定位" />
        <BingCheckbox v-model="basicDemo.highlightMatches" label="highlightMatches 搜索高亮" />
        <BingCheckbox v-model="basicDemo.block" label="block 宽度撑满" />
        <BingCheckbox v-model="basicDemo.clearable" label="显示清空按钮" />
        <BingCheckbox v-model="basicDemo.showTreeActions" label="显示展开/收起操作" />
        <BingCheckbox v-model="basicDemo.disabled" label="禁用选择器" />
      </div>
    </div>
  </div>

  </ClientOnly>
  <BingCodeBlock :code="basicCode" language="vue" title="代码示例" />
</template>
