import { Pipe, PipeTransform } from '@angular/core';
import { Transaction } from './db.service';

@Pipe({
  name: 'filterDescription'
})
export class FilterDescriptionPipe implements PipeTransform {
  transform(transacions: Transaction[], query: string): Transaction[] {
    return transacions.filter((transaction) => {
      if(transaction == null) return false;
      if (query == null || query.length < 3) return true;
      if(transaction.description == null) return false;
      return transaction.description.search(query) >= 0;
    });
  }

}
