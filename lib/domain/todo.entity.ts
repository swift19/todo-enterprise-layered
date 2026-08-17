export type TodoPriority = 'low' | 'medium' | 'high';
export interface TodoEntity {
  id: string;
  title: string;
  completed: boolean;
  priority: TodoPriority;
  userId: string;
  createdAt: Date;
}
export class TodoDomain {
  static canToggle(todo: TodoEntity): boolean { return !!todo.title; }
  static isOverdue(todo: TodoEntity): boolean {
    return !todo.completed && (Date.now() - todo.createdAt.getTime()) > 86400000 * 3;
  }
  static validateTitle(title: string): void {
    if (!title || title.trim().length < 3) throw new Error('Title must be >=3 chars');
    if (title.length > 100) throw new Error('Title too long');
  }
  static create(title: string, userId: string, priority: TodoPriority = 'medium'): Omit<TodoEntity, 'id' | 'createdAt'> {
    this.validateTitle(title);
    return { title: title.trim(), completed: false, priority, userId };
  }
}
