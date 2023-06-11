export type User = {
  id: number;
  email: string;
  password: string;
  role: Role;
  permissions: UserPermission[];
  createdAt: string;
  updatedAt: string;
  firstName?: string;
  lastName?: string;
  workDays: WorkDay[];
  taskHours: TaskHour[];
  comments: Comment[];
};

export type Permission = {
  id: number;
  name: string;
  users: UserPermission[];
};

export type UserPermission = {
  permissionId: number;
  permission: Permission;
  user: User;
  userId: number;
};

export enum Role {
  Pracownik = 'Pracownik',
  Moderator = 'Moderator',
  Administrator = 'Administrator',
}

export type TaskHour = {
  id: number;
  taskId: number;
  createdAt: string;
  startTime: string;
  endTime: string;
  duration: number;
  task: Task;
  workDay?: WorkDay;
  workDayId?: number;
  user: User;
  userId: number;
};

export type Comment = {
  id: number;
  createdAt: string;
  updatedAt: string;
  content: string;
  type: string;
  workdayId: number;
  workday: WorkDay;
  userId: number;
  user: User;
};

export type WorkDay = {
  id: number;
  userId: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  isReviewed: boolean;
  reviewedBy?: number;
  hours: TaskHour[];
  comments: Comment[];
  user: User;
};

export type Task = {
  id: number;
  projectId: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  taskHours?: TaskHour[];
  project: Project;
};

export type Project = {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  tasks: Task[];
};
