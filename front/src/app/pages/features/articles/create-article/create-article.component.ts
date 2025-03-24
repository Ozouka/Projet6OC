import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule]
})
export class CreateArticleComponent {
  articleForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.articleForm = this.fb.group({
      theme: ['', Validators.required],
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.articleForm.valid) {
      // Implémentez ici la logique pour sauvegarder l'article
      console.log(this.articleForm.value);
      this.router.navigate(['/articles']);
    }
  }
}