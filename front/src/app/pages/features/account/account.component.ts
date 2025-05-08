import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ThemeService } from '../themes/services/theme.service';
import { Theme } from '../themes/interfaces/theme.interface';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule]
})
export class AccountComponent implements OnInit {
  profileForm: FormGroup;
  subscribedThemes: Theme[] = [];
  isLoading = false;
  hasError = false;
  errorMessage = '';
  updateSuccess = false;
  updateError = false;
  updateErrorMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private themeService: ThemeService
  ) {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.loadUserProfile();
    this.loadThemes();
  }

  loadUserProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Utilisateur non authentifié');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any>('http://localhost:8080/auth/me', { headers }).subscribe({
      next: (userData) => {
        console.log('Données utilisateur reçues:', userData);

        this.profileForm.patchValue({
          username: userData.username,
          email: userData.email,
          password: ''
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement du profil:', error);
        this.updateError = true;
        this.updateErrorMessage = 'Impossible de charger les informations du profil.';
      }
    });
  }

  loadThemes() {
    this.isLoading = true;
    this.hasError = false;

    this.themeService.getThemes().subscribe({
      next: (themes) => {
        this.subscribedThemes = themes.filter(theme =>
          theme.isSubscribed || theme.subscribed
        );
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des thèmes:', error);
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = 'Impossible de charger les thèmes.';
      }
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.updateSuccess = false;
      this.updateError = false;

      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Utilisateur non authentifié');
        return;
      }

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });

      const updateUser: any = {
        username: this.profileForm.value.username,
        email: this.profileForm.value.email
      };

      if (this.profileForm.value.password && this.profileForm.value.password.trim() !== '') {
        updateUser.password = this.profileForm.value.password;
      }

      this.http.put('http://localhost:8080/auth/me', updateUser, { headers }).subscribe({
        next: (response) => {
          this.updateSuccess = true;
          console.log('Profil mis à jour avec succès');

          this.profileForm.patchValue({ password: '' });
        },
        error: (error) => {
          this.updateError = true;
          this.updateErrorMessage = error.error && error.error.message ?
            error.error.message : 'Une erreur est survenue lors de la mise à jour du profil';
          console.error('Erreur lors de la mise à jour du profil:', error);
        }
      });
    }
  }

  toggleSubscription(theme: Theme): void {
    if (!theme.id) {
      console.error('L\'ID du thème est manquant');
      return;
    }

    const isSubscribed = theme.isSubscribed || theme.subscribed;

    if (isSubscribed) {
      this.themeService.unsubscribeFromTheme(theme.id).subscribe({
        next: (updatedTheme) => {
          console.log('Désabonnement réussi:', updatedTheme);
          this.loadThemes();
        },
        error: (error) => {
          console.error('Erreur lors du désabonnement:', error);
          if (error.status === 409 || error.status === 404) {
            this.loadThemes();
          }
        }
      });
    } else {
      this.themeService.subscribeToTheme(theme.id).subscribe({
        next: (updatedTheme) => {
          console.log('Abonnement réussi:', updatedTheme);
          this.loadThemes();
        },
        error: (error) => {
          console.error('Erreur lors de l\'abonnement:', error);
          if (error.status === 409 || error.status === 404) {
            this.loadThemes();
          }
        }
      });
    }
  }

  isThemeSubscribed(theme: Theme): boolean {
    return theme.isSubscribed === true || theme.subscribed === true;
  }
}
