<script setup lang="ts">
import { BingCheckbox, BingCodeBlock, BingTreeSelect } from '@moubing/bing-ui'
import { onActivated, onDeactivated, ref } from 'vue'
import { useExamples } from './state'
const { workspaceTree, cascadeDemo, cascadeValue, selectedCascadeText, formatValue, formatSelectedCount, cascadeCode } = useExamples()
const examplesActive = ref(true)
onActivated(() => { examplesActive.value = true })
onDeactivated(() => { examplesActive.value = false })
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example demo-grid tree-select-demo-grid">
    <div class="doc-example__preview demo-panel tree-select-demo-stage">
      <p class="preview-label">级联预览</p>
        <BingTreeSelect
          id="tree-select-cascadeValue" ariaLabel="选择组件范围" v-model="cascadeValue"
          :options="workspaceTree"
          multiple
          :check-strictly="cascadeDemo.checkStrictly"
          :show-select-all="cascadeDemo.showSelectAll"
          :clearable="cascadeDemo.clearable"
          select-all-text="选择当前可选节点"
          clear-all-text="清空已选节点"
          placeholder="选择组件范围"
          :default-expanded-values="['library', 'basic', 'form']"
          block
        />
      <div class="tree-select-feedback">
        <span>已选数量：{{ formatSelectedCount(cascadeValue) }}</span>
        <span>已选文本：{{ selectedCascadeText }}</span>
        <span>当前值：{{ formatValue(cascadeValue) }}</span>
      </div>
    </div>

    <div class="doc-example__controls demo-panel tree-select-control-panel">
      <p class="preview-label">选择模式</p>
      <div class="tree-select-toggle-list">
        <BingCheckbox v-model="cascadeDemo.checkStrictly" label="checkStrictly 独立选择" />
        <BingCheckbox v-model="cascadeDemo.showSelectAll" label="显示全选/清空当前结果操作" />
        <BingCheckbox v-model="cascadeDemo.clearable" label="允许清空" />
      </div>
    </div>
  </div>

  </ClientOnly>
  <BingCodeBlock :code="cascadeCode" language="vue" title="代码示例" />
</template>
