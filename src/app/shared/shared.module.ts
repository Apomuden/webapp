import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { NgZorroAntdModule, NzNotificationService } from "ng-zorro-antd";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { ThemeConstantService } from "./services/theme-constant.service";
import { SearchPipe } from "./pipes/search.pipe";
import { AntModule } from "./ant.module";

@NgModule({
  exports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    PerfectScrollbarModule,
    SearchPipe,
    ReactiveFormsModule,
    AntModule,
  ],
  imports: [
    RouterModule,
    CommonModule,
    NgZorroAntdModule,
    AntModule,
    PerfectScrollbarModule,
    ReactiveFormsModule
  ],
  declarations: [SearchPipe],
  providers: [ThemeConstantService, NzNotificationService]
})
export class SharedModule {}
