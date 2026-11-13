<script setup lang="ts">
import { BingRadio, BingCheckbox, BingCodeBlock, BingInput, BingRadioGroup } from '@moubing/bing-ui'
import { useExamples } from './state'
const { languageOptions, themeOptions, highlightOptions, playgroundLanguage, playgroundTheme, playgroundTitle, playgroundLanguageLabel, playgroundHighlightMode, playgroundHighlightLines, playgroundLineNumbers, playgroundCopyable, playgroundWrap, playgroundMaxHeight, copyLog, highlightLog, playgroundCodeValue, updateLanguage, updateTheme, updateHighlight, handleCopy, handleCopyError, handleHighlightError, playgroundUsageCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--wide">
    <div class="doc-example__preview codeblock-demo-stage">
      <ClientOnly>
        <BingCodeBlock
          :code="playgroundCodeValue"
          :language="playgroundLanguage"
          :theme="playgroundTheme"
          :title="playgroundTitle"
          :language-label="playgroundLanguageLabel"
          :line-numbers="playgroundLineNumbers"
          :copyable="playgroundCopyable"
          :wrap="playgroundWrap"
          :max-height="playgroundMaxHeight"
          :highlight-lines="playgroundHighlightLines"
          @copy="handleCopy"
          @copy-error="handleCopyError"
          @highlight-error="handleHighlightError"
        />
      </ClientOnly>

      <p class="codeblock-feedback">
        <span>{{ copyLog }}</span><span>{{ highlightLog }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <label class="control-label" for="codeblock-title">标题</label>
      <BingInput id="codeblock-title" v-model="playgroundTitle" block clearable />

      <label class="control-label" for="codeblock-label">语言标签</label>
      <BingInput id="codeblock-label" v-model="playgroundLanguageLabel" block clearable />

      <label class="control-label" for="codeblock-height">最大高度</label>
      <BingInput id="codeblock-height" v-model="playgroundMaxHeight" block />

      <div class="control-block">
        <span class="control-label">代码类型</span>
        <BingRadioGroup id="code-block-control-1" name="code-block-control-1"
          :model-value="playgroundLanguage"
          @update:model-value="updateLanguage">
          <BingRadio v-for="option in languageOptions" :id="`code-block-control-1-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-block">
        <span class="control-label">主题</span>
        <BingRadioGroup id="code-block-control-2" name="code-block-control-2"
          :model-value="playgroundTheme"
          @update:model-value="updateTheme">
          <BingRadio v-for="option in themeOptions" :id="`code-block-control-2-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-block">
        <span class="control-label">行高亮</span>
        <BingRadioGroup id="code-block-control-3" name="code-block-control-3"
          :model-value="playgroundHighlightMode"
          @update:model-value="updateHighlight">
          <BingRadio v-for="option in highlightOptions" :id="`code-block-control-3-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <BingCheckbox v-model="playgroundLineNumbers" label="显示行号" />
      <BingCheckbox v-model="playgroundCopyable" label="显示复制按钮" />
      <BingCheckbox v-model="playgroundWrap" label="长行换行" />
    </div>
  </div>

  <BingCodeBlock :code="playgroundUsageCode" language="vue" title="代码示例" wrap />
</template>
