import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BestSellerService {

  url = environment.apiUrl;

  constructor(
    private httpClient : HttpClient
  ) { }

  getProductsList(){
    return this.httpClient.get(this.url + "product/get/")
  }
}
