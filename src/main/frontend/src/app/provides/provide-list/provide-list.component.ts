import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {ServiceProvideModel} from "../../models/serviceProvide.model";
import {ProvideService} from "../provide.service";
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-provide-list',
  templateUrl: './provide-list.component.html',
  styleUrls: ['./provide-list.component.css']
})
export class ProvideListComponent implements OnInit, OnDestroy {

  provides: ServiceProvideModel[] = [];
  providesSub: Subscription;
  size: number = 0;

  provideType: string = 'All';
  provideTypes: string[] = [];

  language: string = 'All';
  languages: string[] = [];

  page: number = 0;
  pageNumber: number = 0;
  pageNumberlist: number[] = [];
  limit: number = 2;

  constructor(private provideService: ProvideService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.onCallAPI();
    this.providesSub = this.provideService.getProvidesChanged()
      .subscribe(
        (providesData: {provides: ServiceProvideModel[], size: number}) => {
          this.provides = providesData.provides;
          this.size = providesData.size;
          this.pageNumber = Math.ceil(this.size / this.limit);
          this.pageNumberlist = [...Array(this.pageNumber).keys()];
        }
      );

    this.authService.getProvideTypes()
      .subscribe(
        provideTypes => {
          this.provideTypes = ['All', ...provideTypes];
        }
      );

    this.authService.getLanguages()
      .subscribe(
        languages => {
          this.languages = ['All', ...languages];
        }
      );
  }

  onCallAPI() {
    this.provideService.getProvidesFromAPI(this.provideType, this.language, this.page, this.limit);
    this.router.navigate(['/provides'], { replaceUrl: true });
  }

  onSelect() {
    this.page = 0;
    this.onCallAPI();
  }

  onPre() {
    this.page--;
    this.onCallAPI();
  }

  onNext() {
    this.page++;
    this.onCallAPI();
  }

  onPageSelect() {
    this.page = +this.page;//select default string
    this.onCallAPI();
  }

  ngOnDestroy(): void {
    this.providesSub.unsubscribe();
  }
}
