import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {AuthenticationService, UserService} from "../_services";
import {BehaviorSubject} from "rxjs";
import {first} from "rxjs/operators";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { MustMatch } from '../_helpers';
import {AppComponent} from "../app.component";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  currentUserSubject: BehaviorSubject<any>;
  nameForm: FormGroup;
  emailForm: FormGroup;
  passwordForm: FormGroup;
  currentUser: any;
  changeDetails: any;
  cards: any[];
  primeVisible: boolean;
  accountDetailVisible: boolean;
  editNameVisible: any;
  editEmailVisible: any;
  editPasswordVisible: any;
  transitionURL: any;
  private error: any;
  constructor(private http: HttpClient, private userService: UserService, public router: Router, private authService: AuthenticationService, private route: ActivatedRoute,private formBuilder: FormBuilder, public app: AppComponent) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    this.authService.currentUser.subscribe(x => {
      this.currentUser = x;
      this.changeDetails = x;
      this.changeDetails.updatePassword = false;
    });
    this.route.queryParams.subscribe(params => {
      switch (params['part']){
        case 'prime':
          this.primeVisible = true;
          break;
        case 'changeDetails':
          this.accountDetailVisible = true;
          break;
        case 'editName':
          this.editNameVisible = true;
          break;
        case 'editEmail':
          this.editEmailVisible = true;
          break;
        case 'editPassword':
          this.editPasswordVisible = true;
          break;

      }

    })

  }

  ngOnInit(): void {
    this.nameForm = this.formBuilder.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required)
    });
    this.emailForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.pattern(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/)])
    });
    this.passwordForm = this.formBuilder.group({
        password: new FormControl('', Validators.required),
        newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
        confirmPassword: new FormControl('', [Validators.required])
      }, {
      validator: MustMatch('newPassword', 'confirmPassword')
    });

    this.cards = [{
      Name: 'Your Orders',
      Desc: 'View the orders you have made',
      routerLink: '/order-history',
      img: 'https://images-na.ssl-images-amazon.com/images/G/01/x-locale/cs/help/images/gateway/self-service/order._CB660668735_.png'
    },
      {
        Name: 'Prime',
        Desc: 'View subscription',
        routerLink: '/account?part=prime',
        img: 'https://images-na.ssl-images-amazon.com/images/G/01/x-locale/cs/ya/images/Prime_clear-bg._CB423472251_.png'
      },
      {
        Name: 'Login & Security',
        Desc: 'Edit login, and name',
        routerLink: '/account?part=changeDetails',
        img: 'https://images-na.ssl-images-amazon.com/images/G/01/x-locale/cs/help/images/gateway/self-service/security._CB659600413_.png'
      },
      {
        Name: 'Your Payments',
        Desc: 'Manage payment methods and settings',
        routerLink: '/account/payment-methods',
        img: 'https://images-na.ssl-images-amazon.com/images/G/01/x-locale/cs/help/images/gateway/self-service/payment._CB660668735_.png'
      },
      {
        Name: 'Your Delivery Addresses',
        Desc: 'View and manage your delivery addresses',
        routerLink: '/account/addresses',
        img: 'https://images-na.ssl-images-amazon.com/images/G/01/x-locale/cs/help/images/gateway/self-service/digital_devices._CB660668735_.png'
      },
      {
        Name: 'skip'
      }];
  }

  get name() { return this.nameForm.controls; }
  get email() { return this.emailForm.controls; }
  get password() { return this.passwordForm.controls; }

  changeMembership() {
    this.app.loadingAdd();
    this.http.post<any>("http://localhost:4200/api/changePrimeMembership", { member: this.currentUser.primeMember, accountId: this.currentUser.accountId }).subscribe(response =>{
      response.data.token = this.currentUserSubject.value.token;
      this.authService.updateUser(response.data)
      this.app.loadingRemove();
    });
  }

  showEdit(url: string) {
    this.transitionURL = '/account?part=' + url;
    this.accountDetailVisible = false;
  }

  logger (string: any){
    console.log(string)
  }

  submitName(form: any) {

    if (this.nameForm.invalid) {
      return;
    }
    this.app.loadingAdd();
    let tempAccount = this.currentUser;
    tempAccount.firstName = this.nameForm.value.firstName.toLowerCase();
    tempAccount.lastName = this.nameForm.value.lastName.toLowerCase();
    tempAccount.updatePassword = false;
    this.callEditAccount(tempAccount);
    this.editNameVisible = false;
    form.reset();
    form.resetForm()
    this.nameForm.reset();
    this.editNameVisible = false;
  }
  submitEmail(form: any) {

    if (this.emailForm.invalid) {
      return;
    }
    this.app.loadingAdd();
    let tempAccount = this.currentUser;
    tempAccount.email = this.emailForm.value.email.toLowerCase();
    tempAccount.updatePassword = false;
    this.callEditAccount(tempAccount);
    this.editEmailVisible = false;
    form.reset();
    form.resetForm()
    this.emailForm.reset();
    this.editEmailVisible = false;
  }
  submitPassword(form: any) {


    if (this.passwordForm.invalid) {
      return;
    }
    this.app.loadingAdd();
    this.authService.checkPassword(this.currentUser.email, this.passwordForm.value.password)
      .pipe(first())
      .subscribe(
        response => {
          if(response.status == 200){
            let tempAccount = this.currentUser;
            tempAccount.password = this.passwordForm.value.newPassword;
            tempAccount.updatePassword = true;
            this.callEditAccount(tempAccount);
            this.editPasswordVisible = false;
          }
          else{

            this.app.loadingRemove();
          }

        },
        error => {
          this.error = error;
          this.app.loadingRemove();
        }
      );
    form.reset();
    form.resetForm()
    this.passwordForm.reset();
    this.editPasswordVisible = false;

  }

  callEditAccount(tempAccount: any){
    this.userService.changeAccountDetails(tempAccount)
      .pipe(first())
      .subscribe(
        response => {
          if(response.status == 200){
            this.authService.updateUser(response.data)
          }
          else{
            this.error = response.message;
          }
          this.app.loadingRemove();

        },
        error => {
          this.error = error;
          this.app.loadingRemove();
        }
      );
  }
}
