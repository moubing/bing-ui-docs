<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingDropDown, BingDropDownItem, type BingDropDownContextOpenPayload } from '@moubing/bing-ui'
import { Copy, FilePlus2, FolderOpen, PenLine, Trash2 } from 'lucide-vue-next'
import '@moubing/bing-ui/style.css'

type Asset = { id: string; name: string; kind: 'folder' | 'image' | 'package' | 'document'; locked: boolean; deletable: boolean }
const assets: Asset[] = [
  { id: 'brand-kit', name: '品牌资源', kind: 'folder', locked: false, deletable: false },
  { id: 'cover-image', name: '首页封面图', kind: 'image', locked: false, deletable: true },
  { id: 'release', name: 'release-candidate.zip', kind: 'package', locked: true, deletable: false },
  { id: 'handoff', name: '交付说明.md', kind: 'document', locked: false, deletable: true },
]
// 插槽、更新事件和 context-open 的 context 类型都是 unknown，先检查再使用。
const context = ref<unknown>(null)
const feedback = ref('等待右键操作')
function asAsset(value: unknown): Asset | null {
  if (typeof value !== 'object' || value === null) return null
  const record = value as Record<string, unknown>
  return typeof record.id === 'string' && typeof record.name === 'string'
    && typeof record.kind === 'string' && ['folder', 'image', 'package', 'document'].includes(record.kind)
    && typeof record.locked === 'boolean' && typeof record.deletable === 'boolean'
    ? record as Asset : null
}
const selected = computed(() => asAsset(context.value)?.name ?? '未选择资源')
function opened(payload: BingDropDownContextOpenPayload) { feedback.value = `右键打开：${asAsset(payload.context)?.name ?? '未知资源'}` }
function action(label: string, value: unknown) { feedback.value = `${label}：${asAsset(value)?.name ?? '未知资源'}（仅本地演示）` }
</script>

<template>
  <BingDropDown v-model:context="context" trigger="contextmenu" min-width="292px" ariaLabel="资源右键菜单" @context-open="opened">
    <template #trigger="{ getTriggerProps }">
      <div class="resources">
        <button v-for="asset in assets" :key="asset.id" type="button" v-bind="getTriggerProps(asset)">{{ asset.name }}</button>
      </div>
    </template>
    <template #default="{ context: current }">
      <BingDropDownItem v-if="asAsset(current)?.kind === 'folder'" title="打开文件夹" :description="asAsset(current)?.name" :icon="FolderOpen" @click="action('打开', current)" />
      <BingDropDownItem v-else title="预览资源" :description="asAsset(current)?.name" :icon="FilePlus2" @click="action('预览', current)" />
      <BingDropDownItem title="重命名" :disabled="asAsset(current)?.locked ?? true" :icon="PenLine" shortcut="F2" @click="action('重命名', current)" />
      <BingDropDownItem title="复制路径" :icon="Copy" shortcut="Ctrl+Shift+C" @click="action('复制路径', current)" />
      <BingDropDownItem title="删除" tone="danger" :disabled="!asAsset(current)?.deletable" :icon="Trash2" shortcut="Del" @click="action('删除', current)" />
    </template>
  </BingDropDown>
  <p role="status">当前上下文：{{ selected }}；{{ feedback }}</p>
</template>

<style scoped>
.resources { display: grid; gap: 8px; max-width: 420px; }
.resources button { padding: 14px; border: 1px solid var(--bing-border); border-radius: 10px; text-align: left; background: transparent; color: inherit; font: inherit; cursor: context-menu; }
</style>
