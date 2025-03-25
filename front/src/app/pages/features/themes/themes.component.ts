import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ThemeService, Theme, ThemeRequest } from './services/theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule]
})
export class ThemesComponent implements OnInit {
  themes: Theme[] = [];
  isLoading = false;
  hasError = false;
  showCreateForm = false;
  themeForm: FormGroup;

  constructor(
    private themeService: ThemeService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.themeForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['']
    });
  }

  ngOnInit(): void {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Utilisateur non authentifié');
      this.router.navigate(['/login']);
      return;
    }

    this.loadThemes();
  }

  loadThemes(): void {
    this.isLoading = true;
    this.hasError = false;

    this.themeService.getThemes().subscribe({
      next: (data: Theme[]) => {
        this.themes = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des thèmes:', error);
        this.isLoading = false;
        this.hasError = true;

        // Si erreur 401, rediriger vers login
        if (error.status === 401) {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }
      }
    });
  }

  toggleSubscription(theme: Theme): void {
    if (!theme.id) {
      console.error('L\'ID du thème est manquant');
      return;
    }

    if (theme.isSubscribed) {
      this.themeService.unsubscribeFromTheme(theme.id).subscribe({
        next: () => {
          theme.isSubscribed = false;
        },
        error: (error: any) => {
          console.error('Erreur lors du désabonnement:', error);
        }
      });
    } else {
      this.themeService.subscribeToTheme(theme.id).subscribe({
        next: () => {
          theme.isSubscribed = true;
        },
        error: (error: any) => {
          console.error('Erreur lors de l\'abonnement:', error);
        }
      });
    }
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.themeForm.reset();
    }
  }

  createTheme(): void {
    if (this.themeForm.invalid) {
      return;
    }

    const themeRequest: ThemeRequest = {
      name: this.themeForm.value.name,
      description: this.themeForm.value.description || null
    };

    this.themeService.createTheme(themeRequest).subscribe({
      next: (newTheme: Theme) => {
        // Ajouter le nouveau thème à la liste
        this.themes.unshift({...newTheme, isSubscribed: false});
        this.toggleCreateForm(); // Fermer le formulaire
      },
      error: (error: any) => {
        console.error('Erreur lors de la création du thème:', error);
      }
    });
  }
}
