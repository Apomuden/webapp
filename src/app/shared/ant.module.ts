import { NgModule } from "@angular/core";
import { NzNotificationService, NzSwitchModule, NzSelectModule, NzInputModule, NzButtonModule, NzStepsModule, NzInputNumberModule, NzIconModule, NzDatePickerModule, NzGridModule, NzFormModule, NgZorroAntdModule } from "ng-zorro-antd";
import { ThemeConstantService } from "./services/theme-constant.service";
import { SearchPipe } from "./pipes/search.pipe";

@NgModule({
  exports: [
    NzGridModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzIconModule,
    NzInputNumberModule,
    NzSwitchModule,
    NzStepsModule,
    NzButtonModule,
  ],
  imports: [
    NzStepsModule,
    NzButtonModule,
    NzGridModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzIconModule,
    NzInputNumberModule,
    NzSwitchModule,
  ],
})
export class AntModule { }
