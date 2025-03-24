import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../interfaces/registerRequest.interface';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../../sessions/services/session.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class RegisterComponent implements OnInit {

  public onError = false;

  public form = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],
    username: [
      '',
      [
        Validators.required,
      ]
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.min(3),
        Validators.max(40)
      ]
    ],
    firstName: ['testFirstName', [Validators.required]],
    lastName: ['testLastName', [Validators.required]]
  });

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private sessionService: SessionService
  ) {
  }

  ngOnInit(): void {
    if (this.sessionService.isLogged) {
      this.router.navigate(['/articles']);
    }
  }

  public submit(): void {
    const registerRequest = this.form.value as RegisterRequest;
    this.authService.register(registerRequest).subscribe({
      next: (_: void) => {
        this.authService.login({
          email: registerRequest.email,
          password: registerRequest.password
        }).subscribe({
          next: (response) => {
            this.sessionService.logIn(response);
            this.router.navigate(['/articles']);
          },
          error: _ => this.onError = true
        });
      },
      error: _ => this.onError = true
    });
  }

}
