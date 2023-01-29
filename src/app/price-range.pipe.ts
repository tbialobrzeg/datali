import { Pipe, PipeTransform } from '@angular/core';
import { isTransactionPriceValid, Transaction } from './db.service';

@Pipe({
  name: 'priceRange'
})
export class PriceRangePipe implements PipeTransform {

  transform(transactions: Transaction[], from: string, to: string): Transaction[] {
    return transactions.filter(transaction => {
      if (!isTransactionPriceValid(transaction)) return true
      if (from == "") from = "0";
      let fromNumber = parseFloat(from);
      let toNumber = Infinity;
      if (to != "") toNumber = parseFloat(to);
      let transactionPrice = parseFloat(transaction.metadata.price_eur);
      return transactionPrice <= toNumber && transactionPrice >= fromNumber;
    })
  }
}
