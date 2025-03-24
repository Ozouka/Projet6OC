import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from './pages/features/sessions/services/session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'front';

  constructor(
    private router: Router,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    if (this.sessionService.isLogged) {
      if (this.router.url === '/' || this.router.url === '/login' || this.router.url === '/register') {
        this.router.navigate(['/articles']);
      }
    }
  }
}
