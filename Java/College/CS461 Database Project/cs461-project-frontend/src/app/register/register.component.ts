import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { first } from 'rxjs/operators';

import { UserService, AuthenticationService } from '../_services';

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  error: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.pattern(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.registerForm.value.firstName = this.normalizeInput(this.registerForm.value.firstName);
    this.registerForm.value.lastName = this.normalizeInput(this.registerForm.value.lastName);
    this.registerForm.value.email = this.normalizeInput(this.registerForm.value.email);

    this.loading = true;
    this.userService.register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        response => {
          if(response.status == 200){
            this.router.navigate(['/login'], { queryParams: { registered: true }});
          }
          else{
            this.error = response.message;
            this.loading = false;
          }

        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }
  normalizeInput(input: string): string{
    return input.toLowerCase();
  }
}
