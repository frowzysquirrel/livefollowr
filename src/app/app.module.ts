import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { GtagModule } from 'angular-gtag';
import { ClickOutsideModule } from 'ng-click-outside';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { LoadingMessagesComponent } from './loading-messages/loading-messages.component';
import { FooterComponent } from './dashboard/footer/footer.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { DebugComponent } from './debug/debug.component';
import { LiveLoaderComponent } from './live-loader/live-loader.component';
import { FaqComponent } from './faq/faq.component';
import { LightswitchComponent } from './lightswitch/lightswitch.component';
import { UsersComponent } from './users/users.component';
import { FeatureRequestsComponent } from './feature-requests/feature-requests.component';
import { SafePipe } from './pipes/safe-pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HomeComponent,
    ForbiddenComponent,
    LoadingMessagesComponent,
    FooterComponent,
    MaintenanceComponent,
    DebugComponent,
    LiveLoaderComponent,
    FaqComponent,
    LightswitchComponent,
    UsersComponent,
    FeatureRequestsComponent,
    SafePipe,
  ],
  imports: [
    FormsModule,
    GtagModule.forRoot({ trackingId: 'UA-177892411-1', trackPageviews: true }),
    ClickOutsideModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
