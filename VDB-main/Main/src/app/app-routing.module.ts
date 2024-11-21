import { Component, NgModule } from '@angular/core';
// import { ROUTES, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './landingpage/login/login.component';
import { SignupComponent } from './landingpage/signup/signup.component';
import { AppComponent } from './app.component';
import { DemoComponent } from './landingpage/header/demo.component';
import { FooterComponent } from './landingpage/footer/footer.component';
import { MainComponent } from './landingpage/main/main.component';
import { RequestDemoComponent } from './landingpage/request-demo/request-demo.component';
import { CarrierpageComponent } from './landingpage/carrierpage/carrierpage.component';
import { MoreInfopageComponent } from './landingpage/more-infopage/more-infopage.component';
import { HomeComponent } from './mainpage/home/home.component';
import { FirstpageComponent } from './mainpage/sidenavfolders/firstpage.component';
import { SearchComponent } from './mainpage/sidenavfolders/search/search.component';
import { PeopleComponent } from './mainpage/sidenavfolders/search/people/people.component';
import { CompaniesComponent } from './mainpage/sidenavfolders/search/companies/companies.component';
import { SavedListComponent } from './mainpage/sidenavfolders/search/saved-list/saved-list.component';
import { filter } from 'rxjs';
import { FiltersComponent } from './mainpage/sidenavfolders/search/filters/filters.component';
import { SavedSearchesComponent } from './mainpage/sidenavfolders/search/saved-searches/saved-searches.component';
import { SavedComponent } from './mainpage/sidenavfolders/search/people/saved/saved.component';
import { TotalComponent } from './mainpage/sidenavfolders/search/people/total/total.component';
import { NetNewComponent } from './mainpage/sidenavfolders/search/people/net-new/net-new.component';
import { RigthSidenetnewSavedTotalComponent } from './mainpage/sidenavfolders/search/people/rigth-sidenetnew-saved-total/rigth-sidenetnew-saved-total.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { AuthGuard } from './auth-guard.guard';
import { UserDetailsComponent } from './mainpage/sidenavfolders/search/people/total/user-details/user-details.component';
import { UserDetails2Component } from './mainpage/sidenavfolders/search/people/total/user-details2/user-details2.component';
import { FilterCompaniesComponent } from './filter-companies/filter-companies.component';
import { TotalCompaniesComponent } from './filter-companies/total-companies/total-companies.component';
import { CompaniesnetnewComponent } from './filter-companies/companiesnetnew/companiesnetnew.component';
import { RightSideForCompaniesComponent } from './filter-companies/right-side-for-companies/right-side-for-companies.component';
import { DataEnrichmentComponent } from './data-enrichment/data-enrichment.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HowCanwehelpComponent } from './how-canwehelp/how-canwehelp.component';
import { HelpcomponentComponent } from './helpcomponent/helpcomponent.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { RouterModule, Routes, ROUTES } from '@angular/router';
import { EmailDialogComponent } from './email-dialog/email-dialog.component';
import { InboxEmailComponent } from './inbox-email/inbox-email.component';
import { SequenceComponent } from './sequence/sequence.component';
import { EmailLinkDialogComponent } from './email-link-dialog/email-link-dialog.component';
import { EmaildialogueComponent } from './emaildialogue/emaildialogue.component';
import { CatagoryDataEnrichmentComponent } from './catagory-data-enrichment/catagory-data-enrichment.component';
import { EmailComponent } from 'src/email/email.component';
import { JobChangesEnrichmentComponent } from './job-changes-enrichment/job-changes-enrichment.component';
import { MissingemailComponent } from 'src/missingemail/missingemail.component';
import { ExporthistoryComponent } from 'src/exporthistory/exporthistory.component';
const ROUTES_PROVIDERS = [
  {
    provide: ROUTES,
    useValue: [],
    multi: true
  },
];
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
 
  { path: 'requestDemo', component: RequestDemoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'demo', component: DemoComponent },
  { path: 'footer', component: FooterComponent },
  { path: 'main', component: MainComponent },
  { path: 'carrier', component: CarrierpageComponent },
  { path: 'jobdetails/:id', component: MoreInfopageComponent },
  {path:'login/forgotPassword',component:ForgotPasswordComponent},
  // {path:'job-changes',component:JobChangesEnrichmentComponent},
  {
    path: 'home',
    component: HomeComponent,canActivate: [AuthGuard],
    children: [
      {path:'job-changes',component:JobChangesEnrichmentComponent},
    {path:'search/people/exporthistory',component:ExporthistoryComponent},
      {path:'missingEmail',component:MissingemailComponent},
      {path:'myProfile',component:MyProfileComponent},
     
      { path: 'firstPage', component: FirstpageComponent },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'firstPage',
      },
      {path:'dataEnrichment',component:DataEnrichmentComponent} ,
   
      { path: 'sendEmail', component: EmailDialogComponent },
      { path: 'linkEmail', component: EmailLinkDialogComponent },
      { path: 'emaildialogue', component: EmaildialogueComponent },
      { path: 'sequence', component: SequenceComponent },
      { path: 'inbox', component: InboxEmailComponent },
      {path:'email',component:EmailComponent},
      {
        path: 'search',
        component: SearchComponent,
        children: [
          { path: '', redirectTo: 'people', pathMatch: 'full' },
     
          {path:'people',component:PeopleComponent},
          { path: 'companies',component:CompaniesComponent,children:[
           
              { path: 'left/filterCompanies', component: FilterCompaniesComponent },

              { path: 'left/savedSearches', component: SavedSearchesComponent },
              { path: 'right/saved', component: SavedComponent },
              { path: 'right/totall', component: TotalCompaniesComponent },
              { path: 'right/netNeww', component: CompaniesnetnewComponent },
          
              {
                path: 'right',
                component: RightSideForCompaniesComponent,
                children: [
                  { path: 'right/saved', component: SavedComponent },
                  { path: 'totall', component: TotalCompaniesComponent},
                  { path: 'netNeww', component: CompaniesnetnewComponent }
                ],
              
              },
             
            ],
          },
          {path:'savedList',component:SavedListComponent},
          {
            path: 'people',
            component: PeopleComponent,
            children: [
          
              { path: 'left/filter', component: FiltersComponent },
              { path: 'left/savedSearches', component: SavedSearchesComponent },
              { path: 'right/saved', component: SavedComponent },
              { path: 'right/total', component: TotalComponent },
              { path: 'right/netNew', component: NetNewComponent },
              // {path:'exporthistory',component:ExporthistoryComponent},
              {
                path: 'right',
                component: RigthSidenetnewSavedTotalComponent,
                children: [
                  {path: 'right/saved', component: SavedComponent },
                  {path: 'total', component: TotalComponent},
                  {path: 'netNew', component: NetNewComponent },
                  {path: 'help', component: HelpcomponentComponent },
                  {path: 'chatbot', component: ChatbotComponent },
                  
                ],
              
              },
             
            ],
          },
        ],
        
      },
    ],
  },
 
  { path: 'savedList', component: SavedListComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [ROUTES_PROVIDERS]
})
export class AppRoutingModule {}
