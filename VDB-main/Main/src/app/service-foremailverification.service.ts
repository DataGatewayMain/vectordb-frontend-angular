import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class ServiceForemailverificationService {
  private emailVerificationSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null!);
  public emailVerification$: Observable<string> = this.emailVerificationSubject.asObservable();

  constructor() {}

  updateEmailVerification(emailVerification: string): void {
    this.emailVerificationSubject.next(emailVerification);
  }
}
