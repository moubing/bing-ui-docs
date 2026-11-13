# Bing UI 0.6.0 文档更新：第六阶段

日期：2026-09-12。对应[更新计划](bing-ui-0.6.0-update-plan.md)的展示与转场阶段。

## 内容与示例

| 组件 | 更新结果 |
| --- | --- |
| Image | 中文加载失败与预览名称；重验回退、错误重试、图库索引和关闭后的清理 |
| ImagePreview | 同步中文工具栏、可播报计数器、主题磨砂默认值、焦点循环和浮层协调；行为演示关闭工具栏与遮罩入口时保留 Escape |
| FilePreview | 同步中文操作、错误、CSV 空表头及截断文案；更新焦点与共享滚动锁说明，新增 Dialog 中分别打开文件与图片预览的完整示例 |
| CodeBlock | 中文复制和纯文本名称；纠正 resizableOptions 的 fixed/mirror 模式，保留复制失败和未知语言回退说明 |
| AnimatedText | 移除旧版强制 key 重建写法；说明同一实例更新、原始文字与 inert 装饰副本、中文换行及动态偏好监听 |
| AppSwitcherTransition | 中文默认名称；更新中性卡片与字号，重验内部选择、外部赋值、禁用邻项、滚轮及常驻状态 |
| CarouselTransition | 中文默认名称；去除旧渐变和重阴影，重验轨道、阈值、边界及禁用邻项限制 |
| DeckTransition | 基础示例展示默认“切换下一张”；更新中性色与卡片字重，保留真实洗牌、自定义终点控制和退出清理 |

保留页面结构与原有章节，FilePreview 新增附件组合章节。独立示例累计 149 个，连同阅读应用共 183 个 SFC。ImagePreview 的磨砂输入默认留空以继承主题；glass=false 时为 blur=0、opacity=1、saturation=1。FilePreview 的固定浅色纸面与主题遮罩分别说明。

## 验证

- 八个组件网页用例 57 项通过：Image 7、ImagePreview 8、FilePreview 8、CodeBlock 6，其余四个各 7。覆盖浅深主题、1440/390px、API/章节、真实剪贴板和缓存页面离开。
- 独立导出及阅读应用 59 项通过：Image 8、ImagePreview 8、FilePreview 10、CodeBlock 5、AnimatedText 9、AppSwitcherTransition 6、CarouselTransition 7、DeckTransition 6。
- 附件组合验证文本和图片预览中的 Tab 循环、Escape 逐层关闭、恢复入口焦点，以及父弹窗持续持有滚动锁。
- AnimatedText 验证同一实例内更新中文与 Unicode 文案、禁用 jump、切换效果，以及运行中启停系统减少动态效果；三个转场保留实际动画完成检查。
- 人工查看图片、图片工具栏、JSON 纸面、代码块、文字效果及三个转场的代表性浅深主题和窄屏截图。
- Nuxt、文档、测试 TypeScript 及全站 183 个 SFC 严格检查通过；76 项导出测试与 `docs:check` 通过。
- r6 收尾复验 CodeBlock 的 6 项页面检查及 2 项迁移检查，网页和清单均正确显示已验收状态。

文档修订 r6，已有 33 个组件全部验证，Cursor 仍为待新增。全程无头 Chrome，通过临时环境变量选择浏览器；未运行完整构建或更新像素快照。

## 仍保留的边界

- Image 在关闭 previewable 后再开启，可能恢复之前仍为打开状态的预览模型。
- FilePreview 的图片分支会发送两次模型关闭请求和一次 close；Escape 不再重复 close。下载与错误事件仍按分支转发。
- FilePreview 从打开的非图片分支直接切换到图片后，关闭图片仍可能留下原滚动锁，直到组件卸载；因此跨分支先关闭再切换。
- Carousel 的滚轮结束逻辑仍可在邻项禁用时移动轨道而不更新模型；有禁用项时可由业务拦截滚轮，改用标签或外部控制。
- 三个转场没有自动设置隐藏业务内容的 inert，也没有对列表重排重新布局；继续保留示例中的 inert 和动态列表重建建议。减少动态效果在切换时处理，不承诺立即取消已运行的转场。

下一阶段单独完成 Cursor 页面、独立示例、导航与 AI 覆盖。

## 临时文件

测试命令与临时浏览器已结束。清理下列 17 个本阶段目录时已校验绝对路径及父目录，但自动审批在执行前拒绝，原因为 `blocked by policy`。没有换用其他方式删除；目录保留在忽略的 `test-results/` 中：

`stage6-animated-ai`、`stage6-animated-site`、`stage6-app-ai`、`stage6-app-site`、`stage6-carousel-ai`、`stage6-carousel-site`、`stage6-code-ai`、`stage6-code-site`、`stage6-deck-ai`、`stage6-deck-carousel-site`、`stage6-file-preview-ai`、`stage6-file-preview-site`、`stage6-final-site`、`stage6-image-ai`、`stage6-image-preview-ai`、`stage6-image-preview-site`、`stage6-image-site`。

前几阶段被拒绝的清理项未重新尝试。
