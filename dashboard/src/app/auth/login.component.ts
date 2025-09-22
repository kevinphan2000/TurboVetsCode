import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NonNullableFormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'turbovets-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="max-w-md mx-auto mt-20 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow">
    <h2 class="text-2xl font-semibold mb-4">Login</h2>

    <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-3" novalidate>
      <div>
        <label class="block text-sm" for="email">Email</label>
        <input id="email" class="w-full mt-1 px-3 py-2 rounded-lg border dark:border-gray-700 bg-transparent"
               formControlName="email" type="email" autocomplete="username"
               [class.border-red-500]="submitted && email.invalid" required />
        <p *ngIf="submitted && email.errors?.['required']" class="text-xs text-red-500 mt-1">Email is required.</p>
        <p *ngIf="submitted && email.errors?.['email']" class="text-xs text-red-500 mt-1">Enter a valid email.</p>
      </div>

      <div>
        <label class="block text-sm" for="password">Password</label>
        <input id="password" class="w-full mt-1 px-3 py-2 rounded-lg border dark:border-gray-700 bg-transparent"
               formControlName="password" type="password" autocomplete="current-password"
               [class.border-red-500]="submitted && password.invalid" required />
        <p *ngIf="submitted && password.errors?.['required']" class="text-xs text-red-500 mt-1">Password is required.</p>
        <p *ngIf="submitted && password.errors?.['minlength']" class="text-xs text-red-500 mt-1">Minimum 4 characters.</p>
      </div>

      <button class="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              [disabled]="form.invalid || loading" type="submit">
        {{ loading ? 'Signing in…' : 'Sign in' }}
      </button>

      <p *ngIf="error" class="text-sm text-red-500">{{ error }}</p>
    </form>
  </div>
  `,
})
export class LoginComponent {
  loading = false;
  submitted = false;
  error = '';

  form!: FormGroup<LoginForm>; // initialize in constructor

  constructor(private fb: NonNullableFormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required, Validators.minLength(4)]),
    });
  }

  get email() { return this.form.controls.email; }
  get password() { return this.form.controls.password; }

  submit() {
    this.submitted = true;
    this.error = '';
    if (this.form.invalid || this.loading) return;

    this.loading = true;
    const { email, password } = this.form.getRawValue();

    this.auth.login(email, password).pipe(
      take(1),
      finalize(() => (this.loading = false))
    ).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (e) => {
        this.error =
          e?.error?.message ||
          e?.error?.error ||
          e?.message ||
          (e?.status === 0 ? 'Network error. Check your connection.' : 'Login failed');
      },
    });
  }
}
