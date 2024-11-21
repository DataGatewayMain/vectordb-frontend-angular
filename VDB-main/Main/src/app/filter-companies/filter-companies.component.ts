import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatChipInputEvent, MatChipEditedEvent } from '@angular/material/chips';
import { MatOptionSelectionChange } from '@angular/material/core';
import { startWith, map } from 'rxjs';
import { FilterService } from '../mainpage/sidenavfolders/search/filters/filter.service';
import { GetDataService } from '../mainpage/sidenavfolders/search/people/get-data.service';
import { FilterCompaniesService } from './filter-companies.service';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { driver } from 'driver.js';
import { NameSavedsearchComponent } from '../name-savedsearch/name-savedsearch.component';
import { StateService } from '../state.service';
interface Fruit {
  name: string[]; // Assuming 'name' can be an array of strings
} 
@Component({
  selector: 'app-filter-companies',
  templateUrl: './filter-companies.component.html',
  styleUrls: ['./filter-companies.component.css']
})
export class FilterCompaniesComponent {
  selectedJobTitles: string[] = []; 
  jobname: string[] = []; 
  industryFilter: string = '';
  jobFunctionFilter: string = '';
  countryFilter: any;
  userEmail:any
  includecountry:string[]=[]
  // these names should match the backend properties name
  
  filters: any = {
    include_country: '', 
    include_city:'' ,
    include_state:'',
    include_Zip_Code:'',
    include_region:'',
    include_Industry:'',
    include_job_title: '',
    include_First_Name: '',
    include_company_name:'',
    include_company_domain:'',
    include_Employee_Size: [],
    exclude_Employee_Size: [],
    exclude_job_title :'',
    exclude_company_domain:'',
    exclude_company_name:'',
    exclude_country:'',
    include_job_function:[],
    include_job_level:[],
 
  };



includeCompanyName:string[]=[]
includeCity:string[]=[]
includeState:string[]=[]
includeIndustry:string[]=[]
includeRegion:string[]=[]
// includeZipcode:number[]=[]
includeJobTitles: string[] = [];
includeCompanyDomain:string[]=[]
// properties for exclude fields for chips
excludeJobTitles: string[] = [];
excludeCountry: string[] = [];
excludeCompanyName: string[] = [];
excludeCompanyDomain:string[]=[]
  checkboxValues: { [key: string]: boolean } = {
    'Director': false,
    'Manager': false,
    'VP Level': false,
    'Vice President': false,
    'C Level': false,
    'Founder': false
  };
  service: any;
 
  
  getCheckboxKeys(): string[] {
    return Object.keys(this.checkboxValues);
  }

getSelectedJobTitlesCount(): number {
  // Implement your logic to calculate the count of selected job titles
  return this.selectedJobTitles ? this.selectedJobTitles.length : 0;
}
  

  results: any = [];
  currentPage: number = 1;

  companytitle: Set<string> = new Set<string>(); 
  resultsToShow: any;
  selectedRows: any[] = [];

  selectedEmployeeSizes: string[] = [];
  constructor(
    private apiService: GetDataService,
    private filterService: FilterService,
    private authService:AuthService,
    private fb : FormBuilder,
    private http: HttpClient,
    private dialog:MatDialog,
    private route: ActivatedRoute,
    private filterstateservice:StateService
  ) {
    
    this.jobFunctionControl.valueChanges.subscribe(selectedFunctions => {
      this.selectedJobFunctions = selectedFunctions;
      this.updateFilters()
   
    });
    this.employeeSizeControl.valueChanges.subscribe(selectedSizes => {
      this.selectedEmployeeSizes = selectedSizes;
      this.updateFilters()
    });
   this.jobLevelControl.valueChanges.subscribe(level=>{
    this.selectedJobLevels=level
    this.updateFilters()
  
   })
  }
  selectedName: any;
  ngOnInit(): void {
    

    this.filters = {};
    this.filterService.filters$.subscribe((filters) => {
      this.filters = filters;
      this.search();
    });

    
    this.search();
    this.fetchSuggestions();
    this.fetchCountrySuggestions();
    this.fetchJobTitleSuggestions();
    this.fetchexcludeJobTitleSuggestions()
    this.fetchexcludecountrySuggestions()
    this.fetchexcludeCompanySuggestions()
    this.fetchCitySuggestions()
    this.fetchIndustrySuggestions()
    this.fetchRegionSuggestions()
    this.fetchStateSuggestions()
    this.fetchZipCodeSuggestions()

    const storedCompanyName = localStorage.getItem('companyNameFilter');
    const storedExlcudeCompanyName = localStorage.getItem('ExcludecompanyNameFilter');
    const storedcountry=localStorage.getItem('country')
    const storedCompanyDomain=localStorage.getItem('companyDomain')
    const storedExkludeCompanyDomain=localStorage.getItem('excludeCompanyDomain')
    const firstName=localStorage.getItem('include_First_Name')
    const storedJobTitle=localStorage.getItem('jobtitle')
    const storedExcludeJobTitle=localStorage.getItem('excludeJobtitle')
    const storedjobLevel=localStorage.getItem('jobLevel')
    const storedExcludeCountry=localStorage.getItem('excludeCountry')
    const storedjobaFunction=localStorage.getItem('jobfunction')
    const storedEmployeSize=localStorage.getItem('empSize')
    const storedCity=localStorage.getItem('city')
    if (storedCity) {
      this.includeCity = JSON.parse(storedCity);
    }

    const storedRegion=localStorage.getItem('region')
    if (storedRegion) {
      this.includeRegion = JSON.parse(storedRegion);
    }
    const storedIndustry=localStorage.getItem('industry')
    if (storedIndustry) {
      this.includeIndustry = JSON.parse(storedIndustry);
    }

    const storedState=localStorage.getItem('state')
    if (storedState) {
      this.includeState = JSON.parse(storedState);
    }
    const storedZipcode=localStorage.getItem('zipCode')
    if (storedZipcode) {
      this.includeZipcode = JSON.parse(storedZipcode);
    }
    if (storedCompanyName) {
      this.includeCompanyName = JSON.parse(storedCompanyName);
    }
    if (storedExlcudeCompanyName) {
      this.excludeCompanyName = JSON.parse(storedExlcudeCompanyName);
    }
    if (storedcountry) {
      this.includecountry = JSON.parse(storedcountry);
    }
    if (storedCompanyDomain) {
      this.includeCompanyDomain = JSON.parse(storedCompanyDomain);
    }
    if (storedExkludeCompanyDomain

    ) {
      this.excludeCompanyDomain = JSON.parse(storedExkludeCompanyDomain);
    }
    if (firstName

    ) {
      this.filters.include_First_Name = JSON.parse(firstName);
    }
    if (storedJobTitle

    ) {
      this.includeJobTitles = JSON.parse(storedJobTitle);
    }

    if (storedExcludeJobTitle

    ) {
      this.excludeJobTitles = JSON.parse(storedExcludeJobTitle);
    }

    if (storedjobLevel
    ) {
      this.selectedJobLevels = JSON.parse(storedjobLevel);
    }
    if (storedjobaFunction
    ) {
      this.selectedJobFunctions = JSON.parse(storedjobaFunction);
    }

    if (storedExcludeCountry

    ) {
      this.excludeCountry = JSON.parse(storedExcludeCountry);
    }
    const savedSelectedEmployeeSizes = localStorage.getItem('selectedEmployeeSizes');
    if (savedSelectedEmployeeSizes) {
      this.selectedEmployeeSizes = JSON.parse(savedSelectedEmployeeSizes);
      this.employeeSizeControl.setValue(this.selectedEmployeeSizes);
    }
    const storedJobLevels = localStorage.getItem('selectedJobLevels');
    if (storedJobLevels) {
      this.selectedJobLevels = JSON.parse(storedJobLevels);
      this.jobLevelControl.setValue(this.selectedJobLevels);
    }
  
    const storedJobFunctions = localStorage.getItem('selectedJobFunctions');
    if (storedJobFunctions) {
      this.selectedJobFunctions = JSON.parse(storedJobFunctions);
      this.jobFunctionControl.setValue(this.selectedJobFunctions);
    }  
    const savedFilters = localStorage.getItem('savedFilters');
    if (savedFilters) {
      this.filters = JSON.parse(savedFilters);
      console.log('Retrieved filters from local storage:', this.filters);
      this.applyFilter();
    }
  
  this.applyFilter()
   

    
    // this.route.queryParams.subscribe(params => {
    //   const filters = params['filters'] ? JSON.parse(params['filters']) : {};
    //   this.filters = filters;
    //   console.log('Retrieved filters from query params:', filters);

    //   // Update the filters in the FilterService
    //   this.filterService.updateFilters(filters);
    // });

   
    // this.filterService.filters$.subscribe(updatedFilters => {
    //   this.filters = updatedFilters;
    //   console.log('Updated filters in FiltersComponent:', updatedFilters);
    // });

  }

  

