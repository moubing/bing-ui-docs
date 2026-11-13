# 0.16.0 下游联动验证

日期：2026-11-09。目标版本：`@moubing/bing-ui@0.16.0`。

当前状态：npm 已发布 `0.16.0`，`latest` 校验一致。文档站与需求看板均已精确安装正式版本，锁文件由 pnpm 生成；候选 tarball 路径已移除。7 组组件迁移标记已完成，全部 AI 导出重新生成，`pnpm ui:check --check-versions` 通过。

组件库发布提交为 `4df46d1`（`chore(release): 0.16.0`）。正式包与候选包 SHA-512 一致；发布后再次通过新增交互的 8 项浏览器用例、全部 90 项导出测试及 `pnpm docs:check`。

## 文档与示例

| 组件 | 本轮同步 |
| --- | --- |
| AnimatedText / Button | shimmer、父容器与指针起点、视口/聚焦、play、swap/textSwap、默认 1.6 秒扫光和 2.4 秒间隔；计数、上传、复制/关注切换 |
| Checkbox / CheckboxGroup | 三态、禁用、decorative、命中区域、线宽；dragSelect/rangeSelect 默认关闭、跳过禁用项、结束时一次 change |
| Dialog | 初始焦点、触发方向、忙碌/关闭守卫、拒绝反馈、footer busy、移动贴底和可视视口限制；自定义 footer 直接模型赋值的边界 |
| DropDown | Group/Divider、radio/checkbox 与 checked、typeahead、slide、长按、逐层 Escape、Tab、滚动区结构、编辑器保留焦点 |
| Tooltip | 实际目标 ARIA、triggerProps、replaced、长按、skipDelay、shortcut、inverse、展开抑制、短文案/滚动容器 |

新增 7 个网页与独立示例；网页预览直接复用对应 SFC，复制内容与 AI 导出共用原文件。由脚本生成全部 `public/ai/`、清单及 `public/llms.txt`。

## 已完成验证

- `pnpm typecheck`、`pnpm typecheck:tests` 通过；`pnpm typecheck:ai-examples` 检查全部 40 个组件的 212 个 SFC 通过。
- `pnpm test:docs-export` 全部 90 项和 `pnpm docs:check` 通过，候选/已发布状态按各组件的真实迁移登记导出。
- 7 组组件文档页共 53 项无头浏览器用例通过：1440/390px、亮暗主题、API/目录、逐段代码复制、原交互、浮层和缓存清理。
- 首页、Form/FormItem、Table、Select、TreeSelect 共 51 项无头用例通过：SSR 接管和文字位置、表单校验、全选/半选、列设置、decorative 标记及窄屏浮层。
- 相关独立示例与阅读应用共 56 项用例分别验证通过，包含新增 8 项交互与低视口用例。Tooltip 禁用后不会自动重开，共享替换会同步旧模型；测试按实际新契约更新。
- 390×420 亮暗截图已检查 Dialog、DropDown 和 Tooltip；各浮层在视口内，Dialog 贴底，短 Tooltip 无多余滚动槽。

混合迁移测试显式构造一个已发布组件，避免受当前 Button 候选状态影响；生产迁移登记仍保留真实的 `unreleased` 状态。

## 联调发现与修复

- Checkbox 的减少动态效果 class 改为挂载后更新，避免服务端未获知系统偏好时出现 hydration 警告。
- DropDown 的鼠标右键打开保留触发区域内编辑器焦点；键盘打开及显式 autoFocus 保留进入菜单的行为。普通和 Yjs 表格右键均已验证。
- 更新过时测试：移动 Dialog 铺满宽度、等待 visualViewport 更新、按新菜单语义查询 checked；保留真实键盘和鼠标操作。

浏览器均为无头模式，未运行视觉快照回归或修改快照。移动布局、CDP 组词及合成触屏不能替代实体手机系统输入法、选字和原生长按菜单的验证。
