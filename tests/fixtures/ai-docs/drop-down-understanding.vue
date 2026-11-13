<script setup lang="ts">
// 根据导出文档重组，验证受控请求、主菜单键盘行为及子菜单边界。
import { ref } from 'vue'
import { BingButton, BingDialog, BingDropDown, BingDropDownItem } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const open = ref(false)
const compositionMode = new URLSearchParams(location.search).has('composition')
const dialogOpen = ref(false)
const accept = ref(false)
const events = ref<string[]>([])
function record(value: string) { events.value.push(value) }
function update(value: boolean) { record(`update:${value}`); if (accept.value) open.value = value }
</script>

<template>
  <div style="padding: 32px; min-height: 600px">
    <label><input v-model="accept" type="checkbox">接收更新</label>
    <BingDropDown :open="open" :loop="false" ariaLabel="阅读菜单"
      @update:open="update" @open="record('open')" @close="record('close')"
      @after-enter="record('after-enter')" @after-leave="record('after-leave')">
      <template #trigger="{ triggerProps }"><button type="button" v-bind="triggerProps">受控锚点</button></template>
      <template #header><strong>文档阅读菜单</strong></template>
      <BingDropDownItem title="Alpha" shortcut="F2" :close-on-click="false" @click="record('Alpha')" />
      <BingDropDownItem title="Beta disabled" disabled @click="record('Beta')" />
      <BingDropDownItem title="Gamma prevented" @click.prevent="record('Gamma')" />
      <BingDropDownItem title="Delta parent" close-on-click @click="record('Delta')">
        <template #submenu>
          <BingDropDownItem title="Child one" @click="record('Child one')" />
          <BingDropDownItem title="Child two" @click="record('Child two')" />
        </template>
      </BingDropDownItem>
      <BingDropDownItem title="Disabled link" href="https://example.com" disabled @click="record('Disabled link')" />
      <template #footer><small>快捷键文本不注册操作</small></template>
    </BingDropDown>
    <BingDropDown trigger="hover" ariaLabel="悬停菜单">
      <template #trigger="{ triggerProps }"><button type="button" v-bind="triggerProps">悬停锚点</button></template>
      <BingDropDownItem active :close-on-click="false" ariaLabel="自定义标题">
        <template #prefix><span>★</span></template>
        <template #default>默认插槽标题</template>
        <template #description>说明插槽</template>
        <template #suffix><span>已选</span></template>
      </BingDropDownItem>
    </BingDropDown>
    <p id="state">{{ JSON.stringify({ open, events }) }}</p>
    <template v-if="compositionMode">
      <BingButton @click="dialogOpen = true">打开菜单弹窗</BingButton>
      <BingDialog v-model="dialogOpen" title="菜单组合">
        <BingDropDown>
          <template #trigger="{ triggerProps }"><BingButton v-bind="triggerProps">弹窗操作</BingButton></template>
          <BingDropDownItem title="导出格式"><template #submenu><BingDropDownItem title="JSON" /><BingDropDownItem title="CSV" /></template></BingDropDownItem>
        </BingDropDown>
      </BingDialog>
    </template>
  </div>
</template>
