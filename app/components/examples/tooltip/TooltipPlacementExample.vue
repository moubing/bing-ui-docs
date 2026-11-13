<script setup lang="ts">
import { BingButton, BingCodeBlock, BingTooltip } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, placementItems, placementCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
  <div class="doc-example__preview tooltip-placement-board">
    <ClientOnly v-if="examplesActive">
      <BingTooltip
        :id="`docs-tooltip-placement-${item.placement}`"
        v-for="item in placementItems"
        :key="item.placement"
        :content="item.content"
        trigger="click"
        :placement="item.placement"
        align="center"
        :open-delay="0"
        :offset="12"
        :interactive="false"
      >
        <template #default="{ triggerProps }"><BingButton variant="tertiary" :throttle="false" v-bind="triggerProps">{{ item.label }}</BingButton></template>
      </BingTooltip>
    </ClientOnly>
  </div>

  </div>

  <BingCodeBlock :code="placementCode" language="vue" title="代码示例" wrap />
</template>
