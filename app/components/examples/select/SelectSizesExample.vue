<script setup lang="ts">
import { BingCodeBlock, BingSelect } from '@moubing/bing-ui'
import { onActivated, onDeactivated, ref } from 'vue'
import { useExamples } from './state'
const { cityOptions, smallValue, mediumValue, largeValue, sizesCode } = useExamples()
const examplesActive = ref(true)
onActivated(() => { examplesActive.value = true })
onDeactivated(() => { examplesActive.value = false })
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview">
      <p class="preview-label">尺寸与状态</p>
      <div class="select-demo-stack">
          <BingSelect id="select-smallValue" v-model="smallValue" ariaLabel="小尺寸城市"
            :options="cityOptions"
            size="sm"
            status="success"
            placeholder="小尺寸"
          />
          <BingSelect id="select-mediumValue" v-model="mediumValue" ariaLabel="中尺寸城市"
            :options="cityOptions"
            size="md"
            status="warning"
            placeholder="中尺寸"
          />
          <BingSelect id="select-largeValue" v-model="largeValue" ariaLabel="大尺寸城市"
            :options="cityOptions"
            size="lg"
            status="error"
            placeholder="大尺寸"
          />
      </div>
    </div>
  </div>

  </ClientOnly>
  <BingCodeBlock :code="sizesCode" language="vue" title="代码示例" wrap />
</template>
