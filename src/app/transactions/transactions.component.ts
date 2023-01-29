import { Component, Input, OnInit } from '@angular/core';
import { DBService, Transaction } from '../db.service';
import { TimeFilter } from "../time-filter.pipe";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent {

  public readonly PAGE_SIZE = 5;
  public readonly INITIAL_CHUNK_SIZE = 100;
  public readonly TimeFilter = TimeFilter;
  public timeFilter = TimeFilter.WHOLE_TIME;
  public descriptionQuery: string = "";
  public priceFrom: string = "";
  public priceTo: string = "";
  public pageIndex = 0;


  constructor(public dbService: DBService) {
    dbService.loadTransactions(this.INITIAL_CHUNK_SIZE);
  }

  public setPage(pageIndex: number) {
    this.pageIndex = pageIndex >= 0 ? pageIndex : 0;
    this.dbService.loadTransactions((this.pageIndex + 1) * this.PAGE_SIZE);
  }

  public resetPageSearch() {
    if (this.descriptionQuery.length >= 3) this.pageIndex = 0;
  }

}
