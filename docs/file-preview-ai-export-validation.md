# FilePreview 迁移验证

适用 `@moubing/bing-ui 0.5.3`。正文迁入 `content/components/file-preview.md`，共享 API 包含 30 项属性、8 个文件字段、5 个事件、8 个 FilePreview 公开类型以及 SmoothScrollValue/Options 的 9 个配置字段。三个完整示例为文件类型预览、文本/CSV 限制和 Office 策略；命令为 `pnpm docs:export file-preview`。

- 保留 URL、原章节、控制区和三个预览，增加生命周期及完整类型说明。网页复制代码与 AI 导出共用 SFC，补齐状态、事件、组件/样式导入和全部数据。
- 移除缺失的 /mock-files 依赖和只有文件头的 PDF。内置 599 bytes 的一页 PDF 与 899 bytes 的最小 DOCX，均只含演示文字；从实际导出代码提取后，用 pypdf 严格解析和 python-docx 确认可读。转换 HTML 使用内置可信静态内容，所有示例都可独立运行。
- 修复限制控制原先被 file.type 覆盖的问题。选择 unknown、PDF、Office 等现在实际进入相应分支；两个 Radio 控制组具有独立 ID/name。
- 核对 file 合并规则：对象存在时不补独立 src/name，其余字段用非 null/undefined 值覆盖；空 content、只有 previewSrc、显式类型和 auto 的图片后缀限制都有阅读用例。未对组件包作修改。
- 核对 content 优先、完整 fetch 后截断、过期结果忽略和 HTTP 错误通知。JSON 高亮按格式化长度判断且转义 HTML，无效 JSON 不发 error；CSV 支持引号及双引号转义，行数包含表头。已打开时仅改 textMaxLength 不重新截断。
- 核对下载、外部打开的不同地址优先级及真实浏览器动作。下载/打开事件不可取消、不表示成功；图片下载不转发 FilePreview.download。图片分支不转发 ariaLabel/teleportTo 等参数，关闭按钮会重复发送模型 false。
- 通过阅读用例确认跨图片分支切换可能残留非图片滚动锁，正文要求先关闭再换类型；页面缓存停用时主动关闭并卸载四个弹层实例，切回后正常复用。说明焦点、iframe、无 sandbox/插槽/实例方法等实际边界。
- 导出一致性、54 项导出测试、文档与测试类型检查通过。23 个组件的 98 个导出 SFC 与 21 个阅读应用，共 119 个文件通过严格类型检查。
- 网页 7 项无头测试通过：1440/390px 明暗主题、章节/API、三份代码复制、类型/限制控制、PDF 和转换页面、缓存页面清理。四张文档预览截图和两张打开后的 JSON 面板截图已检查。
- 独立导出与阅读应用 9 项无头测试通过，覆盖三份示例和上述模型、加载、限制、文件操作与图片分支边界。阅读应用由同一助手根据导出文档重组，没有独立模型盲测。
- 全站类型检查仍为原有 6 项诊断，本组件没有新增错误；未运行完整构建。临时下载文件已删除，浏览器/服务已退出，截图与 trace 移入回收站。
