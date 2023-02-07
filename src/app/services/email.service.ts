import { Observable, first } from 'rxjs';

import { Email } from 'src/app/models/email';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) { }

  send$(email: FormData): Observable<number> {
    return this.http.post<number>(`${environment.emailUrl}/MailMessenger/sendmail`, email)
  }

  send(email: Email): void {
    console.dir(email)

    const formData = new FormData()

    formData.append('From',email.from)
    email.to.forEach(e => {
      formData.append('To', e)
    })
    email.cc.forEach(e => {
      formData.append('Cc', e)
    })

    formData.append('Subject', email.subject)
    formData.append('Message', email.message)

    // email.attachments.forEach(f => {
    //   formData.append('Attachments', f)
    // })

    this.send$(formData).pipe(first()).subscribe({
      next: (result) => {
        console.dir(result)
      }
    })
  }

}
