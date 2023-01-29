import { Pipe, PipeTransform } from '@angular/core';
import { isTransactionTimeValid, Transaction } from './db.service';

@Pipe({
  name: 'printDate'
})
export class PrintDatePipe implements PipeTransform {

  transform(transaction: Transaction): string {
    if (!isTransactionTimeValid(transaction)) return "?";
    return new Date(transaction.metadata.subscription_created).toLocaleDateString();
  }

}
