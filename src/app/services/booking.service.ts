import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Booking } from '../models/booking.model';
import { CreateBookingDto, UpdateBookingDto } from '../core/dtos/booking.dto';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  getBookings(filters?: any): Observable<Booking[]> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined) {
          params = params.append(key, filters[key]);
        }
      });
    }
    return this.http.get<Booking[]>(this.apiUrl, { params });
  }

  getBooking(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }

  createBooking(booking: CreateBookingDto): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }

  updateBooking(id: number, booking: UpdateBookingDto): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/${id}`, booking);
  }

  cancelBooking(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/cancel`, {});
  }

  checkAvailability(propertyId: number, checkIn: Date, checkOut: Date): Observable<boolean> {
    const params = new HttpParams()
      .set('propertyId', propertyId.toString())
      .set('checkIn', checkIn.toISOString())
      .set('checkOut', checkOut.toISOString());

    return this.http.get<boolean>(`${this.apiUrl}/check-availability`, { params });
  }
}