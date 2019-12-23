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
import {EditProfileServiceComponent} from "./dashboard/edit-profile-service/edit-profile-service.component";
import {ProvideGuard} from "./auth/provide.guard";
import {UsersComponent} from "./admin/users/users.component";
import {ServiceTypesComponent} from "./admin/service-types/service-types.component";
import {RolesComponent} from "./admin/roles/roles.component";
import {LanguagesComponent} from "./admin/languages/languages.component";


const routes: Routes = [
  {path: '', redirectTo: 'auth/login', pathMatch: 'full'},
  {path: 'dashboard/profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'dashboard/editProfile', component: EditProfileComponent, canActivate: [AuthGuard]},
  {path: 'dashboard/editService', component: EditProfileServiceComponent, canActivate:[AuthGuard, ProvideGuard]},
  {path: 'admin/users', component: UsersComponent, canActivate: [AuthGuard]},
  {path: 'admin/serviceTypes', component: ServiceTypesComponent, canActivate: [AuthGuard]},
  {path: 'admin/roles', component:RolesComponent, canActivate: [AuthGuard]},
  {path: 'admin/languages', component: LanguagesComponent, canActivate: [AuthGuard]},
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
  providers: [AuthGuard, ProvideGuard]
})
export class AppRoutingModule { }
