<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingTextarea } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const note = ref('🙂')
const inputCount = ref(0)
const clearCount = ref(0)
const readonly = ref(false)
const autosize = ref(false)
</script>

<template>
  <BingTextarea v-model="note" clearable :readonly="readonly" :autosize="autosize ? { minRows: 1, maxRows: 4 } : false" :max-length="2" show-count ariaLabel="短备注" @input="inputCount++" @clear="clearCount++" />
  <BingButton @click="note = '超出最大长度'">程序赋值</BingButton>
  <BingButton @click="readonly = !readonly">切换只读</BingButton>
  <BingButton @click="autosize = !autosize">切换自动高度</BingButton>
  <BingButton @click="note = '第一行\n第二行\n第三行\n第四行\n第五行'">填入多行</BingButton>
  <p role="status">模型长度：{{ note.length }}；input：{{ inputCount }}；clear：{{ clearCount }}</p>
</template>
