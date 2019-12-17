import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertService} from "./alert.service";
import {AlertModel} from "../models/alert.model";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {

  alerts: AlertModel[] = [];
  private alertsSub: Subscription;

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.alertsSub = this.alertService.getAlertsChanged()
      .subscribe(alerts => {
        this.alerts = alerts;
      });
  }

  ngOnDestroy(): void {
    this.alertsSub.unsubscribe();
  }
}
