import { Pipe, PipeTransform } from '@angular/core';
import { Transaction } from './db.service';

@Pipe({
  name: 'pictureURL'
})
export class PictureURLPipe implements PipeTransform {

  transform(transaction: Transaction): string {
    let url = transaction.picture_url;
    if (url == null || url == "") url = "/assets/images/no-picture.jpg";
    return url;
  }

}


