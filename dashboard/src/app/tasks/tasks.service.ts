import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, map, tap } from 'rxjs';
import { TaskDTO } from '../models/models';


@Injectable({ providedIn: 'root' })
export class TasksService {
    private base = '/api';
    private _tasks$ = new BehaviorSubject<TaskDTO[]>([]);
    tasks$ = this._tasks$.asObservable();
    constructor(private http: HttpClient) {}


    load(params?: { category?: string; ownerId?: number }) {
    let p = new HttpParams();
    if (params?.category) p = p.set('category', params.category);
    if (params?.ownerId) p = p.set('ownerId', params.ownerId);
    return this.http.get<TaskDTO[]>(`${this.base}/tasks`, { params: p })
        .pipe(tap(list => this._tasks$.next(list)));
}


create(payload: Partial<TaskDTO>) { return this.http.post<TaskDTO>(`${this.base}/tasks`, payload).pipe(tap(t => this._tasks$.next([t, ...this._tasks$.value]))); }
update(id: number, payload: Partial<TaskDTO>) { return this.http.put<TaskDTO>(`${this.base}/tasks/${id}`, payload).pipe(tap(t => this._tasks$.next(this._tasks$.value.map(x => x.id===id? t: x)))); }
remove(id: number) { return this.http.delete(`${this.base}/tasks/${id}`).pipe(tap(() => this._tasks$.next(this._tasks$.value.filter(x => x.id!==id)))); }
}