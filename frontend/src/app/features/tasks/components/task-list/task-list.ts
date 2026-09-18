import { Component, computed, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Task, UpdateTaskRequest } from '../../models/task';
import { TaskService } from '../../services/task';
import { TaskForm } from '../task-form/task-form';

@Component({
  selector: 'app-task-list',
  imports: [DecimalPipe, TaskForm],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList implements OnInit {
  protected readonly tasks = signal<Task[]>([]);
  protected readonly searchTerm = signal('');
  protected readonly statusFilter = signal<'all' | 'open' | 'complete'>('all');
  protected readonly editingTaskId = signal<number | null>(null);
  protected readonly editTitle = signal('');
  protected readonly editDescription = signal('');
  protected readonly visibleTasks = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();

    return this.tasks().filter((task) => {
      const matchesSearch = !search || `${task.title} ${task.description ?? ''}`.toLowerCase().includes(search);
      const matchesStatus = status === 'all' || (status === 'complete' ? task.completed : !task.completed);
      return matchesSearch && matchesStatus;
    });
  });
  protected isLoading = signal(true);
  protected errorMessage = signal('');

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  protected loadTasks(): void {
    this.isLoading.set(true);
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks.set(tasks);
      this.isLoading.set(false);
    });
  }

  protected addTask(task: Task): void {
    this.tasks.update((tasks) => [task, ...tasks]);
  }

  protected startEditing(task: Task): void {
    this.editingTaskId.set(task.id);
    this.editTitle.set(task.title);
    this.editDescription.set(task.description ?? '');
  }

  protected cancelEditing(): void {
    this.editingTaskId.set(null);
  }

  protected saveTask(task: Task): void {
    const update: UpdateTaskRequest = {
      title: this.editTitle().trim(),
      description: this.editDescription().trim(),
      completed: task.completed
    };

    if (!update.title) return;

    this.taskService.updateTask(task.id, update).subscribe((updatedTask) => {
      this.tasks.update((tasks) => tasks.map((item) => item.id === updatedTask.id ? updatedTask : item));
      this.cancelEditing();
    });
  }

  protected toggleCompleted(task: Task): void {
    this.taskService.updateTask(task.id, {
      title: task.title,
      description: task.description ?? '',
      completed: !task.completed
    }).subscribe((updatedTask) => {
      this.tasks.update((tasks) => tasks.map((item) => item.id === updatedTask.id ? updatedTask : item));
    });
  }

  protected removeTask(task: Task): void {
    if (!window.confirm(`Delete "${task.title}"?`)) return;

    this.taskService.deleteTask(task.id).subscribe(() => {
      this.tasks.update((tasks) => tasks.filter((item) => item.id !== task.id));
    });
  }

  protected setSearchTerm(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  protected setStatusFilter(event: Event): void {
    this.statusFilter.set((event.target as HTMLSelectElement).value as 'all' | 'open' | 'complete');
  }

  protected completedCount(): number {
    return this.tasks().filter((task) => task.completed).length;
  }

  protected pendingCount(): number {
    return this.tasks().length - this.completedCount();
  }
}