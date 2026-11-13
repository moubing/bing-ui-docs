# FormItem AI 文档导出验证

后续维护调整：固定截图基线及像素比较已移除，FormItem 与其他组件统一使用交互/结构断言和临时截图。下文为当时实验记录，历史截图可从 Git 查看，当前规则见 [README](../README.md#验证)。

日期：2026-09-05。适用组件包：`@moubing/bing-ui 0.5.3`，文档修订 `r1`。

## 交付范围

FormItem 已补齐 Markdown 正文、7 项属性、6 项插槽参数和 3 个完整 Vue SFC，输出为 [FormItem AI 文档](../public/ai/components/form-item.md)。网页代码区与导出共用 `examples/form-item/message.vue`、`span.vue`、`slot.vue`，参数替换统一在 `shared/docs/example-code.ts`；交互预览保留原页面逻辑。

消息示例包含两个字段的完整 model、Zod schema、校验与清错方法；跨度示例包含四个字段及完整校验；插槽示例用原生 input 演示值绑定、标签、错误消息关联、尺寸、禁用、失焦校验和提交保护。示例均导入组件、样式与类型，不依赖文档站或 Nuxt 自动导入。

```powershell
pnpm docs:export form-item
pnpm docs:check form-item
pnpm docs:export
pnpm docs:check
```

不带组件名的命令处理 Form 和 FormItem。单组件命令只更新目标文档及共享入口、清单，并在写入前检查另一组件产物是否与来源一致；如果另一组件缺失或过期，提示先导出全部，避免 SHA-256 与实际文件不符。入口与清单始终保留两个组件。

Form 原生成文档的内容保持一致，SHA-256 仍为 `6d0568db9cfecc3d7929aa2a37effa5dbdd4fdc9b3d0856f61afb97ece1522aa`。

## 阅读与应用核对

本节由同一助手阅读实际生成的 Markdown 后核对，并与组件包实现及浏览器结果比对；没有使用独立模型盲测，不能据此保证所有 AI 都能正确使用。

| 问题 | 生成文档提供的答案与验证 |
| --- | --- |
| required 是否产生校验？ | 只显示星号；规则来自 Form schema。移除星号后，空字段仍被拦截。 |
| 隐藏消息是否关闭校验？ | 不会。showMessage=false 时仍有错误，invalid 仍为 true，保存次数不增加，DOM 不再有 aria-describedby。 |
| 错误和帮助文本如何切换？ | 显示第一条错误，清错后恢复 help，同时保留已输入的字段值。 |
| disabled、size、labelWidth 写在哪里？ | 由 Form 传入，FormItem 继承；原生控件还需绑定插槽提供的禁用与尺寸。 |
| span 看窗口宽度还是容器宽度？ | 看 Form 容器宽度。390/900/1440px 页面中的占列为 1/2/3；宽屏里将 Form 缩至 500px 后回到 1 列。 |
| span=99 会超出表格吗？ | 会限制在各断点的 Form columns 内，测试仍为 1/2/3 列且没有页面横向溢出。 |
| 切换 stack 后能保留 span 吗？ | 0.5.3 不能假定会忽略它；移除所有 span 后，字段按单列依次排列。 |
| 原生控件会自动触发字段校验吗？ | 不会自动通知 Bing 控件上下文；示例在 blur 时显式调用 validateField，Form 在 submit 时校验。 |
| 插槽消息属性的名称是什么？ | 运行时是 ariaDescribedby，0.5.3 类型声明却是 aria-describedby；descriptionId 兼容两者，DOM 的 aria-describedby 确实指向消息节点。 |
| 嵌套字段怎么对应？ | 新用例使用 model.profile.note、嵌套 schema 和 prop="profile.note"，失焦时 validateField('profile.note')。 |

新增应用用例位于 `tests/fixtures/ai-docs/form-item-understanding.vue`，根据导出文档另写原生 textarea 和嵌套配送备注字段：空值不保存；隐藏错误提示后仍不保存；填入合法备注后保存次数从 0 变为 1；再次清空提交，保存次数保持 1。另验证了尺寸继承与禁用。本地计数模拟业务保存，没有发送网络请求。

## 发现的组件包问题

以下是已安装 0.5.3 包的问题，本次没有修改 `node_modules` 或组件库仓库：

1. 插槽声明与运行时名称不一致。声明文件将消息属性写成 `aria-describedby`，运行时输出 `ariaDescribedby`；示例通过显式兼容函数解决类型与运行时接线问题。status 在运行时只会是 default/error，API 表已纠正原先过宽的说明。
2. 自动 ID 重复。对导出的双字段消息示例进行无头浏览器检查，两个 label 的 for 与对应控件的 ID 都是 `bing-form-item-1-control`；实例内计数也让消息 ID 存在同类问题。单字段原生控件的标签与消息关联通过，但不能据此证明多字段可访问性正确。正文明确提示需要组件库修复。
3. stack 下的跨度。实际运行保留响应式 span 的 stack 示例时，三个字段排在同一行，备注跨 3 列；CSS 的 span 规则仍然生效。文档改为要求切换 stack 时移除 span 或设为 1，按此方式修改生成示例后单列排列通过。

还修正了示例中的 Select 值类型、原生控件尺寸与状态的样式绑定。最终 5 个导出 SFC 和 2 个应用用例全部通过 strictTemplates 类型检查。

## 自动检查结果

| 命令 | 结果 |
| --- | --- |
| `pnpm docs:check`、`pnpm docs:check form-item`、`pnpm docs:check form` | 生成结果、版本与来源一致。 |
| `pnpm test:docs-export` | 10 项通过：两组件全部 API 表格往返比对、SFC 编译与来源一致、入口/SHA、确定性、引用失败、版本限制、单组件索引保护、CLI 参数及字符转义。 |
| `pnpm typecheck:docs` | 通过。 |
| `pnpm typecheck:tests` | 通过。 |
| `pnpm typecheck:ai-examples` | 5 个导出 SFC 与 2 个应用用例通过严格检查。 |
| `pnpm test:ai-examples` | 10 项通过：原 Form 5 项、FormItem 5 项。服务直接从生成的 Markdown 读取 Vue 代码。 |
| `pnpm test:docs` | 16 项通过，包含 24 张截图、两页 5 个完整示例的复制比对、参数/校验/页面往返及未迁移页面抽查。 |

浏览器均为系统 Chrome 无头模式，未添加机器专属配置。先查看实际截图与差异，确认变化来自新增正文、API 释义及完整代码，然后仅更新 FormItem 的 12 张基线。Form 的 12 张基线保持不变。最终一轮网页回归 16 项全部通过，截图比较仍为 maxDiffPixels=0。

全站 `pnpm typecheck` 仍有原先未修改文件中的 15 处错误；新增和修改文件没有类型诊断。共享函数已统一到一个模块，避免 Node 与 Nuxt 对 TypeScript 导入扩展名的配置差异。没有执行全站构建、提交、推送或部署。

## 覆盖边界与清理

本轮完成 FormItem 的本地 AI 导出与验证；现在 Form / FormItem 的网页迁移和 AI 导出均已接通。历史版本快照、远程发布、其余 31 个组件页及独立模型盲测尚未包含，不能视为全站完成。

测试服务和无头浏览器完成后关闭，类型检查的临时文件自动清理；本轮临时测试输出目录在交付前移入回收站。用于回归的正式截图基线保留在 `tests/browser/form-docs.spec.ts-snapshots`。
