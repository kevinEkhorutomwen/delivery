import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AccountService } from '../../../core/services/account.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { JsonPipe } from '@angular/common';
import { TextInputComponent } from "../../../shared/components/text-input/text-input.component";
import { FirebaseError } from '@angular/fire/app';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    JsonPipe,
    MatError,
    TextInputComponent
],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private snack = inject(SnackbarService);
  validationErrors?: string[];

  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit() {this.accountService.register(this.registerForm.value.email!, this.registerForm.value.password!)
    .then(() => this.router.navigateByUrl('/account/login'))
    .then(() => this.snack.success('Registration successful - you can now login'))
    .catch((e) => {
      var error = e as FirebaseError;
      var message: string;
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'Die E-Mail wurde bereits registriert.'
          break;
        case 'auth/weak-password':
          message = 'Das Passwort muss mindestens 6 Zeichen Beinhalten.'
          break;          
        default:
          message = error.message
          break;
      }
      this.snack.error(message);
    })
  }
}