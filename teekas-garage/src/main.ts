import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { environment } from './environments/environment';

const app = initializeApp(environment.firebase);
getAuth(app);
getFirestore(app);


bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
