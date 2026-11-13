<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingTooltip } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const count = ref(0)
</script>

<template>
  <div class="stage">
    <BingTooltip id="rich-tooltip" trigger="click" placement="right" :open-delay="0" max-width="320px" interactive>
      <template #default="{ triggerProps }"><button type="button" class="anchor" v-bind="triggerProps">字段说明</button></template>
      <template #content>
        <div class="content"><strong>价格策略</strong><span>用于解释字段、状态和操作后果。</span>
          <BingButton size="xs" :throttle="false" @click="count++">标记已读</BingButton>
        </div>
      </template>
    </BingTooltip>
    <p role="status">已读操作：{{ count }} 次</p>
  </div>
</template>

<style scoped>
.stage { padding: 110px 20px; text-align: center; }
.content { display: grid; gap: 10px; }
.anchor { padding: 10px 16px; border: 1px solid var(--bing-border); border-radius: 8px; color: inherit; background: transparent; font: inherit; cursor: pointer; }
</style>
