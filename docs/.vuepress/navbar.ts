import { defineNavbarConfig } from 'vuepress-theme-plume'

export const navbar = defineNavbarConfig([
  { text: '首页', link: '/' },
  { text: '博客', link: '/blog/' },
  { text: '标签', link: '/blog/tags/' },
  { text: '归档', link: '/blog/archives/' },
  {
    text: '笔记',
    items: [
      { text: '技术栈', link: '/notes/技术栈/README.md' },
      { text: '数据库', link: '/notes/数据库/README.md' },
      { text: '算法', link: '/notes/算法/README.md' },
      { text: '网络', link: '/notes/网络/README.md' },
      { text: '微服务', link: '/notes/微服务/README.md' },
      { text: '系统部署', link: '/notes/系统部署/README.md' },
      { text: 'Docker', link: '/notes/Docker/README.md' },
      { text: 'Linux', link: '/notes/Linux/README.md' },
    ],
  },
])
