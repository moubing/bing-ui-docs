<script setup lang="ts">
import { BingCheckbox, BingCodeBlock, BingSelect } from '@moubing/bing-ui'
import { onActivated, onDeactivated, ref } from 'vue'
import { useExamples } from './state'
const { roleOptions, multipleDemo, multipleValue, selectedRoleLabel, multipleCode } = useExamples()
const examplesActive = ref(true)
onActivated(() => { examplesActive.value = true })
onDeactivated(() => { examplesActive.value = false })
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example">
    <div class="doc-example__preview select-demo-stage">
      <p class="preview-label">多选预览</p>
        <BingSelect id="select-multipleValue" v-model="multipleValue"
          :options="roleOptions"
          multiple
          placeholder="选择参与团队"
          select-all-text="选择全部团队"
          clear-all-text="清空已选团队"
          :show-select-all="multipleDemo.showSelectAll"
          :searchable="multipleDemo.searchable"
          :clearable="multipleDemo.clearable"
          block
          ariaLabel="选择参与团队"
        />
      <p class="select-feedback">
        <span>已选：{{ selectedRoleLabel }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <BingCheckbox v-model="multipleDemo.showSelectAll" label="显示全选操作" />
      <BingCheckbox v-model="multipleDemo.searchable" label="开启搜索" />
      <BingCheckbox v-model="multipleDemo.clearable" label="允许清除" />
    </div>
  </div>

  </ClientOnly>
  <BingCodeBlock
    :code="multipleCode"
    language="vue"
    title="代码示例"
    wrap
  />
</template>
