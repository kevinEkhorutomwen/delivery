import { computed, Injectable } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  isAdmin = computed(() => {return true;});
  currentUser$: Observable<User>;

  constructor(private auth: Auth){
    this.currentUser$ = authState(auth)
  }

  async login(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password);
  }

  async register(email: string, password: string) {
    await createUserWithEmailAndPassword(this.auth, email, password);
  }  

  async logout() {
    return signOut(this.auth);
  }
}