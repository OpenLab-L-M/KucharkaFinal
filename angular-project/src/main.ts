import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { RegistrationComponent } from './app/api-authorization/registration/registration.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { LoginComponent } from './app/api-authorization/login/login.component';
import { DashboardComponent } from './app/dashboard/dashboard.component';
import { JwtModule } from '@auth0/angular-jwt';
import { errorHandlerInterceptor } from './app/api-authorization/error-handler.interceptor';
import { authGuard } from './app/api-authorization/auth.guard';
import { jwtInterceptor } from './app/api-authorization/jwt.interceptor';
import { RecipesComponent } from './app/recipes/recipes.component';
import { CreateRecipeComponent } from './app/create-recipe/create-recipe.component';
import { RecipesDetailsComponent } from './app/recipes-details/recipes-details.component';
import { UserProfileComponent } from './app/user-profile/user-profile.component';
import { HomepageComponent } from './app/homepage/homepage.component';
// Import the functions you need from the SDKs you need
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAnalytics, provideAnalytics, ScreenTrackingService } from '@angular/fire/analytics';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { TaskListComponent } from './app/task-list/task-list.component';
import { CreateTaskComponent } from './app/create-task/create-task.component';
import { TaskDetailComponent } from './app/task-detail/task-detail.component';
import { FinishedTasksComponent } from './app/finished-tasks/finished-tasks.component';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries




export function getBaseUrl() {
  return 'https://GulityCrown.bsite.net/api';
  //return 'https://localhost:7186/api';
}

export function tokenGetter() {
  return localStorage.getItem("token");
}

const providers = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }
];

bootstrapApplication(AppComponent, {
    providers: [
      providers,
      importProvidersFrom(BrowserModule, JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ['https://localhost:7189', 'https://GulityCrown.bsite.net/api'],
          disallowedRoutes: [],
        },
      })),
      provideAnimations(),
      provideHttpClient(withInterceptors([errorHandlerInterceptor, jwtInterceptor])),
      provideRouter([
        { path: '', component: DashboardComponent, canActivate: [authGuard]},
        { path: 'login', component: LoginComponent},
        { path: 'register', component: RegistrationComponent},
        { path: 'Homepage', component: HomepageComponent},
        { path: 'Recipes', component: RecipesComponent},
        { path: 'CreateRecipe', component: CreateRecipeComponent},
        { path: 'RecipesDetails/:id', component: RecipesDetailsComponent },
        { path: 'userProfile/:userName', component: UserProfileComponent},
        { path: 'taskList', component: TaskListComponent},
        { path: 'finishedTasks', component: FinishedTasksComponent},
        { path: 'createTask', component: CreateTaskComponent},
        { path: 'TaskDetail/:id', component: TaskDetailComponent}
      ]),
      provideFirebaseApp(() => initializeApp({"projectId":"kucharka-f23d5","appId":"1:877324679360:web:88055d30f344841e0e9525","storageBucket":"kucharka-f23d5.firebasestorage.app","apiKey":"AIzaSyDizY3tqEbDJtkzWPiHD8-okoWu2RuMgbA","authDomain":"kucharka-f23d5.firebaseapp.com","messagingSenderId":"877324679360","measurementId":"G-F1FYEFP6YM"})), provideAnalytics(() => getAnalytics()), ScreenTrackingService, provideStorage(() => getStorage())
    ]
})
  .catch(err => console.error(err));
  //jj