import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PropertyService } from '../../core/services/property.service';
import { Property } from '../../models/property.model';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  // styleUrls: ['./property-list.component.scss']
  // standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ]
})
export class PropertyListComponent implements OnInit, OnDestroy {
  properties: Property[] = [];
  filteredProperties: Property[] = [];
  isLoading = false;
  viewMode: 'grid' | 'list' = 'grid';
  filterForm: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private propertyService: PropertyService,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      status: ['all'],
      sortBy: ['name'],
      bedroomsMin: [''],
      bedroomsMax: [''],
      priceMin: [''],
      priceMax: ['']
    });
  }

  ngOnInit(): void {
    this.loadProperties();
    this.setupFilterSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadProperties(): void {
    this.isLoading = true;
    // this.propertyService.getProperties()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: (properties: any) => {
    //       this.properties = properties;
    //       this.applyFilters();
    //       this.isLoading = false;
    //     },
    //     error: (error: any) => {
    //       this.isLoading = false;
    //       this.snackBar.open(
    //         'Error loading properties. Please try again.',
    //         'Close',
    //         { duration: 3000 }
    //       );
    //       console.error('Error loading properties:', error);
    //     }
    //   });
  }

  private setupFilterSubscription(): void {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.applyFilters();
      });
  }

  private applyFilters(): void {
    const filters = this.filterForm.value;
    
    this.filteredProperties = this.properties.filter(property => {
      const matchesSearch = !filters.search || 
        property.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        property.address.toLowerCase().includes(filters.search.toLowerCase());
        
      const matchesStatus = filters.status === 'all' || 
        (filters.status === 'active' && property.active) ||
        (filters.status === 'inactive' && !property.active);
        
      const matchesBedrooms = (!filters.bedroomsMin || property.bedrooms >= filters.bedroomsMin) &&
        (!filters.bedroomsMax || property.bedrooms <= filters.bedroomsMax);
        
      const matchesPrice = (!filters.priceMin || property.basePrice >= filters.priceMin) &&
        (!filters.priceMax || property.basePrice <= filters.priceMax);
        
      return matchesSearch && matchesStatus && matchesBedrooms && matchesPrice;
    });

    // Apply sorting
    this.filteredProperties.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.basePrice - b.basePrice;
        case 'price-high':
          return b.basePrice - a.basePrice;
        case 'bedrooms':
          return b.bedrooms - a.bedrooms;
        default:
          return 0;
      }
    });
  }

  toggleView(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  addProperty(): void {
    this.router.navigate(['/properties/new']);
  }

  editProperty(id: number): void {
    this.router.navigate(['/properties', id, 'edit']);
  }

  viewProperty(id: number): void {
    this.router.navigate(['/properties', id]);
  }

  deleteProperty(id: number): void {
    // if (confirm('Are you sure you want to delete this property?')) {
    //   this.propertyService.deleteProperty(id)
    //     .pipe(takeUntil(this.destroy$))
    //     .subscribe({
    //       next: () => {
    //         this.loadProperties();
    //         this.snackBar.open('Property deleted successfully', 'Close', {
    //           duration: 3000
    //         });
    //       },
    //       error: (error: any) => {
    //         this.snackBar.open(
    //           'Error deleting property. Please try again.',
    //           'Close',
    //           { duration: 3000 }
    //         );
    //         console.error('Error deleting property:', error);
    //       }
    //     });
    // }
  }

  resetFilters(): void {
    this.filterForm.reset({
      search: '',
      status: 'all',
      sortBy: 'name',
      bedroomsMin: '',
      bedroomsMax: '',
      priceMin: '',
      priceMax: ''
    });
  }
}