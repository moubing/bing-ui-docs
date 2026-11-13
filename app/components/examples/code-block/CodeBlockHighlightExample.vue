<script setup lang="ts">
import { BingCodeBlock, BingSelect } from '@moubing/bing-ui'
import { useExamples } from './state'
const { longCode, highlightLineOptions, selectedHighlightLines, highlightRangeStart, highlightRangeEnd, highlightRangeEndOptions, selectedHighlightEntries, selectedHighlightLinesText, scrollCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview codeblock-demo-stage">
      <ClientOnly>
        <BingCodeBlock
          :code="longCode"
          language="ts"
          title="metrics.ts"
          language-label="TypeScript"
          :max-height="280"
          :highlight-lines="selectedHighlightEntries"
        />
      </ClientOnly>
    </div>

    <div class="doc-example__controls codeblock-highlight-controls">
      <div class="codeblock-highlight-control">
        <p class="control-label">单行高亮</p>
        <ClientOnly>
          <BingSelect
            v-model="selectedHighlightLines"
            :options="highlightLineOptions"
            multiple
            block
            searchable
            clearable
            :show-select-all="false"
            :panel-max-height="300"
            placeholder="选择单独高亮的行"
            aria-label="选择单独高亮的代码行"
          />
        </ClientOnly>
      </div>

      <div class="codeblock-range-control">
        <div class="codeblock-range-heading">
          <p class="control-label">闭区间高亮</p>
          <code>[{{ highlightRangeStart }}, {{ highlightRangeEnd }}]</code>
        </div>

        <div class="codeblock-range-selects">
          <label class="codeblock-range-field">
            <span>起始行</span>
            <ClientOnly>
              <BingSelect
                v-model="highlightRangeStart"
                :options="highlightLineOptions"
                block
                searchable
                :clearable="false"
                :panel-max-height="300"
                placeholder="起始行"
                aria-label="选择闭区间起始行"
              />
            </ClientOnly>
          </label>

          <span class="codeblock-range-arrow" aria-hidden="true">→</span>

          <label class="codeblock-range-field">
            <span>结束行</span>
            <ClientOnly>
              <BingSelect
                v-model="highlightRangeEnd"
                :options="highlightRangeEndOptions"
                block
                searchable
                :clearable="false"
                :panel-max-height="300"
                placeholder="结束行"
                aria-label="选择闭区间结束行"
              />
            </ClientOnly>
          </label>
        </div>
      </div>

      <p class="codeblock-highlight-summary">
        最终传给 <code>highlightLines</code> 的值是 <code>{{ selectedHighlightLinesText }}</code>。
        数字表示单行，<code>[{{ highlightRangeStart }}, {{ highlightRangeEnd }}]</code>
        表示包含首尾两行的闭区间。
      </p>
    </div>
  </div>

  <BingCodeBlock :code="scrollCode" language="vue" title="代码示例" wrap />
</template>
