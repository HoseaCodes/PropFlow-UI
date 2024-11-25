import { Injectable } from '@angular/core';
import { 
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot 
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PropertyService } from '../../../core/services/property.service';
import { Property } from '../../../models/property.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class PropertyResolver implements Resolve<Property> {
//   constructor(private propertyService: PropertyService) {}

//   resolve(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): Observable<Property> {
//     const propertyId = route.params['id'];
//     // return this.propertyService.getProperty(propertyId).pipe(
//     //   catchError(error => {
//     //     console.error('Error loading property:', error);
//     //     return of(null);
//     //   })
//     // );
//   }
// }