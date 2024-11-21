import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {catchError, map, skipWhile, tap} from 'rxjs/operators'


import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/auth.service';
import { BehaviorSubject, of, Subject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GetDataService   {
  // makeCall(primaryNumber: string, phoneNumber: any) {
  //   throw new Error('Method not implemented.');
  // }
  private currentPageSubject: BehaviorSubject<number>;
  public currentPage$: Observable<number>;
  // http://192.168.0.5:8080/v1/search
  // https://awsbackendapi-vdb.live/v1/search
  private search_url = 'http://localhost:8080/v1/search';
  private base_url = 'https://api.vectordb.app/v1/';
  private api_Url = 'https://app.datagateway.in/API/'; 

  getlastBounce(email: string): Observable<any> {
    const api_key = this.authService.getapi_key();
    const countUrl = `${this.base_url}auth/credit/?api=${api_key}&email_address=${email}`;
    return this.http.get<any>(countUrl);
  }

  headers = new HttpHeaders().set('Content-Type','application/json').set('Accept','application/json')
  httpOptions={
    headers:this.headers
    }
  constructor(private http: HttpClient,private authService:AuthService) {
   this.currentPageSubject = new BehaviorSubject<number>(1);
  this.currentPage$ = this.currentPageSubject.asObservable();
  }
//  sequence
private apiUrlp = 'https://api.cohere.ai/generate';
private apiKeyp = 'XuuGWcce8IFk7Rrwo0TIqg5mbRQSaBB8mnjukK3Z';
generateEmail(prompt: string): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.apiKeyp}`,
    'Content-Type': 'application/json',
  });

  const body = {
    model: 'command-xlarge-nightly', // Specify the Cohere model
    prompt: prompt,
    max_tokens: 100, // Adjust as needed
    temperature: 0.7,
  };

  return this.http.post(this.apiUrlp, body, { headers });
}
  private apiUrl2 = 'http://localhost:5000/generate-email'
  generateEmail2(jobTitle: string, companyName: string, personName: string): Observable<any> {
    const data = {
      job_title: jobTitle,
      company_name: companyName,
      person_name: personName
    };

    return this.http.post<any>(this.apiUrl2, data);
  }








  // ////////////////
  generateAIGeneratedEmails(jobTitle: string, companyName: string, personName: string, emailType: string) {
    const payload = { jobTitle, companyName, personName, emailType };
    return this.http.post<{ generatedEmails: any[] }>('http://127.0.0.1:8000/generate-ai-emails', payload);
  }
  
  

  // Call the API for preformatted email templates
  getPreformattedEmails(): Observable<any> {
    return this.http.get('http://192.168.0.232:8080/preformatted');
  }


  getCurrentPage(): number {
    return this.currentPageSubject.value;
  }

  setCurrentPage(page: number): void {
    this.currentPageSubject.next(page);
  }

  // searchRecords(filters: any, page: number = 1): Observable<any> {
  //   const api_key = this.authService.getapi_key();
  
  //   if (Object.keys(filters).length > 0) {
  //     // Remove 'api' key from filters
  //     const { api, ...filteredParams } = filters;
      
  //     const params = new HttpParams({
  //       fromObject: { ...filteredParams, page: page.toString() }
  //     });
  
      
  //     const searchUrl = `${this.base_url}search/people/?api=${api_key}`;
  
  //     return this.http.get<any>(searchUrl, { params });
  //   } else {
  //     return of(null);
  //   }
  // }

  logPageActivity(trackingId: string, pageUrl: string): Observable<any> {
    // console.log('Logging activity with:', { trackingId, pageUrl });
 
    let params = new HttpParams()
      .set('trackingId', trackingId)
      .set('pageUrl', pageUrl);
 
    // Ensure you're hitting the correct endpoint
    return this.http.post('http://192.168.0.232:8080/activity', {}, { params: params });
  }
  getBuyingIntentData(page: number, filters: any): Observable<any> {
    const api_key = this.authService.getapi_key();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${api_key}`
    });
    const payload = {
      page: page,
      filters: filters
    };

    const searchURL = `${this.search_url}/buying-intent`; // Full URL to the endpoint
    return this.http.post(searchURL, payload, { headers });
  }
  totalsearch(filters: any, page: number = 1): Observable<any> {
    const api_key = this.authService.getapi_key();
    const staticApiKey = '123456'; // Your static API key
 
    if (Object.keys(filters).length > 0) {
      const requestPayload = {
        api: api_key,
        page,
        filters
      };
 
      const searchUrl = `${this.search_url}/total`;
 
      // Create headers with the static API key
      const headers = new HttpHeaders({
        'X-API-KEY': staticApiKey
      });
 
      // Include headers in the HTTP request
      return this.http.post<any>(searchUrl, requestPayload, { headers });
    } else {
      return of(null);
    }
  }
  private apiKey = localStorage.getItem('api_key');  // Fetch the API key from localStorage
  private hrefs = '  https://exporthistory.onrender.com';
  getExportHistory(): Observable<any> {
    const headers = new HttpHeaders().set('x-api-key', this.apiKey!);
    return this.http.get(`${this.hrefs}/getExportHistory`, { headers });
  }

  savedsearch(filters: any, page: number = 1): Observable<any> {
    const api_key = this.authService.getapi_key();
    const staticApiKey = '123456'; // Your static API key
 
    if (Object.keys(filters).length > 0) {
      const requestPayload = {
        api: api_key,
        page,
        filters
      };
 
      const searchUrl = `${this.search_url}/saved`;
 
      // Create headers with the static API key
      const headers = new HttpHeaders({
        'X-API-KEY': staticApiKey
      });
 
      // Include headers in the HTTP request
      return this.http.post<any>(searchUrl, requestPayload, { headers });
    } else {
      return of(null);
    }
  }

  net_new_search(filters: any, page: number = 1): Observable<any> {
    const api_key = this.authService.getapi_key();
    const staticApiKey = '123456'; // Your static API key
 
    if (Object.keys(filters).length > 0) {
      const requestPayload = {
        api: api_key,
        page,
        filters
      };
 
      const searchUrl = `${this.search_url}/net-new`;
 
      // Create headers with the static API key
      const headers = new HttpHeaders({
        'X-API-KEY': staticApiKey
      });
 
      // Include headers in the HTTP request
      return this.http.post<any>(searchUrl, requestPayload, { headers });
    } else {
      return of(null);
    }
  }  
