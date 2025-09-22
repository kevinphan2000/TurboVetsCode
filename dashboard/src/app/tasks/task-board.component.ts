import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Subject, takeUntil } from 'rxjs';
import Chart from 'chart.js/auto';
import { TasksService } from './tasks.service';
import { TaskDTO } from '../models/models';

@Component({
  selector: 'turbovets-task-board',
  template: `
  <div class="flex flex-col gap-4">
    <!-- Filters / Toolbar -->
    <div class="flex flex-wrap items-center gap-3">
      <input [(ngModel)]="query" (ngModelChange)="applyFilters()" placeholder="Search…" class="px-3 py-2 rounded-lg border dark:border-gray-700 bg-transparent" />
      <select [(ngModel)]="category" (change)="refresh()" class="px-3 py-2 rounded-lg border dark:border-gray-700 bg-transparent">
        <option value="">All</option>
        <option>Work</option>
        <option>Personal</option>
      </select>
      <button (click)="openNew()" class="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">New (N)</button>
      <button (click)="toggleChart()" class="px-3 py-2 rounded-lg border dark:border-gray-700">Toggle Chart</button>
    </div>

    <!-- Optional Chart -->
    <canvas *ngIf="showChart" id="doneChart" class="max-w-xl"></canvas>

    <!-- Columns -->
    <div class="grid gap-4 md:grid-cols-3">
      <div class="rounded-2xl border dark:border-gray-800 p-3">
        <h3 class="font-semibold mb-2">Backlog</h3>
        <div
          cdkDropList
          id="backlogList"
          [cdkDropListData]="backlog"
          [cdkDropListConnectedTo]="['openList','doneList']"
          (cdkDropListDropped)="drop($event)"
          class="space-y-2 min-h-10"
        >
          <turbovets-task-card
            *ngFor="let t of filtered(backlog); trackBy: trackById"
            [task]="t"
            (edit)="edit(t)"
            (remove)="remove(t)"
            cdkDrag
          ></turbovets-task-card>
        </div>
      </div>

      <div class="rounded-2xl border dark:border-gray-800 p-3">
        <h3 class="font-semibold mb-2">Open</h3>
        <div
          cdkDropList
          id="openList"
          [cdkDropListData]="open"
          [cdkDropListConnectedTo]="['backlogList','doneList']"
          (cdkDropListDropped)="drop($event)"
          class="space-y-2 min-h-10"
        >
          <turbovets-task-card
            *ngFor="let t of filtered(open); trackBy: trackById"
            [task]="t"
            (edit)="edit(t)"
            (remove)="remove(t)"
            cdkDrag
          ></turbovets-task-card>
        </div>
      </div>

      <div class="rounded-2xl border dark:border-gray-800 p-3">
        <h3 class="font-semibold mb-2">Done</h3>
        <div
          cdkDropList
          id="doneList"
          [cdkDropListData]="done"
          [cdkDropListConnectedTo]="['backlogList','openList']"
          (cdkDropListDropped)="drop($event)"
          class="space-y-2 min-h-10"
        >
          <turbovets-task-card
            *ngFor="let t of filtered(done); trackBy: trackById"
            [task]="t"
            (edit)="edit(t)"
            (remove)="remove(t)"
            cdkDrag
          ></turbovets-task-card>
        </div>
      </div>
    </div>

    <!-- Form Drawer -->
    <turbovets-task-form
      *ngIf="formOpen"
      [model]="editing"
      (save)="save($event)"
      (cancel)="formOpen=false"
    ></turbovets-task-form>
  </div>
  `,
})
export class TaskBoardComponent implements OnInit, OnDestroy {
  // state
  tasks: TaskDTO[] = [];
  backlog: TaskDTO[] = [];
  open: TaskDTO[] = [];
  done: TaskDTO[] = [];

  // ui
  category = '';
  query = '';
  formOpen = false;
  editing: Partial<TaskDTO> | null = null;

  // chart
  showChart = false;
  chart: any;

  private destroyed$ = new Subject<void>();

  constructor(private svc: TasksService) {}

  ngOnInit() {
    this.refresh();
    this.svc.tasks$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((list) => {
        this.tasks = list ?? [];
        this.split();
        if (this.showChart) this.renderChart();
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    if (this.chart) this.chart.destroy?.();
  }

  refresh() {
    this.svc.load({ category: this.category || undefined }).subscribe();
  }

  split() {
    const by = (s: string) => this.tasks.filter((t) => (t.status || 'Open') === s);
    this.backlog = by('Backlog');
    this.open = by('Open');
    this.done = by('Done');
  }

  applyFilters() {
    // no-op: filtering is handled by filtered() in template
  }

  filtered(list: TaskDTO[]) {
    const q = this.query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((t) =>
      (t.title + ' ' + (t.description || '') + ' ' + (t.category || '')).toLowerCase().includes(q),
    );
  }

  openNew() {
    this.editing = { title: '', category: 'Personal', status: 'Backlog' } as any;
    this.formOpen = true;
  }

  edit(t: TaskDTO) {
    this.editing = { ...t };
    this.formOpen = true;
  }

  save(model: Partial<TaskDTO>) {
    const op = model.id ? this.svc.update(model.id, model) : this.svc.create(model);
    op.subscribe(() => {
      this.formOpen = false;
      this.editing = null;
    });
  }

  remove(t: TaskDTO) {
    this.svc.remove(t.id).subscribe();
  }

  drop(e: CdkDragDrop<TaskDTO[]>) {
    if (e.previousContainer === e.container) {
      moveItemInArray(e.container.data, e.previousIndex, e.currentIndex);
    } else {
      transferArrayItem(e.previousContainer.data, e.container.data, e.previousIndex, e.currentIndex);
      const moved = e.container.data[e.currentIndex];
      const newStatus = this.statusForListId(e.container.id);
      if (moved.status !== newStatus) {
        this.svc.update(moved.id, { status: newStatus }).subscribe();
      }
    }
  }

  private statusForListId(listId: string): 'Backlog' | 'Open' | 'Done' {
    if (listId === 'backlogList') return 'Backlog';
    if (listId === 'openList') return 'Open';
    return 'Done';
  }

  toggleChart() {
    this.showChart = !this.showChart;
    if (this.showChart) setTimeout(() => this.renderChart());
  }

  async renderChart() {
    const { Chart } = await import('chart.js/auto');
    const ctx = (document.getElementById('doneChart') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx) return;

    const counts: Record<string, number> = {};
    this.done.forEach((t) => {
      const d = new Date(t.updatedAt).toDateString();
      counts[d] = (counts[d] || 0) + 1;
    });

    const labels = Object.keys(counts).slice(-7);
    const data = labels.map((l) => counts[l]);
    if (this.chart) this.chart.destroy();
    this.chart = new Chart(ctx, { type: 'bar', data: { labels, datasets: [{ label: 'Done per day', data }] } });
  }

  trackById(_i: number, t: TaskDTO) {
    return t.id;
  }

  // Keyboard shortcuts (proper HostListener usage)
  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    // Ignore when typing in inputs/textareas to avoid hijacking typing
    const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;

    if ((e.key === 'n' || e.key === 'N') && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      this.openNew();
    } else if (e.key === 'Delete') {
      e.preventDefault();
      const first = this.open[0] || this.backlog[0] || this.done[0];
      if (first) this.remove(first);
    } else if (e.key === '/') {
      e.preventDefault();
      (document.querySelector('input[placeholder="Search…"]') as HTMLInputElement)?.focus();
    }
  }
}
