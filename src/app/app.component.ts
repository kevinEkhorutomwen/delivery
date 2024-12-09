import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { HeaderComponent } from './layouts/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
  HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  
  constructor() {
    // this.registerUser("Kevin.Ekhorutomwen@yahoo.de", "Qweasd123");
  }

  
  title = 'delivery';
}
