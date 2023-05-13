import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { HomeComponent } from './home/home.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { DebugComponent } from './debug/debug.component';
import { FaqComponent } from './faq/faq.component';
import { UsersComponent } from './users/users.component';
import { FeatureRequestsComponent } from './feature-requests/feature-requests.component';

const maintenance = false;

const routes: Routes = [
  { path: 'home', component: maintenance ? MaintenanceComponent : HomeComponent },
  { path: 'feed/:gameFilter', component: maintenance ? MaintenanceComponent : DashboardComponent },
  { path: 'feed', component: maintenance ? MaintenanceComponent : DashboardComponent },
  { path: 'login', component: maintenance ? MaintenanceComponent : LoginComponent },
  { path: 'debug', component: DebugComponent },
  { path: 'faq', component: maintenance ? MaintenanceComponent : FaqComponent },
  { path: 'users', component: UsersComponent },
  { path: 'forbidden', component: maintenance ? MaintenanceComponent : ForbiddenComponent },
  { path: 'feature-requests', component: maintenance ? MaintenanceComponent : FeatureRequestsComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
