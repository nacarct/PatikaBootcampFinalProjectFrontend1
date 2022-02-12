import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  url: string = 'http://localhost:5000/api/Product/';

  constructor(private httpClient: HttpClient) { }

  getAllProducts(){
    return this.httpClient.get<any>(this.url + 'GetAll');
  }
}
