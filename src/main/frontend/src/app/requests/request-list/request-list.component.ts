import {Component, OnDestroy, OnInit} from '@angular/core';
import {RequestModel} from "../../models/request.model";
import {Subscription} from "rxjs";
import {RequestsService} from "../requests.service";
import {AuthService} from "../../auth/auth.service";
import {UserModel} from "../../models/user.model";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css']
})
export class RequestListComponent implements OnInit, OnDestroy {
  user: UserModel;

  requests: RequestModel[] = [];
  private requestSub: Subscription;
  size: number = 0;

  provideType: string = 'All';
  provideTypes: string[] = [];

  language: string = 'All';
  languages: string[] = [];

  page: number = 0;
  pageNumber: number = 0;
  pageNumberlist: number[] = [];
  limit: number = 2;

  constructor(private requestService: RequestsService, private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.user = this.authService.getUser();

    this.onSelect();
    this.requestSub = this.requestService.getRequestsChanged()
      .subscribe(
        (requestData: {requests: RequestModel[], size: number}) => {
          this.requests = requestData.requests;
          this.size = requestData.size;
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

  onSelect() {
    this.page = 0;
    this.onCallAPI();
  }

  onCallAPI() {
    this.requestService.getRequestsFromAPI(this.provideType, this.language, this.page, this.limit);
    this.router.navigate(['/requests'], { replaceUrl: true });
  }

  onNewRequest() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  onPre() {
    this.page--;
    this.onCallAPI();
  }

  onNext() {
    this.page++;
    this.onCallAPI();
  }

  onPageSelect(){
    this.page = +this.page;//select default string
    this.onCallAPI();
  }

  ngOnDestroy(): void {
    this.requestSub.unsubscribe();
  }
}
