import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { OpdService } from '../services/opd.service';
import { first } from 'rxjs/operators';
import * as faye from 'faye';
import { environment } from 'src/environments/environment';
import { timer, Observable } from 'rxjs';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';


@Component({
  selector: 'app-patient-queue',
  templateUrl: './patient-queue.component.html',
  styleUrls: ['./patient-queue.component.css']
})
export class PatientQueueComponent implements OnInit, OnDestroy {
  attendances = [];
  isLoading = true;

  @Input() action: string;
  @Input() queuePath: string;
  @Output() queueClick: EventEmitter<any> = new EventEmitter();
  client: any;
  timer: Observable<number>;

  constructor(private opdService: OpdService) { }

  ngOnInit() {
    this.initRealtime();
  }

  ngOnDestroy() { }

  initRealtime() {
    if (!this.timer) {
      this.timer = timer(1000, 60000);
      this.timer.pipe(untilComponentDestroyed(this)).subscribe(_ => {
        this.isLoading = true;
        this.opdService.getQueue(this.queuePath).pipe(first()).subscribe(data => {
          this.attendances = data;
          this.isLoading = false;
        }, error => {
          this.isLoading = false;
          if (error.url) {
            console.error(error);
          }
        }
        );
      });
    }
    /* if (!this.client) {
      this.client = new faye.Client(environment.queueUrl); // not connecting

      this.client.subscribe('/laravel_database_consultation', attendanceData => this.socketUpdate)
        .then(_ => console.log('connected'));
    } */
  }

  socketUpdate(attendanceData: any) {
    if (attendanceData.added) {
      this.attendances.push(attendanceData.data);
    } else {
      this.attendances.splice(attendanceData.data.id, 1);
    }
  }

  doAction(patient: any) {
    this.queueClick.emit(patient);
  }
}
