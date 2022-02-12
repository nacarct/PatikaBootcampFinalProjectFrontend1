import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  url: string = 'http://localhost:5000/api/Customer/';

  constructor(private httpClient: HttpClient) { }

  getCustomerByTcKn(tcKn: string){
    return this.httpClient.get<any>(this.url + 'GetByTcKn?tcKn='+tcKn);
  }
}
