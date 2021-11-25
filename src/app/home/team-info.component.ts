import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService ,AlertService} from '@app/_services';

@Component({ selector: 'pm-team-info',
templateUrl: 'team-info.component.html',
styleUrls:['team-info.component.css'] })
export class TeamInfoComponent implements OnInit {
    users = null;
    page = 1;
    pageSize =10;
    totalSize;
    addUserForm: FormGroup;
    submitted = false;
    loading = false;
    emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

    constructor(private accountService: AccountService,
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        private alertService: AlertService


        ) {}

    ngOnInit() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe(users => 
                {
                    this.users = users
                    this.totalSize = this.users.length;
                });
                this.addUserForm = this.formBuilder.group({
                    firstName: ['', Validators.required],
                    middleName: ['', Validators.required],
                    lastName: ['', Validators.required],
                    email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
                    empId: ['', Validators.required]
              
                  });
    }
    openModal(targetModal, user) {
        this.modalService.open(targetModal, {
          centered: true,
          backdrop: 'static'
        });
    }

    //integration pending server side pagination
    loadPage(event,page){
        console.log(this.users)
        
    }


    get f() { return this.addUserForm.controls; }

    onSubmit() {
        this.submitted = true;
        console.log(this.addUserForm.value)

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.addUserForm.invalid) {
            return;
        }

        this.loading = true;
    
    }
    deleteUser(id: string) {
        const user = this.users.find(x => x.id === id);
        user.isDeleting = true;
        this.accountService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.users = this.users.filter(x => x.id !== id) 
            });
    }
}