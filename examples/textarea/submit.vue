<script setup lang="ts">
import { ref, useId } from 'vue'
import { BingTextarea } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const note = ref('')
const description = ref('')
const submitted = ref('')
const height = ref(0)
const notifications = ref(0)
const hint = useId()
function resize(value: number) { height.value = value; notifications.value++ }
</script>
<template>
  <div style="display: grid; gap: 16px; min-width: 0">
    <p :id="hint">短标注 Enter 提交、Shift+Enter 换行；清除后 5 秒内且焦点仍在控件内，可 Ctrl / ⌘+Z 撤销。</p>
    <BingTextarea v-model="note" submit-on="enter" :ariaDescribedby="hint" ariaLabel="快捷提交标注" :rows="1" :autosize="{ minRows: 1, maxRows: 4 }" clearable show-count :max-length="100" :count-formatter="(count, max) => count + ' / ' + max + ' 字符'" block @submit="submitted = $event" @resize="resize" />
    <p role="status">提交：{{ submitted }}；高度 {{ height }}px；高度通知 {{ notifications }} 次</p>
    <p :id="hint + '-long'">长说明使用 Ctrl / ⌘+Enter 提交；普通 Enter 换行，默认无清除按钮。</p>
    <BingTextarea v-model="description" submit-on="mod-enter" :ariaDescribedby="hint + '-long'" ariaLabel="长说明快捷提交" :autosize="{ minRows: 2, maxRows: 6 }" block @submit="submitted = $event" />
  </div>
</template>
