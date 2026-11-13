import { docsVersion } from './migration.ts'

export const upgradeGuideTitle = '版本升级指南'

/** 人工核对的基线，不能跟随 docsVersion 自动升级；导出只检查，不代替验收。 */
export const releaseReview = {
  packageVersion: '0.19.0',
  docsRevision: 'r3',
  checkedAt: '2026-11-13',
  fromVersion: '0.13.x',
  migration: 'required' as 'required' | 'none',
  summary: '跨过 0.16–0.18 时核对焦点、关闭保护、数字空值、默认值和表格键盘行为；0.19.0 新增能力无需迁移。',
  changelogUrl: 'https://github.com/moubing/bing-ui/blob/main/CHANGELOG.md',
  pages: {
    upgrade: { label: '升级指南', path: '/docs/upgrade', verified: true },
    quickStart: { label: '快速开始与组件目录', path: '/docs', verified: true },
    home: { label: '首页介绍与安装', path: '/', verified: true },
    readme: { label: '文档仓库 README', path: 'README.md', verified: true },
    libraryReadme: { label: '组件库 README', path: 'bing-ui/README.md', verified: true },
  },
  evidence: 'docs/release-validation.md',
}

export function assertReleaseReview(review = releaseReview, target = docsVersion): void {
  if (review.packageVersion !== target.packageVersion || review.docsRevision !== target.docsRevision) {
    throw new Error('全站发布核对仍为 ' + review.packageVersion + ' / ' + review.docsRevision + '，请检查升级指南、快速开始和仓库首页，再更新 releaseReview')
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(review.checkedAt) || !review.summary.trim() || !review.changelogUrl) {
    throw new Error('发布核对缺少日期、迁移结论或 CHANGELOG 链接')
  }
  if (review.migration === 'none' && !review.summary.includes('无需迁移')) {
    throw new Error('没有用户侧迁移时，发布结论必须明确写出“无需迁移”')
  }
}

/** 只替换明确的元数据占位符，历史版本和旧用法保持原文。 */
export function renderUpgradeGuide(source: string): string {
  assertReleaseReview()
  const values: Record<string, string> = {
    title: upgradeGuideTitle,
    packageVersion: docsVersion.packageVersion,
    docsRevision: docsVersion.docsRevision,
    fromVersion: releaseReview.fromVersion,
    checkedAt: releaseReview.checkedAt,
    changelogUrl: releaseReview.changelogUrl,
  }
  return source.replace(/\{\{release\.(\w+)\}\}/g, (_, name: string) => {
    if (!Object.hasOwn(values, name)) throw new Error('未知升级指南元数据：' + name)
    return values[name]!
  })
}
