import { Pipe, PipeTransform } from '@angular/core';
import { isTransactionTimeValid, Transaction } from './db.service';

export enum TimeFilter {
  WHOLE_TIME = "whole time",
  THIS_YEAR = "this year",
  THIS_MONTH = "this month",
  PREVIOUS_MONTH = "previous month"
}

@Pipe({
  name: 'timeFilter'
})
export class TimeFilterPipe implements PipeTransform {

  transform(transactions: Transaction[], timeFilter: TimeFilter): Transaction[] {
    const now = new Date();
    const thisYear = now.getFullYear();
    const thisMonth = now.getMonth();
    return transactions.filter(transaction => {

      if (!isTransactionTimeValid(transaction) && timeFilter == TimeFilter.WHOLE_TIME) return true;
      if (!isTransactionTimeValid(transaction) && timeFilter != TimeFilter.WHOLE_TIME) return false;

      const transactionDate = new Date(transaction.metadata.subscription_created);
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth = transactionDate.getMonth();

      switch (timeFilter) {
        case TimeFilter.THIS_YEAR: {
          return transactionYear == thisYear;
        }
        case TimeFilter.THIS_MONTH: {
          return transactionMonth == thisMonth && transactionYear == thisYear;
        }
        case TimeFilter.PREVIOUS_MONTH: {
          if (thisMonth > 0) return transactionMonth == thisMonth - 1 && transactionYear == thisYear;
          return transactionMonth == 11 && transactionYear == thisYear - 1;
        }
        default: {
          return true;
        }
      }
    });
  }
}
