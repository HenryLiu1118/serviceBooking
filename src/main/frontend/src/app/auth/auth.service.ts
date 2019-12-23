import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {UserModel} from "../models/user.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {RegisterDataModel} from "./register-data.model";
import {ActivatedRoute, Router} from "@angular/router";
import {UserInfoModel} from "../dashboard/UserInfo.model";
import {ProvideService} from "../provides/provide.service";
import {map} from "rxjs/operators";
import {AlertService} from "../alert/alert.service";
import {AlertModel} from "../models/alert.model";

const BACKEND_URL = environment.apiUrl + '/users/';

@Injectable({providedIn: "root"})
export class AuthService {
  private isAuthenticated: boolean = false;
  private authStatusListener = new Subject<boolean>();
  private token: string = '';
  private user: UserModel = null;
  private authLoadingListener = new Subject<boolean>();

  //global list
  private roles: string[] = [];
  private languages: string[] = [];
  private serviceTypes: string[] = [];
  private dataLoadingStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private provideService: ProvideService, private alertService: AlertService){}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUser() {
    return this.user;
  }

  getLanguages() {
    return this.languages;
  }

  getRoles() {
    return this.roles;
  }

  getServiceTypes() {
    return this.serviceTypes;
  }

  getDataLoadingListener() {
    return this.authLoadingListener.asObservable();
  }

  login(username: string, password: string) {
    this.authLoadingListener.next(true);
    const authData = {username: username, password: password};
    this.http.post<{token: string, user: UserModel}>(BACKEND_URL + 'login', authData)
      .subscribe(
        response => {
          this.token = response.token;
          localStorage.setItem('token', this.token);
          this.user = response.user;
          this.isAuthenticated = true;
          this.authStatusListener.next(this.isAuthenticated);
          this.authLoadingListener.next(false);
          this.alertService.addAlert(new AlertModel('success', 'Login Successfully!'));
          this.router.navigate(['/dashboard/profile'], {relativeTo: this.route});
        },
        err => {
          if (err.error) {
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
          this.authStatusListener.next(false);
          this.authLoadingListener.next(false);
        }
      );
  }

  loadUser() {
    this.authLoadingListener.next(true);
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
    }

    this.http.get<UserModel>(environment.apiUrl + '/userinfo/me')
      .subscribe(
        response => {
          this.user = response;
          this.isAuthenticated = true;
          this.authStatusListener.next(this.isAuthenticated);
          this.authLoadingListener.next(false);
          this.router.navigate(['/dashboard/profile'], {relativeTo: this.route});
        },
        err => {
          this.authLoadingListener.next(false);
        }
      );
  }

  logout() {
    this.user = null;
    localStorage.removeItem('token');
    this.token = '';
    this.isAuthenticated = false;
    this.provideService.clearMyProvide();
    this.authStatusListener.next(this.isAuthenticated);
    this.router.navigate(["/auth/login"]);
  }

  signup(registerData: RegisterDataModel) {
    this.authLoadingListener.next(true);
    this.http.post<{message: string}>(BACKEND_URL + 'register', registerData)
      .subscribe(
        response => {
          this.authLoadingListener.next(false);
          this.alertService.addAlert(new AlertModel('success', 'Account Created!'));
          this.router.navigate(["/auth/login"]);
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
          this.authStatusListener.next(false);
          this.authLoadingListener.next(false);
        }
      );
  }

  updateProfile(profileData: UserInfoModel) {
    this.authLoadingListener.next(true);
    this.http.put<UserModel>(environment.apiUrl + '/userinfo', profileData)
      .subscribe(
        user => {
          this.user = user;
          this.authStatusListener.next(true);
          this.authLoadingListener.next(false);
          this.alertService.addAlert(new AlertModel('success', 'Account Updated!'));
          this.router.navigate(['/dashboard/profile'], {relativeTo: this.route});
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
          this.authLoadingListener.next(false);
        }
      );
  }

  initDataFromAPI() {
    this.dataLoadingStatusListener.next(true);
    let tempCnt = 0;

    this.http.get(BACKEND_URL + 'role')
      .pipe(
        map(
          (roles: any[]) => {
            return roles.map(
              role => {
                return role.name;
              }
            );
          }
        )
      )
      .subscribe(
        (roles: string[]) => {
          this.roles = roles;
          tempCnt++;
          this.dataLoadingStatusListener.next(tempCnt !== 3);
        },err => {
          tempCnt++;
          this.dataLoadingStatusListener.next(tempCnt !== 3);
        }
      );

    this.http.get(BACKEND_URL + 'serviceType')
      .pipe(
        map(
          (provideTypes: any[]) => {
            return provideTypes.map(
              provideType => {
                return provideType.name;
              }
            );
          }
        )
      )
      .subscribe(
        (serviceTypes: string[]) => {
          this.serviceTypes = serviceTypes;
          tempCnt++;
          this.dataLoadingStatusListener.next(tempCnt !== 3);
        }, err => {
          tempCnt++;
          this.dataLoadingStatusListener.next(tempCnt !== 3);
        }
      );

    this.http.get(BACKEND_URL + 'language')
      .pipe(
        map(
          (languages: any[]) => {
            return languages.map(
              language => {
                return language.name;
              }
            );
          }
        )
      )
      .subscribe(
        (languages: string[]) => {
          this.languages = languages;
          tempCnt++;
          this.dataLoadingStatusListener.next(tempCnt !== 3);
        }, err => {
          tempCnt++;
          this.dataLoadingStatusListener.next(tempCnt !== 3);
        }
      );
  }
}