  // Table data
  tableData: any[] = []; 
  filteredData: any[] = [];
 
toggleCheckbox(value: string, type: string): void {
  // Use the appropriate property based on the type
  const currentValue = type === 'Employee_Size' ? this.filters.include_Employee_Size : this.filters.include_job_level || this.filters.include_job_function;
  // Check if currentValue is defined before using it
  const values = (currentValue || '').split(',');

  if (values.includes(value)) {
    const index = values.indexOf(value);
    values.splice(index, 1);
  } else {
    values.push(value);
  }

  if (type === 'Employee_Size') {
    this.filters.include_Employee_Size = values.join(',');
  } else {
    // Assuming 'Job_Level' and 'Job_Function' have the same structure
    this.filters[type === 'Job_Level' ? 'include_job_level' : 'include_job_function'] = values.join(',');
  }

  this.applyFilter();
  this.updateLocalStorage()
}

isCheckboxChecked(value: string, type: string): boolean {
  let values: string[] = [];

  if (type === 'Employee_Size') {
    values = (this.filters && this.filters.include_Employee_Size || '').split(',');
  } else if (type === 'Job_Level' || type === 'job_function') {
    const includeProperty = type === 'Job_Level' ? 'include_job_level' : 'include_job_function';
    values = (this.filters && this.filters[includeProperty] || '').split(',');
  } 
  this.updateLocalStorage()
  return values.includes(value);
}

togglePanel(panelId: string): void {
  const panel = document.getElementById(panelId);
  if (panel) {
    // Consider using Angular data binding to control visibility
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
  }
}

addOnBlur = true;
// announcer = inject(LiveAnnouncer);
readonly separatorKeysCodes: number[] = [ENTER, COMMA];
readonly separatorKeysCodes1:number[]=[ENTER,COMMA];
readonly separatorKeysCodes2:number[]=[ENTER,COMMA];
readonly separatorKeysCodes3:number[]=[ENTER,COMMA];
readonly separatorKeysCodes4:number[]=[ENTER,COMMA];
// include job title


// for exclude the job title


removeExcludeJobTitle(jobTitle: string): void {
  const index = this.excludeJobTitles.indexOf(jobTitle);
  if (index !== -1) {
    this.excludeJobTitles.splice(index, 1);
    this.updateFilters();
  }
}

 
 removeExcludeCompanyName(companyName: string): void {
   const index = this.excludeCompanyName.indexOf(companyName);
   if (index !== -1) {
     this.excludeCompanyName.splice(index, 1);
     this.updateFilters();
     this.updateLocalStorage()
   }
 }


removeExcludeCountry(country: string): void {
  const index = this.excludeCountry.indexOf(country);
  if (index !== -1) {
    this.excludeCountry.splice(index, 1);
    this.updateFilters();
    this.updateLocalStorage()
  }
}

applyFilter(): void {
  // Convert arrays to strings before updating the filters
  this.filters.include_job_title = this.includeJobTitles.join(', ');
  this.filters.include_country = this.includecountry.join(', ');

  this.filters.include_company_domain = this.includeCompanyDomain.join(', ');
  this.filters.include_company_name = this.includeCompanyName.join(', ');
  this.filters.include_state = this.includeState.join(', ');
this.filters.include_city=this.includeCity.join(', ')
this.filters.include_region=this.includeRegion.join(', ')

this.filters.include_Industry=this.includeIndustry.join(', ')
this.filters.include_Zip_Code=this.includeZipcode.join(', ')


  // Apply the filter on the table data
  this.filters.include_Employee_Size = this.selectedEmployeeSizes.join(', ');
  this.filters.include_job_function = this.selectedJobFunctions.join(', ');
  this.filters.include_job_level = this.selectedJobLevels.join(', ');

  // Update the filters in the service
  this.filterService.updateFilters(this.filters);

  // Call search after updating filters
  this.search();
 this.updateLocalStorage()
 
}

search(): void {
  const userEmail = this.authService.getUserEmail();

  const filtersApplied = Object.values(this.filters).some(
    (value) => value !== null && value !== undefined && value !== ''
  );

  if (!filtersApplied) {
    // Clear results and selected rows when no filters are applied
    this.results = [];
    this.selectedRows = [];

    return; 
  }


}


private updateFilters(): void {
  // Update include_job_title and  in filters
  this.filters.include_job_title = this.includeJobTitles.join(', ');
  this.filters.include_country = this.includecountry.join(', ');
  this.filters.include_company_name=this.includeCompanyName.join(', ');
  this.filters.include_city=this.includeCity.join(', ');
  this.filters.include_region=this.includeRegion.join(', ');
  this.filters.include_Industry=this.includeIndustry.join(', ');
  this.filters.include_state=this.includeState.join(', ');
this.filters.include_Zip_Code=this.includeZipcode.join(', ')
  this.filters.include_company_domain=this.includeCompanyDomain.join(', ');
  this.filters.exclude_job_title = this.excludeJobTitles.join(', ');
  this.filters.exclude_company_name=this.excludeCompanyName.join(', ');
  this.filters.exclude_country=this.excludeCountry.join(', ');
  this.filters.exclude_company_domain=this.excludeCompanyDomain.join(', ')
    // Update include_employee_size filter
  this.filters.include_Employee_Size = this.selectedEmployeeSizes.join(', ');
  this.filters.include_job_function=this.selectedJobFunctions.join(', ');
  this.filters.include_job_level=this.selectedJobLevels.join(', ');
  this.applyFilter(); 
  this.formatChipsData()
  this.updateLocalStorage()
}
formatChipsData(): void {
  this.filters.include_job_title = this.includeJobTitles.join(', ');
  this.filters.include_country = this.includecountry.join(', ');
  this.filters.include_company_name=this.includeCompanyName.join(', ');
  this.filters.include_city=this.includeCity.join(', ');
  this.filters.include_region=this.includeRegion.join(', ');
  this.filters.include_Industry=this.includeIndustry.join(', ');
  this.filters.include_state=this.includeState.join(', ');
this.filters.include_Zip_Code=this.includeZipcode.join(', ')
  this.filters.include_company_domain=this.includeCompanyDomain.join(', ');
  this.filters.exclude_job_title = this.excludeJobTitles.join(', ');
  this.filters.exclude_company_name=this.excludeCompanyName.join(', ');
  this.filters.exclude_country=this.excludeCountry.join(', ');
  this.filters.exclude_company_domain=this.excludeCompanyDomain.join(', ')
  this.filters.include_job_function=this.selectedJobFunctions.join(', ')
  this.filters.include_Employee_Size = this.selectedEmployeeSizes.join(', ');
  this.filters.include_job_level=this.selectedJobLevels.join(', ');
  this.updateLocalStorage()
}

// REMOVE THE COUNT
removeAllCompanyNames(): void {
  this.includeCompanyName = []; // Clear the array
  this.updateFilters(); 
  this.updateLocalStorage(); // Update the filters accordingly
}
removeExcludeCompanyNames():void{
  this.excludeCompanyName=[];
  this.updateFilters()
  this.updateLocalStorage(); 
}
removeAllCompanyDomain():void{
  this.includeCompanyDomain=[]
  this.updateFilters()
  this.updateLocalStorage();
}
removeExcludeCompanyDomainCount():void{
  this.excludeCompanyDomain=[]
  this.updateFilters()

}
removeincludeJobTitles():void{
  this.includeJobTitles=[]
  this.updateFilters()
  this.updateLocalStorage();
}
removeExcludeJobTitles():void{
  this.excludeJobTitles=[]
  this.updateFilters()
  this.updateLocalStorage();
}
removeincludeCountry():void{
  this.includecountry=[]
  this.updateFilters()
  this.updateLocalStorage(); 
}
removeincludeIndustry():void{
  this.includeIndustry=[]
  this.updateFilters()
  this.updateLocalStorage(); 
}
removeincludeZipCode():void{
  this.includeZipcode=[]
  this.updateFilters()
  this.updateLocalStorage(); 
}

removeincludeState():void{
  this.includeState=[]
  this.updateFilters()
  this.updateLocalStorage(); 
}
removeincludeRegion():void{
  this.includeRegion=[]
  this.updateFilters()
  this.updateLocalStorage(); 
}
removeincludeCity():void{
  this.includeCity=[]
  this.updateFilters()
  this.updateLocalStorage(); 
}
removeExcludecountry():void{
  this.excludeCountry=[]
  this.updateFilters()
  this.updateLocalStorage();
}

getAppliedFiltersCount(): number {
  let count = 0;
  for (const key in this.filters) {
    if (this.filters.hasOwnProperty(key)) {
      // Check if the property is an array (checkboxes)
      if (Array.isArray(this.filters[key])) {
        // Check if all options are selected
        const allSelected = this.filters[key].every((isChecked: boolean) => isChecked);
        if (!allSelected) {
          // Count the number of selected checkboxes
          count += this.filters[key].filter((isChecked: boolean) => isChecked).length;
        }
      } else if (this.filters[key] !== '') {
        // Check if the property is meant for inclusion/exclusion and not empty
        if (key.startsWith('include_') || key.startsWith('exclude_')) {
          count++;
        }
      }
    }
  }
  return count;
}

removeAllselectedJobLevels(){
  this.selectedJobLevels=[]
  this.jobLevelControl.patchValue([], { emitEvent: false });
  this.updateFilters()
  this.updateLocalStorage()
}
removeAllselectedJobFunctions(){
  this.selectedJobFunctions = []; // Clear the selectedJobFunctions array
  // Reset the form control value to an empty array
  this.jobFunctionControl.patchValue([], { emitEvent: false });
  this.updateFilters(); 
  this.updateLocalStorage()
}


removeselectedEmployeeSizes(){
  this.selectedEmployeeSizes=[]
  this.employeeSizeControl.patchValue([], { emitEvent: false });
  this.updateFilters()
  this.updateLocalStorage()
}

removeAllFilters() {
  // Clear all filter properties
  for (const key in this.filters) {
    if (this.filters.hasOwnProperty(key)) {
      if (Array.isArray(this.filters[key])) {
        // If it's an array, empty the array
        this.filters[key] = [];
      } else {
        // Otherwise, reset to empty string
        this.filters[key] = '';
      }
    }
  }

  // Clear specific filter properties if they exist
  if (this.filters.hasOwnProperty('includecountry')) {
    this.filters['includecountry'] = [];
  }
  if (this.filters.hasOwnProperty('excludeCountry')) {
    this.filters['excludeCountry'] = [];
  }
  // Clear company name filter properties
  if (this.filters.hasOwnProperty('includeCompanyName')) {
    this.filters['includeCompanyName'] = [];
  }
  if (this.filters.hasOwnProperty('excludeCompanyName')) {
    this.filters['excludeCompanyName'] = [];
  }
  // Clear company domain filter properties
  if (this.filters.hasOwnProperty('includeCompanyDomain')) {
    this.filters['includeCompanyDomain'] = [];
  }
  if (this.filters.hasOwnProperty('excludeCompanyDomain')) {
    this.filters['excludeCompanyDomain'] = [];
  }
  // Clear job title filter properties
  if (this.filters.hasOwnProperty('includeJobTitles')) {
    this.filters['includeJobTitles'] = [];
  }
  if (this.filters.hasOwnProperty('excludeJobTitles')) {
    this.filters['excludeJobTitles'] = [];
  }
  if (this.filters.hasOwnProperty('include_job_function')) {
    this.filters['include_job_function'] = [];
  }

  if (this.filters.hasOwnProperty('include_Employee_Size')) {
    this.filters['include_Employee_Size'] = [];
  }
  if (this.filters.hasOwnProperty('include_job_level')) {
    this.filters['include_job_level'] = [];
    
  }
  if (this.filters.hasOwnProperty('include_city')) {
    this.filters['include_city'] = [];
    
  }

  if (this.filters.hasOwnProperty('include_state')) {
    this.filters['include_state'] = [];
    
  }

  if (this.filters.hasOwnProperty('include_Industry')) {
    this.filters['include_Industry'] = [];
    
  }

  if (this.filters.hasOwnProperty('include_region')) {
    this.filters['include_region'] = [];
    
  }

  if (this.filters.hasOwnProperty('include_Zip_Code')) {
    this.filters['include_Zip_Code'] = [];
    
  }


  // Clear chip input fields
  this.includecountry = [];
  this.excludeCountry = [];
  this.includeCompanyName = [];
  this.excludeCompanyName = [];
  this.includeCompanyDomain = [];
  this.excludeCompanyDomain = [];
  this.includeJobTitles = [];
  this.excludeJobTitles = [];
  this.selectedJobFunctions = [];
  this.selectedJobLevels = [];
  this.selectedEmployeeSizes = [];
this.includeCity=[]
this.includeState=[]
this.includeRegion=[]
this.includeIndustry=[]
this.includeZipcode=[]
  // Reset form control values
  this.jobFunctionControl.setValue([], { emitEvent: false });
  this.jobLevelControl.setValue([], { emitEvent: false });
  this.employeeSizeControl.setValue([], { emitEvent: false });

  // Call the method to update filters
  this.updateFilters();
  this.updateLocalStorage()
}

employeeSizeControl = new FormControl();
employeeSizeOptions: string[] = [
  '51',
  '201',
  '501',
  '1001',
  '5001',
  '10001',
  '10001+'
  ];


