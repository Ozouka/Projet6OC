import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Theme {
  title: string;
  date: string;
  author: string;
  content: string;
  isSubscribed: boolean;
}

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule]
})
export class AccountComponent {
  profileForm: FormGroup;
  subscribedThemes: Theme[] = [
    {
      title: "Titre du thème",
      date: "Date",
      author: "Auteur",
      content: "Content: lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled...",
      isSubscribed: true
    },
    {
      title: "Titre du thème",
      date: "Date",
      author: "Auteur",
      content: "Content: lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled...",
      isSubscribed: true
    }
  ];

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      console.log(this.profileForm.value);
      // Implémentez ici la logique de sauvegarde
    }
  }

  toggleSubscription(theme: Theme): void {
    theme.isSubscribed = !theme.isSubscribed;
    // Ici, vous pourriez ajouter un appel à un service pour sauvegarder l'état d'abonnement
  }
}