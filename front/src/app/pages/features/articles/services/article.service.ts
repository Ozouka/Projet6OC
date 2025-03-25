import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: {
    id: number;
    username: string;
  };
}

export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  author: {
    id: number;
    username: string;
  };
  theme: {
    id: number;
    name: string;
  };
}

export interface PostRequest {
  title: string;
  content: string;
  themeId: number;
}

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  public getFeed(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/posts/feed`, {
      headers: this.getHeaders()
    });
  }

  public getPostById(id: number): Observable<Post> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Post>(`${this.baseUrl}/posts/${id}`, { headers });
  }

  public createPost(postRequest: PostRequest): Observable<Post> {
    return this.http.post<Post>(`${this.baseUrl}/posts`, postRequest, {
      headers: this.getHeaders()
    });
  }

  public addComment(postId: number, content: string): Observable<Comment> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<Comment>(
      `${this.baseUrl}/posts/${postId}/comments`,
      { content },
      { headers }
    );
  }
}
