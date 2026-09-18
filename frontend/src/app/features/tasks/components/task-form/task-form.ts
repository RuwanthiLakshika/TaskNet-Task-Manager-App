import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, CreateTaskRequest } from '../../models/task';
import { TaskService } from '../../services/task';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule],
  styleUrl: './task-form.css',
  templateUrl: './task-form.html',
})
export class TaskForm {
  @Output() taskCreated = new EventEmitter<Task>();

  protected readonly form;

  protected isSubmitting = false;
  protected errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService
  ) {
    this.form = this.formBuilder.nonNullable.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['']
    });
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const task: CreateTaskRequest = this.form.getRawValue();

    this.taskService.createTask(task).subscribe({
      next: (createdTask) => {
        this.taskCreated.emit(createdTask);
        this.form.reset();
        this.isSubmitting = false;
      },
      error: () => {
        this.errorMessage = 'Unable to create task. Please try again.';
        this.isSubmitting = false;
      }
    });
  }
}
