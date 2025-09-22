import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';


@Component({
selector: 'turbovets-root',
template: `
<div [class.dark]="dark">
<div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
<header class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
<h1 class="text-xl font-semibold">TurboVets Tasks</h1>
<div class="flex items-center gap-3">
<button class="px-3 py-1 rounded-lg border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800" (click)="toggleTheme()">
{{ dark ? '🌙 Dark' : '☀️ Light' }}
</button>
<ng-container *ngIf="auth.isLoggedIn(); else loginBtn">
<span class="text-sm opacity-80">{{ auth.currentUser()?.email }}</span>
<button (click)="logout()" class="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600">Logout</button>
</ng-container>
<ng-template #loginBtn>
<a routerLink="/login" class="px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Login</a>
</ng-template>
</div>
</header>
<main class="p-4">
<router-outlet></router-outlet>
</main>
</div>
</div>
`,
})
export class AppComponent implements OnInit {
dark = false;
constructor(public auth: AuthService, private router: Router) {}
ngOnInit() {
this.dark = (localStorage.getItem('theme') || 'light') === 'dark';
if (!this.auth.isLoggedIn()) this.router.navigateByUrl('/login');
}
toggleTheme() {
this.dark = !this.dark;
localStorage.setItem('theme', this.dark ? 'dark' : 'light');
}
logout() { this.auth.logout(); this.router.navigateByUrl('/login'); }
}