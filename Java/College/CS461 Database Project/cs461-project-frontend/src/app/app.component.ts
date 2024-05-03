import { Component } from '@angular/core';
import {AuthenticationService} from "./_services";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'database-project-frontend';
  currentUser: any;

  loading: boolean = false;
  numberOfLoading: number = 0;

  constructor(private router: Router, private authService: AuthenticationService) {
    this.authService.currentUser.subscribe(x => this.currentUser = x);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  loadingAdd(){
    this.numberOfLoading++;
    this.loading = true;
  }
  loadingRemove(){
    this.numberOfLoading--;
    if(this.numberOfLoading < 0){
      this.numberOfLoading = 0
    }
    if(this.numberOfLoading == 0){
      this.loading = false;
    }
  }
}