  removeSize(size: string): void {
    const index = this.selectedEmployeeSizes.indexOf(size);
    if (index !== -1) {
      this.selectedEmployeeSizes.splice(index, 1);
      // Update the form control value
      this.employeeSizeControl.setValue(this.selectedEmployeeSizes);
      // Perform any additional operations as needed
      this.updateFilters();
      // Save selected employee sizes to local storage
      this.updateLocalStorage();
    }
  }


checked: boolean = false;
checkedd: boolean = false;
checkforjobtitle:boolean=false
checkforcountry:boolean=false
ifclick() {
  this.checked = !this.checked;
}

ifclickk(){
  this.checkedd=!this.checkedd;
}

ifclickjobtitle(){
this.checkforjobtitle=!this.checkforjobtitle
}

ifclickoncountry(){
this.checkforcountry=!this.checkforcountry
 }


  jobFunctionControl = new FormControl();
  jobFunctionOptions: string[] = [
    'Any', 'Business', 'Customer', 'Design', 'Education', 'Engineer', 'Finance', 
    'Founder', 'Human Resources', 'Information Technology', 
    'Law', 'Legal', 'Manufacturing', 'Marketing', 'Marketing/Finance', 
    'Medical & Health', 'Operations', 'Owner', 'Partner', 'Sales'
  ];
  selectedJobFunctions: string[] = [];
  // Method to remove a selected job function chip
  removeFunction(func: string): void {
    const index = this.selectedJobFunctions.indexOf(func);
    if (index !== -1) {
      this.selectedJobFunctions.splice(index, 1);
      // Update the form control value
      this.jobFunctionControl.setValue(this.selectedJobFunctions);
      // Perform any additional operations as needed
      this.updateFilters();
      // Save selected options to local storage
      this.updateLocalStorage();
    }
  }

