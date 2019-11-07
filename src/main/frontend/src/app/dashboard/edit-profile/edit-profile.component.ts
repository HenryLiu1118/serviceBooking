import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../auth/auth.service";
import {Subscription} from "rxjs";
import {UserModel} from "../../models/user.model";
import {RegisterDataModel} from "../../auth/register-data.model";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup;
  private authListenerSubs: Subscription;
  user: UserModel;

  constructor(private router: Router, private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.initForm();
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(
        response => {
          this.user = this.authService.getUser();
          this.initForm();
        }
      );
  }

  initForm() {
    let firstname;
    let lastname;
    let streetname;
    let city;
    let state;
    let zipcode;
    let phone;
    let language;

    if (this.user) {
      firstname = this.user.firstname;
      lastname = this.user.lastname;
      streetname = this.user.streetname;
      city = this.user.city;
      state = this.user.state;
      zipcode = this.user.zipcode;
      phone = this.user.phone;
      language = this.user.language;
    }

    this.profileForm = new FormGroup({
      firstname: new FormControl(firstname, Validators.required),
      lastname: new FormControl(lastname, Validators.required),
      streetname: new FormControl(streetname, Validators.required),
      city: new FormControl(city, Validators.required),
      state : new FormControl(state, Validators.required),
      zipcode: new FormControl(zipcode, Validators.required),
      phone: new FormControl(phone, Validators.required),
      language: new FormControl(language, Validators.required)
    });
  }

  onSubmit() {
    const registerData = new RegisterDataModel(
      null,
      null,
      this.profileForm.value.city,
      this.profileForm.value.firstname,
      this.profileForm.value.lastname,
      this.profileForm.value.streetname,
      this.profileForm.value.state,
      this.profileForm.value.zipcode,
      this.profileForm.value.phone,
      this.profileForm.value.language,
      null
    );
    this.authService.updateProfile(registerData);
  }
}
