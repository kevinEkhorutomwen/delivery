import { computed, Injectable, signal } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User as FireBaseUser } from '@angular/fire/auth';
import { collection, doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  isAdmin = computed(() => {return true;});
  currentUser = signal<FireBaseUser | null>(null)
  currentUser$: Observable<FireBaseUser>;
  myUser = signal<User | null>(null)
  collectionName = "user";

  constructor(private auth: Auth, private firestore: Firestore){
    this.currentUser$ = authState(auth)
    this.currentUser$.subscribe(x => {
      this.currentUser.set(x)
      this.getUser(x.uid)
  })
  }

  async login(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password);
  }

  async register(email: string, password: string): Promise<string> {
    var userCred = await createUserWithEmailAndPassword(this.auth, email, password);
    return userCred.user.uid;
  }  

  async logout() {
    return signOut(this.auth);
  }

  async createUser(uId: string, email: string, firstName: string, lastName: string){
    const collectionRef = collection(this.firestore, this.collectionName);
    const docRef = doc(collectionRef, uId);
    const user: User = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      roles: "0"
    }

    await setDoc(docRef, user);
  }

  async getUser(uId: string){
    const ref = doc(this.firestore, this.collectionName, uId);
    const docSnap = await getDoc(ref);
    if(docSnap.exists()){
      this.myUser.set(docSnap.data() as User)
    }    
  }
}