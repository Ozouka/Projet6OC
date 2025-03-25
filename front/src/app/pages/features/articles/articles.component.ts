import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Post {
  id: number;
  title: string;
  content: string;
  authorEmail: string;
  authorUsername: string;
  themeId: number;
  themeName: string;
  themeDescription: string | null;
  createdAt: string | null;
  comments: Comment[];
}

interface Comment {
  id: number;
  content: string;
  authorEmail: string;
  createdAt: string;
}

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ArticlesComponent implements OnInit {
  articles: Post[] = [];
  isLoading = false;
  hasError = false;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadArticles();
  }

  loadArticles(): void {
    this.isLoading = true;
    this.hasError = false;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<Post[]>('http://localhost:8080/api/posts/feed', { headers }).subscribe({
      next: (data) => {
        this.articles = data;
        this.isLoading = false;
        this.sortArticlesByDate();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des articles:', error);
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = 'Impossible de charger les articles.';
      }
    });
  }

  sortArticlesByDate(): void {
    this.articles.sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }
}
