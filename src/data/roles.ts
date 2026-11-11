import type { Role } from '../types'

/** 任务提示语，按序号给出：进入角色 → 沉浸体验 → 沉淀感悟 */
export const TASK_HINTS = [
  '这是一个帮助你进入角色状态的任务，慢慢感受这个身份带来的新视角。',
  '沉浸在当下的体验中，让这个角色的特质融入你的行动。',
  '这是一个总结性体验任务，回顾今天的收获，将感悟沉淀为智慧。',
]

export const TASK_TAGS = ['探索型', '社交型', '创意型', '治愈型', '挑战型'] as const

export const ROLES: Role[] = [
  {
    id: 'cat-cafe-owner',
    emoji: '🐱',
    name: '猫咖咖啡馆的店长',
    desc: '十五只猫员工各有脾气，而人类客人更需敬重来。',
    tags: ['治愈型', '慢生活'],
    tasks: [
      { text: '用猫的视角观察一个最喜欢的地方' },
      { text: '模仿猫的姿态放松五分钟' },
      { text: '为今天设定一个"猫咪哲学"（例：保持独立，不过度依赖）' },
    ],
  },
  {
    id: 'street-artist',
    emoji: '🎨',
    name: '街头涂鸦艺术家',
    desc: '用色彩表达态度，让城市的每一面墙都成为画布。',
    tags: ['创意型', '艺术'],
    tasks: [
      { text: '用手机记录一个被忽视的美丽角落' },
      { text: '创作一幅5分钟速写' },
      { text: '为今天取一个艺术主题' },
    ],
  },
  {
    id: 'bookstore-owner',
    emoji: '📚',
    name: '独立书店的老板',
    desc: '守护着一方文字净土，为每位读者推荐心灵的归宿。',
    tags: ['治愈型', '阅读'],
    tasks: [
      { text: '向一个人推荐一本书' },
      { text: '安静阅读30分钟' },
      { text: '写下今日读书笔记' },
    ],
  },
  {
    id: 'botanist',
    emoji: '🌱',
    name: '植物园管理员',
    desc: '照顾植物的过程就是和生命对话。',
    tags: ['治愈型', '自然'],
    tasks: [
      { text: '观察一株植物的生长变化' },
      { text: '记录植物成长日记' },
      { text: '思考生命与成长的关系' },
    ],
  },
  {
    id: 'theater-actor',
    emoji: '🎭',
    name: '剧场演员',
    desc: '站在舞台上，每个角色都是一次新的生命体验。',
    tags: ['创意型', '表达'],
    tasks: [
      { text: '朗读一段戏剧台词' },
      { text: '观察路人的表情和动作' },
      { text: '写下对表演的感悟' },
    ],
  },
  {
    id: 'documentary-director',
    emoji: '🎬',
    name: '纪录片导演',
    desc: '用镜头记录真实的生活，发现平凡中的不平凡。',
    tags: ['探索型', '影像'],
    tasks: [
      { text: '用手机拍摄一段3分钟的生活片段' },
      { text: '采访一个陌生人的故事' },
      { text: '为今天的见闻写一段旁白' },
    ],
  },
  {
    id: 'midnight-diner',
    emoji: '🍜',
    name: '深夜食堂老板',
    desc: '为深夜归来的人们提供温暖的食物和倾听。',
    tags: ['社交型', '美食'],
    tasks: [
      { text: '为自己或他人做一道温暖的料理' },
      { text: '倾听一个朋友的烦恼' },
      { text: '记录一个美食故事' },
    ],
  },
  {
    id: 'city-detective',
    emoji: '🕵️',
    name: '城市侦探',
    desc: '每一扇窗、每一道墙缝里，都藏着一座城市没说完的话。',
    tags: ['探索型', '观察'],
    tasks: [
      { text: '在常走的那条路上找出三个从没注意过的细节' },
      { text: '为一栋老建筑编一个来历' },
      { text: '写下你今天破的"案子"' },
    ],
  },
  {
    id: 'night-radio',
    emoji: '📻',
    name: '深夜电台主播',
    desc: '在所有人都睡着的时段，替城市保管那些没说出口的话。',
    tags: ['社交型', '温柔'],
    tasks: [
      { text: '用三句话对一个人说"晚安"' },
      { text: '录一段1分钟的语音，讲今天最想讲的事' },
      { text: '为今晚的节目起一个标题' },
    ],
  },
  {
    id: 'perfumer',
    emoji: '🌸',
    name: '调香师',
    desc: '把看不见的记忆，装进一只可以带走的瓶子。',
    tags: ['创意型', '感知'],
    tasks: [
      { text: '闭眼分辨出身边三种不同的气味' },
      { text: '用一种气味形容今天的心情' },
      { text: '为这个气味写一句配方说明' },
    ],
  },
  {
    id: 'bread-apprentice',
    emoji: '🥐',
    name: '面包店学徒',
    desc: '凌晨四点起床的人，负责让整条街在清晨闻到幸福。',
    tags: ['治愈型', '日常'],
    tasks: [
      { text: '认真地吃完一顿早餐，不看手机' },
      { text: '为一个陌生人做一件顺手的小事' },
      { text: '记录今天最早的一刻' },
    ],
  },
  {
    id: 'stargazer',
    emoji: '🔭',
    name: '天台观星人',
    desc: '城市的光太亮，但总有几颗星星愿意等你抬头。',
    tags: ['治愈型', '安静'],
    tasks: [
      { text: '在夜里抬头看天空三分钟' },
      { text: '找一个能看见天空的角落待着' },
      { text: '写下你今天想留住的一颗"星星"' },
    ],
  },
  {
    id: 'museum-guide',
    emoji: '🏛️',
    name: '博物馆讲解员',
    desc: '把沉默的物件，讲成会呼吸的故事。',
    tags: ['探索型', '叙事'],
    tasks: [
      { text: '找到身边一件有年头的东西' },
      { text: '为它编一段身世' },
      { text: '用一句话讲给朋友听' },
    ],
  },
  {
    id: 'bus-poet',
    emoji: '🚌',
    name: '公交诗人',
    desc: '在所有人都赶路的时候，负责把窗外写成诗。',
    tags: ['探索型', '诗意'],
    tasks: [
      { text: '在通勤路上收集三个画面' },
      { text: '把其中一个写成三行诗' },
      { text: '读给一个人听（或读给自己）' },
    ],
  },
  {
    id: 'extreme-photographer',
    emoji: '📷',
    name: '极限运动摄影师',
    desc: '为了一个瞬间，愿意跑到别人不愿意去的地方。',
    tags: ['挑战型', '行动'],
    tasks: [
      { text: '今天多走一段平时不会走的路' },
      { text: '拍下一张"只有站在这里才拍得到"的照片' },
      { text: '记录这次冒险的代价与收获' },
    ],
  },
  {
    id: 'convenience-clerk',
    emoji: '🏪',
    name: '深夜便利店店员',
    desc: '这城市最真实的故事，都发生在收银台前。',
    tags: ['探索型', '人间'],
    tasks: [
      { text: '观察一个陌生人的一个动作' },
      { text: '对他做一次真诚的道谢' },
      { text: '写下你看到的那个"人间片段"' },
    ],
  },
  {
    id: 'coffee-philosopher',
    emoji: '☕',
    name: '咖啡馆哲学家',
    desc: '用一杯咖啡的时间，想清楚一个想不明白的问题。',
    tags: ['社交型', '思考'],
    tasks: [
      { text: '对一个日常问题提出三个为什么' },
      { text: '和一个人聊一次不设目的的闲天' },
      { text: '把一个思考写成一句话' },
    ],
  },
  {
    id: 'picturebook-author',
    emoji: '🖍️',
    name: '绘本作家',
    desc: '把大人觉得无聊的事，画成小孩会笑的样子。',
    tags: ['创意型', '童心'],
    tasks: [
      { text: '用一句话描述今天发生的一件小事' },
      { text: '给这件事配一个想象中的画面' },
      { text: '为它起一个书名' },
    ],
  },
  {
    id: 'florist',
    emoji: '💐',
    name: '花店老板',
    desc: '替那些说不出口的话，挑一束合适的花。',
    tags: ['社交型', '温柔'],
    tasks: [
      { text: '为一个人挑一件小而合适的礼物' },
      { text: '说一句你平时不会说的软话' },
      { text: '记录对方的表情' },
    ],
  },
  {
    id: 'lighthouse-keeper',
    emoji: '🗼',
    name: '灯塔守夜人',
    desc: '不指引方向，只负责提醒：这里一直亮着。',
    tags: ['治愈型', '安静'],
    tasks: [
      { text: '给自己留15分钟完全不被打扰的时间' },
      { text: '写下此刻最想被谁看见的事' },
      { text: '对自己说一句话（并记住它）' },
    ],
  },
  {
    id: 'seafood-vendor',
    emoji: '🦐',
    name: '菜市场摊主',
    desc: '讨价还价里藏着最生猛的烟火气。',
    tags: ['社交型', '烟火'],
    tasks: [
      { text: '在菜市场或小店里和摊主聊两句' },
      { text: '学会一个你原本不会的生活技巧' },
      { text: '记录今天最生动的一句话' },
    ],
  },
  {
    id: 'repair-master',
    emoji: '🔧',
    name: '修理铺师傅',
    desc: '在扔掉之前，先问一句"还能不能救"。',
    tags: ['挑战型', '专注'],
    tasks: [
      { text: '找出身边一件"将坏未坏"的东西' },
      { text: '花10分钟试着修好或整理它' },
      { text: '写下修理时的专注感' },
    ],
  },
  {
    id: 'birdwatcher',
    emoji: '🐦',
    name: '城市观鸟者',
    desc: '当你的耳朵醒过来，城市就多了一整个乐团。',
    tags: ['探索型', '自然'],
    tasks: [
      { text: '闭眼听30秒周围的声音' },
      { text: '分辨出其中三种不同的来源' },
      { text: '写下你听见的"城市配乐"' },
    ],
  },
  {
    id: 'dancer',
    emoji: '💃',
    name: '街头舞者',
    desc: '身体比脑子更早知道，什么叫做自由。',
    tags: ['挑战型', '身体'],
    tasks: [
      { text: '放一首歌，随意动三分钟' },
      { text: '在一个没人的地方做一次夸张的动作' },
      { text: '记录身体放松后的感受' },
    ],
  },
]

export function findRole(id: string, customRoles: Role[]): Role | undefined {
  return ROLES.find((r) => r.id === id) ?? customRoles.find((r) => r.id === id)
}
