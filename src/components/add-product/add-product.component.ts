import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddProductComponent {
  form: FormGroup;
  submitting = false;
  error: string | null = null;
  // Categories derived from server db.json (unique values)
  categories: string[] = [
    'Electronics',
    'Books',
    'Clothing',
    'Home Appliances',
    'Toys'
  ];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    // Define the reactive form with validation rules
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      category: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  // Expose controls for template convenience
  get name() { return this.form.get('name'); }
  get price() { return this.form.get('price'); }
  get category() { return this.form.get('category'); }

  submit(): void {
    this.error = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;

    const payload: Product = {
      // backend (json-server) will assign a real id; use 0 as placeholder
      id: 0,
      name: this.name?.value,
      price: Number(this.price?.value),
      category: this.category?.value
    };

    this.productService.addProduct(payload).subscribe({
      next: () => {
        this.submitting = false;
        // navigate back to product list
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.submitting = false;
        this.error = err?.message ?? 'Failed to add product';
      }
    });
  }
}
