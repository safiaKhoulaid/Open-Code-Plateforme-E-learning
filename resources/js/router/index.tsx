import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CourseExplore from '../components/course/CourseExplore';
import PaymentSuccess from '../pages/PaymentSuccess';
import Layout from '../layouts/Layout'; // Assuming you have a layout component

// Import other components as needed

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // Other routes
      {
        path: 'courses/:courseId',
        element: <CourseExplore />,
      },
      {
        path: 'payment-success',
        element: <PaymentSuccess />,
      },
      // Add other routes as needed
    ],
  },
]);

const Router: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default Router;
