export type TaskHour = {
  id: number;
  taskId: number;
  userId: number;
  createdAt: string;
  startTime: string;
  endTime: string;
  duration: number;
  note: string;
};

export type Comments = {
  id: number;
  userId: number;
  workdayId: number;
  createdAt: string;
  updatedAt: string;
  content: string;
  type: string;
};

export type WorkDay = {
  id: number;
  userId: number;
  date: Date;
  createdAt: string;
  updatedAt: string;
  hours: TaskHour[];
  isReviewed: boolean;
  revievedBy: string;
  comments: Comments[];
};

export type User = {
  id: number;
  createdAt: string;
  updatedAt: string;
  email: string;
  firstName: string;
  lastName: string;
  workDays: WorkDay[];
};

export type Task = {
  id: number;
  projectId: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
};

export type Project = {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  tasks: Task[];
};

export type CurrentUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  token: string;
};