googleSignin(googleWrapper: any) {  
  googleWrapper.click();
}


// ??not used
saveDataToUserAccount(email: string, selectedRows: any[]): Observable<any> {
  const api_key = this.authService.getapi_key();
  const selectedIds = selectedRows.map(row => row.prospect_link);
  const selectedIdsString = selectedIds.join('&selectedRowIds[]=');

  // const url = `${this.saveDataApiUrl}?dynamic_table=${email}&selectedRowIds[]=${selectedIdsString}`;
  const countUrl = `${this.base_url}search/people/savedata/?api=${api_key}&selectedRowIds[]=${selectedIdsString}`;

  return this.http.post(countUrl, null);
}

saveDataToUserAccount1(selectedRows: any[]): Observable<any> {
  const api_key = this.authService.getapi_key();
  // Ensure you're accessing the correct property for the IDs
  const selectedIds = selectedRows.map(row => row.pid || row.id); // Use pid or id based on your data

  const url = `${this.base_url}search/people/savedata/`;

  const params = new HttpParams()
    .set('data', 'save')
    .set('selectedRowIds', JSON.stringify(selectedIds))
    .set('api', api_key || '');

  console.log('Selected Rows in Service:', selectedIds);
  
  return this.http.post(url, null, { params });
}





exportToCSV(filters: any, selectedRows: any[]): Observable<any> {
  const api_key = this.authService.getapi_key();
  const selectedIds = selectedRows.map(row => row.id);
  const exportCsvUrl = `${this.base_url}search/people/export/`;

  // Construct the request body
  const requestBody = {
    export: 'csv',
    selectedIds: selectedIds,
    api: api_key,
    ...filters
  };
  return this.http.post(exportCsvUrl, requestBody, {
    responseType: 'text'
  });
}
// const exportCsvUrl = `${this.search_url}/people/exportAll/`;




exportToCSFROMSAVED(filters: any, selectedRows: any[]): Observable<any> {
  const api_key = this.authService.getapi_key();
  const selectedIds = selectedRows.map(row => row.id);
  const exportCsvUrl = `${this.base_url}search/people/exportsave/`;

  // Construct the request body
  const requestBody = {
    export: 'csv',
    selectedIds: selectedIds,
    api: api_key,
    ...filters
  };
  return this.http.post(exportCsvUrl, requestBody, {
    responseType: 'text'
  });
}


