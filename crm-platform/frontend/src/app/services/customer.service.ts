import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) { }

  getActiveCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/customers`);
  }

  getDeletedCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/customers/deleted`);
  }

  getCustomer(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/customers/${id}`);
  }

  createCustomer(customer: Omit<Customer, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}/customers`, customer);
  }

  updateCustomer(id: string, customer: Omit<Customer, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/customers/${id}`, customer);
  }

  deleteCustomer(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/customers/${id}`);
  }

  restoreCustomer(id: string): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}/customers/restore/${id}`, {});
  }

  permanentlyDeleteCustomer(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/customers/permanent/${id}`);
  }
}