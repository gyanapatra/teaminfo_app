import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { AuthenticationService } from './auth.service';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

    successMessage: string;
    invalidLogin = false;
    loginSuccess = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private authenticationService: AuthenticationService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;

        this.accountService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    
                    this.router.navigate(['./home']);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });

       

        // this.authenticationService.authenticationService(this.f.username.value, this.f.password.value).subscribe((result)=> {

        //     this.invalidLogin = false;
        //     this.loginSuccess = true;
        //     this.successMessage = 'Login Successful.';
        //     console.log('returnurl',this.returnUrl)
        //     this.router.navigate([this.returnUrl]);
        //   }, () => {
        //     this.invalidLogin = true;
        //     this.loginSuccess = false;
        //   }); 
    }
}