// exportToCSV2(filters: any, selectedRows1: any[]): Observable<any> {
//   const api_key = this.authService.getapi_key();
//   const selectedIds = selectedRows1.map(row => row.id);
//   const params = {
//     ...filters,
//     export: 'csv',
//     selectedIds: JSON.stringify(selectedIds),
//     api: api_key
//   };
//   const exportCsvUrl = `https://api.vectordb.app/v1/search/people/export/id.php?`;
//   return this.http.get(exportCsvUrl, {
//     params: params,
//     responseType: 'text'
//   });
// }

  // getSavedData(email: string): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.base_url}search/people?user_email=${email}`);
  // }
  
//  showing data in first page
  getSavedDataForUser(page: number = 1): Observable<any> {
    const api_key = this.authService.getapi_key();

    if (!api_key) {
      console.error('User email not found.');
      return of(null);
    }

    const params = new HttpParams({
      fromObject: { api: api_key, page: page.toString() }
    });

    return this.http.get<any>(this.base_url + 'search/people/saved/?', { params });
  }

// it sends the registration email to user
  registerUser(user: any): Observable<any> {
    return this.http.post(this.api_Url + 'signup_process.php', JSON.stringify(user), {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      responseType: 'text'
    })
    .pipe(
      catchError((error: { status: number; }) => {
        
        if (error.status === 404) {
          console.error('User not found.', error);
        } else if (error.status === 409) {
          console.error('Conflict: Email already exists. Please use a different email address.', error);
        } else {
          console.error('Error registering user:', error);
        }
        return throwError(error); 
      })
    );
  }
  
  loginUser(user: any): Observable<any> {
    return this.http.post(this.base_url + 'auth/login/', user, { responseType: 'json' })
      .pipe(
        tap((response: any) => {
          this.authService.setToken(response.token);
          localStorage.setItem('user_id', response.id);
          localStorage.setItem('email', response.email);
         
        })
      );
  }

  resetPassword(email: string): Observable<any> {
    const data = JSON.stringify({ email: email });
    return this.http.post<any>(`https://auth.vectordb.app/reset-password/`, data, {
      headers: {
        'Content-Type': 'application/json' 
      }
    });
  }
  
// shows user details 
  getAllDetailsForUser(prospectLink: string): Observable<any> {
    return this.http.get(`${this.base_url + 'search/people/getUserDetails/'}?prospect_link=${prospectLink}`);
  }

  

  // getData(): Observable<string[]> {
  //   return this.http.get('https://api.vectordb.app/v1/search/people/count/?')
  //     .pipe(
  //       map((response: any) => {
  //         return Object.keys(response).map(key => response[key]['name']);
  //       })
  //     );
  // }


  // getCounts(): Observable<any> {
  //   const api_key = this.authService.getapi_key();
  //   const countUrl = `${this.base_url}search/people/count/?api=${api_key}`;
  //   return this.http.get<any>(countUrl);
  // }

  // getTimestampData(page: number = 1): Observable<any> {
  //   const api_key = this.authService.getapi_key();

  //   if (!api_key) {
  //     console.error('User email not found.');
  //     return of(null);
  //   }

  //   const params = new HttpParams({
  //     fromObject: { api: api_key, page: page.toString() }
  //   });

  //   const url = `${this.base_url}enrichment/userGraph/`; 

  //   return this.http.get<any>(url, { params });
  // }

  // getTopCountriesData(): Observable<any[]> {
  //   const url = `${this.base_url}enrichment/country/`;  
  //   return this.http.get<any[]>(url);
  // }

  // getTopJobTitlesData(): Observable<any[]> {
  //   const url = `${this.base_url}enrichment/jobT/`;  
  //   return this.http.get<any[]>(url);
  // }
// 


// For saving the searches in list
saveSearch(filter_name: string, filters: any): Observable<any> {
  const api_key = this.authService.getapi_key();
  const url = `https://api.vectordb.app/v1/search/people/save-filters/?api=${api_key}&filter_name=${filter_name}`;
  const body = {
    filters: filters 
  };

  return this.http.post<any>(url, body, {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  });
}