  jobLevelControl = new FormControl();
  jobLevelOptions: string[] = ['Director', 'Manager', 'VP Level', 'Vice President', 'C Level', 'Owner', 'Partner', 'Senior', 'Entry', 'Intern'];
  selectedJobLevels: string[] = [];

removeJobLevel(level: string): void {
  const index = this.selectedJobLevels.indexOf(level);
  if (index !== -1) {
    this.selectedJobLevels.splice(index, 1);
    // Update the form control value
    this.jobLevelControl.setValue(this.selectedJobLevels);
    // Perform any additional operations as needed
    this.updateFilters();
    // Save selected job levels to local storage
    this.updateLocalStorage();
  }
}


  @ViewChild('input') inputElement!: ElementRef;
  @ViewChild('input1') inputElement1!: ElementRef;
  @ViewChild('input2') inputElement2!: ElementRef;
  @ViewChild('input3') inputElement3!: ElementRef;
  @ViewChild('input4') inputElement4!: ElementRef;
  @ViewChild('input5') inputElement5!: ElementRef;
  @ViewChild('input6') inputElement6!: ElementRef;
  @ViewChild('input7') inputElementCity!: ElementRef;
  @ViewChild('input8') inputElementState!: ElementRef;
  @ViewChild('input9') inputElementRegion!: ElementRef;
  @ViewChild('input10') inputElementZipcode!: ElementRef;
  @ViewChild('input11') inputElementIndustry!: ElementRef;

  panelOpenState: boolean = false;

  companyNameSuggestions: string[] = [];
  filteredSuggestions: string[] = [];
 
