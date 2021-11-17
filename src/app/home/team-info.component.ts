﻿import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';

@Component({ selector: 'pm-team-info',
templateUrl: 'team-info.component.html' })
export class TeamInfoComponent implements OnInit {
    users = null;

    constructor(private accountService: AccountService) {}

    ngOnInit() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
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