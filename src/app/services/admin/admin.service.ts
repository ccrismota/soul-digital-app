import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Admin } from 'src/app/models/admin';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  baseUrl = 'http://localhost:5001/soul-digital-c15f6/us-central1/api';
  adminUrl = `${this.baseUrl}/admin`;

  constructor(
    private http: HttpClient,
    private authservice: AuthService
  ) { }


  getAdmins(){
    return this.http.get<Admin[]>(this.adminUrl, {
      headers: {Authorization: `Bearer ${this.authservice.userToken}`}
    });
  }

  addAdmin(admin: Admin){
    return this.http.post(this.adminUrl, admin, {
      headers: { Authorization: `Bearer ${this.authservice.userToken}`}
    });
  }

  updateAdmin(admin: Admin){
    return this.http.put(`${this.adminUrl}/${admin.uid}`, admin, {
      headers: { Authorization: `Bearer ${this.authservice.userToken}`}
    });
  }

  deleteAdmin(admin: Admin){
    return this.http.put(`${this.adminUrl}/${admin.uid}`, {
      Headers: { Authorization: `Bearer ${this.authservice.userToken}`}
    });
  }




















}
