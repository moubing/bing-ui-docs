<script setup lang="ts">
import { ref } from 'vue'
import { BingCheckbox } from '@moubing/bing-ui'
import type { BingCheckboxProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

// @docs-options:start
const options: BingCheckboxProps = {
  "label": "启用动效反馈",
  "size": "md",
  "shape": "rounded",
  "tone": "primary",
  "status": "default",
  "indeterminate": false,
  "disabled": false
}
// @docs-options:end

const checked = ref(false)
</script>

<template>
  <BingCheckbox v-model="checked" v-bind="options" id="motion-feedback" name="motion-feedback" />
  <p role="status">当前值：{{ checked }}；半选参数：{{ options.indeterminate }}</p>
</template>
