import { defineNoteConfig, defineNotesConfig } from 'vuepress-theme-plume'

const stack = defineNoteConfig({
  dir: '技术栈',
  link: '/技术栈',
  sidebar: 'auto',
})
const database = defineNoteConfig({
  dir: '数据库',
  link: '/数据库',
  sidebar: 'auto',
})
const algo = defineNoteConfig({
  dir: '算法',
  link: '/算法',
  sidebar: 'auto',
})
const network = defineNoteConfig({
  dir: '网络',
  link: '/网络',
  sidebar: 'auto',
})
const cloud = defineNoteConfig({
  dir: '微服务',
  link: '/微服务',
  sidebar: 'auto',
})
const deploy = defineNoteConfig({
  dir: '系统部署',
  link: '/系统部署',
  sidebar: 'auto',
})
const docker = defineNoteConfig({
  dir: 'Docker',
  link: '/Docker',
  sidebar: 'auto',
})
const linux = defineNoteConfig({
  dir: 'Linux',
  link: '/Linux',
  sidebar: 'auto',
})

export const notes = defineNotesConfig({
  dir: 'notes',
  link: '/',
  notes: [stack,database,algo,network,cloud,deploy,docker,linux],
})
