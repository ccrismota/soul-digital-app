import { Component, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  logged$: Observable<User | null> = EMPTY;

  constructor(private authService: AuthService, private router: Router) { }

  logout(){
    this.authService.logout().subscribe(()=>{
      this.router.navigate(['/login']);
    })
  }

  ngOnInit(): void {
    this.logged$ = this.authService.logged;
  }

}
