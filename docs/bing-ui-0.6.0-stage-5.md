# Bing UI 0.6.0 文档更新：第五阶段

日期：2026-09-12。对应[更新计划](bing-ui-0.6.0-update-plan.md)的数据与布局阶段。

## 内容与示例

| 组件 | 更新结果 |
| --- | --- |
| Scrollbar | 中文默认名称；新增 viewport 插槽 API 和原生 textarea 示例，说明 ref、事件绑定、编辑与只读语义，以及内容更新后的测量 |
| Tabs | 中文默认名称；更新中性样式、主题磨砂与 32/36/40px 尺寸说明，补窄屏长标签的键盘定位验证 |
| Resizable | 同步八方向中文手柄名称、细边框与中性参考网格；重验比例、吸附、受控回退、Escape 提交和默认值重置 |
| SortableList | 新增 dragOverlay 属性和独立浮层示例，明确复用插槽、inert、焦点及 ID 边界；更新减少动态效果说明和排序卡片样式 |
| Table | 同步中文内置文案、底部列设置、行高默认值与统一高度测量；新增 Input＋Select＋Button 与加载流程示例，说明全文提示、控件点击和旧数据保留 |

保留原有路由、章节与页面组织。新增 Scrollbar 自定义视口、SortableList 拖拽浮层、Table 控件与加载三个示例，网页直接复用独立 SFC；这些独立预览占满示例容器宽度。独立示例累计 148 个，连同阅读应用共 182 个 SFC。

Table 虚拟行高输入默认留空，省略固定 48px；空值不再被转成 0。实际默认随 sm/md/lg 使用 36/40/44px，虚拟模式可根据已挂载内容向上修正统一行高。常规示例降低字重、去除重阴影与渐变，使用组件库语义颜色。

## 验证

- 五个组件网页用例共 37 项通过：Scrollbar 7、Tabs 7、Resizable 7、SortableList 8、Table 8；涵盖浅深主题、1440/390px、章节/API、真实剪贴板和缓存页面退出。
- 独立导出及阅读应用共 37 项通过：Scrollbar 6、Tabs 4、Resizable 5、SortableList 10、Table 12。Table 补验列面板内独立浮层拖拽后继续键盘排序。
- 新示例验证 textarea 编辑/只读、长标签 End 定位、拖拽浮层不可交互、表格全文 Tooltip、嵌入控件不误选行、加载保留旧数据及高度、视口 inert 和分页恢复。
- 人工查看代表性浅深主题及窄屏截图，包括调整尺寸网格、排序卡片、原生文本编辑器、表格列面板、输入焦点与加载遮罩。
- 全站 182 个 SFC 严格类型检查、Nuxt、文档和测试 TypeScript 检查通过；导出测试 76 项与 `docs:check` 通过。
- r5 收尾复验三个新增预览的复制与交互，并验证 Button、Table 的已验收状态与 Image 的待迁移提示、AI 清单一致。

文档修订为 r5，累计 25 个已验证组件；剩余 8 个已有组件保留迁移提示，Cursor 待新增。全程使用系统 Chrome 无头模式及临时环境变量，没有运行完整构建或更新像素快照。

## 仍保留的边界

- Scrollbar 自定义 viewport 需自行承担角色、名称、焦点、尺寸和禁用语义；组件实例不能代替真实 DOM 元素。水平 Shift 滚轮兼容处理不等同于关闭 smooth 后所有路径都完全原生。
- Resizable 的 Escape 提交当前结果，比例锁定不隐藏角手柄；父容器与比例约束可能冲突，未同步的受控状态会回退。
- SortableList 禁用项不能主动排序，但并非固定索引；live 已提交结果不会因取消自动撤销。浮层复用默认插槽，不能依赖插槽只挂载一次。
- Table 的 sortKey/sortOrder 为 null 时仍可能回退内部默认排序；defaultExpandAll 在数据变化后会重置非受控展开。表头拖拽仍可能覆盖 th 的角色，未宣称完整 columnheader 语义。
- Table loading 不统一禁用业务工具栏、列设置和实例方法；跨页选择键可保留，但事件 rows 只解析当前 data。row-click 仍先于交互源过滤发送。

下一阶段为 Image、ImagePreview、FilePreview、CodeBlock、AnimatedText 及三个转场组件。

## 临时文件

测试命令和临时浏览器均已结束。清理以下 19 个本阶段目录时，命令已核对绝对路径和父目录，但自动审批在执行前拒绝，原因为 `blocked by policy`。没有换用其他方式删除；文件保留在 `test-results/`，不纳入提交：

`stage5-column-tabs-ai`、`stage5-final-site`、`stage5-resizable-ai`、`stage5-resizable-site`、`stage5-scroll-tabs-ai`、`stage5-scroll-tabs-site`、`stage5-scrollbar-ai`、`stage5-scrollbar-site`、`stage5-sortable-ai`、`stage5-sortable-site`、`stage5-table-ai`、`stage5-table-complete-ai`、`stage5-table-complete-site`、`stage5-table-controls-ai`、`stage5-table-current-ai`、`stage5-table-site`、`stage5-table-sortable-verified`、`stage5-table-verified-ai`、`stage5-table-visual`。

前几阶段已被拒绝的清理项未重新尝试。
