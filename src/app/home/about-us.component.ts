import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/_services';
import { first } from 'rxjs/operators';

@Component({ selector: 'pm-about-us',
templateUrl: 'about-us.component.html' })
export class AboutUsComponent implements OnInit{
    users = null;

    constructor(private accountService: AccountService) {}

    ngOnInit() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
    }
}