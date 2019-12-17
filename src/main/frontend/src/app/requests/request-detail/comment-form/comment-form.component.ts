import {Component, Input, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {CommentService} from "../comment.service";
import {CommentModel} from "../../../models/comment.model";
import {AlertService} from "../../../alert/alert.service";
import {AlertModel} from "../../../models/alert.model";

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css']
})
export class CommentFormComponent implements OnInit {

  private _requestId: number;
  private comment: CommentModel;

  get requestId(): number {
    return this._requestId;
  }

  @Input()
  set requestId(requestId: number) {
    this._requestId = requestId;
    console.log(requestId);

    this.commentService.checkDuplicateComment(this.requestId).subscribe(
      (comment: any) => {
        if (comment == null) {
          this.comment = null;
        } else {
          this.comment = new CommentModel(
            comment.commentId,
            comment.commentDetail,
            comment.servicetype,
            comment.info,
            comment.active,
            comment.requestUser,
            comment.userdto
          );
        }
      }
    );
  }
  constructor(private commentService: CommentService, private alertService: AlertService) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const detail = form.value.detail;
    this.commentService.addComment(detail, this.requestId).subscribe(
      (comment:any) => {
        this.comment = new CommentModel(
          comment.commentId,
          comment.commentDetail,
          comment.title,
          comment.info,
          comment.active,
          comment.requestUser,
          comment.userdto
        );
        this.alertService.addAlert(new AlertModel('success', 'Comment Posted!'));
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
