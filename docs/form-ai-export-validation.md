# Form AI 文档导出验证

后续维护调整：固定截图基线及像素比较已移除，Form 与其他组件统一使用交互/结构断言和临时截图。下文为当时实验记录，当前规则见 [README](../README.md#验证)。

日期：2026-09-05。范围：`@moubing/bing-ui 0.5.3` 的 Form 单组件实验。

后续同日补齐了 FormItem 导出，统一入口和清单已覆盖两者，省略组件名的命令现在处理全部已接入组件；本页的测试数量与范围保留为 Form 实验当时的记录，最新增量见 [FormItem 导出验证](./form-item-ai-export-validation.md)。

## 交付与来源

运行 `pnpm docs:export form` 生成[完整 Form 文档](../public/ai/components/form.md)、[读取入口](../public/llms.txt)和[当前版本清单](../public/ai/manifest.json)。`pnpm docs:check form` 只检查输出是否与当前来源一致，不更新文件。

正文来自 `content/components/form.md`，API 来自 `shared/docs/form.ts`，两个完整 Vue 示例来自 `examples/form`。网页代码展示和 AI 导出共用这些示例；布局参数由共享函数注入（后续统一至 `shared/docs/example-code.ts`），默认参数只保存在完整布局示例中。网页交互预览继续使用原 playground 逻辑，通过浏览器检查核对行为。

导出器按 Comark 的文档结构处理容器、正文、示例插槽和 API 引用，生成普通 Markdown。未知节点、缺失引用、遗漏已声明的示例/API、组件包版本不匹配都会报错。输出为确定性的 UTF-8/LF 文本，不写生成时间；清单记录输出正文的 SHA-256。生成过程无需启动网站或执行全站构建。

## 阅读与应用检查

本节由实现任务的同一助手根据生成文档逐项核对，并与已安装组件代码和实际运行结果比对。不是独立模型的盲测，也没有据此声称所有模型都能正确使用。

| 问题 | 从生成文档应得到的答案 | 核对依据 |
| --- | --- | --- |
| `required` 能代替 schema 吗？ | 不能，它只显示星号；规则在 Form 的 Zod schema 中。 | 布局与校验正文；去掉示例中的 required 后，空值仍被 schema 拦截。 |
| 校验失败还会调用 submit 吗？ | 会。必须先判断 `payload.valid`，失败时返回，阻止业务保存；invalid 随后触发。 | 正文、事件表、布局示例；空表单触发失败回调，没有进入保存分支。 |
| 一个角色数组至少选一项怎么写？ | 在 model 中声明数组，schema 使用 `z.array(z.string()).min(1)`，FormItem.prop 与该字段对应，CheckboxGroup 使用同一个数组的 v-model。 | 正文、通知渠道示例，以及根据文档新编写的角色多选用例。 |
| manual 模式下按提交按钮，会自动校验吗？ | 不会；不包含 submit 时 payload.valid 直接为 true。保存前需保留 submit 触发器，或 await ref.value.validate() 并检查返回值。 | 正文；把导出示例改为 manual 后，空值提交直接进入演示保存分支。 |
| 异步规则需要另一套接口吗？ | 不需要，Form 使用 safeParseAsync，调用 validate/validateField 时需要 await。示例只在本地模拟邮箱占用。 | 方法正文、完整代码及独立运行的异步校验检查。 |
| validateField 会清空其他字段错误吗？ | 不会；它执行 schema，只更新当前路径相关的错误。 | 方法正文/API；修正邮箱并校验邮箱后，昵称错误仍保留。 |
| clearValidate 与 resetFields 有什么差别？ | 前者清除错误但不改值；后者恢复挂载时的初始快照并清错，不能理解成全部置空。 | 方法正文/API；清错后保留改过的邮箱，重置后回到 taken@example.com / Bo。 |
| 布局示例中的 xl: 3 是组件默认值吗？ | 不是，它是演示配置；API 的组件默认值是 base: 1、sm: 2、xl: 5。 | 导出开头的说明与属性表。 |
| getErrors 返回什么？ | 字段路径到错误消息数组的映射，即 Record<string, string[]> 的拷贝。 | 方法表；表格往返解析检查确认类型中的方括号完整保留。 |
| 可以把这份文档用于任意版本吗？ | 当前只验证 0.5.3，其他版本需要另行核对。 | 文档头、入口和版本清单。 |

应用检查的新示例位于 `tests/fixtures/ai-docs/understanding.vue`：角色为空时保存次数为 0；选择管理员后保存次数变为 1；再次清空角色并提交，保存次数仍为 1。这里的保存是本地模拟，不调用业务接口。

## 已发现并修正的问题

- 原展示代码缺少组件导入、事件处理函数和部分受 schema 约束的控件。现在导出两个完整 SFC，所有受约束字段均有对应控件。
- 严格类型检查发现 Select、CheckboxGroup、RadioGroup 的更新值类型比示例原先声明的类型更宽。完整示例现在使用组件包导出的值类型；字符串限制继续由 schema 表达。
- 普通 API 说明中的 `string[]` 在再次解析时会丢失方括号。导出器对数据文本中的 Markdown 特殊字符转义，并将导出的全部表头、单元格重新解析后与来源逐个比较。
- 明确 manual 模式下的提交行为，并将主动校验写成 Vue ref 的 `.value` 调用，要求检查返回值。
- 补充 BingFormBreakpoint 与 BingFormErrors 的定义，避免阅读者只能看到未解释的类型别名。

## 自动验证

| 命令 | 范围 |
| --- | --- |
| `pnpm docs:check form` | 输出与来源一致，清单和版本正确。 |
| `pnpm test:docs-export` | 6 项检查：确定性/入口、全部 API 单元格、插槽与未知引用、版本拒绝、SFC 编译与来源一致、参数转义。 |
| `pnpm typecheck:docs` | 导出脚本、共享数据和导出测试的类型检查。 |
| `pnpm typecheck:tests` | 两套 Playwright 配置、浏览器测试与测试服务配置。 |
| `pnpm typecheck:ai-examples` | 从生成 Markdown 提取两个 SFC，并连同新写的角色多选用例做 strictTemplates 检查；仅使用标准 Vite 客户端类型声明。 |
| `pnpm test:ai-examples` | 5 项无头浏览器检查：导出布局示例、方法示例、manual 行为、required 行为、新的角色多选用例。 |
| `pnpm test:docs` | 网页交互、代码复制与导出一致性、24 张截图及未迁移页面抽查。 |

浏览器使用系统 Chrome 无头模式。独立示例测试服务从生成的 Markdown 读取代码，不使用文档页面的运行组件或 Nuxt 自动导入。代码复制对比只统一 Windows 剪贴板的 CRLF/LF，不忽略代码内容差异。

本次 Form 增加了正文说明、完整代码和 API 类型定义，因此查看差异图后更新其 12 张截图；FormItem 的 12 张原迁移基线保持不变。截图阈值没有放宽，测试样式仅隐藏开发工具浮标。

最终结果：6 项导出测试、5 项独立示例浏览器测试、15 项网页回归（含 24 张截图）全部通过；导出脚本、测试代码、2 个导出 SFC 与 1 个根据文档新写的 SFC 均通过对应类型检查。

另做了一次实际过期检测：临时改变生成文档标题后，`pnpm docs:check form` 返回非零状态并指出该文件过期；重新导出后检查通过。清单 SHA-256 与文件实际字节一致。`.gitattributes` 固定生成文档为 LF，避免 Windows checkout 自动换行导致校验失配。

## 限制与后续

全站 `pnpm typecheck` 仍报告先前已记录的 15 处错误，均在本次未修改的布局或其他组件页；本次新增与修改的文件没有全站类型诊断。没有执行完整构建、部署、提交或推送。

测试服务与无头浏览器已关闭，类型检查生成的临时目录已清理。`test-results` 目录及其中 25 个临时文件（截图、trace、错误上下文和运行记录）已移入回收站，并确认项目中不再存在该目录。

本页记录的原始交付只导出 Form；FormItem 随后已补齐。其他组件、历史快照、远程发布和独立模型盲测仍未包含。版本清单记录的是当前实验结果，不代表历史版本服务已经建立。
