import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TaskDTO } from '../models/models';


@Component({
    selector: 'turbovets-task-form',
    template: `
        <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="w-full max-w-lg bg-white dark:bg-gray-950 rounded-2xl p-6 border dark:border-gray-800 shadow-xl">
        <h3 class="text-lg font-semibold mb-3">{{ model?.id ? 'Edit Task' : 'New Task' }}</h3>
        <form [formGroup]="form" (ngSubmit)="onSave()" class="space-y-3">
        <div>
        <label class="block text-sm">Title</label>
        <input class="w-full mt-1 px-3 py-2 rounded-lg border dark:border-gray-700 bg-transparent" formControlName="title" required />
        </div>
        <div>
        <label class="block text-sm">Description</label>
        <textarea class="w-full mt-1 px-3 py-2 rounded-lg border dark:border-gray-700 bg-transparent" rows="3" formControlName="description"></textarea>
        </div>
        <div class="grid grid-cols-2 gap-3">
        <div>
        <label class="block text-sm">Category</label>
        <select class="w-full mt-1 px-3 py-2 rounded-lg border dark:border-gray-700 bg-transparent" formControlName="category">
        <option>Work</option>
        <option>Personal</option>
        </select>
        </div>
        <div>
        <label class="block text-sm">Status</label>
        <select class="w-full mt-1 px-3 py-2 rounded-lg border dark:border-gray-700 bg-transparent" formControlName="status">
        <option>Backlog</option>
        <option>Open</option>
        <option>Done</option>
        </select>
        </div>
        </div>
        <div class="flex justify-end gap-2 pt-2">
        <button type="button" class="px-3 py-2 rounded-lg border dark:border-gray-700" (click)="cancel.emit()">Cancel</button>
        <button class="px-3 py-2 rounded-lg bg-blue-600 text-white">Save</button>
        </div>
        </form>
        </div>
        </div>
    `,
})
export class TaskFormComponent implements OnChanges {
    @Input() model: Partial<TaskDTO> | null = null;
    @Output() save = new EventEmitter<Partial<TaskDTO>>();
    @Output() cancel = new EventEmitter<void>();
    form = this.fb.group({ title: ['', Validators.required], description: [''], category: ['Personal'], status: ['Backlog'] });
    constructor(private fb: FormBuilder) {}
    ngOnChanges(changes: SimpleChanges) {
    if (changes['model']) {
    const m = this.model || ({} as any);
    this.form.patchValue({ title: m.title || '', description: m.description || '', category: m.category || 'Personal', status: (m as any).status || 'Backlog' });
    }
    }
    onSave() { if (this.form.valid) this.save.emit({ ...this.model, ...this.form.value }); }
}