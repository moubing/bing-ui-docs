<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingCheckbox, BingDialog, BingInput, type BingDialogCloseReason } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const open = ref(false)
const centered = ref(false)
const allowClose = ref(false)
const busy = ref(false)
const name = ref<string | number | null>('草稿')
const rejected = ref<BingDialogCloseReason | ''>('')
async function beforeClose() { return allowClose.value }
</script>

<template>
  <div class="guard">
    <BingCheckbox v-model="centered" label="居中入场" />
    <BingButton @click="open = true">打开关闭拦截示例</BingButton>
    <p role="status">上次拦截：{{ rejected || '无' }}</p>
    <BingDialog v-model="open" title="关闭前检查" :transition-origin="centered ? 'center' : 'auto'" :busy="busy" :before-close="beforeClose" :show-peek="false" @close-prevented="rejected = $event">
      <div class="guard">
        <label for="guard-name">草稿名称</label>
        <BingInput id="guard-name" v-model="name" />
        <BingCheckbox v-model="allowClose" label="允许关闭" />
        <BingCheckbox v-model="busy" label="模拟忙碌" />
      </div>
      <template #footer="{ cancel, busy: pending }">
        <BingButton variant="secondary" :disabled="pending" @click="cancel">取消</BingButton>
        <BingButton :disabled="pending" @click="open = false">保存并收起</BingButton>
      </template>
    </BingDialog>
  </div>
</template>

<style scoped>
.guard { display: grid; gap: 16px; }
.guard p { margin: 0; }
</style>
