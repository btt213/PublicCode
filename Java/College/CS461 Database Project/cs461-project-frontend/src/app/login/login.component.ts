import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../_services";
import {Message,MessageService} from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error: string;
  success: string;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authService: AuthenticationService,private messageService: MessageService) {
    if(this.authService.currentUserValue){
      this.router.navigate(['/'])
    }
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    if(this.route.snapshot.queryParams['registered']) {
      this.success = 'Registration successful';
    }

  }
  get f() { return this.loginForm.controls; }


  onSubmitPassword() {
    this.submitted = true;

    this.error = null;
    this.success = null;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.loginForm.value.email = this.normalizeInput(this.loginForm.value.email);

    this.loading = true;
    this.authService.login(this.f.email.value, this.f.password.value)
      .subscribe(data => {
          if(data.status == 200){
            this.router.navigate([this.returnUrl]);
          }
          else
          {
            this.error = data.message;
            this.show()
            this.loading = false;
          }

        },
        error => {
          this.error = error;
          this.loading = false;
      });
  }
  normalizeInput(input: string): string{
    return input[0].toUpperCase() + input.substr(1).toLowerCase();
  }
  show(){
    this.messageService.add({severity:'error', detail:this.error});
  }
}
