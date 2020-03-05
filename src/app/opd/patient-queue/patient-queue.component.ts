import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OpdService } from '../services/opd.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-patient-queue',
  templateUrl: './patient-queue.component.html',
  styleUrls: ['./patient-queue.component.css']
})
export class PatientQueueComponent implements OnInit {
  attendances = [];
  isLoading = true;

  @Input() action: string;
  @Input() queuePath: string;
  @Output() queueClick: EventEmitter<any> = new EventEmitter();

  constructor(private opdService: OpdService) { }

  ngOnInit() {
    this.opdService.getQueue(this.queuePath).pipe(first()).subscribe(data => {
      this.attendances = data;
      this.isLoading = false;
    }, error => console.error(error));
  }

  doAction(patient: any) {
    this.queueClick.emit(patient);
  }
}
