import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  private authLoadingSubs: Subscription;
  private authLoading: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authLoadingSubs = this.authService.getDataLoadingListener()
      .subscribe(
        loading => {
          this.authLoading = loading;
        }
      );

    if (localStorage.getItem('token')) {
      this.authService.loadUser();
    }
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      //return;
    }
    const email = form.value.email;
    const password = form.value.password;
    this.authService.login(email, password);
  }

  ngOnDestroy(): void {
    this.authLoadingSubs.unsubscribe();
  }
}
