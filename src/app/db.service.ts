import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
    return this.transactions;
  }

  loadNextPage(pageSize: number) {
    return new Promise((resolve) => {
      let startIndex = this.transactions.length;
      // we don't have to unsubscribe from http, it's done automatically
      this.http.post<Transaction[]>(this.apiPath, { start_at: startIndex, limit: pageSize })
        .subscribe(newChunk => {
          this.transactions.push(...newChunk);
          resolve(this.transactions);
        })
    });
  }

  private transactions: Transaction[] = [];
  private readonly apiPath = "https://2fn4h5gwz1.execute-api.us-east-1.amazonaws.com/dev/data";
}