// getting the list of saved searches
getSavedFilters(): Observable<any[]> {
  const api_key = this.authService.getapi_key();
  const Url = `https://api.vectordb.app/v1/search/people/getSaveFilter/?api=${api_key}`;

  return this.http.get<any[]>(Url);
}


// saved records counts
getsavedcount():Observable<any[]> {
  const api_key = this.authService.getapi_key();
  const Url = `https://api.datagateway.in/v1/search/people/count/saved/?api=${api_key}`;

  return this.http.get<any[]>(Url);
}

// exportToCSV1(filters: any, selectedRows: any[]): Observable<any> {
//   const api_key = localStorage.getItem('api_key');
//   let params: any = {
//     ...filters,
//     export: 'csv',
//     api: api_key
//   };

//   if (selectedRows.length > 0) {
//     const selectedIds = selectedRows.map(row => row.id);
//     params.selectedIds = JSON.stringify(selectedIds);
//   }

//   const exportCsvUrl = `${this.base_url}search/people/exportAll/`;

//   return this.http.get(exportCsvUrl, {
//     params: params,
//     responseType: 'text'
//   }).pipe(
//     catchError(error => {
//       console.error('Error exporting data:', error.message);
//       console.error('Detailed Error:', error);
//       return throwError(error);
//     })
//   );
//  }


// for sending emails
 private apiUrl = 'https://api.vectordb.app/v1/email-enrichment/send-email/';
 sendEmail(emailData: any): Observable<any> {
  return this.http.post<any>(this.apiUrl, emailData);
}

private emailurl = 'https://api.vectordb.app/v1/email-enrichment/get-email/';
sendEmailDetails(data: any): Observable<any> {
  return this.http.post(this.emailurl, data);
}

private fetchUrl = 'https://api.vectordb.app/v1/email-enrichment/fetch-email/';
fetchEmailDetails(apiKey: string): Observable<any> {
  const api_key = this.authService.getapi_key();
  const body = { api: api_key };
  return this.http.post(this.fetchUrl, body);
}

private emailUpdateUrl = 'https://api.vectordb.app/v1/email-enrichment/update-email/';
updateEmailDetails(data: any): Observable<any> {
    return this.http.post(this.emailUpdateUrl, data);
  }

private fetchInbox = 'https://api.vectordb.app/v1/email-enrichment/fetch-inbox/';
fetchInboxDetails(apiKey: string): Observable<any> {
  const api_key = this.authService.getapi_key();
  const body = { api: api_key };
  return this.http.post(this.fetchInbox, body);
}

private baseUrl = 'https://api.vectordb.app/v1/email-enrichment/get-service-providers/';
getServiceProviderData(serviceProvider: string): Observable<any> {
  // Construct the URL based on whether the serviceProvider is provided
  const url = serviceProvider
    ? `${this.baseUrl}?service_provider=${encodeURIComponent(serviceProvider)}`
    : `${this.baseUrl}?service_provider=`;
  
  return this.http.get<any>(url);
}

private bulkemail='https://api.vectordb.app/v1/email-enrichment/bulkemail/'
sendBulkEmails(data: any): Observable<any> {
  return this.http.post(this.bulkemail, data);
}

private apisUrl = ' http://192.168.0.6:3000/make-call';
makeCall(primaryNumber: string, targetNumber: string): Observable<any> {
  return this.http.post(this.apisUrl, { primaryNumber, targetNumber });
  
}
// http://192.168.0.232:8080/preformatted

private notificationSubject = new Subject<void>();
  notification$ = this.notificationSubject.asObservable();

  // Trigger the notification event
  triggerNotification() {
    this.notificationSubject.next();
  }
  logout(): Observable<any> {
    const email = localStorage.getItem('email');
    return this.http.post<any>(this.base_url + 'auth/login/', { logout: true, email: email });
  }

  
  jobChanges(filters: any, page: number = 1): Observable<any> {
    const api_key = this.authService.getapi_key();
    const staticApiKey = '123456'; // Your static API key
  
    if (Object.keys(filters).length > 0) {
      const requestPayload = {
        api: api_key,
        page,
        filters
      };
  
      const searchUrl = `${this.search_url}/changes`;
  
      // Create headers with the static API key
      const headers = new HttpHeaders({
        'X-API-KEY': staticApiKey
      });
  
      // Include headers in the HTTP request
      return this.http.post<any>(searchUrl, requestPayload, { headers });
    } else {
      return of(null);
    }
  }



}



