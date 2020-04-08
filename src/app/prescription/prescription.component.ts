import { Component, OnInit, Input, EventEmitter, Output, OnDestroy, AfterViewInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { SetupService } from '../shared/services/setup.service';
import { FormBuilder } from '@angular/forms';
import { PhysicianService } from '../physician/services/physician.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.css']
})
export class PrescriptionComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() consultation: any;
  @Input() patient: any;
  @Input() userId: any;
  @Output() nextClicked: EventEmitter<any> = new EventEmitter();
  @Output() previousClicked: EventEmitter<any> = new EventEmitter();

  consultationDate = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
  submiting = false;

  constructor(
    private setUpService: SetupService,
    private fb: FormBuilder,
    private physicianService: PhysicianService,
    private notificationS: NzNotificationService,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.physicianService.consultationDate$.pipe(untilComponentDestroyed(this))
      .subscribe(date => {
        this.consultationDate = formatDate(date, 'yyyy-MM-dd HH:mm:ss', 'en');
      });
  }

  ngOnDestroy() { }

  previous() {
    // emit previous step event
    this.previousClicked.emit();
  }

  submit() {
    // submit to api and move to next step
  }
}
