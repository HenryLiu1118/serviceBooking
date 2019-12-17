import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {AlertModel} from "../models/alert.model";

@Injectable({providedIn: 'root'})
export class AlertService {
  private alerts: AlertModel[] = [];
  private alertsChanged = new Subject<AlertModel[]>();

  getAlertsChanged() {
    return this.alertsChanged;
  }

  addAlert(alert: AlertModel) {
    this.alerts.push(alert);
    this.alertsChanged.next(this.alerts);

    setTimeout(()=>{
      this.alerts = this.alerts.filter(a => a!== alert);
      this.alertsChanged.next(this.alerts);
    }, 5000);
  }
}
