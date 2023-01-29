import { Pipe, PipeTransform } from '@angular/core';
import { isTransactionPriceValid, Transaction } from './db.service';

@Pipe({
  name: 'printPrice'
})
export class PrintPricePipe implements PipeTransform {

  transform(transaction: Transaction): string {
    if (!isTransactionPriceValid(transaction)) return "?";
    return transaction.metadata.price_eur;
  }

}
