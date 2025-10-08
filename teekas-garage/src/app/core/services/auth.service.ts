import { Injectable, signal } from "@angular/core";

import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User
} from 'firebase/auth';

import {
    getFirestore,
    doc,
    setDoc,
    serverTimestamp
} from 'firebase/firestore';

@Injectable({ providedIn: 'root'})
export class AuthService {
    currentUser = signal<User | null>(null);

    private auth = getAuth();
    private db = getFirestore();

    constructor() {
        onAuthStateChanged(this.auth, (user) => {
            this.currentUser.set(user);
        });
    }

    async register(name: string, email: string, password: string): Promise <void>{

        const cred = await createUserWithEmailAndPassword(this.auth, email, password);
        await updateProfile(cred.user, { displayName: name});

        const ref = doc(this.db, 'users', cred.user.uid);
        await setDoc(ref, {
            uid: cred.user.uid,
            name,
            email: cred.user.email,
            createdAt: serverTimestamp(),
        });
    }

    async login (email: string, password: string): Promise<void> {
        await signInWithEmailAndPassword(this.auth, email, password);
    }

    async logout(): Promise<void> {
        await signOut(this.auth);
    }
}