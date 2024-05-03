import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {AuthenticationService} from "../../_services";
import {AppComponent} from "../../app.component";

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.css']
})
export class AddressesComponent implements OnInit {
  addresses: any[];
  paymentTypes: any[];
  addAddress: boolean = false;
  addressForm: FormGroup;
  selectedType: any = [];

  constructor(private http: HttpClient, private auth: AuthenticationService, public app: AppComponent, private formBuilder: FormBuilder) {
    this.app.loadingAdd(); }

  ngOnInit(): void {
    this.getAllAddresses();
    this.addressForm = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      zipcode: new FormControl('', Validators.required),
      addressId: new FormControl(''),
      favorite: new FormControl('')
    });
    this.app.loadingRemove();
  }
  getAllAddresses(){
    this.app.loadingAdd();
    this.http.get<any>("http://localhost:4200/api/getAllAddresses",
      {params: {accountId: this.auth.currentUserValue.accountId}}).subscribe(response =>{
      console.log(response.data);
      this.addresses = response.data
      console.log(this.addresses);
      this.app.loadingRemove();
    })
  }

  makeFavorite(addressId: any) {
    this.app.loadingAdd();
    this.http.post<any>("http://localhost:4200/api/setAddressFavorite", {accountId: this.auth.currentUserValue.accountId, AddressId: addressId}).subscribe(response =>{
      if(response.status == 200){
        window.location.reload();
      }
      this.app.loadingRemove();
    })
  }
  get form() { return this.addressForm.controls; }

  submitAddress(formElement: any) {

    if (this.addressForm.invalid) {
      return;
    }
    this.app.loadingAdd();
    let tempForm:any = {};
    if(this.addressForm.value.addressId != ""){
      tempForm.addressId = parseInt(this.addressForm.value.addressId);
    }
    if(this.addressForm.value.favorite != ""){
      tempForm.favorite = this.addressForm.value.favorite;
    }
    tempForm.accountId = this.auth.currentUserValue.accountId;
    tempForm.name = this.addressForm.value.name.toLowerCase();
    tempForm.address = this.addressForm.value.address.toLowerCase();
    tempForm.city = this.addressForm.value.city.toLowerCase();
    tempForm.state = this.addressForm.value.state.toLowerCase();
    tempForm.zipcode = this.addressForm.value.zipcode;
    this.http.post<any>("http://localhost:4200/api/saveAddress", {address: tempForm}).subscribe(response =>{
      this.app.loadingRemove();
      if(response.status == 200){
        window.location.reload();

      }
    })
  }

  deletePaymentMethod(addressId: number){
    this.http.post<any>("http://localhost:4200/api/deleteAddress", {addressId: addressId}).subscribe(response =>{
      if (response.status == 200){
        window.location.reload();
      }

    })
  }

  editAddress(method: any) {
    this.addressForm.setValue({
      addressId: method.addressId,
      name: method.name,
      address: method.address,
      city: method.address,
      state: method.state,
      zipcode: method.zipcode,
      favorite: method.favorite
    });
    this.addAddress = true
  }

}
