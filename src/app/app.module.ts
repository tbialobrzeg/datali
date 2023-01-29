import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DBService } from './db.service';
import { TransactionsComponent } from './transactions/transactions.component';
import { PrintDatePipe } from './print-date.pipe';
import { PrintPricePipe } from './print-price.pipe';
import { CurrentPagePipe } from './current-page.pipe';
import { PictureURLPipe } from './picture-url.pipe';
import { TransactionComponent } from './transaction/transaction.component';

@NgModule({
  declarations: [
    AppComponent,
    TransactionsComponent,
    PrintDatePipe,
    PrintPricePipe,
    CurrentPagePipe,
    PictureURLPipe,
    TransactionComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule
  ],
  providers: [DBService],
  bootstrap: [AppComponent]
})
export class AppModule { }
