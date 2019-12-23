import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {ServiceProvideModel} from "../../models/serviceProvide.model";
import {AuthService} from "../../auth/auth.service";
import {ProvideService} from "../../provides/provide.service";

@Component({
  selector: 'app-edit-profile-service',
  templateUrl: './edit-profile-service.component.html',
  styleUrls: ['./edit-profile-service.component.css']
})
export class EditProfileServiceComponent implements OnInit, OnDestroy {
  editMode = false;
  provideForm: FormGroup;
  myProvide: ServiceProvideModel;
  private provideListenerSubs: Subscription;
  provideTypes: string[] = [];
  private myProvideLoading: boolean = false;

  constructor(private authService: AuthService, private provideService: ProvideService) { }

  ngOnInit() {
    this.myProvide = this.provideService.getMyProvide();
    this.editMode = this.myProvide != null;
    this.provideTypes = this.authService.getServiceTypes();
    this.initForm();

    this.provideListenerSubs = this.provideService.getProvideStatusListener()
      .subscribe(
        provide => {
          this.myProvide = provide;
          this.editMode = this.myProvide != null;
          this.initForm();
          this.myProvideLoading = false;
        }
      );

  }

  initForm() {
    let detail = '';
    let price = ''
    let servicetype = '';

    if (this.editMode) {
      detail = this.myProvide.detail;
      price = this.myProvide.price;
      servicetype = this.myProvide.servicetype;
    }

    this.provideForm = new FormGroup({
      detail: new FormControl(detail, Validators.required),
      price: new FormControl(price, Validators.required),
      servicetype: new FormControl(servicetype, Validators.required)
    });
  }

  onSubmit() {
    this.myProvideLoading = true;
    this.provideService.updateService(this.provideForm.value.detail, this.provideForm.value.price, this.provideForm.value.servicetype);
  }

  ngOnDestroy(): void {
    this.provideListenerSubs.unsubscribe();
  }
}
