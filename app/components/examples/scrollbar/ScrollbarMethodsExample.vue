<script setup lang="ts">
import { BingButton, BingCodeBlock, BingScrollbar } from '@moubing/bing-ui'
import { useExamples } from './state'
const { logItems, apiScrollbarRef, apiLog, scrollApiToTop, scrollApiDown, scrollApiToBottom, refreshApiMetrics, appendLogs, stopApiScroll, forwardApiWheel, exposeCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview scrollbar-demo-stage">
      <div class="scrollbar-forward" @wheel="forwardApiWheel">在这里使用滚轮，将事件转交给下方列表。</div>
      <ClientOnly>
        <BingScrollbar
          ref="apiScrollbarRef"
          height="260px"
          always
          aria-label="日志列表"
        >
          <div class="scrollbar-log-list">
            <article v-for="item in logItems" :key="item.id" class="scrollbar-log-row">
              <code>{{ item.time }}</code>
              <span>{{ item.text }}</span>
            </article>
          </div>
        </BingScrollbar>
      </ClientOnly>

      <div class="toast-action-row">
        <BingButton size="sm" :throttle="false" @click="scrollApiToTop">顶部</BingButton>
        <BingButton size="sm" :throttle="false" @click="scrollApiDown">下移 120</BingButton>
        <BingButton size="sm" :throttle="false" @click="scrollApiToBottom">底部</BingButton>
        <BingButton size="sm" variant="ghost" :throttle="false" @click="refreshApiMetrics">更新</BingButton>
        <BingButton size="sm" variant="ghost" :throttle="false" @click="stopApiScroll">停止组件插值</BingButton>
        <BingButton size="sm" variant="ghost" :throttle="false" @click="appendLogs">追加并更新</BingButton>
      </div>

      <p class="scrollbar-feedback">
        <span>{{ apiLog }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <p>
        传入数字时，<code>scrollTo(160)</code> 表示设置 <code>scrollTop</code> 为 160；对象写法会直接转给原生 <code>viewport.scrollTo()</code>。
      </p>
    </div>
  </div>

  <BingCodeBlock :code="exposeCode" language="vue" title="代码示例" wrap />
</template>

<style scoped>
.scrollbar-forward { padding: 12px; border: 1px dashed var(--bing-border-color, #94a3b8); }
</style>
