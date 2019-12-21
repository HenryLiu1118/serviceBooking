import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {AlertModel} from "../models/alert.model";
import {AlertService} from "../alert/alert.service";

const BACKEND_URL = environment.apiUrl + '/admin/';
@Injectable({providedIn: 'root'})
export class AdminService {
  serviceTypes: any[] = [];
  serviceTypesChanged = new Subject<any[]>();

  roles: any[] = [];
  rolesChanged = new Subject<any[]>();

  languages: any[] = [];
  languagesChanged = new Subject<any[]>();

  constructor(private http: HttpClient, private alertService: AlertService){}

  getServiceTypes() {
    return this.serviceTypes;
  }

  getServiceStatusListener() {
    return this.serviceTypesChanged.asObservable();
  }

  getUsers() {
    return this.http.get(BACKEND_URL + 'user');
  }

  getRoles() {
    return this.roles;
  }

  getRolesStatusListener() {
    return this.rolesChanged.asObservable();
  }

  getLanguages() {
    return this.languages;
  }

  getLanguageStatusListener() {
    return this.languagesChanged.asObservable();
  }

  getRolesFromAPI() {
    this.http.get(BACKEND_URL + 'role')
      .subscribe(
        (roles: any[]) => {
          this.roles = roles;
          this.rolesChanged.next([...this.roles]);
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

  getServiceTypesFromAPI() {
    this.http.get(BACKEND_URL + 'serviceType')
      .subscribe(
        (serviceTypes: any[]) => {
          this.serviceTypes = serviceTypes;
          this.serviceTypesChanged.next([...this.serviceTypes]);
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

  getLanguagesFromAPI() {
    this.http.get(BACKEND_URL + 'language')
      .subscribe(
        (languages: any[]) => {
          this.languages = languages;
          this.languagesChanged.next([...this.languages]);
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

  addService(name: string) {
    this.http.post(BACKEND_URL + 'serviceType', {name : name})
      .subscribe(
        (serviceType: any) => {
          this.serviceTypes.push(serviceType);
          this.serviceTypesChanged.next([...this.serviceTypes]);
          this.alertService.addAlert(new AlertModel('success', 'Service Created!'));
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

  addRole(name: string) {
    this.http.post(BACKEND_URL + 'role', {name: name})
      .subscribe(
        (role: any) => {
          this.roles.push(role);
          this.rolesChanged.next([...this.roles]);
          this.alertService.addAlert(new AlertModel('success', 'Role Created!'));
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

  addLanguage(name: string) {
    this.http.post(BACKEND_URL + 'language', {name: name})
      .subscribe(
        (language: any) => {
          this.languages.push(language);
          this.languagesChanged.next([...this.languages]);
          this.alertService.addAlert(new AlertModel('success', 'Language Created!'));
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
