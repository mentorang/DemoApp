import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Product } from '../models/product';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  // Get all products
  getProducts() {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      catchError(error => throwError(() => new Error('Error fetching products: ' + error.message)))
    );
  }

  // Add a new product
  addProduct(product: Product) {
    return this.http.post<Product>(this.apiUrl, product).pipe(
      catchError(error => throwError(() => new Error('Error adding product: ' + error.message)))
    );
  }
}
