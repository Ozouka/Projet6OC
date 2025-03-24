import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Theme {
  title: string;
  date: string;
  author: string;
  content: string;
  isSubscribed: boolean;
}

@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ThemesComponent {
  themes: Theme[] = [
    {
      title: "Titre du thème",
      date: "Date",
      author: "Auteur",
      content: "Content: lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled...",
      isSubscribed: false
    },
    {
      title: "Titre du thème",
      date: "Date",
      author: "Auteur",
      content: "Content: lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled...",
      isSubscribed: false
    },
    {
      title: "Titre du thème",
      date: "Date",
      author: "Auteur",
      content: "Content: lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled...",
      isSubscribed: false
    },
    {
      title: "Titre du thème",
      date: "Date",
      author: "Auteur",
      content: "Content: lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled...",
      isSubscribed: false
    }
  ];

  toggleSubscription(theme: Theme): void {
    theme.isSubscribed = !theme.isSubscribed;
    // Ici, vous pourriez ajouter un appel à un service pour sauvegarder l'état d'abonnement
  }
}
