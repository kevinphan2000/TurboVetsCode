import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'filter', standalone: false })
export class FilterPipe implements PipeTransform {
    transform<T extends { [k: string]: any }>(list: T[], q: string) {
        if (!q) return list;
            const s = q.toLowerCase();
        return list.filter(x => JSON.stringify(x).toLowerCase().includes(s));
    }
}