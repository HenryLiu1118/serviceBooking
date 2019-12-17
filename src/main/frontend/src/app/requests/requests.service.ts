import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {RequestModel} from "../models/request.model";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthService} from "../auth/auth.service";
import {map} from "rxjs/operators";
import {AlertService} from "../alert/alert.service";
import {AlertModel} from "../models/alert.model";

const BACKEND_URL = environment.apiUrl + '/request/';

@Injectable({providedIn: 'root'})
export class RequestsService {
  private requests: RequestModel[] = [];
  private reqestsChanged = new Subject<{requests: RequestModel[], size: number}>();

  constructor(private authService: AuthService, private http: HttpClient, private router: Router, private alertService:AlertService){}

  getRequestsChanged() {
    return this.reqestsChanged.asObservable();
  }

  getRequestyIdx(idx: number) {
    return this.requests[idx];
  }

  getRequestsFromAPI(provideName: string, languageName: string, page: number = 0, limit: number) {
    let URL = BACKEND_URL;
    let userRole = this.authService.getUser().role;
    if (userRole === 'Customer') {
      URL += 'me';
    } else if (userRole === 'Service') {
      if (provideName != 'All' && languageName != 'All') {
        URL += provideName + '/' + languageName;
      } else if (provideName != 'All') {
        URL += 'name' + '/' + provideName;
      } else if (languageName != 'All') {
        URL += 'language' + '/' + languageName;
      } else {
        URL += 'All';
      }
    }

    URL += '?page='+page+'&limit='+limit;
    this.http.get<{requestDtoList: any, size: number}>(URL)
      .pipe(
        map( requestData => {
          return {
            requests: requestData.requestDtoList.map(
              request => {
                return new RequestModel(
                  request.requestId,
                  request.servicetype,
                  request.info,
                  request.active,
                  request.userDto,
                  request.create_At,
                  request.update_At
                );
              }
            ),
            size: requestData.size
          }
        })
      )
      .subscribe(
        transformedRequests => {
          this.requests = transformedRequests.requests;
          this.reqestsChanged.next({
            requests: [...this.requests],
            size: transformedRequests.size
          });
          if (page === 0) {
            if (transformedRequests.size > 0) {
              this.alertService.addAlert(new AlertModel('success', 'Total ' + transformedRequests.size + ' found!'));
            } else {
              this.alertService.addAlert(new AlertModel('warning', 'Found 0!'));
            }
          }
        },
        err => {
          const errors = err.error.errors;
          if (errors) {
            for (let error of errors) {
              this.alertService.addAlert(new AlertModel('danger', error));
            }
          }
          const error = err.error.error;
          if (error) {
            this.alertService.addAlert(new AlertModel('danger', error))
          }
        }
      );
  }

  addRequest(servicetype: string, info: string) {
    let requestData = {servicetype: servicetype, info: info};
    this.http.post(BACKEND_URL, requestData)
      .subscribe(
        (request: any) => {
          let newRequest = new RequestModel(
            request.requestId,
            request.servicetype,
            request.info,
            request.active,
            request.userDto,
            request.create_At,
            request.update_At
          );
          this.requests.push(newRequest);
          this.reqestsChanged.next({
            requests: [...this.requests],
            size: this.requests.length
          });
          this.alertService.addAlert(new AlertModel('success', 'Request Posted!'));
          this.router.navigateByUrl('/requests');
        },
        err => {
          const errors = err.error.errors;
          if (errors) {
            for (let error of errors) {
              this.alertService.addAlert(new AlertModel('danger', error));
            }
          }
          const error = err.error.error;
          if (error) {
            this.alertService.addAlert(new AlertModel('danger', error))
          }
        }
      );
  }

  updateRequest(servicetype: string, info: string, index: number) {
    let currentRequest: RequestModel = this.requests[index];
    let requestData = {servicetype: servicetype, info: info};
    this.http.put(BACKEND_URL + 'id/' + currentRequest.requestId, requestData)
      .subscribe(
        (request: any) => {
          let newRequest = new RequestModel(
            request.requestId,
            request.servicetype,
            request.info,
            request.active,
            request.userDto,
            request.create_At,
            request.update_At
          );
          this.requests[index] = newRequest;
          this.reqestsChanged.next({
            requests: [...this.requests],
            size: this.requests.length
          });
          this.alertService.addAlert(new AlertModel('success', 'Request Updated Successfully!'));
          this.router.navigateByUrl('/requests');
        },
        err => {
          const errors = err.error.errors;
          if (errors) {
            for (let error of errors) {
              this.alertService.addAlert(new AlertModel('danger', error));
            }
          }
          const error = err.error.error;
          if (error) {
            this.alertService.addAlert(new AlertModel('danger', error))
          }
        }
      );
  }
}
