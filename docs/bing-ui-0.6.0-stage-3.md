# Bing UI 0.6.0 文档更新：第三阶段

日期：2026-09-12。对应[更新计划](bing-ui-0.6.0-update-plan.md)的基础控件与表单阶段。

## 组件变更

| 组件 | 文档及示例更新 | 验证重点 |
| --- | --- | --- |
| Icon | 默认描边改为 1.75，参数面板及完整示例同步 | 装饰模式、可访问名称、尺寸、实际 CSS 描边 |
| Textarea | 增加 readonly；更正中文清除名称、计数及自动高度说明；去掉切换 autosize 时重建组件的旧补丁 | 只读仍可聚焦和选择、隐藏清除按钮；同一节点切换自动高度后清除内联高度与 overflow |
| Checkbox / CheckboxGroup | 更正尺寸与禁用继承，删除重复 ID/name 的旧限制 | 16/18/20px 方框与 32/36/40px 最小点击高度；唯一 ID、组名隔离、整组禁用优先、半选、焦点与事件 |
| Radio / RadioGroup | 更新默认 ID/name 和尺寸；保留 options 使用 String(value) 作为 key 的类型边界 | 标签、数字/字符串/布尔模型、多组独立选择、方向键跳过禁用、focus/blur |
| Tag | 20/24/28px 高度，细边框与胶囊形状说明，中文默认移除名称 | 默认名称、键盘关闭、业务移除、禁用、长文本省略、关闭不冒泡 |
| Form | auto 默认校验，focusOnError=true，nextStepHint=false；参数面板同步；新增独立默认行为示例 | 失焦报错、修改复查、提交失败聚焦、关闭聚焦开关、异步等待继续编辑、真实 Tab 落点及提示退出 |
| FormItem | 唯一字段/消息 ID、标签关联、stack 自动单列、消息过渡；原生控件代码补上真实网页预览 | 标签聚焦、错误消息关联、隐藏消息仍校验、禁用、响应式跨度及保留 span 切换 stack |

Form 新增 `auto-focus.vue`，全站独立示例从 143 个增加到 144 个。新预览直接复用独立 SFC；动态参数与网页复制代码保持同步。

九个组件的 API/正文、网页预览、独立示例、AI 导出及验证均已完成。文档修订为 r3，已验证覆盖累计 13 个；其余 20 个已有组件继续标为迁移中，Cursor 待新增。

## 验证

- 网页检查：Icon/Textarea 共 12 项，选择控件/Tag 共 30 项，Form/FormItem 共 18 项通过，合计 60 项；覆盖浅深主题、1440/390px、目录、API、交互及实际剪贴板。
- 独立导出与阅读应用：Icon/Textarea 7 项、选择控件/Tag 19 项、Form/FormItem 12 项通过，合计 38 项。
- 人工查看了各组件代表截图，以及窄屏暗色自动校验、键盘提示和原生控件错误状态。新增验证使用减少动态效果模式。
- 九个组件的 48 个示例及阅读应用 SFC 通过严格类型检查；全站 177 个 SFC 也通过，第一阶段登记的 16 处类型错误全部解决。
- Nuxt、文档和测试 TypeScript 检查通过；导出测试 76 项、`docs:check` 通过。
- 最后通过公共迁移用例核对已完成页面与待迁移 TreeSelect 的提示、AI coverage 和主题状态。

浏览器均为系统 Chrome 无头模式，通过临时环境变量选择；没有运行完整构建或更新像素快照。

全部测试命令已结束。清理本阶段八个临时目录的命令包含路径范围校验，但自动审批在执行前拒绝，原因为 `blocked by policy`。没有改用其他删除方式。保留且不纳入提交的目录位于 `test-results/`：`stage3-icon-textarea-site`、`stage3-icon-textarea-ai`、`stage3-choice-site`、`stage3-choice-ai`、`stage3-form-site`、`stage3-form-ai`、`stage3-form-slot`、`stage3-migration-final`。前两阶段被拒绝的清理项仍保留。

## 仍保留的边界

- FormItem 0.6.0 的插槽发布类型仍写成 `aria-describedby`，运行时为 `ariaDescribedby`，保留 `descriptionId` 兼容读取。
- Form 的 `manual` 配置不会自动校验提交，业务仍须主动校验并判断结果；`validate()` 不主动抢焦点。
- `nextStepHint` 为实验性辅助提示，不修改 Tab 顺序，也不表示校验通过。
- 原生控件仍须自行接入模型和失焦校验；RadioGroup options 中字符串化后相同的值仍会形成重复 Vue key。

下一阶段处理 TreeSelect、DatePicker、ColorPicker、DropDown、Tooltip、Dialog、Toast，并集中验证浮层组合、焦点、Escape 和滚动行为。
