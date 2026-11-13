# 0.17.0 下游联动验证

日期：2026-11-10。npm 已发布 `@moubing/bing-ui@0.17.0`，版本查询与 `latest` 一致，发布提交为 `7afa826`。文档站精确安装正式包，锁文件由 pnpm 生成；下列验证均未设置 `BING_UI_CANDIDATE_DIR`。

## 文档与示例

- Select / TreeSelect 的正文、API、预览和 AI 导出改为正式版本说明，移除本轮功能的候选提示，保留早期验证记录。
- 同步字符定位、英文/拼音首字母搜索、命中区间插槽、Select 面板内三态全选与计数、TreeSelect 搜索展开快照及标签折叠行为。
- TreeSelect 保留自然高度与展开收起动画；本次发布不包含已回退的面板冻结、底部占位方案。
- 全部 40 个组件的 AI 文档、版本清单、内容摘要和 `llms.txt` 由 `pnpm docs:export` 重新生成。

## 正式包验证

- `pnpm typecheck`、`pnpm typecheck:docs`、`pnpm typecheck:tests` 通过。
- `pnpm typecheck:ai-examples`：40 个组件、212 个 SFC 严格类型检查通过。
- `pnpm test:docs-export`：90 项通过；`pnpm docs:check` 通过。
- Select / TreeSelect 文档页：19 项无头 Playwright 用例通过，覆盖 1440 / 390px、明暗主题、API、复制代码、搜索、键盘定位、级联、虚拟列表与浮层卸载。
- Select / TreeSelect 独立导出示例及阅读应用：24 项无头用例通过，覆盖搜索恢复展开状态、`matchRanges` 插槽、批量范围、末项键盘定位、弹窗焦点及实例隔离。
- 检查窄屏 Select 浮层与深色 TreeSelect 预览截图，控件、说明和边界正常。

导出结构测试原先把正文中的键盘说明表也算成 API 表，导致 TreeSelect 表格数量断言失败。现按完整表头识别 API 表，仍核对数量、顺序、所有字段和逐行内容；正文说明表可正常保留。

组件库发布前的 700 项单元测试、350 项浏览器测试及构建通过。TreeSelect 动画测试改用样式变更记录捕获短暂高度动画，DatePicker 缩放测试改为等待实际布局切换，避免固定等待和轮询错过动画状态造成偶发超时；未放宽原有行为断言。

本轮未运行文档站完整构建或视觉快照回归，未修改视觉快照。浏览器使用系统 Chrome 的无头模式，仅通过进程环境变量选择，不提交机器路径配置。
