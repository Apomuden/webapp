import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-procedure',
  templateUrl: './procedure.component.html',
  styleUrls: ['./procedure.component.css']
})
export class ProcedureComponent implements OnInit {
  @Input() consultation: any;
  @Input() patient: any;
  @Input() userId: any;
  @Output() nextClicked: EventEmitter<any> = new EventEmitter();
  @Output() previousClicked: EventEmitter<any> = new EventEmitter();

  submitting = false;

  previousProcedures = [
    {
      date: Date.now(),
      service: 'Belly Incision',
      procedureType: 'Slicing',
      status: 'New',
      patientStatus: 'Out-Patient',
      clinic: 'General',
      doctor: 'Dr. Yellow Brown'
    }
  ];
  currentInvestigations = [];

  isServicesLoading = true;
  isCategoriesLoading = true;
  isBillSponsorLoading = true;

  categories = ['Slicing and Dicing'];
  services = ['Belly Incision '];

  unitPrice = 0;

  procedureForm: FormGroup;

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit() {
    this.procedureForm = this.fb.group({
      category: ['', Validators.required],
      service: ['', Validators.required],
      orderType: ['INTERNAL', Validators.required],
      unitFee: [0.0, Validators.required],
      billedSponor: ['', Validators.required]
    });
  }

  previous() {
    this.previousClicked.emit();
  }

  next() {
    // this.nextClicked.emit();
  }

  onAddClicked() {}

  formatFee = (value: number) => `GHC ${value}`;
  parseFee = (value: string) => value.replace('GHC', '');

  submit() {}
}
