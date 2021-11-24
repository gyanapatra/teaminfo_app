import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/_models';
import { AccountService, AlertService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpRequest, HttpHeaders, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Component({
  selector: 'pm-user-detail',
  templateUrl: 'userDetail.component.html',
  styleUrls: ['userDetail.component.css']
})
export class UserDetailComponent implements OnInit {

  user: User;
  editProfileForm: FormGroup;
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  selectedFile: File;
  retrievedImage: any;
  imageul: any;
  base64Data: any;
  retrieveResonse: any;
  message: string;

  imageSrc: string;
  url = '';

  constructor(private accountService: AccountService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private http: HttpClient) {
    //this.user = this.accountService.userValue;

    this.accountService.getById(this.accountService.userValue.id)
      .pipe(first())
      .subscribe(user => {
        this.user = user;

      });
    this.user = this.accountService.userValue;
    this.getImage();
  }
  ngOnInit(): void {

    this.isAddMode = false;
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

    // console.log("route: ",this.route);
    
    if (this.url == '') {
      this.url = '../assets/img/avatar.jpg'
    }
  }
  get f() { return this.editProfileForm.controls; }

  openModal(targetModal, user) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static'
    });

    this.router.navigate(['/home/user']);

    this.editProfileForm.patchValue({
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      userName: user.userName,
      email: user.email,
      mobileNo: user.mobileNo,
      designation: user.designation,
      username: user.username,
      password: user.password
    });
  }
  onFileChanged(event) {

    this.selectedFile = event.target.files[0];
    this.upload();
  }
  upload() {
    console.log('file: ', this.selectedFile);
    const uploadImageData: FormData = new FormData();
    uploadImageData.append('imageFile', this.selectedFile);
    uploadImageData.append('id', this.user.id);
   
    this.http.post(`${environment.apiUrl}/home/upload`, uploadImageData, { observe: 'response' })
      .subscribe((response) => {
        if (response.status === 200) {
          this.getImage();
          this.message = 'Image uploaded successfully';
        } else {
          this.message = 'Image not uploaded successfully';
        }

      }

      );
  }

  getImage() {
    this.http.get(`${environment.apiUrl}/home/photos/` + this.user.id)
      .subscribe(
        res => {
          this.retrieveResonse = res;
          this.base64Data = this.retrieveResonse.image.data;
          this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
        }

      );
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
    this.accountService.update(this.user.id, this.editProfileForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Update successful', { keepAfterRouteChange: true });
          //   this.router.navigate(['/home', { relativeTo: this.route }]);
          this.router.navigate(['/home']);
          this.modalService.dismissAll();
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });

  }
}