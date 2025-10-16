# Teeka's Garage

<img width="1000" height="auto" alt="README-IMG-1" src="https://github.com/user-attachments/assets/d6870120-22c7-44f3-85d2-5ca3fc10b5eb" />


**Teeka's Garage** is a learning project built with **Angular** that consumes the **Star Wars API (SWAPI)** to display a list of starships and their details.  
It’s part of a technical exercise inspired by a real front-end developer test from an e-commerce company in Barcelona.  
The goal is to practice **API integration**, **routing**, **services**, **authentication**, and **clean architecture** while exploring the Star Wars universe 🚀✨.

---

## 📖 Project Overview

**Teeka's Garage** recreates the atmosphere of **Tatooine’s starship shop**, run by the famous Jawa **Teeka** from Star Wars.  
This theme is used to structure and present the different required parts of the **IT Academy Barcelona – Sprint 7** exercise.  

The sprint requested the following key elements:

- 🏠 A **Home menu**  
- 🔐 A **Login page** with **name and email validation**, using a Firebase database as backend  
- 🚀 A **main page** displaying a **list of starships**, fetched from the **Star Wars API**  
- 📄 A **detail page** showing the **specifications of a selected starship**, using the same API  

Teeka's Garage implements all these points through an immersive Star Wars–themed interface:

- 🌍 **Home:** A preview of **Tatooine** acts as the entry screen to the experience.
  
  <img width="1000" height="auto" alt="README-IMG-2" src="https://github.com/user-attachments/assets/11d1c7d8-5a92-43ed-9ce2-20a18b455c12" />

- 🛑 **Login:** Styled as an **Imperial control checkpoint**, where users enter their credentials.

  <img width="1000" height="auto" alt="README-IMG-3" src="https://github.com/user-attachments/assets/3f87618b-618b-426e-b444-1448372c72ec" />
   
- 🛠️ **Starships Page:** Teeka welcomes you to her shop and presents a **holographic catalog** of starships.

  <img width="1000" height="auto" alt="README-IMG-4" src="https://github.com/user-attachments/assets/70ad6265-f225-4d7f-a5a3-9bfc4a3e49be" />

- 📋 **Starship Details Page:** Teeka uses her **data pad** to show the full specs of the selected ship.

  <img width="1000" height="auto" alt="README-IMG-5" src="https://github.com/user-attachments/assets/8fdd4842-564c-4d27-9826-b3e74ad944a4" />

---

## 🌌 App Pages & Features

| Page                     | Description                                                                                 |
|---------------------------|---------------------------------------------------------------------------------------------|
| 🏠 **Home**               | Introductory screen showing Tatooine and allowing users to navigate into the app.           |
| 🔐 **Login**              | Simulates an Imperial access panel. Name and email are validated and stored in Firebase.    |
| 🚀 **Starships**          | Fetches starship data from SWAPI and displays it in a clean holographic catalog UI.        |
| 📋 **Starship Details**   | Displays detailed information about the selected starship, fetched from the same API.      |

---

## 🧰 Technologies & Tools

- **Angular 20.3.4** (standalone components, SCSS)  
- **Firebase** – For user data and login validation  
- **SWAPI – Star Wars API**  
- **Star Wars Visual Guide** – Image assets  
- **Postman** – API testing tool  
- **Git & GitHub** – Version control and collaboration  
- **Node.js & npm** – Package management & Angular CLI

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

## 🧭 Project Structure

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
  public/
    img/             ← forced fallback img data (Star Wats Guide is not working)
```

---

## 📌 TO DO
  
- Further improvements such as guards, more advanced error handling, and UI enhancements can be added.
- More coherence on graphic design styles and motive.
- Animations between starships-list and starships-details
- Responsive design
- Cleaner code (carousel substitution)
- This README will be updated as the project evolves.

---

## 👨‍💻 Author

**Teeka's Garage** is developed as part of the **IT Academy Front-End Bootcamp** 🧠💻  

Arnau Pérez, Barcelona, 2025.
