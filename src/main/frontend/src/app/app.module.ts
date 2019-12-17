import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthInterceptor} from "./auth/auth-interceptor";
import { ProfileComponent } from './dashboard/profile/profile.component';
import { EditProfileComponent } from './dashboard/edit-profile/edit-profile.component';
import { RequestsComponent } from './requests/requests.component';
import { RequestListComponent } from './requests/request-list/request-list.component';
import { RequestDetailComponent } from './requests/request-detail/request-detail.component';
import { RequestFormComponent } from './requests/request-form/request-form.component';
import { RequestItemComponent } from './requests/request-list/request-item/request-item.component';
import { ProvidesComponent } from './provides/provides.component';
import { ProvideDetailComponent } from './provides/provide-detail/provide-detail.component';
import { ProvideListComponent } from './provides/provide-list/provide-list.component';
import { ProvideItemComponent } from './provides/provide-list/provide-item/provide-item.component';
import { EditProfileServiceComponent } from './dashboard/edit-profile-service/edit-profile-service.component';
import { CommentFormComponent } from './requests/request-detail/comment-form/comment-form.component';
import { CommentsComponent } from './requests/request-detail/comments/comments.component';
import { UsersComponent } from './admin/users/users.component';
import { ServiceTypesComponent } from './admin/service-types/service-types.component';
import { ServicelistComponent } from './admin/service-types/servicelist/servicelist.component';
import { ServiceformComponent } from './admin/service-types/serviceform/serviceform.component';
import { RolesComponent } from './admin/roles/roles.component';
import { RolesListComponent } from './admin/roles/roles-list/roles-list.component';
import { RolesFormComponent } from './admin/roles/roles-form/roles-form.component';
import { LanguagesComponent } from './admin/languages/languages.component';
import { LanguagesListComponent } from './admin/languages/languages-list/languages-list.component';
import { LanguagesFormComponent } from './admin/languages/languages-form/languages-form.component';
import { AlertComponent } from './alert/alert.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    EditProfileComponent,
    RequestsComponent,
    RequestListComponent,
    RequestDetailComponent,
    RequestFormComponent,
    RequestItemComponent,
    ProvidesComponent,
    ProvideDetailComponent,
    ProvideListComponent,
    ProvideItemComponent,
    EditProfileServiceComponent,
    CommentFormComponent,
    CommentsComponent,
    UsersComponent,
    ServiceTypesComponent,
    ServicelistComponent,
    ServiceformComponent,
    RolesComponent,
    RolesListComponent,
    RolesFormComponent,
    LanguagesComponent,
    LanguagesListComponent,
    LanguagesFormComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
