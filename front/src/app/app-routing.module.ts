import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/features/auth/components/login/login.component';
import { RegisterComponent } from './pages/features/auth/components/register/register.component';
import { ArticlesComponent } from './pages/features/articles/articles.component';
import { ThemesComponent } from './pages/features/themes/themes.component';
import { ArticleDetailsComponent } from './pages/features/articles/article-details/article-details.component';
import { AuthGuard } from './pages/features/auth/guards/auth.guard';
import { CreateArticleComponent } from './pages/features/articles/create-article/create-article.component';
import { AccountComponent } from './pages/features/account/account.component';

// Routes avec protection par AuthGuard pour les pages nécessitant une authentification
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'articles',
    component: ArticlesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'articles/create',
    component: CreateArticleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'articles/:id',
    component: ArticleDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'themes',
    component: ThemesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
