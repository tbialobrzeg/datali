import { Component, Input, OnInit } from '@angular/core';
import { DBService, isTransactionPriceValid, isTransactionTimeValid, Transaction } from '../db.service';


export enum TimeFilter {
  WHOLE_TIME = "whole time",
  THIS_YEAR = "this year",
  THIS_MONTH = "this month",
  PREVIOUS_MONTH = "previous month"
}

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent {

  public readonly PAGE_SIZE = 5;
  public readonly TimeFilter = TimeFilter;
  public timeFilter = TimeFilter.WHOLE_TIME;
  public descriptionQuery: string = "";
  public priceFrom: string = "";
  public priceTo: string = "";
  public pageIndex = 0;
  private allTransactions: Transaction[] = [];
  private filteredTransactions: Transaction[] = [];

  constructor(public dbService: DBService) {
    dbService.loadNextPage(this.PAGE_SIZE).then(() => {
      this.updateTransactionsLists();
    });
  }

  public getFilteredTransactions() {
    return this.filteredTransactions;
  }

  public nexPage() {
    const lastPageIndex = this.lastPageIndex(this.filteredTransactions.length);

    if (this.pageIndex == lastPageIndex) {
      this.dbService.loadNextPage(this.PAGE_SIZE).then(() => {
        this.updateTransactionsLists();
        this.pageIndex = this.lastPageIndex(this.filteredTransactions.length);
      })
      return;
    }
    this.pageIndex += 1;
  }

  public setPage(pageIndex: number) {
    this.pageIndex = pageIndex >= 0 ? pageIndex : 0;
    this.updateTransactionsLists();
  }

  public resetPageSearch() {
    if (this.descriptionQuery.length >= 3) {
      this.pageIndex = 0;
      this.updateTransactionsLists();
    }
  }

  private updateTransactionsLists() {
    this.allTransactions = this.dbService.getTransactions();
    this.filteredTransactions = this.descriptionFilterFunc(this.allTransactions);
    this.filteredTransactions = this.timeFilterFunc(this.filteredTransactions);
    this.filteredTransactions = this.priceFilterFunc(this.filteredTransactions);

    return this.filteredTransactions;
  }

  // Angular doesn't recommend to sort or filter in pipes
  private descriptionFilterFunc(transactions: Transaction[]) {
    return transactions.filter((transaction) => {
      if (transaction == null) return false;
      if (this.descriptionQuery == null || this.descriptionQuery.length < 3) return true;
      if (transaction.description == null) return false;
      return transaction.description.search(this.descriptionQuery) >= 0;
    });
  }

  // Angular doesn't recommend to sort or filter in pipes
  private timeFilterFunc(transactions: Transaction[]) {
    const now = new Date();
    const thisYear = now.getFullYear();
    const thisMonth = now.getMonth();
    return transactions.filter(transaction => {

      if (!isTransactionTimeValid(transaction) && this.timeFilter == TimeFilter.WHOLE_TIME) return true;
      if (!isTransactionTimeValid(transaction) && this.timeFilter != TimeFilter.WHOLE_TIME) return false;

      const transactionDate = new Date(transaction.metadata.subscription_created);
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth = transactionDate.getMonth();

      switch (this.timeFilter) {
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

  // Angular doesn't recommend to sort or filter in pipes
  private priceFilterFunc(transactions: Transaction[]) {
    return transactions.filter(transaction => {
      if (!isTransactionPriceValid(transaction)) return true
      let fromNumber = 0;
      let toNumber = Infinity;
      if (this.priceFrom != "") fromNumber = parseFloat(this.priceFrom);
      if (this.priceTo != "") toNumber = parseFloat(this.priceTo);
      let transactionPrice = parseFloat(transaction.metadata.price_eur);
      return transactionPrice <= toNumber && transactionPrice >= fromNumber;
    })
  }

  private lastPageIndex(transactionsNumber: number) {
    let index = Math.floor((transactionsNumber - 1) / this.PAGE_SIZE);
    if (index < 0) index = 0;
    return index;
  }

}
