import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { Observable, catchError, of } from 'rxjs';

@Component({
  selector: 'app-list-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListProductComponent {
  
  error: string | null = null;
  products$!: Observable<Product[]>;

  constructor(private productService: ProductService) {
    // initialization moved to ngOnInit; constructor kept for DI only
    }

    ngOnInit(): void {
      this.products$ = this.productService.getProducts().pipe(
        catchError(err => {
          this.error = err?.message ?? 'An error occurred';
          return of([]);
        })
      );
    }
  }
