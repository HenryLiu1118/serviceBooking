import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {Subscription} from "rxjs";
import {UserModel} from "../../models/user.model";
import {Router} from "@angular/router";
import {ProvideService} from "../../provides/provide.service";
import {ServiceProvideModel} from "../../models/serviceProvide.model";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  user: UserModel;
  myProvide: ServiceProvideModel;
  private provideListenerSubs: Subscription;

  private dataLoadingSubs: Subscription;
  private dataLoading: boolean = false;
  private myProvideLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router, private provideService: ProvideService) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.myProvide = this.provideService.getMyProvide();

    if (this.user.role == 'Service' && this.myProvide == null) {
      this.myProvideLoading = true;
      this.provideService.getMyProvideFromAPI();
    }

    this.provideListenerSubs = this.provideService.getProvideStatusListener()
      .subscribe(
        provide => {
          this.myProvide = provide;
          this.myProvideLoading = false;
        }
      );

    this.dataLoadingSubs = this.authService.getDataLoadingListener()
      .subscribe(
        loading => {
          this.dataLoading = loading;
        }
      );
  }

  onRequests() {
    this.router.navigateByUrl('/requests');
  }

  onServiceUpdate() {
    this.router.navigateByUrl('/dashboard/editService');
  }

  ngOnDestroy(): void {
    this.provideListenerSubs.unsubscribe();
    this.dataLoadingSubs.unsubscribe();
  }
}
