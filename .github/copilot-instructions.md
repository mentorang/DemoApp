# 🧭 GitHub Copilot Project Instructions
**Project:** Angular 18 (Standalone) — Best-Practice Setup  
**Scope:** Applies to all Copilot Chat and Inline Chat sessions in VS Code for this workspace.

---

## 🏗️ Framework Context
- Use **Angular 18 Standalone Components** — no `NgModule`-based scaffolding unless explicitly requested.
- Target **Angular 18 LTS** features only.  
  ❌ Do **not** use experimental features like **Signals**, **Zoneless apps**, or **Hydration**.
- Framework stack:  
  - Angular CLI ≥ 18.x  
  - TypeScript ≥ 5.4  
  - RxJS ≥ 7.8  
  - Node ≥ 18 LTS  
- Default CSS preprocessor: **plain CSS** ( not SCSS )

---

## 🧩 General Copilot Prompting Rules
When generating or editing code:
1. **Acknowledge project context:** Angular 18 standalone app using `@Component({ standalone: true })`.
2. **Follow Angular Style Guide** — filenames, folder structure, selector conventions, and coding style.
3. **Include TypeScript typings** (`interface`, `type`, generics) in every example.
4. **Use RxJS patterns** for async data; avoid Promises unless required.
5. **Always import** from `@angular/core`, `@angular/common`, `@angular/router`, `@angular/forms`, `rxjs`.  
   Avoid deprecated APIs.
6. **Add brief comments** explaining component purpose or logic.
7. Prefer **Angular CLI** commands over manual scaffolding.

---

## 🎨 Angular Style Guide Integration
Follow these rules while generating files and components:

- **Naming**
  - Components → `PascalCase` class, kebab-case file: `student-list.component.ts`
  - Services → `camelCase` class, suffix `Service`: `student.service.ts`
  - Interfaces → prefix `I` (optional): `IStudent`

- **Folder Structure**
src/app/
components/
services/
models/
pages/
shared/

- **Component Design**
- Use `ChangeDetectionStrategy.OnPush` by default.
- Keep templates clean; no business logic in HTML.
- Use standalone imports array:  
  ```ts
  @Component({
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
    templateUrl: './student-list.component.html',
    styleUrls: ['./student-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  ```

- **Routing**
- Use functional route definitions:  
  ```ts
  export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'students', component: StudentListComponent },
  ];
  ```

- **Forms**
- Prefer Reactive Forms over Template-driven Forms.

- **HTTP**
- Use `HttpClient` from `@angular/common/http`.
- Handle errors with `catchError` and return `throwError(() => new Error(...))`.

---

## 🧠 GitHub Copilot Usage Guide
### Inline Chat (within `.ts`, `.html`, `.css`)
- Write concise, action-oriented prompts:
- `// @copilot: create CRUD service for Student model using HttpClient`
- `// @copilot: generate reactive form group for StudentFormComponent`
- `// @copilot: suggest OnPush change detection version`
- Use `Ctrl + I` (Windows) or `Cmd + I` (Mac) to trigger Inline Chat on a selected region.

### Copilot Chat Panel
- Ask for design help or refactoring:  
*“Refactor this component into a standalone Angular 18 pattern with OnPush.”*
- Include context files by right-clicking → **Add Context to Chat**.

---

## ✅ Coding Best Practices
- Enable **strict mode** in `tsconfig.json`.
- Keep components **focused and reusable** (Single Responsibility Principle).
- Move shared logic into services.
- Use **Observables + async pipe** instead of manual subscriptions.
- Use **Angular CLI testing utilities** and **Jasmine/Karma**.
- Add **JSDoc** for every public function or class.

---

## 🚫 Avoid / Do Not
- ❌ Don’t use deprecated APIs or private Angular members.  
- ❌ Don’t include external UI libraries without explicit approval.  
- ❌ Don’t generate code for experimental APIs (`signal`, `inject`, `destroyRef`, etc.).  
- ❌ Don’t hard-code API endpoints — use `environment.ts`.

---

## 🧩 Example Prompt Template
```ts
// @copilot: Create a standalone component called StudentListComponent
// that displays a sortable table of students using Angular Material Table.
// Use OnPush change detection and async pipe.