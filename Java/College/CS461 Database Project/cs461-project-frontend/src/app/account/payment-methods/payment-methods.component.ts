import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthenticationService} from "../../_services";
import {AppComponent} from "../../app.component";
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.css']
})
export class PaymentMethodsComponent implements OnInit {
  paymentMethods: any[];
  paymentTypes: any[];
  addPaymentMethod: boolean = false;
  paymentMethodForm: FormGroup;
  selectedType: any = [];

  constructor(private http: HttpClient, private auth: AuthenticationService, private app: AppComponent, private formBuilder: FormBuilder) {
    this.app.loadingAdd(); }

  ngOnInit(): void {
    this.getAllPaymentMethods();
    this.getAllPaymentTypes();
    this.paymentMethodForm = this.formBuilder.group({
      nameOnCard: new FormControl('', Validators.required),
      cardNumber: new FormControl('', Validators.required),
      exp: new FormControl('', Validators.required),
      cvv: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      pmid: new FormControl(''),
      favorite: new FormControl('')
    });
    this.app.loadingRemove();
    this.paymentMethodForm.get("cardNumber").valueChanges.subscribe(val => {
      console.log(val)
      if(val.startsWith('_') || val == ""){
        this.paymentMethodForm.controls.type.reset();
      }
      else if(val.startsWith(4)){
        this.paymentMethodForm.controls.type.setValue(this.paymentTypes[0]);
      }
      else if(val.startsWith(5)){
        this.paymentMethodForm.controls.type.setValue(this.paymentTypes[1]);
      }
      else if(val.startsWith(6)){
        this.paymentMethodForm.controls.type.setValue(this.paymentTypes[2]);
      }
      else if(val.startsWith(38)){
        this.paymentMethodForm.controls.type.setValue(this.paymentTypes[3]);
      }
      else{
        this.paymentMethodForm.controls.type.setValue(this.paymentTypes[4]);
      }
    });
  }
  getAllPaymentMethods(){
    this.app.loadingAdd();
    this.http.get<any>("http://localhost:4200/api/getAllPaymentMethods",
      {params: {accountId: this.auth.currentUserValue.accountId}}).subscribe(response =>{
      console.log(this.paymentMethods);
      this.paymentMethods = JSON.parse(response.data)
      console.log(this.paymentMethods);
      this.app.loadingRemove();
    })
  }
  getAllPaymentTypes(){
    this.app.loadingAdd();
    this.http.get<any>("http://localhost:4200/api/getAllPaymentTypes").subscribe(response =>{
      if(response.status == 200){
        this.paymentTypes = response.data;
      }
      this.app.loadingRemove();
    })
  }

  makeFavorite(PMID: any) {
    this.app.loadingAdd();
    this.http.post<any>("http://localhost:4200/api/setPaymentMethodFavorite", {accountId: this.auth.currentUserValue.accountId, PMID: PMID}).subscribe(response =>{
      if(response.status == 200){
        window.location.reload();
      }
      this.app.loadingRemove();
    })
  }
  get form() { return this.paymentMethodForm.controls; }

  submitPaymentMethod(formElement: any) {

    if (this.paymentMethodForm.invalid) {
      return;
    }
    this.app.loadingAdd();
    let tempForm:any = {};
    if(this.paymentMethodForm.value.pmid != ""){
      tempForm.pmid = parseInt(this.paymentMethodForm.value.pmid);
    }
    if(this.paymentMethodForm.value.favorite != ""){
      tempForm.favorite = this.paymentMethodForm.value.favorite;
    }
    tempForm.accountId = this.auth.currentUserValue.accountId;
    tempForm.typeId = this.paymentMethodForm.value.type.typeId;
    tempForm.nameOnCard = this.paymentMethodForm.value.nameOnCard.toLowerCase();
    tempForm.cardNumber = this.paymentMethodForm.value.cardNumber.replace(/\s/g, "");
    tempForm.exp = this.paymentMethodForm.value.exp;
    tempForm.cvv = this.paymentMethodForm.value.cvv;
    this.http.post<any>("http://localhost:4200/api/savePaymentMethod", {paymentMethod: tempForm}).subscribe(response =>{
      this.app.loadingRemove();
      if(response.status == 200){
        window.location.reload();

      }
    })
  }

  deletePaymentMethod(pmid: number){
    this.http.post<any>("http://localhost:4200/api/deletePaymentMethod", {pmid: pmid}).subscribe(response =>{
      if (response.status == 200){
        window.location.reload();
      }

    })
  }

  getPaymentMethodByFilter(id){
    return this.paymentMethods.filter(x => x.id === id);
  }
  getPaymentTypeByFilter(id){
    return this.paymentTypes.filter(x => x.id === id);
  }

  onChanges(): void {

  }

  editPaymentMethod(method: any) {
    this.paymentMethodForm.setValue({
      pmid: method.PMID,
      type: method.type,
      nameOnCard: method.nameOnCard,
      cardNumber: method.cardNumber,
      exp: method.exp,
      cvv: method.cvv,
      favorite: method.favorite
    });
    this.addPaymentMethod = true
  }
}
