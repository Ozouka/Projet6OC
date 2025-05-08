import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ArticleService, PostRequest } from '../services/article.service';
import { ThemeService } from '../../themes/services/theme.service';
import { Theme } from '../../themes/interfaces/theme.interface';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule]
})
export class CreateArticleComponent implements OnInit {
  articleForm: FormGroup;
  themes: Theme[] = [];
  isLoading = false;
  errorMessage = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private articleService: ArticleService,
    private themeService: ThemeService
  ) {
    this.articleForm = this.fb.group({
      themeId: ['', Validators.required],
      title: ['', Validators.required],
      content: ['', [Validators.required, Validators.minLength(10)]]
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

  loadThemes(): void {
    this.isLoading = true;

    this.themeService.getThemes().subscribe({
      next: (data: Theme[]) => {
        this.themes = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des thèmes:', error);
        this.isLoading = false;
        this.errorMessage = 'Impossible de charger les thèmes. Veuillez réessayer.';

        if (error.status === 401) {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }
      }
    });
  }

  onSubmit(): void {
    if (this.articleForm.valid) {
      this.isSubmitting = true;

      const postRequest: PostRequest = {
        title: this.articleForm.value.title,
        content: this.articleForm.value.content,
        themeId: Number(this.articleForm.value.themeId)
      };

      this.articleService.createPost(postRequest).subscribe({
        next: (_) => {
          this.isSubmitting = false;
          this.router.navigate(['/articles']);
        },
        error: (error: any) => {
          this.isSubmitting = false;
          console.error('Erreur lors de la création de l\'article:', error);
          this.errorMessage = 'Erreur lors de la création de l\'article. Veuillez réessayer.';

          if (error.status === 401) {
            localStorage.removeItem('token');
            this.router.navigate(['/login']);
          }
        }
      });
    }
  }
}
