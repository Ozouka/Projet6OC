import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Theme {
  id: number;
  name: string;
  description: string | null;
  isSubscribed: boolean; // Pour gérer l'état d'abonnement côté UI
}

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

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
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

    // Ici, vous pourriez ajouter un appel à l'API pour récupérer les informations du profil
    // et les utiliser pour remplir le formulaire
  }

  loadThemes() {
    this.isLoading = true;
    this.hasError = false;

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Utilisateur non authentifié');
      this.isLoading = false;
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Récupérer tous les thèmes
    this.http.get<Theme[]>('http://localhost:8080/api/themes', { headers }).subscribe({
      next: (themes) => {
        // Marquer les thèmes auxquels l'utilisateur est abonné
        this.subscribedThemes = themes.map(theme => ({
          ...theme,
          isSubscribed: false // Par défaut, on considère que l'utilisateur n'est pas abonné
        }));

        // Ensuite, récupérer les abonnements de l'utilisateur
        this.loadUserSubscriptions();
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

  loadUserSubscriptions() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Supposons qu'il existe un endpoint pour récupérer les abonnements de l'utilisateur
    this.http.get<number[]>('http://localhost:8080/api/themes/subscribed', { headers }).subscribe({
      next: (subscribedThemeIds) => {
        // Marquer les thèmes auxquels l'utilisateur est abonné
        this.subscribedThemes.forEach(theme => {
          theme.isSubscribed = subscribedThemeIds.includes(theme.id);
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement des abonnements:', error);
      }
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      console.log(this.profileForm.value);
      // Implémentez ici la logique de sauvegarde du profil
    }
  }

  toggleSubscription(theme: Theme): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const url = `http://localhost:8080/api/themes/${theme.id}/subscribe`;

    if (theme.isSubscribed) {
      // Désabonnement
      this.http.delete(url, { headers }).subscribe({
        next: () => {
          theme.isSubscribed = false;
          console.log(`Désabonnement du thème ${theme.name} réussi`);
        },
        error: (error) => {
          console.error(`Erreur lors du désabonnement du thème ${theme.name}:`, error);
        }
      });
    } else {
      // Abonnement
      this.http.post(url, {}, { headers }).subscribe({
        next: () => {
          theme.isSubscribed = true;
          console.log(`Abonnement au thème ${theme.name} réussi`);
        },
        error: (error) => {
          console.error(`Erreur lors de l'abonnement au thème ${theme.name}:`, error);
        }
      });
    }
  }
}
