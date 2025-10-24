import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../services/gemini.service';

/**
 * ChatGeminiComponent
 * Simple chatbot UI that sends the prompt to GeminiService and displays responses.
 */
@Component({
  standalone: true,
  selector: 'app-chat-gemini',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-gemini.component.html',
  styleUrls: ['./chat-gemini.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatGeminiComponent {
  message = '';
  messages: { from: 'user' | 'bot'; text: string }[] = [];
  loading = false;

  constructor(private gemini: GeminiService, private cdr: ChangeDetectorRef) { }

  sendMessage() {
    const text = this.message?.trim();
    if (!text) return;

    this.messages.push({ from: 'user', text });
    this.message = '';
    this.loading = true;
    this.cdr.markForCheck();

    this.gemini.generateResponse(text).subscribe({
      next: (resp) => {
        this.messages.push({ from: 'bot', text: resp });
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.messages.push({ from: 'bot', text: 'Error: ' + (err?.message || err) });
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
