import { UploadFile } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-facility-management-detail',
  templateUrl: './facility-management-detail.component.html',
  styleUrls: ['./facility-management-detail.component.css']
})
export class FacilityManagementDetailComponent implements OnInit {
  loadingImage = false;
  avatarUrl: string;
  constructor() { }

  ngOnInit() {
  }


  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result.toString()));
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: UploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loadingImage = true;
        break;
      case 'done':
        // Get this url from response in real world.
        this.getBase64(info.file.originFileObj, (img: string) => {
          this.loadingImage = false;
          this.avatarUrl = img;
        });
        break;
      case 'error':
        this.loadingImage = false;
        break;
    }
  }
}
