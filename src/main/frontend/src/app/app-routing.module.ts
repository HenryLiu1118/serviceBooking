import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from "./auth/login/login.component";
import {SignupComponent} from "./auth/signup/signup.component";
import {ProfileComponent} from "./dashboard/profile/profile.component";
import {EditProfileComponent} from "./dashboard/edit-profile/edit-profile.component";
import {AuthGuard} from "./auth/auth.guard";
import {RequestsComponent} from "./requests/requests.component";
import {RequestFormComponent} from "./requests/request-form/request-form.component";
import {RequestDetailComponent} from "./requests/request-detail/request-detail.component";
import {ProvidesComponent} from "./provides/provides.component";
import {ProvideDetailComponent} from "./provides/provide-detail/provide-detail.component";


const routes: Routes = [
  {path: '', redirectTo: 'dashboard/profile', pathMatch: 'full'},
  {path: 'dashboard/profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'dashboard/editProfile', component: EditProfileComponent, canActivate: [AuthGuard]},
  {path: 'provides', component: ProvidesComponent, canActivate: [AuthGuard],
    children: [
      {path: ':id', component: ProvideDetailComponent}
    ]
  },
  {path: 'requests', component: RequestsComponent, canActivate: [AuthGuard],
    children: [
      {path: 'new', component: RequestFormComponent},
      {path: ':id', component: RequestDetailComponent},
      {path: ':id/edit', component: RequestFormComponent}
    ]
  },
  {path: 'auth/login', component: LoginComponent},
  {path: 'auth/signup', component: SignupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
