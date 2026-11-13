<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingDropDown, BingDropDownItem } from '@moubing/bing-ui'
import { Archive, Download, ExternalLink, Link2, Share2, ShieldAlert, Star, Trash2, Upload } from 'lucide-vue-next'
import '@moubing/bing-ui/style.css'

const feedback = ref('等待选择')
function action(value: string) { feedback.value = `已选择：${value}（仅本地演示）` }
</script>

<template>
  <div class="stage">
    <BingDropDown min-width="286px" placement="bottom-start" ariaLabel="资源操作">
      <template #trigger="{ triggerProps }">
        <BingButton v-bind="triggerProps" :throttle="false">资源操作</BingButton>
      </template>
      <BingDropDownItem title="分享" :icon="Share2" :close-on-click="false">
        <template #submenu>
          <BingDropDownItem title="复制链接" description="任何成员可访问" :icon="Link2" @click="action('复制链接')" />
          <BingDropDownItem title="邀请评审" description="仅评论权限" :icon="Share2" @click="action('邀请评审')" />
          <BingDropDownItem title="权限提醒" tone="warning" :icon="ShieldAlert" @click="action('权限提醒')" />
        </template>
      </BingDropDownItem>
      <BingDropDownItem title="下载" description="打包当前资源" :icon="Download" shortcut="Ctrl+D" @click="action('下载')" />
      <BingDropDownItem title="发布" tone="success" :icon="Upload" shortcut="Ctrl+Enter" @click="action('发布')" />
      <BingDropDownItem title="示例链接" description="渲染为 a 标签" :icon="ExternalLink" href="https://example.com" target="_blank" />
      <BingDropDownItem title="已收藏" type="checkbox" checked :icon="Star" @click="action('已收藏')" />
      <BingDropDownItem title="归档" :icon="Archive" disabled @click="action('归档')" />
      <BingDropDownItem title="删除资源" tone="danger" :icon="Trash2" shortcut="Del" @click="action('删除资源')" />
    </BingDropDown>
    <p role="status">{{ feedback }}</p>
  </div>
</template>

<style scoped>
.stage { min-height: 480px; padding: 24px; }
</style>
