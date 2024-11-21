import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DemoComponent } from './landingpage/header/demo.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { FooterComponent } from './landingpage/footer/footer.component';
import { MainComponent } from './landingpage/main/main.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './landingpage/login/login.component';
import { SignupComponent } from './landingpage/signup/signup.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import{MatSnackBarModule} from '@angular/material/snack-bar';
import { RequestDemoComponent } from './landingpage/request-demo/request-demo.component';
import { CarrierpageComponent } from './landingpage/carrierpage/carrierpage.component';
import {MatMenuModule} from '@angular/material/menu';
import { ApplypageComponent } from './landingpage/applypage/applypage.component';
import { MoreInfopageComponent } from './landingpage/more-infopage/more-infopage.component';
import { FilterPipe } from './filter.pipe';
import { MatSelectModule } from '@angular/material/select';
import { HomeComponent } from './mainpage/home/home.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { FirstpageComponent } from './mainpage/sidenavfolders/firstpage.component';
import { SearchComponent } from './mainpage/sidenavfolders/search/search.component';
import { PeopleComponent } from './mainpage/sidenavfolders/search/people/people.component';
import { CompaniesComponent } from './mainpage/sidenavfolders/search/companies/companies.component';
import { SavedListComponent } from './mainpage/sidenavfolders/search/saved-list/saved-list.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import { FiltersComponent } from './mainpage/sidenavfolders/search/filters/filters.component';
import { SavedSearchesComponent } from './mainpage/sidenavfolders/search/saved-searches/saved-searches.component';
import { SavedComponent } from './mainpage/sidenavfolders/search/people/saved/saved.component';
import { NetNewComponent } from './mainpage/sidenavfolders/search/people/net-new/net-new.component';
import { TotalComponent } from './mainpage/sidenavfolders/search/people/total/total.component';
import { RigthSidenetnewSavedTotalComponent } from './mainpage/sidenavfolders/search/people/rigth-sidenetnew-saved-total/rigth-sidenetnew-saved-total.component';
import { DataFilterService } from 'src/data-filter.service';
import { SearchPeopleComponent } from './search-people/search-people.component';
import {MatCardModule} from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ChangeEmailComponent } from './my-profile/change-email/change-email.component';
import { ChangePasswordComponent } from './my-profile/change-password/change-password.component';
import { NotificationComponent } from './notification/notification.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { UserDetailsComponent } from './mainpage/sidenavfolders/search/people/total/user-details/user-details.component';
import { UserDetails2Component } from './mainpage/sidenavfolders/search/people/total/user-details2/user-details2.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ServiceService } from './landingpage/services/service.service';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from '@abacritt/angularx-social-login';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FilterCompaniesComponent } from './filter-companies/filter-companies.component';
import { TotalCompaniesComponent } from './filter-companies/total-companies/total-companies.component';
import { RightSideForCompaniesComponent } from './filter-companies/right-side-for-companies/right-side-for-companies.component';
import { CompaniesnetnewComponent } from './filter-companies/companiesnetnew/companiesnetnew.component';
import { LoadingBarModule } from '@ngx-loading-bar/core'
import { JoyrideModule } from 'ngx-joyride';
import { GuideComponent } from './guide/guide.component';
import { GooglesignupComponent } from './googlesignup/googlesignup.component';
import { RouteReuseStrategy } from '@angular/router';
import { DataEnrichmentComponent } from './data-enrichment/data-enrichment.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HowCanwehelpComponent } from './how-canwehelp/how-canwehelp.component';
import {TableModule} from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { EmaildialogueComponent } from './emaildialogue/emaildialogue.component';
import { GuideForCompanyNameComponent } from './guide-for-company-name/guide-for-company-name.component';
import { UserDetailsForSavedComponent } from './user-details-for-saved/user-details-for-saved.component';
import { UserDetailsForNetnewComponent } from './user-details-for-netnew/user-details-for-netnew.component';
import { NameSavedsearchComponent } from './name-savedsearch/name-savedsearch.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { HelpcomponentComponent } from './helpcomponent/helpcomponent.component';
// import { ApiKeyInterceptor } from './interceptor';
import { DialogueSaveComponent } from './dialogue-save/dialogue-save.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmailDialogComponent } from './email-dialog/email-dialog.component';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InboxEmailComponent } from './inbox-email/inbox-email.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { EmailLinkDialogComponent } from './email-link-dialog/email-link-dialog.component';
import { BulkInboxEmailComponent } from './bulk-inbox-email/bulk-inbox-email.component';
// import { DatePipe } from '@angular/common'
import { NgxPaginationModule } from 'ngx-pagination';
import { CatagoryDataEnrichmentComponent } from './catagory-data-enrichment/catagory-data-enrichment.component';
import { EmailComponent } from 'src/email/email.component';
import { ExporthistoryComponent } from 'src/exporthistory/exporthistory.component';
import { ExporthistorydialogueComponent } from 'src/exporthistorydialogue/exporthistorydialogue.component';
import { sequence } from '@angular/animations';
import { SequenceComponent } from './sequence/sequence.component';
import { EmailselectionComponent } from 'src/emailselection/emailselection.component';
import { AiemailComponent } from 'src/aiemail/aiemail.component';
import { AddToSequenceComponent } from 'src/add-to-sequence/add-to-sequence.component';
@NgModule({
  declarations: [
    AppComponent,
    DemoComponent,
    FooterComponent,
    MainComponent,
    LoginComponent,
    SignupComponent,
    RequestDemoComponent,
    CarrierpageComponent,
    ApplypageComponent,
    MoreInfopageComponent,
    FilterPipe,
    HomeComponent,
    FirstpageComponent,
    SearchComponent,
    PeopleComponent,
    CompaniesComponent,
    SavedListComponent,
    FiltersComponent,
    SavedSearchesComponent,
    SavedComponent,
    NetNewComponent,
    TotalComponent,
    RigthSidenetnewSavedTotalComponent,
    SearchPeopleComponent,
    MyProfileComponent,
    ChangeEmailComponent,
    ChangePasswordComponent,
    NotificationComponent,
    UserDetailsComponent,
    UserDetails2Component,
    FilterCompaniesComponent,
    TotalCompaniesComponent,
    RightSideForCompaniesComponent,
    CompaniesnetnewComponent,
    GuideComponent,
    GooglesignupComponent,
    DataEnrichmentComponent,
    ForgotPasswordComponent,
    HowCanwehelpComponent,
    EmaildialogueComponent,
    GuideForCompanyNameComponent,
    UserDetailsForSavedComponent,
    UserDetailsForNetnewComponent,
    NameSavedsearchComponent,
    ChatbotComponent,
    HelpcomponentComponent,
    DialogueSaveComponent,
    EmailDialogComponent,
    InboxEmailComponent,
    EmailComponent,
    ExporthistoryComponent,
    ExporthistorydialogueComponent,
    SequenceComponent,
    EmailselectionComponent,
    AiemailComponent,
    AddToSequenceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatIconModule,
    MatIconModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatNativeDateModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatBadgeModule,
    MatFormFieldModule,
    HttpClientModule,
    MatDialogModule,
    MatMenuModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatDividerModule,
    MatListModule,
    MatSnackBarModule,
    MatInputModule,
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatChipsModule,
    MatAutocompleteModule,FormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatChipsModule,
    MatInputModule,
    SocialLoginModule,
    LoadingBarModule,
    JoyrideModule.forRoot(),
    NgxChartsModule,
    TableModule,
    TreeTableModule,
    ScrollingModule,
    MatToolbarModule,
    MatTooltipModule,
    CKEditorModule,
    CKEditorModule,
    NgxPaginationModule
    
  ],
  
  providers: [
    DataFilterService,
    ServiceService,
    { provide: RouteReuseStrategy, useClass: GooglesignupComponent },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '722454344204-4on4luc4s799mpb77gkrhr0p3ebuq8n8.apps.googleusercontent.com'
            )
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    },
    DatePipe // Correct way to add DatePipe
  ],
  
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
