<script setup lang="ts">
import { BingRadio, BingCheckbox, BingCodeBlock, BingDatePicker, BingRadioGroup } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, typeOptions, sizeOptions, statusOptions, playgroundType, playgroundSize, playgroundStatus, playgroundRange, playgroundClearable, playgroundLocale, playgroundShowShortcuts, playgroundBlock, playgroundDisabled, playgroundValue, eventLog, playgroundPlaceholder, playgroundValueText, updateType, updateSize, updateStatus, handlePlaygroundChange, handlePlaygroundConfirm, playgroundCode } = useExamples()
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example">
    <div class="doc-example__preview date-picker-demo-stage">
      <p class="preview-label">实时预览</p>
        <BingDatePicker
          id="date-picker-basic"
          :key="JSON.stringify([playgroundType, playgroundRange, playgroundDisabled])"
          ariaLabel="选择日期值"
          v-model="playgroundValue"
          :type="playgroundType"
          :range="playgroundRange"
          :placeholder="playgroundPlaceholder"
          start-placeholder="开始"
          end-placeholder="结束"
          :size="playgroundSize"
          :status="playgroundStatus"
          :clearable="playgroundClearable"
          :show-shortcuts="playgroundShowShortcuts"
          :block="playgroundBlock"
          :disabled="playgroundDisabled"
          :locale="playgroundLocale"
          @change="handlePlaygroundChange"
          @confirm="handlePlaygroundConfirm"
        />

      <p class="date-picker-feedback">
        <span>当前值：{{ playgroundValueText }}</span><span>{{ eventLog }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <div class="control-group">
        <p class="control-label">类型</p>
        <BingRadioGroup id="date-picker-control-1" name="date-picker-control-1"
          :model-value="playgroundType"
          direction="column"
          size="sm"
          aria-label="DatePicker 类型"
          @update:model-value="updateType">
          <BingRadio v-for="option in typeOptions" :id="`date-picker-control-1-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-group">
        <p class="control-label">尺寸</p>
        <BingRadioGroup id="date-picker-control-2" name="date-picker-control-2"
          :model-value="playgroundSize"
          direction="row"
          size="sm"
          aria-label="DatePicker 尺寸"
          @update:model-value="updateSize">
          <BingRadio v-for="option in sizeOptions" :id="`date-picker-control-2-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-group">
        <p class="control-label">状态</p>
        <BingRadioGroup id="date-picker-control-3" name="date-picker-control-3"
          :model-value="playgroundStatus"
          direction="wrap"
          size="sm"
          aria-label="DatePicker 状态"
          @update:model-value="updateStatus">
          <BingRadio v-for="option in statusOptions" :id="`date-picker-control-3-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-group">
        <p class="control-label">日历语言</p>
        <BingRadioGroup :model-value="playgroundLocale" @update:model-value="playgroundLocale = String($event)" ariaLabel="日历语言"
          :options="[{ label: '中文', value: 'zh-CN' }, { label: 'English', value: 'en-US' }]" size="sm" />
      </div>
      <BingCheckbox v-model="playgroundRange" label="范围选择" />
      <BingCheckbox v-model="playgroundClearable" label="允许清除" />
      <BingCheckbox v-model="playgroundShowShortcuts" label="显示快捷选择" />
      <BingCheckbox v-model="playgroundBlock" label="宽度撑满" />
      <BingCheckbox v-model="playgroundDisabled" label="禁用" />
    </div>
  </div>

  </ClientOnly>

  <BingCodeBlock
    :code="playgroundCode"
    language="vue"
    title="代码示例"
    max-height="520px"
  />
</template>
