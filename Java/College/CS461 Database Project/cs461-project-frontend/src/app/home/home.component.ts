import { Component, OnInit } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {

  currentUserSubject: BehaviorSubject<any>;
  test: any;
  products: any[];

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {

    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
  }



  ngOnInit(): void {
    let params = new HttpParams().set("productId",'1');
    this.http.get<any>("http://localhost:4200/api/getProductImages", {params: params}).subscribe(response => {
      let objectURL = 'data:image/jpeg;base64,' + response.data[0];

      this.test = this.sanitizer.bypassSecurityTrustUrl(objectURL);

    });
    params = new HttpParams().set("productId",'1');
    this.http.get<any>("http://localhost:4200/api/getProduct", {params: params}).subscribe(response => {
      let objectURL = 'data:image/jpeg;base64,' + response.data[0];

      this.test = this.sanitizer.bypassSecurityTrustUrl(objectURL);

    });
  }

}
