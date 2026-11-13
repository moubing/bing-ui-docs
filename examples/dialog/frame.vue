<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingDialog, BingInput, BingTabs } from '@moubing/bing-ui'
import type { BingTabValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const open = ref(false)
const compact = ref(false)
const tab = ref<BingTabValue>('members')
const tabs = [{ value: 'members', label: '项目成员' }, { value: 'preferences', label: '显示偏好' }]
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; gap: 12px;">
    <BingButton @click="compact = false; open = true">打开项目设置</BingButton>
    <BingButton variant="secondary" @click="compact = true; open = true">打开账号表单</BingButton>
    <BingDialog v-model="open" :title="compact ? '修改密码' : '项目设置'" :width="compact ? 480 : 900"
      :max-width="900" :height="compact ? 480 : 600" :show-peek="false">
      <template v-if="!compact" #header-addon>
        <BingTabs v-model="tab" :items="tabs" ariaLabel="设置分类" />
      </template>
      <div v-if="compact" style="display: grid; gap: 20px;">
        <BingInput type="password" placeholder="当前密码" block />
        <BingInput type="password" placeholder="新密码" block />
      </div>
      <div v-else style="display: grid; gap: 16px;">
        <p v-for="index in 24" :key="index">{{ tab === 'members' ? '成员' : '偏好' }}设置 {{ index }}：头部分类和底部操作保持可见。</p>
      </div>
    </BingDialog>
  </div>
</template>
