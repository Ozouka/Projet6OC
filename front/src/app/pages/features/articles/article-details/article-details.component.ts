import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Badge {
  color: string;
  initial: string;
}

interface Comment {
  username: string;
  content: string;
  badges: Badge[];
}

interface Article {
  id: number;
  title: string;
  date: string;
  author: string;
  content: string;
  comments: Comment[];
}

@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class ArticleDetailsComponent implements OnInit {
  article: Article | undefined;
  newComment: string = '';

  // Données factices pour simuler une base de données
  private articlesData: Article[] = [
    {
      id: 1,
      title: "Titre de l'article 1",
      date: "Date",
      author: "Auteur",
      content: "Content: lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled...",
      comments: [
        {
          username: "username",
          content: "contenu du commentaire",
          badges: [
            { color: "#ff49db", initial: "W" },
            { color: "#ff8c00", initial: "D" }
          ]
        },
        {
          username: "user2",
          content: "Un autre commentaire intéressant sur cet article.",
          badges: [
            { color: "#1e90ff", initial: "B" }
          ]
        }
      ]
    },
    {
      id: 2,
      title: "Titre de l'article 2",
      date: "Date",
      author: "Auteur",
      content: "Content: lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled...",
      comments: []
    },
    {
      id: 3,
      title: "Titre de l'article 3",
      date: "Date",
      author: "Auteur",
      content: "Content: lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled...",
      comments: []
    },
    {
      id: 4,
      title: "Titre de l'article 4",
      date: "Date",
      author: "Auteur",
      content: "Content: lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled...",
      comments: []
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const articleId = +params['id']; // Convertit le paramètre string en number
      this.article = this.articlesData.find(a => a.id === articleId);
    });
  }

  addComment() {
    if (!this.article || !this.newComment.trim()) return;

    this.article.comments.push({
      username: "Utilisateur", // Vous pourriez utiliser un service d'authentification ici
      content: this.newComment,
      badges: [{ color: "#4CAF50", initial: "U" }] // Badge par défaut
    });

    this.newComment = ''; // Réinitialise le champ après l'ajout
  }
}
