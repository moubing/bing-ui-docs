<script setup lang="ts">
import { ref } from 'vue'
import type { BingInputSize, BingInputProps } from '@moubing/bing-ui'
import { BingCodeBlock, BingInput } from '@moubing/bing-ui'
import { useExamples } from './state'
const { sizeValues, statusValues, statesCode } = useExamples()
const sizeModels = ref<Record<BingInputSize, string | number | null>>({ sm: 'sm 尺寸', md: 'md 尺寸', lg: 'lg 尺寸' })
const statusModels = ref<Record<NonNullable<BingInputProps['status']>, string | number | null>>({ default: 'default', success: 'success', warning: 'warning', error: 'error' })
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview">
      <p class="preview-label">尺寸状态</p>
      <div class="input-demo-stack">
        <ClientOnly>
          <BingInput
            v-for="size in sizeValues"
            :key="size"
            v-model="sizeModels[size]"
            :size="size"
            :placeholder="`${size} 尺寸`"
          />
          <BingInput
            v-for="status in statusValues"
            :key="status"
            v-model="statusModels[status]"
            :status="status"
            :placeholder="`${status} 状态`"
          />
          <BingInput model-value="不可编辑" disabled />
        </ClientOnly>
      </div>
    </div>
  </div>

  <BingCodeBlock :code="statesCode" language="vue" title="代码示例" wrap />
</template>
