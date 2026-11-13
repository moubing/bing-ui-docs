<script setup lang="ts">
import { Copy, FolderOpen, PenLine, Trash2 } from 'lucide-vue-next'
import { BingCodeBlock, BingDropDown, BingDropDownItem, BingIcon } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, contextFeedback, recordContextAction, menuContext, assets, selectedContextName, iconForAsset, getContextName, getContextDescription, isAssetFolder, isContextLocked, isContextDeletable, handleContextOpened, contextCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview dropdown-demo-stage">
      <p class="preview-label">右键资源行</p>
      <ClientOnly v-if="examplesActive">
        <BingDropDown
          v-model:context="menuContext"
          trigger="contextmenu"
          min-width="292px"
          ariaLabel="资源右键菜单"
          @context-open="handleContextOpened"
        >
          <template #trigger="{ getTriggerProps }">
            <div class="dropdown-context-board">
              <button
                v-for="asset in assets"
                :key="asset.id"
                v-bind="getTriggerProps(asset)"
                class="dropdown-context-row"
                type="button"
              >
                <BingIcon :icon="iconForAsset(asset)" size="sm" />
                <span class="dropdown-context-row__content">
                  <strong>{{ asset.name }}</strong>
                  <span>{{ asset.description }}</span>
                </span>
                <span class="dropdown-context-row__status">{{ asset.status }}</span>
              </button>
            </div>
          </template>

          <template #default="{ context }">
            <BingDropDownItem
              v-if="isAssetFolder(context)"
              title="打开文件夹"
              :description="getContextName(context)"
              :icon="FolderOpen"
              @click="recordContextAction('打开', context)"
            />
            <BingDropDownItem
              v-else
              title="预览资源"
              :description="getContextName(context)"
              :icon="iconForAsset(context)"
              @click="recordContextAction('预览', context)"
            />
            <BingDropDownItem
              title="重命名"
              :icon="PenLine"
              shortcut="F2"
              :disabled="isContextLocked(context)"
              @click="recordContextAction('重命名', context)"
            />
            <BingDropDownItem
              title="复制路径"
              :icon="Copy"
              shortcut="Ctrl+Shift+C"
              @click="recordContextAction('复制路径', context)"
            />
            <BingDropDownItem
              title="删除"
              tone="danger"
              :icon="Trash2"
              shortcut="Del"
              :disabled="!isContextDeletable(context)"
              @click="recordContextAction('删除', context)"
            />
          </template>
        </BingDropDown>
      </ClientOnly>
      <p class="dropdown-feedback">{{ contextFeedback }}</p>
    </div>

    <div class="doc-example__controls">
      <p class="control-label">当前上下文</p>
      <div class="dropdown-context-summary">
        <strong>{{ selectedContextName }}</strong>
        <span>{{ getContextDescription(menuContext) }}</span>
      </div>
      <p>
        右键不同资源行可以看到菜单标题、禁用状态和危险操作都会跟随上下文变化。键盘用户也可以通过 Shift + F10 打开同一个菜单。
      </p>
    </div>
  </div>

  <BingCodeBlock :code="contextCode" language="vue" title="代码示例" wrap />
</template>
