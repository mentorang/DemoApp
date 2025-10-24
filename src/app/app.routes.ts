import { Routes } from '@angular/router';
import { ListProductComponent } from '../components/list-product/list-product.component';
import { AddProductComponent } from '../components/add-product/add-product.component';
import { ChatGeminiComponent } from '../components/chat-gemini/chat-gemini.component';

export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'products', component: ListProductComponent },
  { path: 'products/add', component: AddProductComponent },
  { path: 'chat', component: ChatGeminiComponent }
];
