import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConsultationData } from '../../shared/models/consultation-data.model';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-clinical-notes',
  templateUrl: './clinical-notes.component.html',
  styleUrls: ['./clinical-notes.component.css']
})
export class ClinicalNotesComponent implements OnInit {

  @Input() consultation: any;
  @Input() patient: any;
  @Input() userId: any;

   // consultation data for holding child component data states
   @Input() consultationData: ConsultationData;


  @Output() nextClicked: EventEmitter<any> = new EventEmitter();
  @Output() previousClicked: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {

  }

}
