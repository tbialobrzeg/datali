import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Data } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';


export interface Transaction {
  id: number,
  description: string,
  picture_url: string,
  metadata: {
    price_eur: string,
    subscription_created: string,
    subscription: {
      actif: boolean,
      responsible: {
        avatar_url: string,
        dob: string,
        email: string,
        first_name: string,
        last_name: string,
        phone: string,
      }
    }
  }
}

export function isTransactionPriceValid(transaction: Transaction) {
  return transaction != null && transaction.metadata != null && transaction.metadata.price_eur != null;
}

export function isTransactionTimeValid(transaction: Transaction) {
  return transaction != null && transaction.metadata != null && transaction.metadata.subscription_created != null;
}


@Injectable({
  providedIn: 'root'
})
export class DBService {
  constructor(private http: HttpClient) { }

  public getTransactions() {
    return this._transactions;
  }

  // if view wants to show more transactions than currently loaded we load more
  loadTransactions(numberOfTransactions: number) {

    if (numberOfTransactions < this._transactions.length) return;

    let startIndex = this._transactions.length;

    // we don't have to unsubscribe from http, it's done automatically
    this.http.post<Transaction[]>(this._apiPath, { start_at: startIndex, limit: numberOfTransactions - startIndex })
      .subscribe(newChunk => {
        let oldChunk = this._transactions;
        // we have to change array reference so Angular can notice change and refresh view
        this._transactions = [];
        this._transactions.push(...oldChunk)
        this._transactions.push(...newChunk);
      })
  }

  private _transactions: Transaction[] = [];
  private readonly _apiPath = "https://2fn4h5gwz1.execute-api.us-east-1.amazonaws.com/dev/data";
}
