import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AccountService } from '../../../core/services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseError } from '@angular/fire/app';
import { SnackbarService } from '../../../core/services/snackbar.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private snack = inject(SnackbarService);
  returnUrl = '/';

  constructor() {
    const url = this.activatedRoute.snapshot.queryParams['returnUrl'];
    if (url) this.returnUrl = url;
  }

  loginForm = this.fb.group({
    email: [''],
    password: ['']
  });

  onSubmit() {
    this.accountService
      .login(this.loginForm.value.email!, this.loginForm.value.password!)
      .then(() => this.router.navigateByUrl(this.returnUrl))
      .catch((e) => {
        var error = e as FirebaseError;
        var message: string;
        switch (error.code) {
          case 'auth/user-not-found':
            message = 'Die E-Mail wurde noch nicht registriert.'
            break;
          case 'auth/wrong-password':
            message = 'Das eingegebene Passwort ist nicht korrekt.'
            break;          
          default:
            message = error.message
            break;
        }
        this.snack.error(message);
      })
  }
}