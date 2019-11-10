import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {ServiceProvideModel} from "../../models/serviceProvide.model";
import {ProvideService} from "../provide.service";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-provide-list',
  templateUrl: './provide-list.component.html',
  styleUrls: ['./provide-list.component.css']
})
export class ProvideListComponent implements OnInit {

  provides: ServiceProvideModel[] = [];
  providesSub: Subscription;
  provideType: string = 'All';
  provideTypes: string[] = [];

  constructor(private provideService: ProvideService, private authService: AuthService) { }

  ngOnInit() {
    this.provideService.getProvidesFromAPI(this.provideType);
    this.providesSub = this.provideService.getProvidesChanged()
      .subscribe(
        provides => {
          this.provides = provides;
        }
      );

    this.authService.getProvideTypes()
      .subscribe(
        provideTypes => {
          this.provideTypes = ['All', ...provideTypes];
        }
      );
  }

  onSelect() {
    this.provideService.getProvidesFromAPI(this.provideType);
  }
}
