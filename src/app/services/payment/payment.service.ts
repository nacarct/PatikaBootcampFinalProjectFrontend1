import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Payment} from "../../models/payment.model";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  url: string = 'http://localhost:5000/api/Payment/';

  constructor(private httpClient: HttpClient) { }

  addPayment(payment: Payment){
    return this.httpClient.post<any>(this.url + 'AddPayment', payment);
  }
}
