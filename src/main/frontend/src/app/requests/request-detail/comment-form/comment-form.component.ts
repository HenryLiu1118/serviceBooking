import {Component, Input, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {CommentService} from "../comment.service";
import {CommentModel} from "../../../models/comment.model";

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
  constructor(private commentService: CommentService) { }

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
      }
    );
  }

}
