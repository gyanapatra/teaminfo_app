import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/_models';
import { AccountService, AlertService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pm-user-detail',
  templateUrl: 'userDetail.component.html',
  styleUrls:['userDetail.component.css']
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
  selectedItems=[];
  skillSet = [];
  imageSrc:string;
  url='';
  imagePath;
  message;
  primarySkillArray = [];
  secondarySkillArray = [];
  skillsObject = {};
  skillsArray = [];

  constructor(private accountService: AccountService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService) {
    this.user = this.accountService.userValue;
    console.log(this.user)
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
      designation: ['', Validators.required],
      secondaryskillset:['', Validators.required],
      primaryskillset:['', Validators.required]

    });

    

    console.log("route: ",this.route);
    if(this.url==''){
      this.url = '../assets/img/avatar.jpg'
    }
   
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
  // onFileChange(event) {
  //   const reader = new FileReader();
    
  //   if(event.target.files && event.target.files.length) {
  //     const [file] = event.target.files;
  //     reader.readAsDataURL(file);
    
  //     reader.onload = () => {
   
  //       this.imageSrc = reader.result as string;
     
  //       // this.myForm.patchValue({
  //       //   fileSource: reader.result
  //       // });
   
  //     };
   
  //   }
  // }
  onFileChanged(event) {
    const files = event.target.files;
    if (files.length === 0)
        return;

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
        this.message = "Only images are supported.";
        return;
    }

    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
        this.url = reader.result as string; 
    }
}
  onSubmit() {
    this.skillsArray = [];
    this.primarySkillArray = this.editProfileForm.value.primaryskillset.split(', ');
    this.secondarySkillArray = this.editProfileForm.value.secondaryskillset.split(', ');
    this.skillsObject["primary_skills"]=this.primarySkillArray
    this.skillsObject["secondary_skills"]=this.secondarySkillArray
    this.skillsArray.push(this.skillsObject);

    console.log(this.skillsArray)
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