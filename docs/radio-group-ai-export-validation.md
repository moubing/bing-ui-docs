# RadioGroup 迁移验证

适用 `@moubing/bing-ui 0.5.3`。正文改为 `content/components/radio-group.md`，10 项属性、4 项 Option 字段、1 个插槽及 4 个事件移入 `shared/docs/radio-group.ts`。原有 URL、章节、四个预览区、参数控制和主题样式保留。

四个完整独立 SFC 覆盖基础配置、options、自定义插槽、键盘切换与事件，网页复制结果逐段等于 AI 导出。基础代码区随参数更新；旧短代码片段的固定高亮行号已移除。命令为 `pnpm docs:export radio-group`。

## 用法与缺陷处理

- RadioGroup 的模型是 `string | number | boolean | null`，不是数组；null 用于未选择，0 和 false 是合法值。示例避免以真假值判断是否选择。
- 点击已选 Radio 不会反选；示例通过外部赋值 null 清空。
- 四个方向键会同步移动焦点与选中值、跳过禁用项并首尾循环，不能套用 Tabs 的 manual 或 loop 属性。
- `change` 是 `(value, event)` 两个参数，focus/blur 按整个组的边界触发。
- 0.5.3 的 Group 默认 ID/name 会在多实例间重复；网页各组和完整示例显式设置 ID 与 name，避免浏览器把多个 radio 组当成同一组。浏览器测试验证改变排列控制组后，预览组和尺寸控制组的选中项仍然保持。
- status 仅控制状态样式，实际必选规则由表单或业务校验提供。没有修改组件包。

## 验证结果

- `docs:check` 与 16 项导出测试通过，所有已登记组件的产物、API、代码、清单和版本一致。
- `typecheck:docs`、`typecheck:tests`、`typecheck:ai-examples` 通过；5 个组件共 18 个导出 SFC，连同 3 个阅读应用用例均通过严格检查。
- RadioGroup 网页 6 项通过：1440/390px、明暗主题、锚点、区块、无横向溢出、独立组名称、完整代码复制、清空/选择/禁用、方向键和焦点事件。
- 独立示例浏览器全部 20 项通过；其中 RadioGroup 4 项覆盖四个导出文件及新增阅读应用用例，Form/FormItem/Tabs/CheckboxGroup 保持通过。
- 新用例根据导出文档编写“启用决策”和“重试次数”两组，验证 false、0、数字 2 保留类型，不同组互不取消选中，清空决策不影响重试次数。是同一助手的阅读应用检查，未进行独立模型盲测。
- 预览截图已人工检查，临时截图不纳入 Git 基线。全站类型检查仍为既有 15 项错误，没有 RadioGroup 新增错误；未运行完整构建。
