import { Role } from '@/types';

export const roleLibrary: Role[] = [
  {
    id: 1,
    title: "巴黎街头写生的落魄画家",
    description: "你的画笔有点旧，但眼睛依然在捕捉光与影的游戏。",
    tasks: [
      "用手机拍一张你认为有故事感的街景",
      "观察三位路人的神态，用一句话速写下来",
      "找到今天让你心动的三种颜色组合"
    ],
    emoji: "🎨",
    color: "from-blue-100 to-indigo-100 border-blue-300",
    category: "艺术"
  },
  {
    id: 2,
    title: "深山古寺的扫地僧",
    description: "扫的是落叶，修的是心。耳畔只有风声与钟鸣。",
    tasks: [
      "找出你今天听到的三种最清晰的声音",
      "缓慢而专注地做一件日常小事（如泡茶）",
      "找一个安静的角落静坐5分钟"
    ],
    emoji: "🧹",
    color: "from-green-100 to-emerald-100 border-green-300",
    category: "禅意"
  },
  {
    id: 3,
    title: "星际考古学家",
    description: "你发现了一个失落文明的水晶终端，上面闪烁着未知的文字。",
    tasks: [
      "将你今天看到的任意文字想象成外星密码",
      "用身边的物品摆出一个'仪式图腾'",
      "为一件日常用品编造一个科幻起源故事"
    ],
    emoji: "👽",
    color: "from-purple-100 to-violet-100 border-purple-300",
    category: "科幻"
  },
  {
    id: 4,
    title: "深夜便利店值班员",
    description: "凌晨三点，你是这座城市少数醒着的灵魂见证者。",
    tasks: [
      "记录今晚遇见的三个有趣瞬间",
      "为一位想象中的夜班客人编个故事",
      "发明一种专属深夜的治愈食物"
    ],
    emoji: "🏪",
    color: "from-yellow-100 to-orange-100 border-yellow-300",
    category: "都市"
  },
  {
    id: 5,
    title: "皇家植物园的首席培育师",
    description: "你负责照料一株据说百年开一次的'梦幻兰'。",
    tasks: [
      "仔细观察一株植物十分钟，记录它的细节",
      "为你最喜欢的植物起个尊贵的名字和头衔",
      "想象一种不存在的神奇植物并描述它"
    ],
    emoji: "🌿",
    color: "from-emerald-100 to-teal-100 border-emerald-300",
    category: "自然"
  },
  {
    id: 6,
    title: "维多利亚时代的幽灵侦探",
    description: "你收到一封用墨水与泪痕写成的匿名求助信。",
    tasks: [
      "从日常物品中寻找一个'谜团'（如咖啡渍形状）",
      "用推理脑补一个陌生人的身份故事",
      "在阴影处寻找一个'可疑的细节'并记录"
    ],
    emoji: "🔍",
    color: "from-gray-100 to-slate-100 border-gray-300",
    category: "神秘"
  },
  {
    id: 7,
    title: "海盗船的瞭望员",
    description: "风暴刚过，你在桅杆顶端搜寻陆地的踪迹与敌船帆影。",
    tasks: [
      "找一个制高点观察四周五分钟",
      "为三朵云的形状编个航海传说",
      "用任何容器当'望远镜'进行一次侦察"
    ],
    emoji: "🏴‍☠️",
    color: "from-amber-100 to-yellow-100 border-amber-300",
    category: "冒险"
  },
  {
    id: 8,
    title: "猫咪咖啡馆的店长",
    description: "十五只猫员工各有脾气，而人类客人带着故事前来。",
    tasks: [
      "用猫的视角观察一个熟悉的地方",
      "模仿猫的姿态放松五分钟",
      "为今天设定一个'猫咪哲学'（如：盒子即宇宙）"
    ],
    emoji: "🐱",
    color: "from-pink-100 to-rose-100 border-pink-300",
    category: "治愈"
  },
  {
    id: 9,
    title: "时间管理局的实习纠察员",
    description: "你的怀表能显示周围物体的'年龄痕迹'，今天是你第一次独立巡逻。",
    tasks: [
      "找出身边最古老和最年轻的三件物品",
      "预测一件日常用品24小时后的状态",
      "发现一个微小的'时间不一致'现象（如钟表误差）"
    ],
    emoji: "⏳",
    color: "from-cyan-100 to-blue-100 border-cyan-300",
    category: "奇幻"
  },
  {
    id: 10,
    title: "失味星球的最后美食家",
    description: "你的母星失去了所有味觉，你被派往地球搜集'味道记忆'。",
    tasks: [
      "极端专注地品尝一种食物，分析它的层次",
      "将一种气味或声音'翻译'成味道描述",
      "创造一道代表今日心情的虚构菜肴"
    ],
    emoji: "🍜",
    color: "from-red-100 to-orange-100 border-red-300",
    category: "美食"
  }
];

/**
 * 生成基于日期和用户ID的确定性哈希值
 */
function generateDeterministicHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为32位整数
  }
  return Math.abs(hash);
}

/**
 * 获取今日的角色序列（包含1个初始角色 + 3个备选角色）
 * 基于用户ID和日期生成确定性随机序列，确保同用户同日序列固定
 */
export function getTodaysRoleSequence(userId: string = 'default'): Role[] {
  const today = new Date().toDateString();
  const seedString = `${userId}-${today}`;
  const hash = generateDeterministicHash(seedString);

  // 创建角色库的副本以避免修改原数组
  const availableRoles = [...roleLibrary];
  const selectedRoles: Role[] = [];

  // 使用哈希值作为随机种子，选择4个不重复的角色
  let tempHash = hash;
  for (let i = 0; i < 4 && availableRoles.length > 0; i++) {
    const randomIndex = tempHash % availableRoles.length;
    selectedRoles.push(availableRoles[randomIndex]);
    availableRoles.splice(randomIndex, 1);

    // 更新哈希值用于下一次选择
    tempHash = generateDeterministicHash(tempHash.toString());
  }

  // 如果角色库不足4个，用第一个角色补齐
  while (selectedRoles.length < 4) {
    selectedRoles.push(roleLibrary[0]);
  }

  return selectedRoles;
}

/**
 * 获取随机角色（用于调试或其他用途）
 */
export function getRandomRole(): Role {
  return roleLibrary[Math.floor(Math.random() * roleLibrary.length)];
}