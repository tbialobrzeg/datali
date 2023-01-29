import { Pipe, PipeTransform } from '@angular/core';
import { Transaction } from './db.service';

@Pipe({
  name: 'currentPage'
})
export class CurrentPagePipe implements PipeTransform {

  transform(transacions: Transaction[], pageIndex: number, pageSize: number): Transaction[] {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return transacions.slice(start, end);
  }

}
