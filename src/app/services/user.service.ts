import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = environment.apiUrl;

  constructor(
    private httpClient : HttpClient
  ) { }

  login(data : any){
    return this.httpClient.post(this.url + "user/signin",data, {
      headers: new HttpHeaders().set('Content-Type',"application/json")
    })
  }

  checkToken(){
     return this.httpClient.get(this.url +  "user/checkToken");
  }

  changePassword(data: any){
    return this.httpClient.post(this.url + "user/changepassword", data,{
      headers: new HttpHeaders().set('Content-Type',"application/json")
    })
  }

  getUsers(){
    return this.httpClient.get(this.url + "user/get/");
  }

  update(data:any){
    return this.httpClient.patch(this.url + "user/update/", data,{
      headers: new HttpHeaders().set('Content-Type',"application/json")
    })
  }
}
