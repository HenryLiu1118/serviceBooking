import {Component, OnDestroy, OnInit} from '@angular/core';
import {RequestsService} from "../requests.service";
import {ActivatedRoute, Params} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {RequestModel} from "../../models/request.model";
import {AuthService} from "../../auth/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.css']
})
export class RequestFormComponent implements OnInit, OnDestroy {
  index: number;
  editMode = false;
  requestForm: FormGroup;
  request: RequestModel;
  provideTypes: string[] = [];
  private requestSub: Subscription;
  private newRequestLoading: boolean = false;

  constructor(private requestService: RequestsService, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    this.provideTypes = this.authService.getServiceTypes();
    this.initForm();

    this.route.params
      .subscribe(
        (params: Params) => {
          if (params.id) {
            let ids = params.id.split('|');
            this.index = +ids[0];
          }
          this.editMode = params.id != null;
          this.initForm();
        }
      );

    this.requestSub = this.requestService.getRequestsChanged()
      .subscribe(
        () => {
          this.newRequestLoading = false;
        }
      );
  }

  initForm() {
    let title = '';
    let info = '';

    if (this.editMode) {
      this.request = this.requestService.getRequestyIdx(this.index);
      title = this.request.servicetype;
      info = this.request.info;
    }

    this.requestForm = new FormGroup({
      title: new FormControl(title, Validators.required),
      info: new FormControl(info, Validators.required)
    });
  }

  onSubmit() {
    if (this.editMode) {
      this.newRequestLoading = true;
      this.requestService.updateRequest(this.requestForm.value.title, this.requestForm.value.info, this.index);
    } else {
      this.newRequestLoading = true;
      this.requestService.addRequest(this.requestForm.value.title, this.requestForm.value.info);
    }
  }

  ngOnDestroy(): void {
    this.requestSub.unsubscribe();
  }
}
