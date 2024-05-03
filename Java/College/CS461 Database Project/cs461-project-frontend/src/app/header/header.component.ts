import { Component, OnInit } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthenticationService} from "../_services";
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  currentUserSubject: BehaviorSubject<any>;
  categories: any[];
  selectedCategory: any;
  accountInfoItems: MenuItem[];
  primeMember: boolean;
  currentUser: any;

  constructor(private http: HttpClient,private router: Router, private authService: AuthenticationService) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    this.authService.currentUser.subscribe(x => {
      this.currentUser = x;
      this.primeMember = this.currentUser != null && this.currentUser.primeMember == true;
    });
  }

  ngOnInit(): void {
    this.primeMember = this.currentUser != null && this.currentUser.primeMember == true;
    this.fetchCategories();
    this.accountInfoItems = [
      {label: 'Your Account',
        items: [{
            label: 'Account',
            icon: 'pi pi-user',
            routerLink: '/account'
          },
          {
            label: 'Orders',
            icon: 'pi pi-check-square',
            routerLink: '/order-history'
          },
          {
            label: 'Browsing History',
            icon: 'pi pi-replay',
            routerLink: '/browsing-history'
          },
          {
            label: 'Prime Membership',
            icon: 'pi pi-amazon',
            routerLink: '/account',
            queryParams: {
              part: 'prime'
            }

          },
          {
            label: 'Sign Out',
            icon: 'pi pi-sign-out',
            command: () => {
              this.logout();
            }
          }
        ]
      }
    ];
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  fetchCategories(){
    this.http.get<any>("http://localhost:4200/api/getAllCategories").subscribe(response => {
      this.categories = [{categoryId: 0, name: "All"}].concat(response.data)
      this.selectedCategory = 0;

    });
  }
  mouseExit(obj: string) {
    console.log('mouse leave :' + obj);

  }
  mouseEnter(obj: string) {
    console.log("mouse enter : " + obj);

  }

  show(element: Element) {
    element.dispatchEvent(new MouseEvent('mouseover', {
      view: window,
      bubbles: true,
      cancelable: true
    }));
  }
  search(words: any){
    this.router.navigate(['/s'], {queryParams: {k: words, c: this.selectedCategory, p: false}})
  }

}
