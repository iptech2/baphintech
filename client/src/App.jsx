
import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/admin/AdminLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

// Public pages
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Services from "./pages/Services/Services";
import Projects from "./pages/Projects/Projects";
import Blog from "./pages/Blog/Blog";
import BlogDetails from "./pages/Blog/BlogDetails";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import NotFound from "./pages/NotFound/NotFound";

// Protected user pages
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Profile/Profile";
import ProjectDetails from "./pages/Projects/ProjectDetails";
import CodeLibrary from "./pages/CodeLibrary/CodeLibrary";

// Admin pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ProjectsManagement from "./pages/Admin/Projects/ProjectsManagement";
import CodeLibraryManagement from "./pages/Admin/CodeLibrary/CodeLibraryManagement";
import BlogManagement from "./pages/Admin/Blog/BlogManagement";
import AdminServices from "./pages/Admin/Services/Services";
import UsersManagement from "./pages/Admin/Users/Users";
import MessagesManagement from "./pages/Admin/Messages/Messages";
import ConsultationsManagement from "./pages/Admin/Consultations/Consultations";
import WebsiteContent from "./pages/Admin/Content/WebsiteContent";
import SettingsManagement from "./pages/Admin/Settings/Settings";

function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route
        path="/"
        element={<MainLayout><Home /></MainLayout>}
      />

      <Route
        path="/about"
        element={<MainLayout><About /></MainLayout>}
      />

      <Route
        path="/services"
        element={<MainLayout><Services /></MainLayout>}
      />

      <Route
        path="/projects"
        element={<MainLayout><Projects /></MainLayout>}
      />

      {/* Public Blog */}
      <Route
        path="/blog"
        element={<MainLayout><Blog /></MainLayout>}
      />

      <Route
        path="/blog/:slug"
        element={<MainLayout><BlogDetails /></MainLayout>}
      />

      <Route
        path="/contact"
        element={<MainLayout><Contact /></MainLayout>}
      />

      <Route
        path="/login"
        element={<MainLayout><Login /></MainLayout>}
      />

      <Route
        path="/register"
        element={<MainLayout><Register /></MainLayout>}
      />

      {/* Protected user pages */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={<MainLayout><Dashboard /></MainLayout>}
        />

        <Route
          path="/profile"
          element={<MainLayout><Profile /></MainLayout>}
        />

        <Route
          path="/projects/:id"
          element={<MainLayout><ProjectDetails /></MainLayout>}
        />

        <Route
          path="/code-library"
          element={<MainLayout><CodeLibrary /></MainLayout>}
        />
      </Route>

      {/* Protected admin pages */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />

          <Route
            path="projects"
            element={<ProjectsManagement />}
          />

          <Route
            path="code-library"
            element={<CodeLibraryManagement />}
          />

          <Route
            path="blog"
            element={<BlogManagement />}
          />

          <Route
            path="services"
            element={<AdminServices />}
          />

          <Route
            path="users"
            element={<UsersManagement />}
          />
          <Route path="messages"
           element={<MessagesManagement />} 
           />
           <Route path="consultations"
            element={<ConsultationsManagement />} 
            />

            <Route path="content" 
            element={<WebsiteContent />}
             />

             <Route path="settings"
              element={<SettingsManagement />} 
              />
        </Route>
      </Route>

      {/* 404 */}
      <Route
        path="*"
        element={<MainLayout><NotFound /></MainLayout>}
      />
    </Routes>
  );
}

export default App;
