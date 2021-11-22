import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// used to create fake backend
import { fakeBackendProvider } from './_helpers';

import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AppComponent } from './app.component';
import { AlertComponent } from './_components';
import { HomeComponent } from './home';;
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { UserDetailComponent } from './home/userDetail.component';
import { TeamInfoComponent } from './home/team-info.component';
import { AboutUsComponent } from './home/about-us.component';
import { HttpInterceptorService } from './_helpers/httpinterceptor.service';
import {LeaveTrackerComponent} from './home/leave-tracker.component';
import { FullCalendarModule } from '@fullcalendar/angular'; 
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin from '@fullcalendar/interaction'; 
FullCalendarModule.registerPlugins([ 
  dayGridPlugin,
  interactionPlugin
]);


@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        NgbModule,
        FullCalendarModule,
        FormsModule
        ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        UserDetailComponent,
        TeamInfoComponent,
        AboutUsComponent,
        LeaveTrackerComponent
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpInterceptorService,
            multi: true
          }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { };