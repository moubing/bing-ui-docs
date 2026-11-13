import { docsVersion } from '../../shared/docs/migration.ts'
import { releaseReview, upgradeGuideTitle } from '../../shared/docs/release.ts'

export function assertLibraryRelease(packageVersion: string, readme: string, changelog: string, componentCount: number): void {
  const readmeVersion = readme.match(/当前仓库版本为\s*\*\*([\d.]+)\*\*/)?.[1]
  if (packageVersion !== docsVersion.packageVersion || readmeVersion !== packageVersion) {
    throw new Error(`组件库 package.json / README 与文档目标不一致：${packageVersion} / ${readmeVersion ?? '未标明'} / ${docsVersion.packageVersion}`)
  }
  const counts = [...readme.matchAll(/(\d+) 个组件(?:文档)?页/g)].map(match => Number(match[1]))
  if (!counts.length || counts.some(count => count !== componentCount)) throw new Error('组件库 README 的文档页统计与注册表不一致')
  if (!changelog.replaceAll('\r\n', '\n').includes('\n## ' + packageVersion + '\n')) throw new Error('组件库 CHANGELOG 缺少目标版本')
  if (!readme.includes(`pnpm add ${docsVersion.packageName}@${packageVersion}`)) throw new Error('组件库 README 推荐安装版本已过期')
}

function visibleText(html: string): string {
  return html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<\/(?:h[1-6]|pre|p|div|li|section|article|button)>|<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, '').replace(/&(?:nbsp|#160);/g, ' ').replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ').trim()
}

export function assertLiveRelease(remote: Record<string, string>, expected: Record<string, string>): void {
  for (const path of ['/ai/manifest.json', '/llms.txt', '/ai/guides/upgrade.md']) {
    if (remote[path]?.replaceAll('\r\n', '\n') !== expected['public' + path]?.replaceAll('\r\n', '\n')) {
      throw new Error('线上文件与本地目标不一致：' + path)
    }
  }
  for (const path of ['/', '/docs', '/docs/upgrade']) {
    const html = remote[path] ?? ''
    const text = visibleText(html)
    const versions = [...text.matchAll(/(?:pnpm add|npm install|yarn add)\s+@moubing\/bing-ui@([\d.]+)/g)].map(match => match[1])
    if (!versions.length || versions.some(version => version !== docsVersion.packageVersion)) {
      throw new Error('线上页面推荐安装版本已过期或缺失：' + path)
    }
    if (path === '/docs/upgrade') {
      if (visibleText(html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/i)?.[0] ?? '') !== upgradeGuideTitle
        || !text.includes(releaseReview.checkedAt) || !text.includes('当前适用 @moubing/bing-ui@' + docsVersion.packageVersion)
        || !text.includes('修订 ' + docsVersion.docsRevision)) {
        throw new Error('线上升级指南标题、核对日期或适用说明已过期')
      }
      for (const id of ['input-018', 'textarea-018', 'table-018', 'slider-018', 'dialog-016', 'pickers-017', 'patches-019', 'button-input']) {
        if (!html.includes(`id="${id}"`)) throw new Error('线上升级指南缺少章节：' + id)
      }
    }
  }
}
