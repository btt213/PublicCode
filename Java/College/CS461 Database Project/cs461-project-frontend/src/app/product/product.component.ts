import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AppComponent} from "../app.component";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  private routeSub: Subscription;
  focusedContainer: any;
  productId: any;
  product: any = {};
  productImageUrls: any[] = [];
  mainImg: any;
  quantityOptions: any[] = [];
  quantity: any = 1;
  categories: { name: string; categoryId: number }[];

  constructor(private route: ActivatedRoute, private http: HttpClient, public app: AppComponent) { }

  ngOnInit(): void {
    this.app.loadingAdd()
    this.routeSub = this.route.params.subscribe(params => {
      this.productId = params['id']
      this.app.loadingRemove()
    });
    this.app.loadingAdd()
    this.http.get<any>("http://localhost:4200/api/getProduct", {params: {productId: this.productId}}).subscribe(response => {
      this.product=response.data
      this.app.loadingRemove()
    })
    this.app.loadingAdd()
    this.http.get<any>("http://localhost:4200/api/getProductImages", {params: {productId: this.productId}}).subscribe(response => {
      console.log(response)
      this.productImageUrls = response.data;
      this.mainImg = this.productImageUrls[0]
      this.app.loadingRemove()
    });

    this.app.loadingAdd()
    this.fetchCategories()
    this.quantityOptions = [
      {name: '1'},
      {name: '2'},
      {name: '3'},
      {name: '4'},
      {name: '5'},

    ]
    this.app.loadingRemove()
  }
  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  focused(container: any, index: any) {
    if(this.focusedContainer != null){
      this.focusedContainer.classList.remove("imageListContainerFocused")
    }
    container.classList.add("imageListContainerFocused");
    this.mainImg = this.productImageUrls[index];
    this.focusedContainer = container;
  }

  fetchCategories(){
    this.http.get<any>("http://localhost:4200/api/getAllCategories").subscribe(response => {
      this.categories = response.data
      this.app.loadingRemove()
    });
  }
}
