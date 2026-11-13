<script setup lang="ts">
import { BingCodeBlock, BingScrollbar } from '@moubing/bing-ui'
import { useExamples } from './state'
const { horizontalColumns, horizontalCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview scrollbar-demo-stage">
      <ClientOnly>
        <BingScrollbar height="180px" horizontal always aria-label="横向内容">
          <div class="scrollbar-wide-lane">
            <article
              v-for="column in horizontalColumns"
              :key="column.id"
              class="scrollbar-column-card"
            >
              <strong>{{ column.title }}</strong>
              <span>{{ column.description }}</span>
            </article>
          </div>
        </BingScrollbar>
      </ClientOnly>
    </div>

    <div class="doc-example__controls">
      <p>
        横向内容通常需要给内部内容设置明确宽度或 grid 列宽。BingScrollbar 不会改变内容布局，只负责 viewport 和滚动条。
      </p>
    </div>
  </div>

  <BingCodeBlock :code="horizontalCode" language="vue" title="代码示例" wrap />
</template>
