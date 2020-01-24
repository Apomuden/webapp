import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SetupsRoutingModule } from './setups-routing.module';
import { SetupsComponent } from './setups.component';
import { DepartmentSetupComponent } from './pages/department-setup/department-setup.component';
import { FundingTypeSetupComponent } from './pages/funding-type-setup/funding-type-setup.component';
import { PaymentChannelSetupComponent } from './pages/payment-channel-setup/payment-channel-setup.component';
import { SponsershipTypeSetupComponent } from './pages/sponsership-type-setup/sponsership-type-setup.component';
import { PaymentStyleSetupComponent } from './pages/payment-style-setup/payment-style-setup.component';
import { BillingSystemSetupComponent } from './pages/billing-system-setup/billing-system-setup.component';
import { BillingCycleSetupComponent } from './pages/billing-cycle-setup/billing-cycle-setup.component';
import { HospitalServiceSetupComponent } from './pages/hospital-service-setup/hospital-service-setup.component';
import { ServiceCategorySetupComponent } from './pages/service-category-setup/service-category-setup.component';
import { StaffTypeSetupComponent } from './pages/staff-type-setup/staff-type-setup.component';
import { ProfessionSetupComponent } from './pages/profession-setup/profession-setup.component';
import { StaffCategorySetupComponent } from './pages/staff-category-setup/staff-category-setup.component';
import { ServiceSubcategorySetupComponent } from './pages/service-subcategory-setup/service-subcategory-setup.component';
import { LanguageSetupComponent } from './pages/language-setup/language-setup.component';
import { BankSetupComponent } from './pages/bank-setup/bank-setup.component';
import { BankBranchesSetupComponent } from './pages/bank-branches-setup/bank-branches-setup.component';
import { IdTypeSetupComponent } from './pages/id-type-setup/id-type-setup.component';
import { EducationLevelSetupComponent } from './pages/education-level-setup/education-level-setup.component';
import { AgeGroupSetupComponent } from './pages/age-group-setup/age-group-setup.component';
import { TitleSetupComponent } from './pages/title-setup/title-setup.component';
import { RelationshipSetupComponent } from './pages/relationship-setup/relationship-setup.component';
import { TownSetupComponent } from './pages/town-setup/town-setup.component';
import { ReligionSetupComponent } from './pages/religion-setup/religion-setup.component';
import { DistrictSetupComponent } from './pages/district-setup/district-setup.component';
import { RegionSetupComponent } from './pages/region-setup/region-setup.component';
import { FacilitySetupComponent } from './pages/facility-setup/facility-setup.component';
import { AccreditationSetupComponent } from './pages/accreditation-setup/accreditation-setup.component';
import { CountrySetupComponent } from './pages/country-setup/country-setup.component';
import { CompanySetupComponent } from './pages/company-setup/company-setup.component';
import { SpecialitySetupComponent } from './pages/speciality-setup/speciality-setup.component';
import { FormsModule } from '@angular/forms';
import { MedicalSponsorSetupComponent } from './pages/medical-sponsor-setup/medical-sponsor-setup.component';

@NgModule({
  declarations: [
    SetupsComponent,
    DepartmentSetupComponent,
    FundingTypeSetupComponent,
    PaymentChannelSetupComponent,
    SponsershipTypeSetupComponent,
    PaymentStyleSetupComponent,
    BillingSystemSetupComponent,
    BillingCycleSetupComponent,
    HospitalServiceSetupComponent,
    ServiceCategorySetupComponent,
    StaffTypeSetupComponent,
    ProfessionSetupComponent,
    StaffCategorySetupComponent,
    ServiceSubcategorySetupComponent,
    LanguageSetupComponent,
    BankSetupComponent,
    BankBranchesSetupComponent,
    IdTypeSetupComponent,
    EducationLevelSetupComponent,
    AgeGroupSetupComponent,
    TitleSetupComponent,
    RelationshipSetupComponent,
    TownSetupComponent,
    ReligionSetupComponent,
    DistrictSetupComponent,
    RegionSetupComponent,
    FacilitySetupComponent,
    AccreditationSetupComponent,
    CountrySetupComponent,
    CompanySetupComponent,
    SpecialitySetupComponent,
    MedicalSponsorSetupComponent
  ],
  imports: [
    CommonModule,
    SetupsRoutingModule,
    SharedModule,
    GooglePlaceModule,
    FormsModule
  ]
})
export class SetupsModule {}
