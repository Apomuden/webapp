import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { first, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

const LAB_URL = `${environment.apiBaseUrl}/labs`;
const PRODUCT_TYPE_URL = `${environment.apiBaseUrl}/pharmacy/producttypes`;
const PRODUCT_CATEGORY_URL = `${environment.apiBaseUrl}/pharmacy/productcategories`;

@Injectable({
  providedIn: 'root'
})
export class StoreSetupService {

  constructor(private http: HttpClient) { }

  getProductTypes() {
    return this.http.get<any>(PRODUCT_TYPE_URL)
      .pipe(map(res => {
        if (res && res.data && res.data.length > 0) {
          res.data.forEach(param => {
            param.isActivated = param.status === 'ACTIVE';
          });
          return res.data;
        } else {
          return [];
        }
      }), first(), catchError(_ => of([])));
  }

  createProductType(data: any) {
    return this.http.post<boolean>(PRODUCT_TYPE_URL, data)
      .pipe(map(res => !!res), first(), catchError(_ => of(false)));
  }

  deleteProductType(id: number) {
    return this.http.delete<boolean>(`${PRODUCT_TYPE_URL}/${id}`)
      .pipe(map(res => !!res), first(), catchError(_ => of(false)));
  }

  editProductType(id: number, data: any) {
    return this.http.put<boolean>(`${PRODUCT_TYPE_URL}/${id}`, data)
      .pipe(map(res => !!res), first(), catchError(_ => of(false)));
  }

  getProductCategories() {
    return this.http.get<any>(PRODUCT_CATEGORY_URL)
      .pipe(map(res => {
        if (res && res.data && res.data.length > 0) {
          res.data.forEach(param => {
            param.isActivated = param.status === 'ACTIVE';
          });
          return res.data;
        } else {
          return [];
        }
      }), first(), catchError(_ => of([])));
  }

  createProductCategory(data: any) {
    return this.http.post<boolean>(PRODUCT_CATEGORY_URL, data)
      .pipe(map(res => !!res), first(), catchError(_ => of(false)));
  }

  deleteProductCategory(id: number) {
    return this.http.delete<boolean>(`${PRODUCT_CATEGORY_URL}/${id}`)
      .pipe(map(res => !!res), first(), catchError(_ => of(false)));
  }

  editProductCategory(id: number, data: any) {
    return this.http.put<boolean>(`${PRODUCT_CATEGORY_URL}/${id}`, data)
      .pipe(map(res => !!res), first(), catchError(_ => of(false)));
  }
}
