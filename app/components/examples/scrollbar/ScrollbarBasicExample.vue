<script setup lang="ts">
import { BingCheckbox, BingCodeBlock, BingInput, BingScrollbar } from '@moubing/bing-ui'
import { useExamples } from './state'
const { verticalItems, playgroundHeight, playgroundMinThumbSize, playgroundTolerance, playgroundAlways, playgroundVertical, playgroundHorizontal, playgroundDisabled, playgroundLog, handlePlaygroundScroll, normalizeNumber, playgroundCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--wide">
    <div class="doc-example__preview scrollbar-demo-stage">
      <ClientOnly>
        <BingScrollbar
          :height="playgroundHeight"
          :min-thumb-size="normalizeNumber(playgroundMinThumbSize, 28)"
          :overflow-tolerance="normalizeNumber(playgroundTolerance, 1)"
          :vertical="playgroundVertical"
          :horizontal="playgroundHorizontal"
          :always="playgroundAlways"
          :disabled="playgroundDisabled"
          aria-label="组件列表"
          @scroll="handlePlaygroundScroll"
        >
          <div class="scrollbar-list">
            <article v-for="item in verticalItems" :key="item.id" class="scrollbar-list-item">
              <strong>{{ item.title }}</strong>
              <span>{{ item.description }}</span>
            </article>
          </div>
        </BingScrollbar>
      </ClientOnly>

      <p class="scrollbar-feedback">
        <span>{{ playgroundLog }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <label class="control-label" for="scrollbar-height">height</label>
      <BingInput id="scrollbar-height" v-model="playgroundHeight" block />

      <label class="control-label" for="scrollbar-thumb">minThumbSize</label>
      <BingInput id="scrollbar-thumb" v-model="playgroundMinThumbSize" block />

      <label class="control-label" for="scrollbar-tolerance">overflowTolerance</label>
      <BingInput id="scrollbar-tolerance" v-model="playgroundTolerance" block />

      <BingCheckbox v-model="playgroundVertical" label="启用纵向滚动条" />
      <BingCheckbox v-model="playgroundHorizontal" label="启用横向滚动条" />
      <BingCheckbox v-model="playgroundAlways" label="始终显示轨道" />
      <BingCheckbox v-model="playgroundDisabled" label="禁用滚动" />
    </div>
  </div>

  <BingCodeBlock :code="playgroundCode" language="vue" title="代码示例" wrap />
</template>
