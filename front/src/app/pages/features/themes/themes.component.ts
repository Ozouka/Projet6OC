import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ThemeService } from './services/theme.service';
import { Theme, ThemeRequest } from './interfaces/theme.interface';
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
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Utilisateur non authentifié');
      this.router.navigate(['/login']);
      return;
    }

    this.loadThemes();
  }

  isThemeSubscribed(theme: Theme): boolean {
    return theme.isSubscribed === true || theme.subscribed === true;
  }

  loadThemes(): void {
    this.isLoading = true;
    this.hasError = false;

    this.themeService.getThemes().subscribe({
      next: (data: Theme[]) => {
        console.log('Thèmes chargés:', data);
        this.themes = data.map(theme => {
          theme.isSubscribed = theme.isSubscribed || theme.subscribed;
          return theme;
        });
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des thèmes:', error);
        this.isLoading = false;
        this.hasError = true;

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

    console.log('État avant abonnement/désabonnement:', theme);
    const isSubscribed = this.isThemeSubscribed(theme);

    if (isSubscribed) {
      this.themeService.unsubscribeFromTheme(theme.id).subscribe({
        next: (updatedTheme: Theme) => {
          console.log('Réponse désabonnement:', updatedTheme);
          const index = this.themes.findIndex(t => t.id === theme.id);
          if (index !== -1) {
            updatedTheme.isSubscribed = updatedTheme.isSubscribed || updatedTheme.subscribed;
            console.log('Mise à jour du thème:', updatedTheme);
            this.themes[index] = {...updatedTheme};
          }
        },
        error: (error: any) => {
          console.error('Erreur lors du désabonnement:', error);
          if (error.status === 401) {
            localStorage.removeItem('token');
            this.router.navigate(['/login']);
          }
          if (error.status === 409 || error.status === 404) {
            this.loadThemes();
          }
        }
      });
    } else {
      this.themeService.subscribeToTheme(theme.id).subscribe({
        next: (updatedTheme: Theme) => {
          console.log('Réponse abonnement:', updatedTheme);
          const index = this.themes.findIndex(t => t.id === theme.id);
          if (index !== -1) {
            updatedTheme.isSubscribed = updatedTheme.isSubscribed || updatedTheme.subscribed;
            console.log('Mise à jour du thème:', updatedTheme);
            this.themes[index] = {...updatedTheme};
          }
        },
        error: (error: any) => {
          console.error('Erreur lors de l\'abonnement:', error);
          if (error.status === 401) {
            localStorage.removeItem('token');
            this.router.navigate(['/login']);
          }
          if (error.status === 409 || error.status === 404) {
            this.loadThemes();
          }
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
        newTheme.isSubscribed = newTheme.isSubscribed || newTheme.subscribed;
        this.themes.unshift({...newTheme});
        this.toggleCreateForm();
      },
      error: (error: any) => {
        console.error('Erreur lors de la création du thème:', error);
        if (error.status === 401) {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }
      }
    });
  }
}
