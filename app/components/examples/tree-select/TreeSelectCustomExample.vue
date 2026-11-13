<script setup lang="ts">
import { BingCodeBlock, BingTag, BingTreeSelect } from '@moubing/bing-ui'
import { onActivated, onDeactivated, ref } from 'vue'
import { useExamples } from './state'
const { workspaceTree, customValue, selectedCustomText, formatValue, metaValue, customCode } = useExamples()
const examplesActive = ref(true)
onActivated(() => { examplesActive.value = true })
onDeactivated(() => { examplesActive.value = false })

function labelParts(label: string, ranges: { start: number; end: number }[] = []) {
  const parts: { text: string; match: boolean }[] = []
  let offset = 0
  for (const range of ranges) {
    if (offset < range.start) parts.push({ text: label.slice(offset, range.start), match: false })
    parts.push({ text: label.slice(range.start, range.end), match: true })
    offset = range.end
  }
  if (offset < label.length) parts.push({ text: label.slice(offset), match: false })
  return parts
}
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example demo-grid tree-select-demo-grid">
    <div class="doc-example__preview demo-panel tree-select-demo-stage">
      <p class="preview-label">自定义节点</p>
        <BingTreeSelect
          id="tree-select-customValue" ariaLabel="自定义节点选择" v-model="customValue"
          :options="workspaceTree"
          searchable
          block
          placeholder="选择并查看节点详情"
          :default-expanded-values="['library', 'form', 'motion']"
        >
          <template #value="{ selectedNodes, placeholder }">
            <span class="tree-select-value-slot">
              <span v-if="selectedNodes.length">
                当前：{{ selectedNodes.map((node) => node.label).join('、') }}
              </span>
              <span v-else>{{ placeholder }}</span>
            </span>
          </template>

          <template #node="{ node, selected, indeterminate, matchRanges }">
            <span class="tree-select-node-line">
              <span class="tree-select-node-title">
                <strong><template v-for="(part, index) in labelParts(node.label, matchRanges)" :key="index"><mark v-if="part.match" class="bing-picker__match">{{ part.text }}</mark><template v-else>{{ part.text }}</template></template></strong>
                <small v-if="node.description">{{ node.description }}</small>
              </span>
              <BingTag v-if="metaValue(node, '类型')" size="sm" variant="soft" tone="secondary">
                {{ metaValue(node, '类型') }}
              </BingTag>
              <BingTag v-if="selected" size="sm" variant="soft" tone="success">已选</BingTag>
              <BingTag v-else-if="indeterminate" size="sm" variant="soft" tone="warning">部分</BingTag>
            </span>
          </template>

          <template #node-detail="{ node, selected, indeterminate }">
            <div class="tree-select-node-detail">
              <strong>{{ node.label }}</strong>
              <p>{{ node.description || '这个节点没有额外说明。' }}</p>
              <span v-if="metaValue(node, '类型')">类型：{{ metaValue(node, '类型') }}</span>
              <span v-if="metaValue(node, '状态')">状态：{{ metaValue(node, '状态') }}</span>
              <span v-if="metaValue(node, '引擎')">引擎：{{ metaValue(node, '引擎') }}</span>
              <span>选择状态：{{ selected ? '已选中' : indeterminate ? '部分选中' : '未选中' }}</span>
            </div>
          </template>
        </BingTreeSelect>
      <div class="tree-select-feedback">
        <span>当前文本：{{ selectedCustomText }}</span>
        <span>当前值：{{ formatValue(customValue) }}</span>
      </div>
    </div>

    <div class="doc-example__controls demo-panel tree-select-notes">
      <p class="preview-label">使用建议</p>
      <p>
        如果只是展示一段短说明，直接在节点上放 <code>description</code> 就够了；如果需要展示状态、标签、路径或业务字段，可以使用 <code>node-detail</code> 插槽组织内容。
      </p>
    </div>
  </div>

  </ClientOnly>
  <BingCodeBlock :code="customCode" language="vue" title="代码示例" />
</template>
