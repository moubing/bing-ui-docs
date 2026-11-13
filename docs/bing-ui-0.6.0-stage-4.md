# Bing UI 0.6.0 文档更新：第四阶段

日期：2026-09-12。对应[更新计划](bing-ui-0.6.0-update-plan.md)的选择器与浮层阶段。

## 内容与示例

| 组件 | 更新结果 |
| --- | --- |
| TreeSelect | 中文默认文案、触发器与节点尺寸、主题磨砂、唯一内部 ID；虚拟示例省略固定 46px，按 sm/md/lg 使用 28/32/36px 行高，仍可显式调整 |
| DatePicker | 默认 zh-CN、月份/星期显示、220px 触发器、主题磨砂；基础预览新增语言切换，窄屏快捷区正常展示 |
| ColorPicker | 中文预设与复制文案、280px 默认触发器、主题磨砂；更正 v-model 回传保留面板 alpha 的行为，说明重新挂载仍需保存完整颜色；文本框 Escape 先结束编辑 |
| DropDown | 220px 默认最小宽度、28/32/36px 菜单项、中文名称、磨砂；删除子菜单方向键和焦点返回的旧限制，补上 Dialog 组合验证 |
| Tooltip | 新磨砂默认值、中性演示容器；验证共享面板、受控可见性、延迟和 Dialog 内交互 |
| Dialog | 默认无光圈，中文回退名称；更新焦点进入/循环/恢复、唯一标题、顶层 Escape、共享滚动锁说明；新增 Form＋Select＋二次确认示例 |
| Toast | 更新中性调用卡和消息外观说明；复验单视口、整条替换和全队列计时；位置演示增加顶部留白，网页同步展示两个位置别名 |

公共样式仅调整本阶段的示例区域，移除多余渐变、粉色悬停边框和重阴影，降低标题与状态字重。保留原有页面结构、字体及既有章节，Dialog 新增 `nested` 章节。

新增 `examples/dialog/nested.vue`，网页预览直接使用同一 SFC。独立示例总数由 144 增至 145；连同阅读应用共 178 个 SFC。七个组件的正文/API、预览、复制代码、独立示例和 AI 文档已同步。

## 验证

- 最终网页回归 63 项通过：浅深主题、1440/390px、章节/API、实际剪贴板、控件参数、缓存页面退出和浮层清理。
- 最终独立导出及阅读应用 65 项通过：TreeSelect 12、DatePicker 10、ColorPicker 9、DropDown 9、Tooltip 8、Dialog 10、Toast 7。
- 组合覆盖 Dialog 内的 Form、Select、TreeSelect、DatePicker、ColorPicker 及格式 Select、DropDown 子菜单、Tooltip；验证焦点可达和 Escape 的作用范围。
- 人工查看各组件代表截图，包括窄屏日历及快捷区、颜色面板、多级菜单、浅深 Tooltip 富内容、Dialog 表单/自定义底部，以及长文本 Toast。
- 全站 178 个 SFC 的严格类型检查、Nuxt、文档和测试 TypeScript 检查通过；导出测试 76 项通过。
- r4 生成后 `docs:check` 通过；另外两项迁移用例验证 Button、TreeSelect 的已验收状态与 Tabs 的待迁移提示、AI 清单一致。

文档修订为 r4，已验证覆盖累计 20 个；其余 13 个已有组件继续标为迁移中，Cursor 待新增。浏览器全部使用系统 Chrome 无头模式，通过临时参数选择；没有运行完整构建或更新像素快照。

## 仍保留的边界

- DatePicker 打开后外部模型不会同步当前草稿；动态 disabled 不会关闭已打开面板，已打开日期仍可能提交；清空前先关闭面板。
- TreeSelect 级联模式下，不可选后代全部被排除时的父节点归一化边界仍存在；节点详情的可访问性限制保留。
- ColorPicker 的模型更新仍为六位 HEX；需用 `change.rgba` 等格式持久化透明度。文本框 Escape 不是完整撤销。
- 带 submenu 的 DropDown 父项即使设置 closeOnClick=true 仍不会自动关闭。
- 自定义 Dialog title 插槽会替换默认标题节点；同时传 title 仍可能留下无目标的 aria-labelledby，继续推荐省略 title 并提供 ariaLabel。glass/glassOpacity 仍为主体未读取的兼容字段。
- Tooltip 多实例共享一个面板，实际显示状态以插槽 open 为准；Toast 仍由最先注册的视口独占显示。

下一阶段处理 Scrollbar、Tabs、Resizable、SortableList、Table。

## 临时文件

全部测试命令及临时浏览器已结束。清理以下 18 个本阶段目录的命令含绝对路径和父目录校验，但自动审批在执行前拒绝，原因为 `blocked by policy`。没有改用其他方式删除，文件保留在 `test-results/` 且不纳入提交：

`stage4-color-ai`、`stage4-color-site`、`stage4-color-verified`、`stage4-date-ai`、`stage4-date-site`、`stage4-dialog-ai`、`stage4-dialog-toast-ai`、`stage4-dialog-toast-site`、`stage4-dropdown-ai`、`stage4-dropdown-site`、`stage4-final-ai`、`stage4-final-site`、`stage4-tooltip-ai`、`stage4-tooltip-site`、`stage4-tooltip-visual`、`stage4-tree-ai`、`stage4-tree-site`、`stage4-migration-final`。

前几阶段被拒绝的清理项继续保留，未重新尝试删除。
