import { Component } from '@angular/core';
import { TaskList } from './features/tasks/components/task-list/task-list';

@Component({
  imports: [TaskList],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}