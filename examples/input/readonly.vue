<script setup lang="ts">
import { ref } from 'vue'
import { BingCheckbox, BingInput } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const value = ref<string | number | null>('可以聚焦并选择这段内容')
const readonly = ref(true)
const smoothCaret = ref(true)
</script>

<template>
  <div style="display: grid; gap: 16px">
    <BingInput v-model="value" :readonly="readonly" :smooth-caret="smoothCaret" clearable block ariaLabel="只读与光标示例" />
    <BingCheckbox v-model="readonly" label="只读" />
    <BingCheckbox v-model="smoothCaret" label="平滑光标" />
    <p>关闭只读后，可输入文字或用方向键移动光标，切换平滑光标进行对照。</p>
  </div>
</template>
