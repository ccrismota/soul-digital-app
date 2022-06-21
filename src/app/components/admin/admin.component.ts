import { Component, OnInit } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { Admin } from 'src/app/models/admin';
import { AdminService } from 'src/app/services/admin/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  admins$: Observable<Admin[]> = EMPTY;

  constructor(private adminService: AdminService) { }


  admin: Admin = {} as Admin

  addAdmin(){
    this.adminService.addAdmin(this.admin).subscribe(()=>{
      this.admins$ = this.adminService.getAdmins();
    });
  }

  delete(admin: Admin){
    this.adminService.deleteAdmin(admin).subscribe(()=>{
      this.admins$ = this.adminService.getAdmins();
    });
  }


  ngOnInit(): void {
    this.admins$ = this.adminService.getAdmins();
  }

}
