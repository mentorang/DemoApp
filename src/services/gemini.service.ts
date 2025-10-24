import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '../environments/environment';

/**
 * GeminiService
 * Minimal service to call Google Generative Language / Gemini-like API.
 * It expects an API key to be placed in `environment.geminiApiKey`.
 * NOTE: Adjust the request body and response parsing to match the exact Gemini endpoint you use.
 */
@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private apiKey = environment.geminiApiKey;
  // Default API URL; can be overridden in environment.geminiApiUrl
  private apiUrl = environment.geminiApiUrl || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

  constructor(private http: HttpClient) { }

  /**
   * Send prompt to Gemini and return the generated text only.
   * Prioritizes top-level "parts" then "contents->parts", "candidates", "outputs".
   */
  generateResponse(prompt: string): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // Use API key header as shown in the latest docs to avoid 401 when API key is required.
      'x-goog-api-key': this.apiKey || ''
    });

    // Body shape per the example: contents -> parts -> { text }
    const body = {
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ]
    };

    return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
      map(rawResp => {
        // Try to parse string responses to JSON
        let resp: any = rawResp;
        if (typeof resp === 'string') {
          try { resp = JSON.parse(resp); } catch { /* leave as string */ }
        }

        // Helper to extract text nodes from an array of parts/content
        const extractFromParts = (parts: any[]): string =>
          (parts || []).map(p => (typeof p === 'string' ? p : (p?.text ?? ''))).filter(Boolean).join('');

        // 1) Top-level parts: { parts: [{ text: '...' }] }
        if (resp && Array.isArray(resp.parts)) {
          const text = extractFromParts(resp.parts).trim();
          if (text) return text;
        }

        // 2) contents -> parts -> text
        if (resp && Array.isArray(resp.contents)) {
          try {
            const text = resp.contents
              .map((c: any) => extractFromParts(c.parts))
              .filter(Boolean)
              .join('\n')
              .trim();
            if (text) return text;
          } catch { /* fallthrough */ }
        }

        // 3) candidates -> content -> parts -> text
        if (resp && Array.isArray(resp.candidates) && resp.candidates[0]) {
          try {
            const candidate = resp.candidates[0];
            // candidate.content can be:
            // - an array of parts
            // - an object { parts: [...] }
            // - candidate.parts directly
            let partsArray: any[] = [];

            if (Array.isArray(candidate.content)) {
              partsArray = candidate.content;
            } else if (candidate.content && Array.isArray(candidate.content.parts)) {
              partsArray = candidate.content.parts;
            } else if (Array.isArray(candidate.parts)) {
              partsArray = candidate.parts;
            }

            const text = extractFromParts(partsArray);
            if (text) return text.trim();
          } catch { /* fallthrough */ }
        }

        // 4) outputs / output shapes
        if (resp?.output?.[0]?.content?.[0]?.text) {
          return String(resp.output[0].content[0].text).trim();
        }
        if (Array.isArray(resp.outputs)) {
          try {
            const text = resp.outputs
              .map((o: any) => extractFromParts(o.content || o.parts || []))
              .filter(Boolean)
              .join('\n')
              .trim();
            if (text) return text;
          } catch { /* fallthrough */ }
        }

        // If original raw response was a string, return it (trimmed). Otherwise fallback to JSON string.
        if (typeof rawResp === 'string') return rawResp.trim();
        return JSON.stringify(resp);
      }),
      catchError(error => throwError(() => new Error('Gemini API error: ' + (error?.message || error))))
    );
  }
}
