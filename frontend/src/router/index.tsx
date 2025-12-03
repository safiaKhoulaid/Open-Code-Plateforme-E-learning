import Login from "../pages/Login";
import Home from "../pages/home";
import Signup from "../pages/signup";
import { Layout } from "../layouts/layout";
import { createBrowserRouter, Navigate } from "react-router-dom";
import ForgetPassword from "../pages/forget-password";
import TeacherDashboard from "../pages/teacherDashboard";
import { ProtectedRoute } from "../components/ProtectedRoute";
import StudentDashboard from "../pages/studentDashboard";
import AdminDashboard from "../pages/adminDashboard";
import StudentProfilePage from "../pages/profile/studentProfile";
import CoursesExplorer from "../pages/course/courseExplore";
import CourseDetails from "../pages/course/courseDetails";
import CoursePlayer from "@/components/course/coursePLayer";
import Checkout from "@/components/checkout/checkout";
import Wishlist from "../components/wishList/wishList.tsx";
import AboutUs from "@/pages/about.tsx";
import ContactPage from "@/pages/contact.tsx";
import PricingPage from "@/pages/pricing.tsx";
import TeacherProfilePage from "@/pages/profile/profileTeacher.tsx";
import PaymentSuccess from "@/pages/payment/success";
import PaymentCancel from "@/pages/payment/cancel";
import ResetPassword from "../pages/reset-password";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/forgot-password",
        element: <ForgetPassword />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/course-explore",
        element: <CoursesExplorer />,
      },
      {
        path: "/course/:id",
        element: <CourseDetails />,
      },
      {
        path: "/about",
        element: <AboutUs />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/pricing",
        element: <PricingPage />,
      },
      {
        path: "/payment/success",
        element: <PaymentSuccess />,
      },
      {
        path: "/payment/cancel",
        element: <PaymentCancel />,
      },
    ],
  },
  {
    path: "/student-dashboard",
    element: (
      <ProtectedRoute component={StudentDashboard} allowedRoles={["student"]} />
    ),
  },
  {
    path: "/teacher-dashboard",
    element: (
      <ProtectedRoute component={TeacherDashboard} allowedRoles={["teacher"]} />
    ),
  },
  {
    path: "/admin-dashboard",
    element: (
      <ProtectedRoute component={AdminDashboard} allowedRoles={["admin"]} />
    ),
  },
  {
    path: "/student-dashboard/profile",
    element: <StudentProfilePage />,
  },
  {
    path: "/teacher-dashboard/profile",
    element: <TeacherProfilePage />,
  },
  {
    path: "/logout",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/coursePlayer/:id",
    element: <CoursePlayer />,
  },
  { path: "/checkout", element: <Checkout /> },
  { path: "/wishlist", element: <Wishlist /> },
]);
