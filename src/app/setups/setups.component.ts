import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-setups',
  templateUrl: './setups.component.html',
  styleUrls: ['./setups.component.css']
})
export class SetupsComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit() { }
  goToRecords() {
    this.router.navigate(['setup/records']);
  }
  goToAccounts() {
    this.router.navigate(['setup/accounts']);
  }
  goToInpatient() {
    this.router.navigate(['setup/inpatient']);
  }
  goToLaboratory() {
    this.router.navigate(['setup/laboratory-setup']);
  }
  goToEISU() {
    this.router.navigate(['setup/eisu']);
  }
  goToOthers() {
    this.router.navigate(['setup/others']);
  }
  goToClinics() {
    this.router.navigate(['setup/clinics']);
  }
}
