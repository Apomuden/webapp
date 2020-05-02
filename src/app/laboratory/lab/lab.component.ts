import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, HostListener, enableProdMode } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { debounceTime, first } from 'rxjs/operators';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import * as datefns from 'date-fns';
import { formatDate } from '@angular/common';
import { PhysicianService } from 'src/app/physician/services/physician.service';
import { OpdService } from 'src/app/opd/services/opd.service';
import { LaboratoryService } from '../services/laboratory.service';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { User } from 'src/app/shared/interfaces/user.type';

@Component({
  selector: 'app-lab',
  templateUrl: './lab.component.html',
  styleUrls: ['./lab.component.css']
})
export class LabComponent implements OnInit, OnDestroy, AfterViewInit {
  today: string;

  folderNumb = this.fb.control(null, [Validators.minLength(11), Validators.maxLength(12)]);

  isLoadingData = false;
  searchInitialized = false;

  patient: any;
  message = 'Please enter a valid folder number to fill this form.';
  labRequests: any[];
  consultation: any;
  user: User;

  constructor(
    private fb: FormBuilder,
    private opdService: OpdService,
    private labService: LaboratoryService,
    private physicianService: PhysicianService,
    private authService: AuthenticationService,
  ) { }

  private get folderNoControl(): FormControl {
    return this.folderNumb as FormControl;
  }

  ngOnInit() {
    this.user = this.authService.currentUserValue;
    this.today = formatDate(datefns.startOfToday(), 'yyyy-MM-dd', 'en');
  }

  ngAfterViewInit() {
    this.folderNoControl.valueChanges.pipe(debounceTime(1000), untilComponentDestroyed(this))
      .subscribe(folderNo => {
        if (folderNo && this.folderNoControl.valid) {
          this.initLabForm(folderNo);
        } else {
          this.message = 'Please enter a valid folder number to fill this form.';
          this.searchInitialized = false;
        }
      });
  }

  ngOnDestroy() { }

  async initLabForm(folderNo: string) {
    this.isLoadingData = true;
    this.searchInitialized = true;
    try {
      this.patient = await this.opdService.getPatient(folderNo).toPromise();
      this.consultation = await this.physicianService
        .getConsultation(this.patient.id, this.today).toPromise();
      this.labRequests = await this.labService
        .getLabInvestigation(this.consultation.id).toPromise();
    } catch (e) {
      this.pauseAll();
      this.message = 'Failed to get lab';
    }
    this.isLoadingData = false;
  }

  pauseAll() {
    this.patient = null;
    this.labRequests = null;
    this.consultation = null;
    this.searchInitialized = false;
    this.folderNoControl.reset();
  }

  pause(labIndex: number) {
    this.labRequests.splice(labIndex, 1);
    if (this.labRequests.length === 0) {
      this.pauseAll();
    }
  }

  attendanceClick(attendance: any) {
    this.folderNoControl.setValue(attendance.folder_no);
  }
}
