# 展示入口说明

文档站提供组件使用说明、API、交互示例与 AI 可读导出；Storybook 用于操作组件。对外导航由 shared/docs/entries.ts 维护。公开源码不包含内部 Nginx 配置、证书路径、私有端口映射、部署账号或备份位置。

本地运行见 [README](../README.md#本地运行)。静态托管可在完成 docs:check 后生成站点，并把 .output/public 交给自己的托管服务。部署前按实际域名配置 HTTPS、缓存及静态路由回退。

```powershell
pnpm docs:check
pnpm generate
```

自行部署后使用实际的 HTTPS origin 执行 docs:check-release 和 docs:check-https；命令不接受账号凭证。私钥和真实环境文件只保存在部署环境，不进入 Git。
