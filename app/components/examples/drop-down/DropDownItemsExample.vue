<script setup lang="ts">
import { Archive, Download, ExternalLink, Link2, Settings2, Share2, ShieldAlert, Star, Trash2, Upload } from 'lucide-vue-next'
import { BingButton, BingCodeBlock, BingDropDown, BingDropDownItem, BingIcon } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, itemFeedback, recordItemAction, itemCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview dropdown-demo-stage">
      <p class="preview-label">菜单项组合</p>
      <ClientOnly v-if="examplesActive">
        <BingDropDown min-width="286px" placement="bottom-start" ariaLabel="资源操作">
          <template #trigger="{ triggerProps }">
            <BingButton v-bind="triggerProps" variant="primary" :throttle="false">
              <template #prefix>
                <BingIcon :icon="Settings2" size="sm" />
              </template>
              资源操作
            </BingButton>
          </template>

          <BingDropDownItem title="分享" :icon="Share2" :close-on-click="false">
            <template #submenu>
              <BingDropDownItem title="复制链接" description="任何成员可访问" :icon="Link2"  @click="recordItemAction('复制链接')" />
              <BingDropDownItem title="邀请评审" description="仅评论权限" :icon="Share2"  @click="recordItemAction('邀请评审')" />
              <BingDropDownItem title="权限提醒" tone="warning" :icon="ShieldAlert"  @click="recordItemAction('权限提醒')" />
            </template>
          </BingDropDownItem>
          <BingDropDownItem title="下载" description="打包当前资源" :icon="Download" shortcut="Ctrl+D"  @click="recordItemAction('下载')" />
          <BingDropDownItem title="发布" tone="success" :icon="Upload" shortcut="Ctrl+Enter"  @click="recordItemAction('发布')" />
          <BingDropDownItem
            title="示例链接"
            description="链接项会渲染为 a 标签"
            :icon="ExternalLink"
            href="https://example.com"
            target="_blank"
          />
          <BingDropDownItem title="已收藏" type="checkbox" checked :icon="Star"  @click="recordItemAction('已收藏')" />
          <BingDropDownItem title="归档" :icon="Archive" disabled  @click="recordItemAction('归档')" />
          <BingDropDownItem title="删除资源" tone="danger" :icon="Trash2" shortcut="Del"  @click="recordItemAction('删除资源')" />
        </BingDropDown>
      </ClientOnly>
      <p class="dropdown-feedback">{{ itemFeedback }}</p>
    </div>

    <div class="doc-example__controls">
      <p>
        子菜单会根据视口空间自动选择左右方向；链接项自动处理<code>target="_blank"</code> 下的 <code>rel</code>；禁用项不会触发点击。
      </p>
    </div>
  </div>

  <BingCodeBlock :code="itemCode" language="vue" title="代码示例" wrap />
</template>
