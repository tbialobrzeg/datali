import { Component, Input } from '@angular/core';
import { Transaction } from '../db.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent {

  constructor() { }

  @Input()
  public transaction: Transaction = {} as Transaction;

}
