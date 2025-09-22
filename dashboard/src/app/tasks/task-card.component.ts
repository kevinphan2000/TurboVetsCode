import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskDTO } from '../models/models';


@Component({
selector: 'turbovets-task-card',
template: `
    <div cdkDrag class="p-3 rounded-xl border dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm">
    <div class="flex items-start justify-between gap-2">
    <div>
    <div class="font-medium">{{ task.title }}</div>
    <div class="text-xs opacity-70">{{ task.category }} • {{ task.updatedAt | date:'short' }}</div>
    </div>
    <div class="flex gap-2">
    <button class="px-2 py-1 rounded-lg border text-xs" (click)="edit.emit(task)">Edit</button>
    <button class="px-2 py-1 rounded-lg bg-red-500 text-white text-xs" (click)="remove.emit(task)">Delete</button>
    </div>
    </div>
    <p class="mt-2 text-sm whitespace-pre-line" *ngIf="task.description">{{ task.description }}</p>
    </div>
`,
})
export class TaskCardComponent {
@Input() task!: TaskDTO;
@Output() edit = new EventEmitter<TaskDTO>();
@Output() remove = new EventEmitter<TaskDTO>();
}