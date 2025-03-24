import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginRequest } from '../../interfaces/loginRequest.interface';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../../sessions/services/session.service';
import { CommonModule } from '@angular/common';


export interface SessionInformation {
  token: string;
  type: string;
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  admin: boolean;
}


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class LoginComponent implements OnInit {
  public hide = true;
  public onError = false;

  public form = this.fb.group({
    email: [''],
    password: ['', [Validators.required]]
  });

  constructor(private authService: AuthService,
              private fb: FormBuilder,
              private router: Router,
              private sessionService: SessionService) {
  }

  ngOnInit(): void {
    if (this.sessionService.isLogged) {
      this.router.navigate(['/articles']);
    }
  }

  public submit(): void {
    const loginRequest = this.form.value as LoginRequest;
    this.authService.login(loginRequest).subscribe({
      next: (response: SessionInformation) => {
        this.sessionService.logIn(response);
        this.router.navigate(['/articles']);
      },
      error: error => {
        this.onError = true;
      }
    });
  }
}
