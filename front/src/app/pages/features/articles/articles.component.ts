import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ThemeService } from '../themes/services/theme.service';
import { forkJoin } from 'rxjs';

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
  imports: [CommonModule, RouterModule, DatePipe]
})
export class ArticlesComponent implements OnInit {
  articles: Post[] = [];
  isLoading = false;
  hasError = false;
  errorMessage = '';
  sortOrder: 'desc' | 'asc' = 'desc';
  isDropdownOpen = false;

  constructor(
    private http: HttpClient,
    private themeService: ThemeService
  ) {}

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.relative')) {
      this.isDropdownOpen = false;
    }
  }

  ngOnInit() {
    this.loadArticlesAndThemes();
  }

  loadArticlesAndThemes(): void {
    this.isLoading = true;
    this.hasError = false;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    forkJoin({
      articles: this.http.get<Post[]>('http://localhost:8080/api/posts/feed', { headers }),
      themes: this.themeService.getThemes()
    }).subscribe({
      next: (results) => {
        const { articles, themes } = results;

        const subscribedThemeIds = themes
          .filter(theme => theme.isSubscribed || theme.subscribed)
          .map(theme => theme.id);

        this.articles = articles.filter(article =>
          subscribedThemeIds.includes(article.themeId)
        );

        this.sortArticlesByDate();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données:', error);
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

      const comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return this.sortOrder === 'desc' ? comparison : -comparison;
    });
  }

  toggleDropdown(event?: MouseEvent): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    event?.stopPropagation();
  }

  setSortOrder(order: 'desc' | 'asc'): void {
    this.sortOrder = order;
    this.sortArticlesByDate();
    this.isDropdownOpen = false;
  }

  onSortOrderChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.sortOrder = selectElement.value as 'desc' | 'asc';
    this.sortArticlesByDate();
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
    this.sortArticlesByDate();
  }

  getSortOrderText(): string {
    return this.sortOrder === 'desc' ? 'Plus récent d\'abord' : 'Plus ancien d\'abord';
  }
}
