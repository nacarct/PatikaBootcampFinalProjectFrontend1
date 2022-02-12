import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PaymentLine} from "../../models/paymentLine.model";

@Injectable({
  providedIn: 'root'
})
export class PaymentLineService {

  url: string = 'http://localhost:5000/api/PaymentLine/';

  constructor(private httpClient: HttpClient) { }

  addPaymentLine(paymentLine: PaymentLine){
    return this.httpClient.post<any>(this.url + 'AddPaymentLine', paymentLine);
  }
}
