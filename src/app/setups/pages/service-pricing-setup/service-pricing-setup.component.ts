import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-service-pricing-setup',
  templateUrl: './service-pricing-setup.component.html',
  styleUrls: ['./service-pricing-setup.component.css']
})
export class ServicePricingSetupComponent implements OnInit {


  //   description (optional and nullable)
  // hospital_service_id (optional and nullable)
  // service_category_id (optional and nullable when service_subcategory_id supplied)
  // service_subcategory_id (optional and nullable when service_category_id is supplied)
  // age_group_id (optional and nullable)
  // gender (optional,default value:MALE,FEMALE)
  // funding_type_id (optional and nullable)
  // patient_status (optional, default value:IN-PATIENT,OUT-PATIENT,WALK-IN)
  // status (optional, default value:IN-PATIENT,OUT-PATIENT,WALK-IN)


  constructor() { }

  ngOnInit() {
  }

}
