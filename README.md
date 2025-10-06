# 📊 Posts Dashboard

A responsive **Posts Dashboard** built with **React.js**.  
The app integrates with the [DummyJSON API](https://dummyjson.com/posts) ([Docs](https://dummyjson.com/docs/posts)) to display, manage, and interact with posts.  
It includes forms, charts, map integration, notifications, and a clean UI with reusable components.


---

## 🚀 Features

- **Responsive Layout**: Sidebar + Main Content Area (Tailwind CSS).
- **Post Management**:
  - Fetch and display posts from API.
  - Paginated and searchable table view.
  - Create / Edit posts with form validation.
- **Forms & Validation**:
  - Built with **Formik** + **Yup**.
- **State Management**:
  - Managed with **Redux Toolkit**.
- **Interactive Map**:
  - Integrated with **React Leaflet**.
- **Charts & Analytics**:
  - **Recharts** used for simple data visualization.
- **UI & UX Enhancements**:
  - Reusable components (Buttons, Modals, Tables).
  - **Lucide React** icons for clean visuals.
  - **react-hot-toast** for success/error notifications.
  - Phone number input with **react-phone-input-2**.
- **Routing**:
  - **React Router DOM** for navigation.

---

## 🛠️ Tech Stack

- **React.js** (Frontend Framework)  
- **Redux Toolkit** (State Management)  
- **TailwindCSS** (Styling)  
- **Formik + Yup** (Forms & Validation)  
- **React Router DOM** (Routing)  
- **React Leaflet** (Map)  
- **Recharts** (Charts & Data Visualization)  
- **Lucide React** (Icons)  
- **React Hot Toast** (Notifications)  
- **react-phone-input-2** (Phone Input)  

---

## 📂 Project Structure

```bash
src/
 ├── store/            # Main redux store
 ├── components/       # Reusable UI components (Modal, Table, etc...)
 ├── features/         # Redux slices & state management
 ├── pages/            # Main pages (Dashboard, Posts, Profile, etc...)
 ├── App.jsx           # Main app entry
 └── main.jsx          # Render root
.env                   # File to simplify API management