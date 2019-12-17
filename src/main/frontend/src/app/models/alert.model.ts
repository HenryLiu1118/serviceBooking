export class AlertModel {
  alertType: string;
  msg: string;

  constructor(alertType: string, msg: string) {
    this.alertType = alertType;
    this.msg = msg;
  }
}
