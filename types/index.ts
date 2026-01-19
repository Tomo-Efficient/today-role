export interface Role {
  id: number;
  title: string;
  description: string;
  tasks: string[];
  emoji: string;
  color: string;
  category?: string;
}

export interface UserProgress {
  completedTasks: boolean[];
  completedAt?: Date;
  shared: boolean;
}

// 新增：角色更换记录类型
export interface RoleSwapRecord {
  timestamp: string;
  fromRoleId: number;
  toRoleId: number;
}