  filterSuggestions(query: string): void {
    // Filter the suggestions based on the search query
    console.log(query,'company');
    
    this.filteredSuggestions = this.companyNameSuggestions
      .filter(suggestion =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 10); 
  }
 
  

  fetchSuggestions(): void {
    const url = 'https://api.vectordb.app/v1/auto/company/?';

    this.http.get<string[]>(url).subscribe(
      (response: string[]) => {
        // Assign the fetched suggestions to the companyNameSuggestions array
       
        
        this.companyNameSuggestions = response;
   
      },
      (error) => {
        console.error('Error fetching suggestions:', error);
      }
    );
  }
  // addCompanyNameFromAuto(event: MatAutocompleteSelectedEvent): void {
  //   const value = event.option.viewValue;
    
  //   // Add the selected value to the list of selected items (chips)
  //   this.addCompanyName(value);
    
  //   // Reset the input value if the input element is available
  //   if (this.inputElement && this.inputElement.nativeElement) {
  //     this.inputElement.nativeElement.value = '';
  //   }
    
  //   // Here you can do whatever you want with the selected value
    
  // }
  
  
// exclude company name
excludecompanySuggestions: string[] = [];
filteredexcludecompanySuggestions: string[]=[]
fetchexcludeCompanySuggestions(): void {
 const url = 'https://api.vectordb.app/v1/auto/company/?';

 this.http.get<string[]>(url).subscribe(
   (response: string[]) => {
     // Assign the fetched suggestions to the countrySuggestions array
    
     this.excludecompanySuggestions = response;
   },
   (error) => {
     console.error('Error fetching country suggestions:', error);
   }
 );
}


addExcludeCompanyName(value: string): void {

const names = value.split(',');

// Trim each name and add it to the includeCompanyName array
names.forEach(name => {
 const trimmedName = name.trim();
 if (trimmedName && !this.excludeCompanyName.includes(trimmedName)) {
   this.excludeCompanyName.push(trimmedName);
   this.updateLocalStorage(); 
 }
});

if (this.inputElement1 && this.inputElement1.nativeElement) {
 this.inputElement1.nativeElement.value = '';
}

this.updateFilters();
}


addexcludeCompanyNameFromAuto(event: MatAutocompleteSelectedEvent): void {
const value = event.option.viewValue;

// Add the selected value to the list of selected items (chips)
this.addExcludeCompanyName(value);

// Reset the input value if the input element is available
if (this.inputElement1 && this.inputElement1.nativeElement) {
 this.inputElement1.nativeElement.value = '';
}


}

filterexcludeCompanySuggestions(query: string): void {
  console.log('Query:', query);
  this.filteredexcludecompanySuggestions = this.excludecompanySuggestions
    .filter(company => company.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 10);
  console.log('Filtered Suggestions:', this.filteredexcludecompanySuggestions);
}


// suggestion for country
   countrySuggestions: string[] = [];
   filteredCountrySuggestions: string[]=[]
   filteredCitySuggestions: string[]=[]
   stateSuggestions: string[] = [];
   filteredStateSuggestions: string[]=[]
   citySuggestions: string[] = [];
   regionSuggestions: string[] = [];
   filteredRegionSuggestions: string[]=[]
   zipSuggestions: string[] = [];
   filteredzipSuggestions: string[]=[]
   industrySuggestions: string[] = [];
   filteredIndustrySuggestions: string[]=[]
   fetchCountrySuggestions(): void {
    const url = 'https://api.vectordb.app/v1/auto/country/?';
  
    this.http.get<string[]>(url).subscribe(
      (response: string[]) => {
       
        this.countrySuggestions = response;
 
      },
      (error) => {
        console.error('Error fetching country suggestions:', error);
      }
    );
  }

  // addCountry(value: string): void {
  
  //   const names = value.split(',');
    
  //   // Trim each name and add it to the includeCompanyName array
  //   names.forEach(name => {
  //     const trimmedName = name.trim();
  //     if (trimmedName && !this.includecountry.includes(trimmedName)) {
  //       this.includecountry.push(trimmedName);
  //     }
  //   });
    
  //   // Reset the input value
  //   if (this.inputElement2 && this.inputElement2.nativeElement) {
  //     this.inputElement2.nativeElement.value = '';
  //   }
    
  //   this.updateFilters();
  // }

  // addCountryNameFromAuto(event: MatAutocompleteSelectedEvent): void {
  //   const value = event.option.viewValue;
    
  //   // Add the selected value to the list of selected items (chips)
  //   this.addCountry(value);
    
  //   // Reset the input value if the input element is available
  //   if (this.inputElement2 && this.inputElement2.nativeElement) {
  //     this.inputElement2.nativeElement.value = '';
  //   }
    
  //   // Here you can do whatever you want with the selected value
    
  // }

  
  filterCountrySuggestions(query: string): void {
    this.filteredCountrySuggestions = this.countrySuggestions
      .filter(country => country.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10);
  }
  
// job title suggestions

  jobTitleSuggestions: string[] = [];
  filteredJobTitleSuggestions: string[] = [];
  fetchJobTitleSuggestions(): void {
    const url = 'https://api.vectordb.app/v1/auto/job/?';
  
    this.http.get<string[]>(url).subscribe(
      (response: string[]) => {
        this.jobTitleSuggestions = response;
      },
      (error) => {
        console.error('Error fetching job title suggestions:', error);
      }
    );
  }
  filterJobTitleSuggestions(query: string): void {
    this.filteredJobTitleSuggestions = this.jobTitleSuggestions
      .filter(jobTitle => jobTitle.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10);
  }
    





  excludejobTitleSuggestions: string[] = [];
  filteredexlcudeJobTitleSuggestions: string[] = [];
  addExcludeJobTitle(value: string): void {
  
    const names = value.split(',');
    
    // Trim each name and add it to the includeCompanyName array
    names.forEach(name => {
      const trimmedName = name.trim();
      if (trimmedName && !this.excludeJobTitles.includes(trimmedName)) {
        this.excludeJobTitles.push(trimmedName);
        this.updateLocalStorage();

      }
    });
    
    // Reset the input value
    if (this.inputElement5 && this.inputElement5.nativeElement) {
      this.inputElement5.nativeElement.value = '';
    }
    
    this.updateFilters();
  }
  addExcludeJobtitleNameFromAuto(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    this.addExcludeJobTitle(value)
    // Reset the input value if the input element is available
    if (this.inputElement5 && this.inputElement5.nativeElement) {
      this.inputElement5.nativeElement.value = '';
    }
    
    // Here you can do whatever you want with the selected value
    
  }

