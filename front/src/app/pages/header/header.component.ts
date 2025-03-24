import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../features/sessions/services/session.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  sessionService: SessionService;
  router: Router;
  isDrawerOpen = false;

  constructor(sessionService: SessionService, router: Router) {
    this.sessionService = sessionService;
    this.router = router;
  }

  ngOnInit(): void {
  }

  public logout(): void {
    this.sessionService.logOut();
    this.router.navigate([''])
  }

  public $isLogged(): Observable<boolean> {
    return this.sessionService.$isLogged();
  }

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
