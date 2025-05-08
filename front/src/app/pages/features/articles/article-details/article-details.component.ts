import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

interface Comment {
  id: number;
  content: string;
  authorEmail: string;
  createdAt: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  authorEmail: string;
  authorUsername: string;
  themeId: number;
  themeName: string;
  themeDescription: string | null;
  createdAt: string;
  comments: Comment[];
}

@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class ArticleDetailsComponent implements OnInit {
  article: Post | null = null;
  newComment: string = '';
  isLoading = false;
  hasError = false;
  errorMessage = '';
  isAddingComment = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Utilisateur non authentifié');
      this.router.navigate(['/login']);
      return;
    }

    this.route.params.subscribe(params => {
      const articleId = +params['id'];
      this.loadArticle(articleId);
    });
  }

  loadArticle(id: number): void {
    this.isLoading = true;
    this.hasError = false;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<Post>(`http://localhost:8080/api/posts/${id}`, { headers }).subscribe({
      next: (data) => {
        this.article = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'article:', error);
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = 'Impossible de charger l\'article.';

        if (error.status === 401) {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }
      }
    });
  }

  addComment() {
    if (!this.article || !this.newComment.trim()) return;

    const currentArticleId = this.article.id;

    const commentContent = this.newComment;

    this.newComment = '';

    this.isAddingComment = true;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.post<Comment>(
      `http://localhost:8080/api/posts/${currentArticleId}/comments`,
      { content: commentContent },
      { headers }
    ).pipe(
      finalize(() => {
        this.reloadArticleAfterComment(currentArticleId);
      })
    ).subscribe({
      next: () => {
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout du commentaire:', error);

        if (error.status === 401) {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }
      }
    });
  }

  private reloadArticleAfterComment(articleId: number): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    setTimeout(() => {
      this.http.get<Post>(`http://localhost:8080/api/posts/${articleId}`, { headers }).subscribe({
        next: (data) => {
          this.article = data;
          this.isAddingComment = false;
        },
        error: (error) => {
          console.error('Erreur lors du rechargement de l\'article:', error);
          this.isAddingComment = false;
        }
      });
    }, 300);
  }
}
