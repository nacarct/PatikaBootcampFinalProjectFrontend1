import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Policy} from "../../models/policy.model";

@Injectable({
  providedIn: 'root'
})
export class PolicyService {

  url: string = 'http://localhost:5000/api/Policy/';

  constructor(private httpClient: HttpClient) { }

  addPolicy(policy: Policy){
    return this.httpClient.post<any>(this.url + 'AddPolicy' , policy);
  }
}
