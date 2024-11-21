import { Component, ElementRef, ViewChild } from '@angular/core';
import { FilterService } from './filter.service';
import { GetDataService } from '../people/get-data.service';
import {MatChipInputEvent} from '@angular/material/chips';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { driver } from 'driver.js';
import { NameSavedsearchComponent } from 'src/app/name-savedsearch/name-savedsearch.component';
import { ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent {
  selectedJobTitles: string[] = [];
  jobname: string[] = [];
  industryFilter: string = '';
  jobFunctionFilter: string = '';
  countryFilter: any;
  userEmail: any;
  includecountry: string[] = [];
  includeCompanyName: string[] = [];
  includefirstName: string[] = [];
  includeCity: string[] = [];
  includeState: string[] = [];
  includeIndustry: string[] = [];
  includeRegion: string[] = [];
  // includeZipcode:number[]=[]
  includeJobTitles: string[] = [];
  includeCompanyDomain: string[] = [];
  // properties for exclude fields for chips
  excludeJobTitles: string[] = [];
  excludeIndustry: string[] = [];
  excludeCountry: string[] = [];
  excludeCompanyName: string[] = [];
  excludeCompanyDomain: string[] = [];
  checkboxValues: { [key: string]: boolean } = {
    Director: false,
    Manager: false,
    'VP Level': false,
    'Vice President': false,
    'C Level': false,
    Founder: false,
  };
  results: any = [];
  currentPage: number = 1;
  companytitle: Set<string> = new Set<string>();
  resultsToShow: any;
  selectedRows: any[] = [];
  selectedEmployeeSizes: string[] = [];
  tableData: any[] = [];
  filteredData: any[] = [];
  selectedName: any;
  addOnBlur = true;
  // announcer = inject(LiveAnnouncer);
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly separatorKeysCodes1: number[] = [ENTER, COMMA];
  readonly separatorKeysCodes2: number[] = [ENTER, COMMA];
  readonly separatorKeysCodes3: number[] = [ENTER, COMMA];
  readonly separatorKeysCodes4: number[] = [ENTER, COMMA];

  employeeSizeControl = new FormControl();
  employeeSizeOptions: string[] = [
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1001-5000',
    '5001-10000',
    '10001+',
  ];
  checked: boolean = false;
  checkedd: boolean = false;
  checkforjobtitle: boolean = false;
  checkforcountry: boolean = false;

  jobFunctionControl = new FormControl();
  jobFunctionOptions: string[] = [
    'Any',
    'Business',
    'Customer',
    'Design',
    'Education',
    'Engineer',
    'Finance',
    'Founder',
    'Human Resources',
    'Information Technology',
    'Law',
    'Legal',
    'Manufacturing',
    'Marketing',
    'Marketing/Finance',
    'Medical & Health',
    'Operations',
    'Owner',
    'Partner',
    'Sales',
  ];
  selectedJobFunctions: string[] = [];
  // Method to remove a selected job function chip
  jobLevelControl = new FormControl<string[]>([]);  // Specify the type as string[]
  // Initialize as an empty array
  jobLevelOptions: string[] = [
    'Director',
    'Manager',
    'VP Level',
    'Vice President',
    'C Level',
    'Owner',
    'Partner',
    'Senior',
    'Entry',
    'Intern',
  ];
  selectedJobLevels: string[] = [];
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
  @ViewChild('input13') inputElementSiccode!: ElementRef;
  @ViewChild('input14') inputElementNaiccode!: ElementRef;
  @ViewChild('input11') inputElementIndustry!: ElementRef;
  @ViewChild('input12') inputElementExcludeIndustry!: ElementRef;
// suggestion for country
countrySuggestions: string[] = [];
filteredCountrySuggestions: string[] = [];
filteredCitySuggestions: string[] = [];
stateSuggestions: string[] = [];
filteredStateSuggestions: string[] = [];
citySuggestions: string[] = [];
regionSuggestions: string[] = [];
filteredRegionSuggestions: string[] = [];
zipSuggestions: string[] = [];
filteredzipSuggestions: string[] = [];
industrySuggestions: string[] = [];
filteredIndustrySuggestions: string[] = [];
excludeindustrySuggestions: string[] = [];
filteredexcludeIndustrySuggestions: string[] = [];
excludecompanySuggestions: string[] = [];
filteredexcludecompanySuggestions: string[] = [];
panelOpenState: boolean = false;
companyNameSuggestions: string[] = [];
filteredSuggestions: string[] = [];
excludejobTitleSuggestions: string[] = [];
filteredexlcudeJobTitleSuggestions: string[] = [];
jobTitleSuggestions: string[] = [];
filteredJobTitleSuggestions: string[] = [];
  filters: any = {
    include_country: '',
    include_city: '',
    include_state: '',
    include_zip_Code: '',
    include_region: '',
    include_Industry: '',
    exclude_industry: '',
    include_job_title: '',
    include_first_name: '',
    include_company_name: '',
    include_company_domain: '',
    include_employee_size: [],
    exclude_employee_size: [],
    exclude_job_title: '',
    exclude_company_domain: '',
    exclude_company_name: '',
    exclude_country: '',
    include_job_function: [],
    include_job_level: [],
    include_sic: '',
    include_naic: '',
  };

  

  getCheckboxKeys(): string[] {
    return Object.keys(this.checkboxValues);
  }

  getSelectedJobTitlesCount(): number {
    // Implement your logic to calculate the count of selected job titles
    return this.selectedJobTitles ? this.selectedJobTitles.length : 0;
  }

  saveFiltersToLocal(): void {
    localStorage.setItem('appliedFilters', JSON.stringify(this.filters));
  }

  // Function to retrieve filters from local storage
  retrieveFiltersFromLocal(): any {
    const storedFilters = localStorage.getItem('appliedFilters');
    return storedFilters ? JSON.parse(storedFilters) : {};
  }
  retrieveAndApplyFiltersFromLocalStorage(): void {
    
    const savedFilters = localStorage.getItem('savedFilters');
    if (savedFilters) {
      const parsedFilters = JSON.parse(savedFilters);
      this.applyStoredFilters(parsedFilters);
    }
    if (savedFilters) {
      const parsedFilter = JSON.parse(savedFilters);

      // Set the respective properties based on the saved filter
      // this.includeCompanyName = parsedFilter.include_company_name || '';
      // this.companyNameListText = this.includeCompanyName; // Bind to textarea for display
      this.includeCompanyName = parsedFilter.include_company_name ? parsedFilter.include_company_name.split(',') : [];
      this.companyNameListText = this.includeCompanyName.join(', ')
      // Handle company domains if applicable
      this.includeCompanyDomain = parsedFilter.include_company_domain || '';
      // this.companyListText = this.includeCompanyDomain.join(', '); // If it's an array, join for display

      // Handle exclusion lists
      this.excludeCompanyName = parsedFilter.exclude_company_name ? parsedFilter.exclude_company_name.split(',') : [];
      this.excludecompanyNameListText = this.excludeCompanyName.join(', '); // For display in textarea

      this.excludeCompanyDomain = parsedFilter.exclude_company_domain ? parsedFilter.exclude_company_domain.split(',') : [];
      this.excludecompanydomainlist = this.excludeCompanyDomain.join(', '); // For display in textarea
    }
  }

 
  constructor(
    private apiService: GetDataService,
    private filterService: FilterService,
    private authService: AuthService,
    private http: HttpClient,
    private dialog: MatDialog
  ) {
    this.jobFunctionControl.valueChanges.subscribe((selectedFunctions) => {
      this.selectedJobFunctions = selectedFunctions;
      this.updateFilters();
    });
    this.employeeSizeControl.valueChanges.subscribe((selectedSizes) => {
      this.selectedEmployeeSizes = selectedSizes;
      this.updateFilters();
    });
    this.jobLevelControl.valueChanges.subscribe((level) => {
      this.selectedJobLevels = level ? level : [];

      this.updateFilters();
    });
  }
//   onFilterChange(filterName: string, value: string): void {
//     this.filterService.updateFilters({ [filterName]: value });
// }

  ngOnInit(): void {
    this.filterService.filters$.subscribe(filters => {
      this.filters = filters;
      /// this.applyFilter(); // Apply the filters to the data

      // Update your component's state based on the filters
      console.log('Current filters:', this.filters);
    });
    this.retrieveAndApplyFiltersFromLocalStorage();
    
    this.filters = this.retrieveFiltersFromLocal();
    this.filters = {};
    this.filterService.filters$.subscribe((filters) => {
      this.filters = filters;
      this.search();
    });
    this.loadSavedFilters();
    const storedFilters = this.retrieveFiltersFromLocal();
    if (storedFilters) {
      if (storedFilters.include_company_name) {
        const companyNames = storedFilters.include_company_name.split(', ');
        this.addCompanyNameFromSavedList(companyNames);
      }
      if (storedFilters.include_company_domain) {
        const companyNames = storedFilters.include_company_domain.split(', ');
        this.addCompanyDomainFromSavedList(companyNames);
      }

      // Apply other stored filters if needed
      this.applyStoredFilters(storedFilters);
    }
    const storedDomains = localStorage.getItem('companyDomain');
    if (storedDomains) {
      this.includeCompanyDomain = JSON.parse(storedDomains);
      // Populate the textarea with the saved domains, joined by commas
      this.companyListText = this.includeCompanyDomain.join(', ');
    }

    if (storedFilters) {
      this.applyStoredFilters(storedFilters);
    }

    this.fetchSuggestions();
    this.fetchCountrySuggestions();
    this.fetchJobTitleSuggestions();
    this.fetchexcludeJobTitleSuggestions();
    this.fetchexcludecountrySuggestions();
    this.fetchexcludeCompanySuggestions();
    this.fetchCitySuggestions();
    this.fetchIndustrySuggestions();
    this.fetchRegionSuggestions();
    this.fetchStateSuggestions();
    this.fetchZipCodeSuggestions();

    const storedCompanyName = localStorage.getItem('companyNameFilter');
    
    const storedcountry = localStorage.getItem('country');
    const storedCompanyDomain = localStorage.getItem('companyDomain');
    const storedExkludeCompanyDomain = localStorage.getItem('excludeCompanyDomain' );
    const firstName = localStorage.getItem('include_First_Name');
    const storedJobTitle = localStorage.getItem('jobtitle');
    const storedExcludeJobTitle = localStorage.getItem('excludeJobtitle');
    const storedjobLevel = localStorage.getItem('jobLevel');
    const storedExcludeCountry = localStorage.getItem('excludeCountry');
    const storedjobaFunction = localStorage.getItem('jobfunction');
    const storedEmployeSize = localStorage.getItem('empSize');
    const storedCity = localStorage.getItem('city');
    if (storedCity) {
      this.includeCity = JSON.parse(storedCity);
    }

    const storedRegion = localStorage.getItem('region');
    if (storedRegion) {
      this.includeRegion = JSON.parse(storedRegion);
    }
    const storedIndustry = localStorage.getItem('industry');
    if (storedIndustry) {
      this.includeIndustry = JSON.parse(storedIndustry);
    }

    const storedState = localStorage.getItem('state');
    if (storedState) {
      this.includeState = JSON.parse(storedState);
    }
    const storedZipcode = localStorage.getItem('zipCode');
    if (storedZipcode) {
      this.includeZipcode = JSON.parse(storedZipcode);
    }
    if (storedCompanyName) {
      this.includeCompanyName = JSON.parse(storedCompanyName);
      this.companyNameListText = this.includeCompanyName.join(', ');
    }
    const storedExlcudeCompanyName = localStorage.getItem('ExcludecompanyNameFilter');
    if (storedExlcudeCompanyName) {
      this.excludeCompanyName = JSON.parse(storedExlcudeCompanyName);
      this.excludecompanyNameListText = this.excludeCompanyName.join(', ');
    }
    if (storedcountry) {
      this.includecountry = JSON.parse(storedcountry);
    }
    if (storedCompanyDomain) {
      this.includeCompanyDomain = JSON.parse(storedCompanyDomain);
      this.companyListText=this.includeCompanyDomain.join(', ')
    }
    if (storedExkludeCompanyDomain) {
      this.excludeCompanyDomain = JSON.parse(storedExkludeCompanyDomain);
      this.excludecompanydomainlist = this.excludeCompanyDomain.join(', ');
    }
    if (firstName) {
      this.filters.include_First_Name = JSON.parse(firstName);
    }

    // const storedDomains = localStorage.getItem('companyDomain');
    // if (storedDomains) {
    //   this.includeCompanyDomain = JSON.parse(storedDomains);
    //   // Populate the textarea with the saved domains, joined by commas
    //   this.companyListText = this.includeCompanyDomain.join(', ');
    // }

    if (storedJobTitle) {
      this.includeJobTitles = JSON.parse(storedJobTitle);
      this.IncludejobTitleListText = this.includeJobTitles.join(', ');
    }

    if (storedExcludeJobTitle) {
      this.excludeJobTitles = JSON.parse(storedExcludeJobTitle);
      this.excludejobTitleListText = this.excludeJobTitles.join(', ');
    }

    if (storedjobLevel) {
      this.selectedJobLevels = JSON.parse(storedjobLevel);
    }
    if (storedjobaFunction) {
      this.selectedJobFunctions = JSON.parse(storedjobaFunction);
    }

    if (storedExcludeCountry) {
      this.excludeCountry = JSON.parse(storedExcludeCountry);
    }
    const savedSelectedEmployeeSizes = localStorage.getItem(
      'selectedEmployeeSizes'
    );
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

    this.applyFilter();

    // Retrieve filters from local storage

    if (storedFilters) {
      this.applyStoredFilters(storedFilters);
    }

  
    if (savedFilters) {
      this.filters = JSON.parse(savedFilters); // Load saved filters
      this.companyNameListText = this.filters.include_company_name || ''; // Initialize textarea value
      this.companyListText = this.filters.include_company_domain;
    }
    // Subscribe to filter updates from the service
    this.filterService.filters$.subscribe((filters) => {
      this.filters = filters; // Update filters based on service
      this.companyNameListText = filters.include_company_name; // Sync textarea with filters
      this.companyListText = this.filters.include_company_domain;
    });
  
    // Perform initial searches and suggestions fetch
    if (this.filters.include_company_name) {
      this.companyNameListText = this.filters.include_company_name;
    }

    // Perform initial searches and suggestions fetch
    if (this.filters.include_company_domain) {
      this.companyListText = this.filters.include_company_domain;
    }
    this.retrieveAndApplySpecificFilters(); 
    this.fetchSuggestions();
    this.fetchCountrySuggestions();
    this.fetchJobTitleSuggestions();
    this.fetchexcludeJobTitleSuggestions();
    this.fetchexcludecountrySuggestions();
    this.fetchexcludeCompanySuggestions();
    this.fetchCitySuggestions();
    this.fetchIndustrySuggestions();
    this.fetchExcludeIndustrySuggestions();
    this.fetchRegionSuggestions();
    this.fetchStateSuggestions();
    this.fetchZipCodeSuggestions();
    // Retrieve and apply specific filters from local storage
    this.retrieveAndApplySpecificFilters();
    this.companyNameListText = this.filters.include_company_name.join(', ') || '';
    this.companyListText = this.filters.include_company_domain.join(', ') || '';

    // Apply saved filters
    // this.updateCompanyNameListText();
    this.applyFilter();
  }
  


  toggleCheckbox(value: string, type: string): void {
    // Use the appropriate property based on the type
    const currentValue =
      type === 'Employee_Size'
        ? this.filters.include_employee_size
        : this.filters.include_job_level || this.filters.include_job_function;
    // Check if currentValue is defined before using it
    const values = (currentValue || '').split(',');

    if (values.includes(value)) {
      const index = values.indexOf(value);
      values.splice(index, 1);
    } else {
      values.push(value);
    }

    if (type === 'Employee_Size') {
      this.filters.include_employee_size = values.join(',');
    } else {
      // Assuming 'Job_Level' and 'Job_Function' have the same structure
      this.filters[
        type === 'Job_Level' ? 'include_job_level' : 'include_job_function'
      ] = values.join(',');
    }

    this.applyFilter();
    this.updateLocalStorage();
  }

  isCheckboxChecked(value: string, type: string): boolean {
    let values: string[] = [];

    if (type === 'Employee_Size') {
      values = (
        (this.filters && this.filters.include_employee_size) ||
        ''
      ).split(',');
    } else if (type === 'Job_Level' || type === 'job_function') {
      const includeProperty =
        type === 'Job_Level' ? 'include_job_level' : 'include_job_function';
      values = ((this.filters && this.filters[includeProperty]) || '').split(
        ','
      );
    }
    this.updateLocalStorage();
    return values.includes(value);
  }

  togglePanel(panelId: string): void {
    const panel = document.getElementById(panelId);
    if (panel) {
      // Consider using Angular data binding to control visibility
      panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
    }
  }

  applyFilter(): void {
    // Convert arrays to strings before updating the filters
    this.filters.include_job_title = this.includeJobTitles.join(', ');
    this.filters.include_country = this.includecountry.join(', ');
    this.filters.include_company_domain = this.includeCompanyDomain.join(', ');
    this.filters.include_company_name = this.includeCompanyName.join(', ');
    this.filters.include_state = this.includeState.join(', ');
    this.filters.include_city = this.includeCity.join(', ');
    this.filters.include_region = this.includeRegion.join(', ');
    this.filters.include_Industry = this.includeIndustry.join(', ');
    this.filters.include_Zip_Code = this.includeZipcode.join(', ');
    this.filters.include_sic = this.includeSiccode.join(', ');
    this.filters.include_naic = this.includeNaiccode.join(', ');
  
    // Apply the filter on the table data
    this.filters.include_employee_size = this.selectedEmployeeSizes.join(', ');
    this.filters.include_job_function = this.selectedJobFunctions.join(', ');
    this.filters.include_job_level = this.selectedJobLevels.join(', ');
  
    // Update the filters in the service
    this.filterService.updateFilters(this.filters);
  
    // Retrieve saved filters from local storage
    const savedFilters = localStorage.getItem('savedFilters');
    if (savedFilters) {
      const parsedFilters = JSON.parse(savedFilters);
      this.filterService.updateFilters(parsedFilters);
    }
  
    // Save the updated filters to local storage
    localStorage.setItem('savedFilters', JSON.stringify(this.filters));
  
    // Execute the search with the applied filters
    this.search();
  
    // Update local storage after applying filters
    this.updateLocalStorage();
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
    console.log('Filters applied:', {
      includeCompanyName: this.includeCompanyName,
    });
    console.log('this is the include company count',this.includeCompanyName.length);
    
  
    // Safely join arrays if they are arrays, or default to an empty string
    this.filters.include_job_title = Array.isArray(this.includeJobTitles) ? this.includeJobTitles.join(', ') : '';
    this.filters.include_country = Array.isArray(this.includecountry) ? this.includecountry.join(', ') : '';
    this.filters.include_company_name = Array.isArray(this.includeCompanyName) ? this.includeCompanyName.join(', ') : '';
    this.filters.include_city = Array.isArray(this.includeCity) ? this.includeCity.join(', ') : '';
    this.filters.include_region = Array.isArray(this.includeRegion) ? this.includeRegion.join(', ') : '';
    this.filters.include_Industry = Array.isArray(this.includeIndustry) ? this.includeIndustry.join(', ') : '';
    this.filters.include_state = Array.isArray(this.includeState) ? this.includeState.join(', ') : '';
    this.filters.include_Zip_Code = Array.isArray(this.includeZipcode) ? this.includeZipcode.join(', ') : '';
    this.filters.include_sic = Array.isArray(this.includeSiccode) ? this.includeSiccode.join(', ') : '';
    this.filters.include_naic = Array.isArray(this.includeNaiccode) ? this.includeNaiccode.join(', ') : '';
    this.filters.include_company_domain = Array.isArray(this.includeCompanyDomain) ? this.includeCompanyDomain.join(', ') : '';
    this.filters.exclude_job_title = Array.isArray(this.excludeJobTitles) ? this.excludeJobTitles.join(', ') : '';
    this.filters.exclude_industry = Array.isArray(this.excludeIndustry) ? this.excludeIndustry.join(', ') : '';
    this.filters.exclude_company_name = Array.isArray(this.excludeCompanyName) ? this.excludeCompanyName.join(', ') : '';
    this.filters.exclude_country = Array.isArray(this.excludeCountry) ? this.excludeCountry.join(', ') : '';
    this.filters.exclude_company_domain = Array.isArray(this.excludeCompanyDomain) ? this.excludeCompanyDomain.join(', ') : '';
  
    // Update include_employee_size filter
    this.filters.include_employee_size = Array.isArray(this.selectedEmployeeSizes) ? this.selectedEmployeeSizes.join(', ') : '';
    this.filters.include_job_function = Array.isArray(this.selectedJobFunctions) ? this.selectedJobFunctions.join(', ') : '';
    this.filters.include_job_level = Array.isArray(this.selectedJobLevels) ? this.selectedJobLevels.join(', ') : '';
  
    // Apply filter and update UI/local storage
    this.applyFilter();
    this.formatChipsData();
    this.updateLocalStorage();
  }
  
  
  formatChipsData(): void {
    this.filters.include_job_title = this.includeJobTitles.join(', ');
    this.filters.include_country = this.includecountry.join(', ');
    this.filters.include_company_name = this.includeCompanyName.join(', ');
    this.filters.include_city = this.includeCity.join(', ');
    this.filters.include_region = this.includeRegion.join(', ');
    this.filters.include_Industry = this.includeIndustry.join(', ');
    this.filters.include_state = this.includeState.join(', ');
    this.filters.include_Zip_Code = this.includeZipcode.join(', ');
    this.filters.include_sic = this.includeSiccode.join(', ');
    this.filters.include_naic = this.includeNaiccode.join(', ');
    this.filters.include_company_domain = this.includeCompanyDomain.join(', ');
    this.filters.exclude_job_title = this.excludeJobTitles.join(', ');
    this.filters.exclude_industry = this.excludeIndustry.join(', ');

    this.filters.exclude_company_name = this.excludeCompanyName.join(', ');
    this.filters.exclude_country = this.excludeCountry.join(', ');
    this.filters.exclude_company_domain = this.excludeCompanyDomain.join(', ');
    this.filters.include_job_function = this.selectedJobFunctions.join(', ');
    this.filters.include_employee_size = this.selectedEmployeeSizes.join(', ');
    this.filters.include_job_level = this.selectedJobLevels.join(', ');
    this.updateLocalStorage();
  }

  ifclick() {
    this.checked = !this.checked;
  }

  ifclickk() {
    this.checkedd = !this.checkedd;
  }

  ifclickjobtitle() {
    this.checkforjobtitle = !this.checkforjobtitle;
  }

  ifclickoncountry() {
    this.checkforcountry = !this.checkforcountry;
  }

  applyStoredFilters(storedFilters: any): void {
    this.filters = storedFilters;

    if (storedFilters.include_company_name) {
      this.includeCompanyName = storedFilters.include_company_name.split(', ');
    }

    if (storedFilters.include_job_title) {
      this.includeJobTitles = storedFilters.include_job_title.split(', ');
      this.IncludejobTitleListText = this.includeJobTitles.join(', ');
      
    }

    if (storedFilters.include_country) {
      this.includecountry = storedFilters.include_country.split(', ');
    }

    if (storedFilters.include_company_domain) {
      this.includeCompanyDomain =
        storedFilters.include_company_domain.split(', ');
    }

    if (storedFilters.include_state) {
      this.includeState = storedFilters.include_state.split(', ');
    }

    if (storedFilters.include_city) {
      this.includeCity = storedFilters.include_city.split(', ');
    }

    if (storedFilters.include_region) {
      this.includeRegion = storedFilters.include_region.split(', ');
    }

    if (storedFilters.include_ndustry) {
      this.includeIndustry = storedFilters.include_industry.split(', ');
    }

    if (storedFilters.include_zip_code) {
      this.includeZipcode = storedFilters.include_zip_code.split(', ');
    }

    if (storedFilters.include_sic) {
      this.includeSiccode = storedFilters.include_sic.split(', ');
    }

    if (storedFilters.include_naic) {
      this.includeNaiccode = storedFilters.include_naic.split(', ');
    }

    if (storedFilters.include_employee_size) {
      this.selectedEmployeeSizes =
        storedFilters.include_employee_size.split(', ');
    }

    if (storedFilters.include_job_function) {
      this.selectedJobFunctions =
        storedFilters.include_job_function.split(', ');
    }

    if (storedFilters.selected_job_levels) {
      this.selectedJobLevels = storedFilters.selected_job_levels.split(', ');
      
      // Make sure jobLevelControl reflects the selected job levels
      this.jobLevelControl.setValue(this.selectedJobLevels);
    }
    
// Exclude Filters (Handling missing logic for exclude filters)
if (storedFilters.exclude_company_name) {
  this.excludeCompanyName = storedFilters.exclude_company_name.split(', ');
}

if (storedFilters.exclude_job_title) {
  this.excludeJobTitles = storedFilters.exclude_job_title.split(', ');
  this.excludejobTitleListText = this.excludeJobTitles.join(', ');
}

if (storedFilters.exclude_country) {
  this.excludeCountry = storedFilters.exclude_country.split(', ');
}

if (storedFilters.exclude_company_domain) {
  this.excludeCompanyDomain = storedFilters.exclude_company_domain.split(', ');
}
    // Update the filters in the service
    this.filterService.updateFilters(this.filters);
  }



  filterSuggestions(query: string): void {
    // Filter the suggestions based on the search query
    console.log(query, 'company');

    this.filteredSuggestions = this.companyNameSuggestions
      .filter((suggestion) =>
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
    names.forEach((name) => {
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
      .filter((company) => company.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10);
    console.log(
      'Filtered Suggestions:',
      this.filteredexcludecompanySuggestions
    );
  }

  
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
      .filter((country) => country.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10);
  }

  // job title suggestions
  
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



  addExcludeJobTitle(value: string): void {
    const names = value.split(',');

    // Trim each name and add it to the includeCompanyName array
    names.forEach((name) => {
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
    this.addExcludeJobTitle(value);
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
      .filter((jobTitle) =>
        jobTitle.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 10);
  }

  // excludecountry suggesion

  addExcludecountry(value: string): void {
    const names = value.split(',');

    names.forEach((name) => {
      const trimmedName = name.trim();
      if (trimmedName && !this.excludeJobTitles.includes(trimmedName)) {
        this.excludeCountry.push(trimmedName);
        this.updateLocalStorage();
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
    this.addExcludecountry(value);
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
      .filter((jobTitle) =>
        jobTitle.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 10);
  }

  addCompanyNameFromSavedList(companyNames: string[]): void {
    companyNames.forEach((name) => {
      const trimmedName = name.trim();
      if (trimmedName && !this.includeCompanyName.includes(trimmedName)) {
        this.includeCompanyName.push(trimmedName);
        this.updateLocalStorage(); // Update local storage or any state management
      }
    });

    this.updateFilters(); // Apply filters after adding company names
  }
  addCompanyDomainFromSavedList(companyNames: string[]): void {
    companyNames.forEach((name) => {
      const trimmedName = name.trim();
      if (trimmedName && !this.includeCompanyDomain.includes(trimmedName)) {
        this.includeCompanyDomain.push(trimmedName);
        this.updateLocalStorage(); // Update local storage or any state management
      }
    });

    this.updateFilters(); // Apply filters after adding company names
  }

  addCompanyName(value: string): void {
    const names = value.split(',');

    names.forEach((name) => {
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
    this.applyFilter();
  }



  // Function to update localStorage with current filter values
  updateLocalStorage(): void {
    console.log('Updating local storage...');
    const filtersToSave = {
      include_company_name: this.includeCompanyName,
      include_company_domain: this.includeCompanyDomain,
      exclude_company_name: this.excludeCompanyName,
      exclude_company_domain: this.excludeCompanyDomain,
      include_First_Name: this.filters.include_First_Name || [],
      jobtitle: this.includeJobTitles,
      excludeJobtitle: this.excludeJobTitles,
      selectedJobLevels: this.selectedJobLevels || [],
      selectedEmployeeSizes: this.selectedEmployeeSizes || [],
      selectedJobFunctions: this.selectedJobFunctions || [],
      state: this.includeState || [],
      city: this.includeCity || [],
      region: this.includeRegion || [],
      industry: this.includeIndustry || [],
      zipcode: this.includeZipcode || [],
      excludeCountry: this.excludeCountry || [],
    };
  
    console.log('Saving filters to localStorage:', filtersToSave);
    localStorage.setItem('savedFilters', JSON.stringify(filtersToSave));
    localStorage.setItem(
      'ExcludecompanyNameFilter',
      JSON.stringify(this.excludeCompanyName)
    );
  
    // Log the stored exclude company names
    console.log('Exclude Company Names Saved:', this.excludeCompanyName);
    localStorage.setItem(
      'companyNameFilter',
      JSON.stringify(this.includeCompanyName)
    );
    localStorage.setItem('country', JSON.stringify(this.includecountry));
    localStorage.setItem(
      'companyDomain',
      JSON.stringify(this.includeCompanyDomain)
    );
    localStorage.setItem(
      'excludeCompanyDomain',
      JSON.stringify(this.excludeCompanyDomain)
    );
    localStorage.setItem(
      'include_First_Name',
      JSON.stringify(this.filters.include_First_Name)
    );
    localStorage.setItem('jobtitle', JSON.stringify(this.includeJobTitles));
    localStorage.setItem(
      'excludeJobtitle',
      JSON.stringify(this.excludeJobTitles)
    );
    localStorage.setItem(
      'selectedJobLevels',
      JSON.stringify(this.selectedJobLevels)
    );
    localStorage.setItem('excludeCountry', JSON.stringify(this.excludeCountry));
    localStorage.setItem(
      'selectedEmployeeSizes',
      JSON.stringify(this.selectedEmployeeSizes)
    );
    localStorage.setItem(
      'selectedJobFunctions',
      JSON.stringify(this.selectedJobFunctions)
    );
    localStorage.setItem('state', JSON.stringify(this.includeState));
    localStorage.setItem('city', JSON.stringify(this.includeCity));
    localStorage.setItem('region', JSON.stringify(this.includeRegion));
    localStorage.setItem('industry', JSON.stringify(this.includeIndustry));
    localStorage.setItem('zipcode', JSON.stringify(this.includeZipcode));
    localStorage.setItem('appliedFilters', JSON.stringify(this.filters));
    localStorage.setItem('savedFilters', JSON.stringify(this.filters));
  }

  retrieveAndApplySpecificFilters(): void {
    const savedFilters = localStorage.getItem('savedFilters');
    if (savedFilters) {
      const parsedFilters = JSON.parse(savedFilters);
      console.log('Loaded filters from localStorage:', parsedFilters);
  
      this.includeCompanyName = parsedFilters.include_company_name || [];
      this.includeCompanyDomain = parsedFilters.include_company_domain || [];
      this.excludeCompanyName = parsedFilters.exclude_company_name || [];
      this.excludeCompanyDomain = parsedFilters.exclude_company_domain || [];
      this.filters.include_First_Name = parsedFilters.include_First_Name || [];
      this.includeJobTitles = parsedFilters.jobtitle || [];
      this.excludeJobTitles = parsedFilters.excludeJobtitle || [];
      this.selectedJobLevels = parsedFilters.selectedJobLevels || [];
      this.selectedEmployeeSizes = parsedFilters.selectedEmployeeSizes || [];
      this.selectedJobFunctions = parsedFilters.selectedJobFunctions || [];
      this.includeState = parsedFilters.state || [];
      this.includeCity = parsedFilters.city || [];
      this.includeRegion = parsedFilters.region || [];
      this.includeIndustry = parsedFilters.industry || [];
      this.includeZipcode = parsedFilters.zipcode || [];
      this.excludeCountry = parsedFilters.excludeCountry || [];
  
      // Reapply form controls
      this.reapplyFormControls();
    } else {
      console.log('No saved filters found in localStorage.');
    }
  }
  

  // Reapply form control values to reflect the stored filters
  reapplyFormControls(): void {
    if (this.selectedEmployeeSizes) {
      this.employeeSizeControl.setValue(this.selectedEmployeeSizes);
    }
    if (this.selectedJobLevels) {
      this.jobLevelControl.setValue(this.selectedJobLevels);
    }
    if (this.selectedJobFunctions) {
      this.jobFunctionControl.setValue(this.selectedJobFunctions);
    }
  }
  // Function to add CompanyName from autocomplete option
  addCompanyNameFromAuto(event: any): void {
    this.addCompanyName(event.option.value);
  }

  // countries localstorage
  addCountry(value: string): void {
    const names = value.split(',');
    // Trim each name and add it to the includeCountry array
    names.forEach((name) => {
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

  addCountryNameFromAuto(event: any): void {
    this.addCountry(event.option.value);
  }

  // Function to add city
  addCity(value: string): void {
    const names = value.split(',');
    names.forEach((name) => {
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
      .filter((city) => city.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10);
  }

  addState(value: string): void {
    const names = value.split(',');
    names.forEach((name) => {
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
      .filter((country) => country.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10);
  }

  // region
  addRegion(value: string): void {
    const names = value.split(',');
    names.forEach((name) => {
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
      .filter((country) => country.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10);
  }

  // zip code

  includeZipcode: string[] = [];

  // Function to add zip code
  addZipCode(value: string): void {
    const codes = value.split(',').map((code) => code.trim()); // Convert to array of trimmed codes
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
      .filter((zipCode: string) =>
        zipCode.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 10);
  }

  ////sic

  includeSiccode: string[] = [];
  // Function to add sic code
  addSicCode(value: string): void {
    const codes = value.split(',').map((code) => code.trim()); // Convert to array of trimmed codes
    codes.forEach((code: string) => {
      if (code && !this.includeSiccode.includes(code)) {
        this.includeSiccode.push(code);
        this.updateLocalStorage();
      }
    });

    if (this.inputElementSiccode && this.inputElementSiccode.nativeElement) {
      this.inputElementSiccode.nativeElement.value = ''; // Clear input field
    }
    this.updateFilters();
  }
  addSicCodeFromAuto(event: any): void {
    this.addSicCode(event.option.value);
  }

  currentInput: string = ''; // Current input value
  debounceTimeout: any = null; // Timeout for debouncing
  // Handle key up events for input (with debouncing)
  handleKeyUp(event: KeyboardEvent): void {
    // console.log('Key pressed:', event.key); // Log the pressed key

    // Add title on Enter or comma
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault(); // Prevent default behavior (like form submission)

      this.addJobTitlesFromInput(this.currentInput); // Add titles from the input
      this.currentInput = ''; // Clear the current input field
    }

    // Handle Backspace: if the input field is empty, remove the last chip
    if (
      event.key === 'Backspace' &&
      this.currentInput.length === 0 &&
      this.includeJobTitles.length > 0
    ) {
      this.includeJobTitles.pop(); // Remove the last job title
    }

    // Debounce the input filtering to prevent frequent updates
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout); // Clear previous timeout
    }
    this.debounceTimeout = setTimeout(() => {
      this.filterJobTitleSuggestions(this.currentInput); // Filter suggestions after debounce
    }, 300); // Delay of 300ms for debouncing
  }

  // Add job titles from input
  addJobTitlesFromInput(input: string): void {
    // Split input by commas and add to the chip list
    const titles = input
      .split(',')
      .map((title) => title.trim())
      .filter((title) => title); // Trim spaces and filter empty titles
    console.log('Titles to add:', titles); // Log the titles that will be added

    titles.forEach((title) => {
      if (title && !this.includeJobTitles.includes(title)) {
        this.includeJobTitles.push(title); // Add the title if not already present
        console.log(`Added title: ${title}`); // Log the title added
      } else {
        console.log(`Title already exists: ${title}`); // Log if the title already exists
      }
    });

    // Update localStorage and filters only when titles have changed
    if (titles.length > 0) {
      this.updateLocalStorage(); // Save the titles to local storage
      this.updateFilters(); // Update the filters after adding titles
    }
  }

  // Filter job title suggestions based on user input (optimized with caching)
  filterJobTitleSuggestions(inputValue: string): void {
    const filterValue = inputValue.toLowerCase();
    if (!filterValue) {
      this.filteredJobTitleSuggestions = []; // Clear suggestions if no input
      return;
    }
    // Cache the filtering result to improve performance
    this.filteredJobTitleSuggestions = this.jobTitleSuggestions.filter(
      (title) => title.toLowerCase().includes(filterValue)
    );
  }

  // Exclude job title

  currentInput1: string = ''; // Current input value
  debounceTimeout1: any = null; // Timeout for debouncing
  // Handle key up events for input (with debouncing)
  // Handle key up events for input (with debouncing)
  handleKeyUp1(event: KeyboardEvent): void {
    // Add title on Enter or comma
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault(); // Prevent default behavior (like form submission)

      this.addJobTitlesFromInput1(this.currentInput1); // Add titles from the input
      this.currentInput1 = ''; // Clear the input field
      return; // Stop further execution
    }

    // Handle Backspace: if the input field is empty, remove the last chip
    if (
      event.key === 'Backspace' &&
      this.currentInput1.length === 0 &&
      this.excludeJobTitles.length > 0
    ) {
      this.excludeJobTitles.pop(); // Remove the last job title
    }

    // Debounce the input filtering to prevent frequent updates
    if (this.debounceTimeout1) {
      clearTimeout(this.debounceTimeout1); // Clear previous timeout
    }
    this.debounceTimeout1 = setTimeout(() => {
      this.filterJobTitleSuggestions1(this.currentInput1); // Filter suggestions after debounce
    }, 300); // Delay of 300ms for debouncing
  }

  // Add job titles from input
  addJobTitlesFromInput1(input: string): void {
    // Split input by commas and add to the chip list
    const titles = input
      .split(',')
      .map((title) => title.trim())
      .filter((title) => title); // Trim spaces and filter empty titles

    titles.forEach((title) => {
      if (title && !this.excludeJobTitles.includes(title)) {
        this.excludeJobTitles.push(title); // Add the title if not already present
      }
    });

    // Update localStorage and filters only when titles have changed
    if (titles.length > 0) {
      this.updateLocalStorage(); // Save the titles to local storage
      this.updateFilters(); // Update the filters after adding titles
    }
  }

  // Filter job title suggestions based on user input (optimized with caching)
  filterJobTitleSuggestions1(inputValue: string): void {
    const filterValue = inputValue.toLowerCase();

    // If no input, clear suggestions
    if (!filterValue) {
      this.filteredJobTitleSuggestions = [];
      return;
    }

    // Cache the filtering result to improve performance
    this.filteredJobTitleSuggestions = this.jobTitleSuggestions.filter(
      (title) => title.toLowerCase().includes(filterValue)
    );
  }

  // Add job title from autocomplete selection
  addDomainFromAuto(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue; // Get the selected value from the autocomplete
    this.addJobTitle(value); // Add the selected job title
  }

  // Add a single job title to the list of selected items (chips)
  addJobTitle(value: string): void {
    const titles = value
      .split(',')
      .map((domain) => domain.trim())
      .filter((domain) => domain); // Split and trim input

    titles.forEach((title) => {
      if (title && !this.includeJobTitles.includes(title)) {
        this.includeJobTitles.push(title); // Add title if not present
      }
    });

    this.updateLocalStorage(); // Update localStorage after saving
    this.updateFilters(); // Update filters after saving
  }

  // Focus the input field when clicking anywhere inside the custom chip container
  focusInput(inputField: HTMLInputElement): void {
    inputField.focus(); // Set focus on the input field
  }

  // Optional: Implement `trackBy` for better performance when rendering a large list
  trackByJobTitle(index: number, jobtitle: string): string {
    return jobtitle; // Use the job title as a unique identifier
  }

  ////sic

  includeNaiccode: string[] = [];
  // Function to add sic code
  addNaicCode(value: string): void {
    const codes = value.split(',').map((code) => code.trim()); // Convert to array of trimmed codes
    codes.forEach((code: string) => {
      if (code && !this.includeNaiccode.includes(code)) {
        this.includeNaiccode.push(code);
        this.updateLocalStorage();
      }
    });

    if (this.inputElementNaiccode && this.inputElementNaiccode.nativeElement) {
      this.inputElementNaiccode.nativeElement.value = ''; // Clear input field
    }
    this.updateFilters();
  }

  

  addNaicCodeFromAuto(event: any): void {
    this.addNaicCode(event.option.value);
  }

  // Industry

  addIndustry(value: string): void {
    const names = value.split(',');
    names.forEach((name) => {
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
      .filter((country) => country.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10);
  }

  //excludeindustry

  addExcludeIndustry(value: string): void {
    const names = value.split(',');

    names.forEach((name) => {
      const trimmedName = name.trim();
      if (trimmedName && !this.excludeIndustry.includes(trimmedName)) {
        this.excludeIndustry.push(trimmedName);
        this.updateLocalStorage();
      }
    });

    // Reset the input value
    if (
      this.inputElementExcludeIndustry &&
      this.inputElementExcludeIndustry.nativeElement
    ) {
      this.inputElementExcludeIndustry.nativeElement.value = '';
    }

    this.updateFilters();
  }

  // Function to add city from autocomplete
  addExcludeIndustryNameFromAuto(event: any): void {
    const value = event.option.viewValue;
    this.addExcludeIndustry(value);
    // Reset the input value if the input element is available
    if (
      this.inputElementExcludeIndustry &&
      this.inputElementExcludeIndustry.nativeElement
    ) {
      this.inputElementExcludeIndustry.nativeElement.value = '';
    }
  }

  fetchExcludeIndustrySuggestions(): void {
    const url = 'https://api.vectordb.app/v1/auto/industry/?';

    this.http.get<string[]>(url).subscribe(
      (response: string[]) => {
        this.excludeindustrySuggestions = response;
      },
      (error) => {
        console.error('Error fetching job title suggestions:', error);
      }
    );
  }

  filterExcludeIndustrySuggestions(query: string): void {
    this.filteredexcludeIndustrySuggestions = this.excludeindustrySuggestions
      .filter((jobTitle) =>
        jobTitle.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 10);
  }

  isLoading = false; // Initialize the loader flag
  // addSimpleCompanyDomain(value: string): void {
  //   const names = value.split(',').map(name => name.trim()).filter(name => name);
  //   let updated = false;

  //   names.forEach(name => {
  //     if (name && !this.includeCompanyDomain.includes(name)) {
  //       this.includeCompanyDomain.push(name);
  //       updated = true;
  //     }
  //   });

  //   if (updated) {
  //     this.updateLocalStorage();
  //     this.updateFilters();
  //   }
  // }
// In your FiltersComponent class

companyNameListText: string = '';

  companyListText: string = '';
  saveAndSearch(): void {
    // Split the textarea input by commas and clean up spaces
    this.includeCompanyDomain = this.companyListText
      .split(',')
      .map((domain) => domain.trim())
      .filter((domain) => domain);

    // Update localStorage and the filters after saving
    this.updateLocalStorage();
    this.updateFilters();
  }
  isFilterApplied: boolean = false; 
  saveAndSearchForCname(): void {
    this.includeCompanyName = this.companyNameListText
      .split(',')
      .map((name) => name.trim())
      .filter((name) => name);
      
    // this.isFilterApplied = this.includeCompanyName.length > 0; // Set flag based on active filters
    this.updateLocalStorage();
    this.updateFilters(); // Ensure this function updates the table's data source
  }
  

  
  loadSavedFilters(): void {
    const savedFilters = localStorage.getItem('savedFilters');
    if (savedFilters) {
      const parsedFilters = JSON.parse(savedFilters);
      console.log('Loaded filters from localStorage:', parsedFilters);
      this.includeCompanyName = parsedFilters.include_company_name || [];
      // this.companyNameListText = this.includeCompanyName.join(', '); // Update the text area as well

      this.includeCompanyDomain=parsedFilters.include_company_domain || [];
      // this.companyListText=this.includeCompanyDomain.join(', ')
    } else {
      console.log('No saved filters found in localStorage.');
    }
  }
  

  excludecompanyNameListText: string = '';
  saveAndSearchForExcludeCname(): void {
    // Split the textarea input by commas and clean up spaces
    this.excludeCompanyName = this.excludecompanyNameListText
      .split(',')
      .map((excludeCompanyName) => excludeCompanyName.trim())
      .filter((excludeCompanyName) => excludeCompanyName);
    // Update filters and localStorage after saving
    this.updateLocalStorage();
    this.updateFilters();
  }
  

  // job title
  IncludejobTitleListText: string = '';
  saveAndSearchForJobtitle(): void {
    // Split the textarea input by commas and clean up spaces
    this.includeJobTitles = this.IncludejobTitleListText.split(',')
      .map((jobtitle) => jobtitle.trim())
      .filter((jobtitle) => jobtitle);

    // Update localStorage and the filters after saving
    this.updateLocalStorage();
    this.updateFilters();
  }

  excludejobTitleListText: string = '';
  saveAndSearchForexcludeJobtitle(): void {
    // Split the textarea input by commas and clean up spaces
    this.excludeJobTitles = this.excludejobTitleListText
      .split(',')
      .map((jobtitle) => jobtitle.trim())
      .filter((jobtitle) => jobtitle);

    // Update localStorage and the filters after saving
    this.updateLocalStorage();
    this.updateFilters();
  }

  // addCompanyDomain(event: string): void {
  //   const names = event.split(',').map(name => name.trim()).filter(name => name); // Clean up input
  //   const batchSize = 500; // Set your batch size
  //   let batchCount = Math.ceil(names.length / batchSize); // Calculate number of batches
  //   let currentBatchIndex = 0;

  //   // Show loader
  //   this.isLoading = true;

  //   const processNextBatch = () => {
  //     const start = currentBatchIndex * batchSize;
  //     const end = start + batchSize;
  //     const currentBatch = names.slice(start, end); // Get current batch

  //     // Add current batch to includeCompanyDomain
  //     let updated = false;
  //     currentBatch.forEach(name => {
  //       if (!this.includeCompanyDomain.includes(name)) {
  //         this.includeCompanyDomain.push(name);
  //         updated = true;
  //       }
  //     });

  //     if (updated) {
  //       this.updateLocalStorage(); // Update localStorage after each batch if updated
  //     }

  //     currentBatchIndex++; // Move to the next batch

  //     if (currentBatchIndex < batchCount) {
  //       // Process the next batch after a delay (to simulate async behavior)
  //       setTimeout(processNextBatch, 500); // Adjust the delay as necessary
  //     } else {
  //       // Reset the input field and hide loader after all batches are processed
  //       if (this.inputElement6 && this.inputElement6.nativeElement) {
  //         this.inputElement6.nativeElement.value = '';
  //       }

  //       this.updateFilters(); // Update filters once all batches are processed
  //       this.isLoading = false; // Hide loader
  //     }
  //   };

  //   // Start processing batches
  //   processNextBatch();
  // }

  // removeCompanyDomain(domain: string): void {
  //   const index = this.includeCompanyDomain.indexOf(domain);
  //   if (index > -1) {
  //     this.includeCompanyDomain.splice(index, 1);
  //     this.updateFilters();
  //     this.updateLocalStorage();
  //   }
  // }

  addExcludeCompanyDomain(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      // Split the input by separator if multiple job titles are entered
      const titles = value.split(',');
      // Trim each title and add it to the excludeJobTitles array
      titles.forEach((companyDomain) => {
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
  
  excludecompanydomainlist: string = '';
  saveAndSearchforexcludedomain(): void {
    // Split the textarea input by commas and clean up spaces
    this.excludeCompanyDomain = this.excludecompanydomainlist
      .split(',')
      .map((domain) => domain.trim())
      .filter((domain) => domain);

    // Update localStorage and the filters after saving
    this.updateLocalStorage();
    this.updateFilters();
  }

  addJobTitle1(value: string): void {
    const names = value.split(',');

    names.forEach((name) => {
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
  // removeJobTitle(jobTitle: string): void {
  //   const index = this.includeJobTitles.indexOf(jobTitle);
  //   if (index !== -1) {
  //     this.includeJobTitles.splice(index, 1);
  //     this.updateFilters();
  //     this.updateLocalStorage();
  //   }
  // }

  tourGuide() {
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
            side: 'left',
            align: 'start',
          },
        },
      ],
    });

    driverObj.drive();
  }

  jobTitleGuide() {
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
            side: 'left',
            align: 'start',
          },
        },
      ],
    });

    driverObj.drive();
  }

  empSizeGuide() {
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
            side: 'left',
            align: 'start',
          },
        },
      ],
    });

    driverObj.drive();
  }

  industryGuide() {
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
            side: 'left',
            align: 'start',
          },
        },
      ],
    });

    driverObj.drive();
  }

  countryGuide() {
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
            side: 'left',
            align: 'start',
          },
        },
      ],
    });

    driverObj.drive();
  }

  zipCodeGuide() {
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
            side: 'left',
            align: 'start',
          },
        },
      ],
    });

    driverObj.drive();
  }
  value: any;
  savedFilters: { include_company_name?: string[] ,
    include_company_domain?:string[]
  } = {};
  getstoredvalue() {
    localStorage.getItem('savedFilters');
    this.value = localStorage.getItem('savedFilters');
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
      excludeCompanyDomain: this.excludeCompanyDomain,
    };

    console.log('Filters to be saved:', filters);

    this.apiService.saveSearch(name, filters).subscribe(
      () => {
        console.log('Search saved successfully!');
        // Reset the filter notification flag to true
        this.apiService.triggerNotification();
        // Optionally, clear the local storage if you want the notification to show regardless
        localStorage.removeItem('filterNotificationClosed');
      },
      (error: any) => {
        console.error('Error saving search:', error);
      }
    );
  }

  openDialog() {
    const dialogRef = this.dialog.open(NameSavedsearchComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  handlePaste(event: ClipboardEvent, type: string): void {
    event.preventDefault();
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData?.getData('text');
    if (pastedText) {
      const domains = pastedText.split(/[,\s]+/);
      if (type === 'include') {
        this.includeCompanyDomain.push(
          ...domains.filter((d) => d.trim().length > 0)
        );
      } else if (type === 'exclude') {
        this.excludeCompanyDomain.push(
          ...domains.filter((d) => d.trim().length > 0)
        );
      }
    }
  }



  


  // REMOVE THE COUNT
  removeAllCompanyNames(): void {
    this.includeCompanyName = [];
    this.companyNameListText = '';
    // Clear the array
    this.updateFilters();
    this.updateLocalStorage(); // Update the filters accordingly
  }
  removeExcludeCompanyNames(): void {
    this.excludeCompanyName = [];
    this.excludecompanyNameListText = '';
    this.updateFilters();
    this.updateLocalStorage();
  }
  // Remove all company domains
  removeAllCompanyDomain(): void {
    this.includeCompanyDomain = [];
    this.companyListText = '';
    this.updateLocalStorage();
    this.updateFilters();
  }
  removeExcludeCompanyDomainCount(): void {
    this.excludeCompanyDomain = [];
    this.excludecompanydomainlist = '';
    this.updateLocalStorage();
    this.updateFilters();
  }
  removeincludeJobTitles(): void {
    this.includeJobTitles = [];
    // this.currentInput = '';
    this.IncludejobTitleListText = '';
    this.updateFilters();
    this.updateLocalStorage();
  }
  removeExcludeJobTitles(): void {
    this.excludeJobTitles = [];
    // this.currentInput1 = '';
    this.excludejobTitleListText = '';
    this.updateFilters();
    this.updateLocalStorage();
  }
  removeallJobTitles(): void {
    this.excludeJobTitles=[]
    this.includeJobTitles=[]
    // this.currentInput1 = '';
    // this.currentInput = '';
    this.IncludejobTitleListText = '';
    this.excludejobTitleListText = '';
    this.updateFilters();
    this.updateLocalStorage();
  }
  removeincludeCountry(): void {
    this.includecountry = [];
    this.updateFilters();
    this.updateLocalStorage();
  }
  removeincludeIndustry(): void {
    this.includeIndustry = [];
    this.updateFilters();
    this.updateLocalStorage();
  }
  removeExcludeIndustry(): void {
    this.excludeIndustry = [];
    this.updateFilters();
    this.updateLocalStorage();
  }
  removeincludeZipCode(): void {
    this.includeZipcode = [];
    this.updateFilters();
    this.updateLocalStorage();
  }

  removeincludeState(): void {
    this.includeState = [];
    this.updateFilters();
    this.updateLocalStorage();
  }
  removeincludeRegion(): void {
    this.includeRegion = [];
    this.updateFilters();
    this.updateLocalStorage();
  }
  removeincludeCity(): void {
    this.includeCity = [];
    this.updateFilters();
    this.updateLocalStorage();
  }
  removeExcludecountry(): void {
    this.excludeCountry = [];
    this.updateFilters();
    this.updateLocalStorage();
  }
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
      this.updateLocalStorage();
    }
  }

  removeExcludeCountry(country: string): void {
    const index = this.excludeCountry.indexOf(country);
    if (index !== -1) {
      this.excludeCountry.splice(index, 1);
      this.updateFilters();
      this.updateLocalStorage();
    }
  }
  getAppliedFiltersCount(): number {
    let count = 0;
    for (const key in this.filters) {
      if (this.filters.hasOwnProperty(key)) {
        // Check if the property is an array (checkboxes)
        if (Array.isArray(this.filters[key])) {
          // Check if all options are selected
          const allSelected = this.filters[key].every(
            (isChecked: boolean) => isChecked
          );
          if (!allSelected) {
            // Count the number of selected checkboxes
            count += this.filters[key].filter(
              (isChecked: boolean) => isChecked
            ).length;
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

  removeAllselectedJobLevels() {
    this.selectedJobLevels = [];
    this.jobLevelControl.patchValue([], { emitEvent: false });
    this.updateFilters();
    this.updateLocalStorage();
  }
  removeAllselectedJobFunctions() {
    this.selectedJobFunctions = []; // Clear the selectedJobFunctions array
    // Reset the form control value to an empty array
    this.jobFunctionControl.patchValue([], { emitEvent: false });
    this.updateFilters();
    this.updateLocalStorage();
  }

  removeselectedEmployeeSizes() {
    this.selectedEmployeeSizes = [];
    this.employeeSizeControl.patchValue([], { emitEvent: false });
    this.updateFilters();
    this.updateLocalStorage();
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

    if (this.filters.hasOwnProperty('include_employee_size')) {
      this.filters['include_employee_size'] = [];
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
    if (this.filters.hasOwnProperty('exclude_industry')) {
      this.filters['exclude_industry'] = [];
    }

    if (this.filters.hasOwnProperty('include_region')) {
      this.filters['include_region'] = [];
    }

    if (this.filters.hasOwnProperty('include_Zip_Code')) {
      this.filters['include_Zip_Code'] = [];
    }

    if (this.filters.hasOwnProperty('include_sic')) {
      this.filters['include_sic'] = [];
    }
    if (this.filters.hasOwnProperty('include_naic')) {
      this.filters['include_naic'] = [];
    }

    this.companyNameListText = '';
    this.excludecompanydomainlist = '';
    this.companyListText = '';
    this.excludecompanyNameListText = '';
    this.excludecompanydomainlist = '';
    this.IncludejobTitleListText = '';
    this.excludejobTitleListText = '';
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
    this.includeCity = [];
    this.includeState = [];
    this.includeRegion = [];
    this.includeIndustry = [];
    this.includeZipcode = [];
    // Reset form control values
    this.jobFunctionControl.setValue([], { emitEvent: false });
    this.jobLevelControl.setValue([], { emitEvent: false });
    this.employeeSizeControl.setValue([], { emitEvent: false });

    // Call the method to update filters
    this.updateFilters();
    this.updateLocalStorage();
  }
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







  removeExcludeCompanyDomain(companyDomain: string): void {
    const index = this.excludeCompanyDomain.indexOf(companyDomain);
    if (index !== -1) {
      this.excludeCompanyDomain.splice(index, 1);
      this.updateLocalStorage(); // Update localStorage before updating filters
      this.updateFilters(); // Update filters after removing the domain
    }
  }
// Function to remove city
removeIndustryChip(stateName: string): void {
  const index = this.includeIndustry.indexOf(stateName);
  if (index >= 0) {
    this.includeIndustry.splice(index, 1);
    this.updateLocalStorage();
  }
}
removeExcludeIndustryChip(stateName: string): void {
  const index = this.excludeIndustry.indexOf(stateName);
  if (index >= 0) {
    this.excludeIndustry.splice(index, 1);
    this.updateLocalStorage();
  }
}
removeNaicCodeChip(zipCode: string): void {
  const index = this.includeNaiccode.indexOf(zipCode);
  if (index >= 0) {
    this.includeNaiccode.splice(index, 1);
    this.updateLocalStorage();
  }
}
// Remove a specific job title from the list
removeJobTitle(jobtitle: string): void {
  const index = this.includeJobTitles.indexOf(jobtitle);
  if (index !== -1) {
    this.includeJobTitles.splice(index, 1); // Remove the title from the list
    this.updateLocalStorage(); // Update localStorage after removal
    this.updateFilters(); // Update filters after removal
  }
}
removeZipCodeChip(zipCode: string): void {
  const index = this.includeZipcode.indexOf(zipCode);
  if (index >= 0) {
    this.includeZipcode.splice(index, 1);
    this.updateLocalStorage();
  }
}  removeRegionChip(regionName: string): void {
  const index = this.includeRegion.indexOf(regionName);
  if (index >= 0) {
    this.includeRegion.splice(index, 1);
    this.updateLocalStorage();
  }
}
// Function to remove city
removeStateChip(stateName: string): void {
const index = this.includeState.indexOf(stateName);
if (index >= 0) {
  this.includeState.splice(index, 1);
  this.updateLocalStorage();
}
}
removeCityChip(cityName: string): void {
const index = this.includeCity.indexOf(cityName);
if (index >= 0) {
  this.includeCity.splice(index, 1);
  this.updateLocalStorage();
}
}  removeCountryChip(companyName: string): void {
const index = this.includecountry.indexOf(companyName);
if (index >= 0) {
  this.includecountry.splice(index, 1);
  this.updateLocalStorage();
}
}
excludecountrySuggestions: string[] = [];
filteredexlcudecountrySuggestions: string[] = [];
// Function to remove CompanyName filter
removeCompanyName(companyName: string): void {
const index = this.includeCompanyName.indexOf(companyName);
if (index >= 0) {
  this.includeCompanyName.splice(index, 1);
  this.updateLocalStorage(); // Update localStorage after removing a filter
}
}
removeSicCodeChip(zipCode: string): void {
  const index = this.includeSiccode.indexOf(zipCode);
  if (index >= 0) {
    this.includeSiccode.splice(index, 1);
    this.updateLocalStorage();
  }
}






}
