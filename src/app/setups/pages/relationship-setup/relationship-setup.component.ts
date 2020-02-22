import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-relationship-setup',
  templateUrl: './relationship-setup.component.html',
  styleUrls: ['./relationship-setup.component.css']
})
export class RelationshipSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingRelationship = new BehaviorSubject(false);
  data = [];
  list = [];
  error = '';
  relationship = '';
  componentLabel = 'relationship';

  submitForm(): void {
    if (this.relationship == null || this.relationship === '') {
      this.error = `Please enter ${this.componentLabel} name`;
    } else {
      this.error = '';
      this.isCreatingRelationship.next(true);
      this.setup
        .createRelationship(this.relationship)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingRelationship.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getRelationships();
              this.relationship = '';
            } else {
              this.notification.blank(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingRelationship.next(false);
            this.notification.blank(
              'Error',
              `Could not create ${this.componentLabel}`
            );
          }
        );
    }
  }

  constructor(
    private setup: SetupService,
    private notification: NzNotificationService
  ) { }
  getRelationships() {
    this.setup
      .getRelationships()
      .pipe(first())
      .subscribe(
        data => {
          this.data = data.data;
          this.list = data.data;
          this.initLoading = false;
          console.log(this.data);
        },
        error => {
          console.log(error);
        }
      );
  }
  ngOnInit() {
    this.getRelationships();
  }

  toggleItem($event: any, relationship: any) {
    this.setup.toggleActive(`setups/relationships/${relationship.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(r => r.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(r => r.id === relationship.id);
        this.list[index].isActivated = !relationship.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
}
