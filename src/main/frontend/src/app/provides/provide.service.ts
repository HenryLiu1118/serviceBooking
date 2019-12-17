import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {ServiceProvideModel} from "../models/serviceProvide.model";
import {Subject} from "rxjs";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {AlertService} from "../alert/alert.service";
import {AlertModel} from "../models/alert.model";

const BACKEND_URL = environment.apiUrl + '/provider/';

@Injectable({providedIn: 'root'})
export class ProvideService {
  private provides: ServiceProvideModel[] = [];
  private providesChanged = new Subject<{provides: ServiceProvideModel[], size: number}>();
  private myProvide: ServiceProvideModel;
  private myProvideChanged = new Subject<ServiceProvideModel>();

  constructor(private http: HttpClient, private router: Router, private alertService:AlertService){}

  getProvidesChanged() {
    return this.providesChanged.asObservable();
  }

  getProvideByIdx(index: number) {
    return this.provides[index];
  }

  clearMyProvide() {
    this.myProvide = null;
    this.myProvideChanged.next(null);
  }

  getProvideStatusListener() {
    return this.myProvideChanged.asObservable();
  }

  getMyProvide() {
    return this.myProvide;
  }

  getProvidesFromAPI(provideName: string, languageName: string, page: number, limit: number) {
    let URL = BACKEND_URL;
    if (provideName != 'All' && languageName != 'All') {
      URL += provideName + '/' + languageName;
    } else if (provideName != 'All') {
      URL += 'name' + '/' + provideName;
    } else if (languageName != 'All') {
      URL += 'language' + '/' + languageName;
    }

    URL += '?page='+page+'&limit='+limit;

    this.http.get<{serviceDtoList: any, size: number}>(URL)
      .pipe(
        map(
          providesData => {
            return {
              provides: providesData.serviceDtoList.map(
                provide => {
                  return new ServiceProvideModel(
                    provide.serviceId,
                    provide.detail,
                    provide.price,
                    provide.servicetype,
                    provide.userDto
                  );
                }
              ),
              size: providesData.size
            }
          }
        )
      )
      .subscribe(
        transformedProvides => {
          this.provides = transformedProvides.provides;
          this.providesChanged.next({
            provides: [...this.provides],
            size: transformedProvides.size
          });
          if (page === 0) {
            if (transformedProvides.size > 0) {
              this.alertService.addAlert(new AlertModel('success', 'Total ' + transformedProvides.size + ' found!'));
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

  getMyProvideFromAPI() {
    let URL = BACKEND_URL + 'me';

    return this.http.get(URL)
      .pipe(
        map(
          (provide: any) => {
            if (provide == null) {
              return null;
            }
            else {
              return new ServiceProvideModel(
                provide.serviceId,
                provide.detail,
                provide.price,
                provide.servicetype,
                provide.userDto
              );
            }
          }
        )
      )
      .subscribe(
        transformedProvide => {
          this.myProvide = transformedProvide;
          this.myProvideChanged.next(this.myProvide);
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

  updateService(detail: string, price: string, servicename: string) {
    let provideData = {detail: detail, price: price, servicename: servicename};
    let URL = BACKEND_URL + 'update';
    this.http.post(URL, provideData)
      .subscribe(
        (provide: any) => {
          let newProvide = new ServiceProvideModel(
            provide.serviceId,
            provide.detail,
            provide.price,
            provide.servicetype,
            provide.userDto
          );
          this.myProvide = newProvide;
          this.myProvideChanged.next(this.myProvide);
          this.alertService.addAlert(new AlertModel('success', 'Service Updated Successfully!'));
          this.router.navigateByUrl('/dashboard/profile');
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
