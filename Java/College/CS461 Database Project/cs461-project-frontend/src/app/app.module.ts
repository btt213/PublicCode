import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MenubarModule} from 'primeng/menubar';
import {SharedModule, TreeNode} from 'primeng/api';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {AccordionModule} from 'primeng/accordion';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import {ErrorInterceptor, fakeBackendProvider, JwtInterceptor} from "./_helpers";
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import {SlideMenuModule} from 'primeng/slidemenu';
import {MenuModule} from 'primeng/menu';
import { AccountComponent } from './account/account.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OrderComponent } from './order/order.component';
import { BrowsingHistoryComponent } from './browsing-history/browsing-history.component';
import { CartComponent } from './cart/cart.component';
import {CardModule} from 'primeng/card';
import {PasswordModule} from 'primeng/password';
import { ProductComponent } from './product/product.component';
import { AddressesComponent } from './account/addresses/addresses.component';
import { PaymentMethodsComponent } from './account/payment-methods/payment-methods.component';
import {DialogModule} from 'primeng/dialog';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {TreeModule} from 'primeng/tree';
import {InputMaskModule} from 'primeng/inputmask';
import { SearchResultsComponent } from './search-results/search-results.component';
import {CheckboxModule} from 'primeng/checkbox';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    AccountComponent,
    OrderHistoryComponent,
    OrderComponent,
    BrowsingHistoryComponent,
    CartComponent,
    ProductComponent,
    AddressesComponent,
    PaymentMethodsComponent,
    SearchResultsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ButtonModule,
    RippleModule,
    ReactiveFormsModule,
    MenubarModule,
    SharedModule,
    InputTextModule,
    FormsModule,
    DropdownModule,
    BrowserAnimationsModule,
    SlideMenuModule,
    MenuModule,
    CardModule,
    PasswordModule,
    DialogModule,
    MessagesModule,
    MessageModule,
    ProgressSpinnerModule,
    ConfirmPopupModule,
    TreeModule,
    AccordionModule,
    InputMaskModule,
    CheckboxModule

  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},

    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
