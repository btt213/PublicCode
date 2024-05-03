import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {HomeComponent} from "./home/home.component";
import {AuthGuard} from "./_helpers";
import {RegisterComponent} from "./register/register.component";
import {CartComponent} from "./cart/cart.component";
import {ProductComponent} from "./product/product.component";
import {AccountComponent} from "./account/account.component";
import {OrderHistoryComponent} from "./order-history/order-history.component";
import {OrderComponent} from "./order/order.component";
import {BrowsingHistoryComponent} from "./browsing-history/browsing-history.component";
import {PaymentMethodsComponent} from "./account/payment-methods/payment-methods.component";
import {AddressesComponent} from "./account/addresses/addresses.component";
import {SearchResultsComponent} from "./search-results/search-results.component";

const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'account', component: AccountComponent, canActivate: [AuthGuard]},
  {path: 'order-history', component: OrderHistoryComponent, canActivate: [AuthGuard]},
  {path: 'order/:id', component: OrderComponent, canActivate: [AuthGuard]},
  {path: 'product/:id', component: ProductComponent, canActivate: [AuthGuard]},
  {path: 'browsing-history', component: BrowsingHistoryComponent, canActivate: [AuthGuard]},
  {path: 'cart', component: CartComponent, canActivate: [AuthGuard]},
  {path: 'account/payment-methods', component: PaymentMethodsComponent, canActivate: [AuthGuard]},
  {path: 'account/addresses', component: AddressesComponent, canActivate: [AuthGuard]},
  {path: 's', component: SearchResultsComponent, canActivate: [AuthGuard]},

  {path: '**', redirectTo: ''}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