  fetchexcludeJobTitleSuggestions(): void {
    const url = 'https://api.vectordb.app/v1/auto/job/?';
  
    this.http.get<string[]>(url).subscribe(
      (response: string[]) => {
        this.excludejobTitleSuggestions = response;
      },
      (error) => {
        console.error('Error fetching job title suggestions:', error);
      }
    );
  }
  filterexcludeJobTitleSuggestions(query: string): void {
    this.filteredexlcudeJobTitleSuggestions = this.excludejobTitleSuggestions
      .filter(jobTitle => jobTitle.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10);
  }


// excludecountry suggesion


excludecountrySuggestions: string[] = [];
filteredexlcudecountrySuggestions: string[] = [];
addExcludecountry(value: string): void {

  const names = value.split(',');
  

  names.forEach(name => {
    const trimmedName = name.trim();
    if (trimmedName && !this.excludeJobTitles.includes(trimmedName)) {
      this.excludeCountry.push(trimmedName);
      this.updateLocalStorage()
    }
  });
  
  // Reset the input value
  if (this.inputElement3 && this.inputElement3.nativeElement) {
    this.inputElement3.nativeElement.value = '';
  }
  
  this.updateFilters();
}
addExcludecountryNameFromAuto(event: MatAutocompleteSelectedEvent): void {
  const value = event.option.viewValue;
  this.addExcludecountry(value)
  // Reset the input value if the input element is available
  if (this.inputElement3 && this.inputElement3.nativeElement) {
    this.inputElement3.nativeElement.value = '';
  }
  
  // Here you can do whatever you want with the selected value

}

fetchexcludecountrySuggestions(): void {
  const url = 'https://api.vectordb.app/v1/auto/country/?';

  this.http.get<string[]>(url).subscribe(
    (response: string[]) => {
      this.excludecountrySuggestions = response;
    },
    (error) => {
      console.error('Error fetching job title suggestions:', error);
    }
  );
}
filterexcludecountrySuggestions(query: string): void {
  this.filteredexlcudecountrySuggestions = this.excludecountrySuggestions
    .filter(jobTitle => jobTitle.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 10);
}



addCompanyName(value: string): void {

  const names = value.split(',');
  
  names.forEach(name => {
    const trimmedName = name.trim();
    if (trimmedName && !this.includeCompanyName.includes(trimmedName)) {
      this.includeCompanyName.push(trimmedName);
      this.updateLocalStorage();
    }
  });
  
  // Reset the input value
  if (this.inputElement && this.inputElement.nativeElement) {
    this.inputElement.nativeElement.value = '';
  }
  
  this.updateFilters();

}

// Function to remove CompanyName filter
removeCompanyName(companyName: string): void {
  const index = this.includeCompanyName.indexOf(companyName);
  if (index >= 0) {
    this.includeCompanyName.splice(index, 1);
    this.updateLocalStorage(); // Update localStorage after removing a filter
  }
}

// Function to update localStorage with current filter values
updateLocalStorage(): void {
  localStorage.setItem('companyNameFilter', JSON.stringify(this.includeCompanyName));
  localStorage.setItem('ExcludecompanyNameFilter', JSON.stringify(this.excludeCompanyName));
  localStorage.setItem('country',JSON.stringify(this.includecountry))
  localStorage.setItem('companyDomain',JSON.stringify(this.includeCompanyDomain))
  localStorage.setItem('excludeCompanyDomain',JSON.stringify(this.excludeCompanyDomain))
  localStorage.setItem('include_First_Name', JSON.stringify(this.filters.include_First_Name));
  localStorage.setItem('jobtitle',JSON.stringify(this.includeJobTitles))
  localStorage.setItem('excludeJobtitle',JSON.stringify(this.excludeJobTitles))
  localStorage.setItem('selectedJobLevels', JSON.stringify(this.selectedJobLevels));
  localStorage.setItem('excludeCountry',JSON.stringify(this.excludeCountry))
  localStorage.setItem('selectedEmployeeSizes', JSON.stringify(this.selectedEmployeeSizes));
  localStorage.setItem('selectedJobFunctions', JSON.stringify(this.selectedJobFunctions));
  localStorage.setItem('state',JSON.stringify(this.includeState))
  localStorage.setItem('city',JSON.stringify(this.includeCity))
  localStorage.setItem('region',JSON.stringify(this.includeRegion))
  localStorage.setItem('industry',JSON.stringify(this.includeIndustry))
  localStorage.setItem('zipcode',JSON.stringify(this.includeZipcode))

}



// Function to add CompanyName from autocomplete option
addCompanyNameFromAuto(event: any): void {
  this.addCompanyName(event.option.value);
}



// countries localstorage 
addCountry(value: string): void {
  const names = value.split(',');
  // Trim each name and add it to the includeCountry array
  names.forEach(name => {
    const trimmedName = name.trim();
    if (trimmedName && !this.includecountry.includes(trimmedName)) {
      this.includecountry.push(value.trim());
    this.updateLocalStorage();
    }
  });

//   if (value && value.trim()) {
//     this.includecountry.push(value.trim());
//     this.updateLocalStorage(); // Update localStorage after adding a new filter
//   }

    if (this.inputElement2 && this.inputElement2.nativeElement) {
      this.inputElement2.nativeElement.value = '';
    }
  this.updateFilters();
}

// Function to remove Country filter
removeCountryChip(companyName: string): void {
  const index = this.includecountry.indexOf(companyName);
  if (index >= 0) {
    this.includecountry.splice(index, 1);
    this.updateLocalStorage(); 
  }
}
addCountryNameFromAuto(event: any): void {
  this.addCountry(event.option.value);
}



// Function to add city
addCity(value: string): void {
  const names = value.split(',');
  names.forEach(name => {
      const trimmedName = name.trim();
      if (trimmedName && !this.includeCity.includes(trimmedName)) {
          this.includeCity.push(trimmedName);
          this.updateLocalStorage();
      }
  });

  if (this.inputElementCity && this.inputElementCity.nativeElement) {
      this.inputElementCity.nativeElement.value = '';
  }
  this.updateFilters();
}

// Function to remove city
removeCityChip(cityName: string): void {
  const index = this.includeCity.indexOf(cityName);
  if (index >= 0) {
      this.includeCity.splice(index, 1);
      this.updateLocalStorage();
  }
}

// Function to add city from autocomplete
addCityNameFromAuto(event: any): void {
  this.addCity(event.option.value);
}

fetchCitySuggestions(): void {
  const url = 'https://api.vectordb.app/v1/auto/city/?';

  this.http.get<string[]>(url).subscribe(
    (response: string[]) => {
      this.citySuggestions = response;
 
    },
    (error) => {
      console.error('Error fetching country suggestions:', error);
    }
  );
}



filterCitySuggestions(query: string): void {
  this.filteredCitySuggestions = this.citySuggestions
    .filter(city => city.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 10);
}






addState(value: string): void {
  const names = value.split(',');
  names.forEach(name => {
      const trimmedName = name.trim();
      if (trimmedName && !this.includeState.includes(trimmedName)) {
          this.includeState.push(trimmedName);
          this.updateLocalStorage();
      }
  });

  if (this.inputElementState && this.inputElementState.nativeElement) {
      this.inputElementState.nativeElement.value = '';
  }
  this.updateFilters();
}

// Function to remove city
removeStateChip(stateName: string): void {
  const index = this.includeState.indexOf(stateName);
  if (index >= 0) {
      this.includeState.splice(index, 1);
      this.updateLocalStorage();
  }
}

// Function to add city from autocomplete
addStateNameFromAuto(event: any): void {
  this.addState(event.option.value);
}

fetchStateSuggestions(): void {
  const url = 'https://api.vectordb.app/v1/auto/state/?';

  this.http.get<string[]>(url).subscribe(
    (response: string[]) => {
     

      this.stateSuggestions = response;

    },
    (error) => {
      console.error('Error fetching country suggestions:', error);
    }
  );
}



filterStateSuggestions(query: string): void {
  this.filteredStateSuggestions = this.stateSuggestions
    .filter(country => country.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 10);
}






// region
addRegion(value: string): void {
  const names = value.split(',');
  names.forEach(name => {
      const trimmedName = name.trim();
      if (trimmedName && !this.includeRegion.includes(trimmedName)) {
          this.includeRegion.push(trimmedName);
          this.updateLocalStorage();
      }
  });

  if (this.inputElementRegion && this.inputElementRegion.nativeElement) {
      this.inputElementRegion.nativeElement.value = '';
  }
  this.updateFilters();
}

// Function to remove city
removeRegionChip(regionName: string): void {
  const index = this.includeRegion.indexOf(regionName);
  if (index >= 0) {
      this.includeRegion.splice(index, 1);
      this.updateLocalStorage();
  }
}

// Function to add city from autocomplete
addRegionNameFromAuto(event: any): void {
  this.addRegion(event.option.value);
}

fetchRegionSuggestions(): void {
  const url = 'https://api.vectordb.app/v1/auto/region/?';

  this.http.get<string[]>(url).subscribe(
    (response: string[]) => {
      
      this.regionSuggestions = response;

    },
    (error) => {
      console.error('Error fetching country suggestions:', error);
    }
  );
}



filterRegionSuggestions(query: string): void {
  this.filteredRegionSuggestions = this.regionSuggestions
    .filter(country => country.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 10);
}

// zip code

includeZipcode: string[] = [];

// Function to add zip code
addZipCode(value: string): void {
  const codes = value.split(',').map(code => code.trim()); // Convert to array of trimmed codes
  codes.forEach((code: string) => {
    if (code && !this.includeZipcode.includes(code)) {
      this.includeZipcode.push(code);
      this.updateLocalStorage();
    }
  });

  if (this.inputElementZipcode && this.inputElementZipcode.nativeElement) {
    this.inputElementZipcode.nativeElement.value = ''; // Clear input field
  }
  this.updateFilters();
}



removeZipCodeChip(zipCode: string): void {
  const index = this.includeZipcode.indexOf(zipCode);
  if (index >= 0) {
    this.includeZipcode.splice(index, 1);
    this.updateLocalStorage();
  }
}

addZipCodeFromAuto(event: any): void {
  this.addZipCode(event.option.value);
}

fetchZipCodeSuggestions(): void {
  const url = 'https://api.vectordb.app/v1/auto/zipcode/?'; // Assuming you have an API endpoint for zip code suggestions

  this.http.get<string[]>(url).subscribe(
    (response: string[]) => {
      this.zipSuggestions = response;
    },
    (error) => {
      console.error('Error fetching zip code suggestions:', error);
    }
  );
}

filterZipCodeSuggestions(query: string): void {
  this.filteredzipSuggestions = this.zipSuggestions
    .filter((zipCode: string) => zipCode.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 10);
}





// Industry


addIndustry(value: string): void {
  const names = value.split(',');
  names.forEach(name => {
      const trimmedName = name.trim();
      if (trimmedName && !this.includeIndustry.includes(trimmedName)) {
          this.includeIndustry.push(trimmedName);
          this.updateLocalStorage();
      }
  });

  if (this.inputElementIndustry && this.inputElementIndustry.nativeElement) {
      this.inputElementIndustry.nativeElement.value = '';
  }
  this.updateFilters();
}

// Function to remove city
removeIndustryChip(stateName: string): void {
  const index = this.includeIndustry.indexOf(stateName);
  if (index >= 0) {
      this.includeIndustry.splice(index, 1);
      this.updateLocalStorage();
  }
}

// Function to add city from autocomplete
addIndustryNameFromAuto(event: any): void {
  this.addIndustry(event.option.value);
}

fetchIndustrySuggestions(): void {
  const url = 'https://api.vectordb.app/v1/auto/industry/?';

  this.http.get<string[]>(url).subscribe(
    (response: string[]) => {
     

      this.industrySuggestions = response;


    },
    (error) => {
      console.error('Error fetching country suggestions:', error);
    }
  );
}



filterIndustrySuggestions(query: string): void {
  this.filteredIndustrySuggestions = this.industrySuggestions
    .filter(country => country.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 10);
}




// domain
addCompanyDomain(event: string): void {
  const names = event.split(',');

  names.forEach(name => {
   const trimmedName = name.trim();
   if (trimmedName && !this.includeCompanyDomain.includes(trimmedName)) {
     this.includeCompanyDomain.push(trimmedName);
     this.updateLocalStorage(); 
   }
  });
  
  if (this.inputElement6 && this.inputElement6.nativeElement) {
   this.inputElement6.nativeElement.value = '';
  }
  
  

  this.updateFilters(); // Update filters after adding a new chip
}


removeCompanyDomain(companyName: string): void {
  const index = this.includeCompanyDomain.indexOf(companyName);
  if (index !== -1) {
        this.includeCompanyDomain.splice(index, 1);
          this.updateFilters();
    this.updateLocalStorage(); 
      }
    
}     



addExcludeCompanyDomain(event: MatChipInputEvent): void {
  const value = (event.value || '').trim();
  if (value) {
    // Split the input by separator if multiple job titles are entered
    const titles = value.split(',');
    // Trim each title and add it to the excludeJobTitles array
    titles.forEach(companyDomain => {
      const trimmedTitle = companyDomain.trim();
      if (trimmedTitle && !this.excludeCompanyDomain.includes(trimmedTitle)) {
        this.excludeCompanyDomain.push(trimmedTitle);
        this.updateLocalStorage();
      }
    });
    // Reset the input value
    if (event.input) {
      event.input.value = '';
    }
    this.updateFilters();
  }
}
removeExcludeCompanyDomain(companyDomain: string): void {
  const index = this.excludeCompanyDomain.indexOf(companyDomain);
  if (index !== -1) {
    this.excludeCompanyDomain.splice(index, 1);
    this.updateLocalStorage(); // Update localStorage before updating filters
    this.updateFilters(); // Update filters after removing the domain
  }
}




addJobTitle(value: string): void {
  
  const names = value.split(',');
  

  names.forEach(name => {
    const trimmedName = name.trim();
    if (trimmedName && !this.includeJobTitles.includes(trimmedName)) {
      this.includeJobTitles.push(trimmedName);
      this.updateLocalStorage();
    }
  });
  
  // Reset the input value
  if (this.inputElement4 && this.inputElement4.nativeElement) {
    this.inputElement4.nativeElement.value = '';
  }
  
  this.updateFilters();
}
addJobtitleNameFromAuto(event: MatAutocompleteSelectedEvent): void {
  const value = event.option.viewValue;
  
  // Add the selected value to the list of selected items (chips)
  this.addJobTitle(value);

  // Reset the input value if the input element is available
  if (this.inputElement4 && this.inputElement4.nativeElement) {
    this.inputElement4.nativeElement.value = '';
  }
  

  
}
removeJobTitle(jobTitle: string): void {
  const index = this.includeJobTitles.indexOf(jobTitle);
  if (index !== -1) {
    this.includeJobTitles.splice(index, 1);
    this.updateFilters();
    this.updateLocalStorage();
  }
}

tourGuide(){

  const driverObj = driver({
    showProgress: true,
    showButtons: ['next', 'previous'],
    steps: [
      { 
        element: '.companyFilter', 
        popover: { 
          title: 'Company Name', 
          description: `
           
            <img src="https://vectordb.app/img/company.gif" alt="Image" style="max-width: 100%; height: auto;">
            
          `, 
          side: "left", 
          align: 'start' 
        }
      }
    ]
  });
  
  driverObj.drive();
}


jobTitleGuide(){
  
  const driverObj = driver({
    showProgress: true,
    showButtons: ['next', 'previous'],
    steps: [
      { 
        element: '.jobtitleGuide', 
        popover: { 
          title: 'Job Title ', 
          description: `
            <p></p>
            <img src="https://vectordb.app/img/JobTitleGuide.gif" alt="Image" style="max-width: 100%; height: auto;">
          `, 
          side: "left", 
          align: 'start' 
        }
      }
    ]
  });
  
  driverObj.drive();
}


empSizeGuide(){
  
  const driverObj = driver({
    showProgress: true,
    showButtons: ['next', 'previous'],
    steps: [
      { 
        element: '.empSize', 
        popover: { 
          title: 'Employee Size', 
          description: `
            <p></p>
            <img src="https://vectordb.app/img/empSizeGuide.gif" alt="Image" style="max-width: 100%; height: auto;">
          `, 
          side: "left", 
          align: 'start' 
        }
      }
    ]
  });
  
  driverObj.drive();
}

industryGuide(){
  
  const driverObj = driver({
    showProgress: true,
    showButtons: ['next', 'previous'],
    steps: [
      { 
        element: '.industryGuide', 
        popover: { 
          title: 'Industry', 
          description: `
            <p></p>
            <img src="https://vectordb.app/img/industryGuide.gif" alt="Image" style="max-width: 100%; height: auto;">
          `, 
          side: "left", 
          align: 'start' 
        }
      }
    ]
  });
  
  driverObj.drive();
}

countryGuide(){
  
  const driverObj = driver({
    showProgress: true,
    showButtons: ['next', 'previous'],
    steps: [
      { 
        element: '.countryGuide', 
        popover: { 
          title: 'Location', 
          description: `
            <p></p>
            <img src="https://vectordb.app/img/locationGuide.gif" alt="Image" style="max-width: 100%; height: auto;">
          `, 
          side: "left", 
          align: 'start' 
        }
      }
    ]
  });
  
  driverObj.drive();
}


zipCodeGuide(){
  
  const driverObj = driver({
    showProgress: true,
    showButtons: ['next', 'previous'],
    steps: [
      { 
        element: '.zipCodeGuide', 
        popover: { 
          title: 'Zip Code', 
          description: `
            <p>Use the Zip Code filter to search by Zip Code. You will receive suggestions according to your input search.</p>
            <img src="https://vectordb.app/img/zipCodeGuide.gif" alt="Image" style="max-width: 100%; height: auto;">
          `, 
          side: "left", 
          align: 'start' 
        }
      }
    ]
  });
  
  driverObj.drive();
}





onSaveSearch(name: string): void {
  console.log('Save button clicked. Search name:', name);
  const filters = {
      includeCompanyName: this.includeCompanyName,
      includeCity: this.includeCity,
      includeState: this.includeState,
      includeIndustry: this.includeIndustry,
      includeRegion: this.includeRegion,
      includeJobTitles: this.includeJobTitles,
      includeCompanyDomain: this.includeCompanyDomain,
      excludeJobTitles: this.excludeJobTitles,
      excludeCountry: this.excludeCountry,
      excludeCompanyName: this.excludeCompanyName,
      excludeCompanyDomain: this.excludeCompanyDomain
  };
  console.log('Filters to be saved:', filters);
  this.apiService.saveSearch(name, filters).subscribe(
      () => {
          console.log('Search saved successfully!');
      },
      (error: any) => {
          console.error('Error saving search:', error);
      }
  );
}

openDialog(){
  const dialogRef = this.dialog.open(NameSavedsearchComponent, {
    data: {},
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
   
  });
}



// selectedName: string;
// filters: any = {};
 
}














