# 组件文档迁移记录

按组件依次完成 Markdown 正文、共享 API、独立 Vue 示例、AI 导出与验证，每完成一个组件单独提交。适用组件包为 `@moubing/bing-ui 0.5.3`；完整覆盖范围由 `scripts/lib/doc-registry.ts` 生成到 `public/ai/manifest.json`。

> 本文件保留 0.5.3 的历史验证范围。0.6.0 已完成 34 个组件的重新验收，当前结论见[更新计划](bing-ui-0.6.0-update-plan.md)和[整体收尾记录](bing-ui-0.6.0-stage-8.md)。

## 已完成

| 组件 | 独立示例 | 验证记录 |
| --- | --- | --- |
| Form | 2 | [导出验证](form-ai-export-validation.md) |
| FormItem | 3 | [导出验证](form-item-ai-export-validation.md) |
| Tabs | 4 | [迁移验证](tabs-ai-export-validation.md) |
| CheckboxGroup | 5 | [迁移验证](checkbox-group-ai-export-validation.md) |
| RadioGroup | 4 | [迁移验证](radio-group-ai-export-validation.md) |
| Checkbox | 5 | [迁移验证](checkbox-ai-export-validation.md) |
| Radio | 4 | [迁移验证](radio-ai-export-validation.md) |
| Button | 5 | [迁移验证](button-ai-export-validation.md) |
| Tag | 5 | [迁移验证](tag-ai-export-validation.md) |
| Textarea | 5 | [迁移验证](textarea-ai-export-validation.md) |
| CodeBlock | 4 | [迁移验证](code-block-ai-export-validation.md) |
| Icon | 4 | [迁移验证](icon-ai-export-validation.md) |
| Input | 5 | [迁移验证](input-ai-export-validation.md) |
| Card | 6 | [迁移验证](card-ai-export-validation.md) |
| Resizable | 5 | [迁移验证](resizable-ai-export-validation.md) |
| Scrollbar | 4 | [迁移验证](scrollbar-ai-export-validation.md) |
| Toast | 4 | [迁移验证](toast-ai-export-validation.md) |
| Tooltip | 4 | [迁移验证](tooltip-ai-export-validation.md) |
| Dialog | 4 | [迁移验证](dialog-ai-export-validation.md) |
| DropDown | 4 | [迁移验证](drop-down-ai-export-validation.md) |
| Image | 5 | [迁移验证](image-ai-export-validation.md) |
| ImagePreview | 4 | [迁移验证](image-preview-ai-export-validation.md) |
| FilePreview | 3 | [迁移验证](file-preview-ai-export-validation.md) |
| AnimatedText | 4 | [迁移验证](animated-text-ai-export-validation.md) |
| AppSwitcherTransition | 3 | [迁移验证](app-switcher-transition-ai-export-validation.md) |
| CarouselTransition | 3 | [迁移验证](carousel-transition-ai-export-validation.md) |
| DeckTransition | 3 | [迁移验证](deck-transition-ai-export-validation.md) |
| ColorPicker | 4 | [迁移验证](color-picker-ai-export-validation.md) |
| DatePicker | 5 | [迁移验证](date-picker-ai-export-validation.md) |
| Select | 7 | [迁移验证](select-ai-export-validation.md) |
| SortableList | 4 | [迁移验证](sortable-list-ai-export-validation.md) |
| Table | 5 | [迁移验证](table-ai-export-validation.md) |
| TreeSelect | 5 | [迁移验证](tree-select-ai-export-validation.md) |

Form/FormItem 与导出基础保存于提交 `02319d9`。其余组件分别提交，可通过 `git log --oneline -- app/pages/docs/components` 查看。

## 当前结果

截至 2026-09-06，原有 33 个组件页全部完成迁移，共 141 个完整示例；没有待迁移的现有组件页。

最终检查：全部导出与来源一致，74 项导出测试通过；文档、测试和 Nuxt 全站类型检查通过；141 个导出 SFC 加 31 个阅读应用，共 172 个文件通过严格类型检查。各组件的无头交互测试及截图检查见上表记录；最终另复查了目录、页面往返、system 主题与跨组件导航。没有运行完整构建。

组件包仍为 0.5.3。导出清单保留 experimental 标识，阅读应用是同一助手的验证，尚未进行独立模型盲测。历史版本快照、远程发布与使用方入口调整不属于这轮组件迁移；当前可以直接从本地 public/llms.txt 读取所有组件文档。

## 共同约定

- 保留 URL、章节锚点、主题与原有交互；浏览器验证使用无头模式。
- 截图统一保存为临时检查材料，不维护固定像素基线。原 Form/FormItem/Tabs 的 36 张基线已移除，历史对照可从 Git 查看；各组件继续保留交互、结构和导出断言。自动测试通过不代表外观完全一致，样式改动仍需查看截图。
- 网页代码区和 AI 导出共用 `examples/<组件名>/*.vue`；展示参数不应被理解为组件默认值。
- 生成结果随源码提交。单组件命令为 `pnpm docs:export <组件名>`；`pnpm docs:check` 检查全部已完成组件。
- 导出示例在独立 Vue/Vite 环境检查，不依赖 Nuxt 自动导入或文档站别名。
- 这是文档迁移，不包含组件包发布、历史版本快照、推送或部署。
