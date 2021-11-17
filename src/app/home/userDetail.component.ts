import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/_models';
import { AccountService, AlertService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';

@Component({
  selector: 'pm-user-detail',
  templateUrl: 'userDetail.component.html'
})
export class UserDetailComponent implements OnInit {

  user: User;
  editProfileForm: FormGroup;
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;

  constructor(private accountService: AccountService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService) {
    this.user = this.accountService.userValue;
  }
  ngOnInit(): void {
    this.id = this.user.id;
    this.isAddMode = !this.id;

    // password not required in edit mode
    const passwordValidators = [Validators.minLength(6)];
    if (this.isAddMode) {
      passwordValidators.push(Validators.required);
    }

    this.editProfileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      middleName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', passwordValidators],
      email: ['', Validators.required],
      mobileNo: ['', Validators.required],
      designation: ['', Validators.required]

    });

    console.log("route: ",this.route);
  }
  get f() { return this.editProfileForm.controls; }

  openModal(targetModal, user) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static'
    });

    this.editProfileForm.patchValue({
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      userName: user.userName,
      email: user.email,
      mobileNo: user.mobileNo,
      designation: user.designation,
      username: user.username
    });
  }
  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
  //  this.alertService.clear();

    // stop here if form is invalid
    if (this.editProfileForm.invalid) {
        return;
    }

    this.loading = true;
    this.updateUser();
    
}
private updateUser() {
  this.accountService.update(this.id, this.editProfileForm.value)
  .pipe(first())
  .subscribe(
      data => {
         // this.alertService.success('Update successful', { keepAfterRouteChange: true });
         // this.router.navigate(['**', { relativeTo: this.route }]);
         this.router.navigate(['/home']);
          this.modalService.dismissAll();
      },
      error => {
          this.alertService.error(error);
          this.loading = false;
      });
  
}
}