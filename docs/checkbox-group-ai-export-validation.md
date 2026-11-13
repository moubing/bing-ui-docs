# CheckboxGroup 迁移验证

## 0.16.0 联动升级（2026-11-09）

12 项属性；增加 dragSelect/rangeSelect 默认值、输入边界和单次 change 说明，新增刷选与 Shift 范围示例。 网页、独立 SFC、正文和 AI 导出已同步。本节取代下方历史记录中的旧 API 行为说明，原记录保留用于追溯。

本批验证范围、命令和发布状态见 [0.16.0 下游联动验证](bing-ui-0.16.0-validation.md)。

## 历史验证

适用 `@moubing/bing-ui 0.5.3`。正文位于 `content/components/checkbox-group.md`，10 项属性、4 项 Option 字段、1 个插槽与 4 个事件位于 `shared/docs/checkbox-group.ts`。

五个独立示例覆盖基础配置、配置选项、默认插槽、事件和错误状态，均补齐导入、样式、状态和事件函数。网页复制代码与 `pnpm docs:export checkbox-group` 的输出完全一致，基础代码随排列、尺寸、状态和禁用开关同步。原来针对短代码片段的高亮行号已移除，避免高亮完整 SFC 中无关的行。

保留原有 URL、章节 ID、四个预览区、主题样式及所有交互。0.5.3 的 Group 自动 ID/name 会在不同实例重复；完整示例与网页各个选项组显式提供 ID 和 name，避免冲突。没有修改组件包。

## 阅读和运行核对

- 模型是 `Array<string | number>`，不是布尔数组。全选会排除禁用项，清空写入空数组。
- 默认插槽替代 options。导出插槽示例故意同时传入一条 options，浏览器确认只显示三个手写子项，子项共享 Group 的值与 name。
- `change` 接收完整数组和原始 Event 两个参数；事件示例验证事件类型为 change。
- 组内移动焦点不会重复触发组级 focus/blur，离开整组时才触发 blur。
- error 状态仍允许选择和清空，设置 aria-invalid 和说明关联；最少数量需使用 Form schema 或业务规则。

这些是同一助手对生成文档的阅读、应用及浏览器核对，没有进行独立模型盲测。

## 验证结果

- 导出检查与 14 项导出测试通过；所有已接入组件的表格内容、代码来源、确定性和清单 SHA 一致。
- `typecheck:docs`、`typecheck:tests` 与 `typecheck:ai-examples` 通过。4 个组件共 14 个导出 SFC，连同既有 2 个理解用例均通过严格检查。
- CheckboxGroup 网页 6 项通过：1440/390px、明暗主题、根主题属性、原有锚点和区块、无横向页面溢出、组 ID/name 唯一、参数交互、五段代码复制及焦点边界。
- 独立导出示例浏览器 3 项通过，覆盖全部五个文件、数组交互、插槽、状态和事件。
- 采集预览区截图进行人工检查，临时截图不作为像素回归基线提交。
- 全站类型检查仍是迁移前已有的 15 项错误，没有 CheckboxGroup 新增错误；未运行完整构建。
