import { Injectable } from '@angular/core';
declare const gapi: any; 
@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {

  private googleAuth: any;

  constructor() { }

  initGoogleAuth(): Promise<any> {
    return new Promise((resolve, reject) => {
      gapi.load('auth2', () => {
        gapi.auth2.init({
          client_id: '722454344204-4on4luc4s799mpb77gkrhr0p3ebuq8n8.apps.googleusercontent.com',
          scope: 'rohankate9545@gmail.com'
        }).then(
          (auth: any) => {
            this.googleAuth = auth;
            resolve(auth);
          },
          (error: any) => {
            console.error('Error initializing Google Auth:', error);
            reject(error);
          }
        );
      });
    });
  }

  signIn(): Promise<any> {
    return this.googleAuth.signIn();
  }

  signOut(): Promise<any> {
    return this.googleAuth.signOut();
  }
}




