import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Article {
  id: number;
  title: string;
  date: string;
  author: string;
  content: string;
}

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ArticlesComponent {
  articles: Article[] = [
    {
      id: 1,
      title: "Titre de l'article",
      date: "Date",
      author: "Auteur",
      content: "Content: lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled..."
    },
    {
      id: 2,
      title: "Titre de l'article",
      date: "Date",
      author: "Auteur",
      content: "Content: lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled..."
    },
    {
      id: 3,
      title: "Titre de l'article",
      date: "Date",
      author: "Auteur",
      content: "Content: lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled..."
    },
    {
      id: 4,
      title: "Titre de l'article",
      date: "Date",
      author: "Auteur",
      content: "Content: lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled..."
    }
  ];
}
