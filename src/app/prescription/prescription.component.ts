import { Component, OnInit, Input, EventEmitter, Output, OnDestroy, AfterViewInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { SetupService } from '../shared/services/setup.service';
import { FormBuilder } from '@angular/forms';
import { PhysicianService } from '../physician/services/physician.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { ThemeConstantService } from '../shared/services/theme-constant.service';

interface ItemData {
  id: string;
  name: string;
  age: number;
  address: string;
}

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
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
  listOfData: ItemData[] = [];

  constructor(
    private setUpService: SetupService,
    private fb: FormBuilder,
    private themeConstantService: ThemeConstantService,
    private physicianService: PhysicianService,
    private notificationS: NzNotificationService,
  ) { }

  ngOnInit(): void {
    for (let i = 0; i < 100; i++) {
      this.listOfData.push({
        id: `${i}`,
        name: `Edrward ${i}`,
        age: 32,
        address: `London Park no. ${i}`
      });
    }
    this.updateEditCache();
  }

  ngAfterViewInit() {
    // this.themeConstantService.
    this.physicianService.consultationDate$.pipe(untilComponentDestroyed(this))
      .subscribe(date => {
        this.consultationDate = formatDate(date, 'yyyy-MM-dd HH:mm:ss', 'en');
      });
  }

  ngOnDestroy() { }

  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.listOfData.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.listOfData[index] },
      edit: false
    };
  }

  saveEdit(id: string): void {
    const index = this.listOfData.findIndex(item => item.id === id);
    Object.assign(this.listOfData[index], this.editCache[id].data);
    this.editCache[id].edit = false;
  }

  updateEditCache(): void {
    this.listOfData.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  previous() {
    this.previousClicked.emit();
  }

  submit() {

  }
}
