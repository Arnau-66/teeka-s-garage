# 🛠️ Teeka's Garage

**Teeka's Garage** is a learning project built with **Angular** that consumes the **Star Wars API (SWAPI)** to display a list of starships and their details.  
It’s part of a technical exercise inspired by a real front-end developer test from an e-commerce company in Barcelona.  
The goal is to practice **API integration**, **routing**, **services**, and **clean architecture** while exploring the Star Wars universe 🚀✨.

---

## 📖 Project Overview

The main objectives of this project are:

- ✅ Create a base Angular application with a clear, maintainable structure.  
- 🌐 **Consume the SWAPI** (`https://swapi.dev` / `https://swapi.py4e.com`) to retrieve starship data.  
- 🧭 Use **Angular Routing** to navigate between a starship list view and a starship detail view.  
- 🧰 Implement **services** to handle API calls and data flow.  
- 🛡️ Understand basic **Guards** and **JWT tokens** concepts (for future authentication scenarios).  
- 📄 Display only the **relevant starship information** on the list page (name + model), to keep the UI clean and simple.  
- 📸 Load starship images using the **Star Wars Visual Guide**:  
  `https://starwars-visualguide.com/assets/img/starships/{id}.jpg`  
- 🔄 Implement **basic pagination** to load additional starships using the `?page=` parameter.

> 📝 **Note:** If the SWAPI is unavailable, a mock JSON fallback will be used to ensure the app can still run locally.

---

## 🧰 Technologies & Tools

- Angular 17+ (standalone components, SCSS)  
- SWAPI – Star Wars API  
- Star Wars Visual Guide – Image assets  
- Postman – API testing tool  
- Git & GitHub – Version control and collaboration  
- Node.js & npm – Package management & Angular CLI

---

## 🚀 Getting Started

Follow these steps to run the project locally from scratch:

### 1. 📦 Install Node.js and Angular CLI

- **Check Node.js**  
  ```bash
  node -v
  npm -v
  ```
  Make sure you have Node.js LTS (≥ 18.x) and npm installed.

- **Install Angular CLI globally**  
  ```bash
  npm install -g @angular/cli
  ```

- **Verify Angular CLI**  
  ```bash
  ng version
  ```

---

### 2. ⬇️ Clone the repository

```bash
git clone <your-repo-url>
cd <your-project-folder>
```

> ⚠️ If your local folder name differs from the repo name, adjust the `cd` command accordingly.

---

### 3. 📥 Install dependencies

```bash
npm install
```

This will download all the required Node modules for the Angular project.

---

### 4. 🧪 Start the development server

```bash
ng serve
```

Then open http://localhost:4200 in your browser.

The server will **automatically reload** when you change any source file.

---

### 5. 🧱 Build for production

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.  
You can serve them with any static server, for example:

```bash
npx http-server dist/<project-folder> -p 4200
```

> Replace `<project-folder>` with the actual folder produced inside `dist/` (Angular may sanitize special characters).

---

### 6. 🧪 Run tests

```bash
ng test
```

This will execute unit tests via **Karma**.

---

## 🧭 Project Structure (planned)

```
src/
  app/
    core/
      services/        ← API calls, data handling
      models/          ← Interfaces & types
    features/
      starships/       ← List & Detail components
    shared/
      ui/              ← Reusable UI components
  assets/
    mock/             ← JSON fallback data (if needed)
```

---

## 📌 Notes & Future Steps

- The project will start with a **basic starship list** (name + model).  
- Later, more features such as detail views, guards, and pagination will be added incrementally.  
- This README will be updated as the project progresses.

---

## 👨‍💻 Author

**Teeka's Garage** is developed as part of the IT Academy Front-End Bootcamp 🧠💻  
Barcelona, 2025.
