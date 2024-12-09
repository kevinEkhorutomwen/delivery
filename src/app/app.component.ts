import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  constructor(private auth: Auth) {
    this.registerUser("Kevin.Ekhorutomwen@yahoo.de", "Qweasd123");
  }

  async registerUser(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      console.log('User created:', userCredential.user);
    } catch (error) {
      console.error('Error during registration:', error);
    }
  }
  title = 'delivery';
}
