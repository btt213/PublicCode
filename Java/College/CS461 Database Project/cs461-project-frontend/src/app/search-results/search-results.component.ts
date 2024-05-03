import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {AppComponent} from "../app.component";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  private routeSub: Subscription;
  products: any[] = [];
  k: any;

  primeFilter: boolean;
  category: any;


  constructor(private route: ActivatedRoute, private http: HttpClient, public app: AppComponent, public router: Router) { }

  ngOnInit(): void {
    this.routeSub = this.route.queryParams.subscribe(params => {
      this.k = params['k']
      this.category = params['c']
      this.primeFilter = String(params['p']) == "true"
      this.app.loadingAdd()
      this.searchProducts();
    });
  }
  searchProducts(){
    this.http.get<any>('http://localhost:4200/api/searchProducts', {params: {k: this.k, c: String(this.category), prime: String(this.primeFilter)}}).subscribe(response =>{
      this.products = JSON.parse(response.data);
      console.log(this.products)
      this.app.loadingRemove()
    })
  }
  filter(){
    // console.log(this.primeFilter)

    this.router.navigate(['/s'], {queryParams: {k: this.k, c: this.category, p: this.primeFilter}})

  }
}
