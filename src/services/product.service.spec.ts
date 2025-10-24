import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Product } from '../models/product';
import { environment } from '../environments/environment';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductService);
  });

  describe('ProductService', () => {
    let service: ProductService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [ProductService]
      });
      service = TestBed.inject(ProductService);
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    describe('getProducts', () => {
      it('should return products array', () => {
        const mockProducts: Product[] = [
          {
            id: 1, name: 'Product 1', price: 100,
            category: 'Toys'
          },
          {
            id: 2, name: 'Product 2', price: 200,
            category: 'Electronics'
          }
        ];

        service.getProducts().subscribe(products => {
          expect(products).toEqual(mockProducts);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/products`);
        expect(req.request.method).toBe('GET');
        req.flush(mockProducts);
      });

      it('should handle error when API fails', () => {
        service.getProducts().subscribe({
          error: error => {
            expect(error.message).toContain('Error fetching products');
          }
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/products`);
        req.error(new ErrorEvent('Network error'));
      });
    });

    describe('addProduct', () => {
      it('should add new product', () => {
        const mockProduct: Product = {
          id: 1, name: 'New Product', price: 150,
          category: ''
        };

        service.addProduct(mockProduct).subscribe(product => {
          expect(product).toEqual(mockProduct);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/products`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(mockProduct);
        req.flush(mockProduct);
      });

      it('should handle error when adding product fails', () => {
        const mockProduct: Product = {
          id: 1, name: 'New Product', price: 150,
          category: ''
        };

        service.addProduct(mockProduct).subscribe({
          error: error => {
            expect(error.message).toContain('Error adding product');
          }
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/products`);
        req.error(new ErrorEvent('Network error'));
      });
    });
  });
});
