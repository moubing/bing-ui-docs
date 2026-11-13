<script setup lang="ts">
import { BingCodeBlock, BingDatePicker, BingInput } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, minDate, maxDate, ruleDate, ruleTime, disabledDate, disabledTime, formatModelValue, disabledRulesCode } = useExamples()
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example">
    <div class="doc-example__preview date-picker-demo-stage">
      <p class="preview-label">实时预览</p>
      <div class="date-picker-rule-grid">
          <BingDatePicker
            id="date-picker-rule-date"
            ariaLabel="工作日日期"
            v-model="ruleDate"
            type="date"
            :min="minDate"
            :max="maxDate"
            :disabled-date="disabledDate"
            placeholder="只允许工作日"
            block
          />
          <BingDatePicker
            id="date-picker-rule-time"
            ariaLabel="营业时间"
            min="09:00:00" max="18:00:00"
            v-model="ruleTime"
            type="time"
            :minute-step="15"
            :second-step="30"
            :disabled-time="disabledTime"
            placeholder="只允许 09:00-18:00"
            block
          />
      </div>

      <p class="date-picker-feedback">
        <span>日期：{{ formatModelValue(ruleDate) }}</span><span>时间：{{ formatModelValue(ruleTime) }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <div class="control-group">
        <p class="control-label">最小日期</p>
        <BingInput id="date-picker-min" ariaLabel="最小日期" v-model="minDate" block />
      </div>
      <div class="control-group">
        <p class="control-label">最大日期</p>
        <BingInput id="date-picker-max" ariaLabel="最大日期" v-model="maxDate" block />
      </div>
      <p class="control-help">
        当前示例会禁用周六和周日；时间示例限制为 09:00:00 到 18:00:00，分钟步进 15、秒步进 30。
      </p>
    </div>
  </div>

  </ClientOnly>

  <BingCodeBlock
    :code="disabledRulesCode"
    language="vue"
    title="代码示例"
    max-height="520px"
  />
</template>
