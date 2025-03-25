import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import DefaultComponent from "../components/default";
import NotFoundComponent from "../components/notFound";
import { useQuery } from "@tanstack/react-query";
import Dashboard from "../components/dashboard";
import ProtectedRoutes from "./protectedRoutes";
import Layout from "../components/layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, 
    children: [
      {
        path: "/main",
        element: <App />,
      },
      {
        path: "/",
        element: <DefaultComponent />,
      },
      {
        path: "/login",
        element: <DefaultComponent />,
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoutes>
            <Dashboard />
          </ProtectedRoutes>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundComponent />,
  },
]);

const AppRouter = () => {
  function callOnLoad() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          success: true,
          code: 200,
        });
      }, 1000);
    });
  }

  const { data, isLoading } = useQuery({
    queryKey: ["data"],
    queryFn: () => callOnLoad(),
  });
 const isAuthenticated = false;
  return (
    <>
      {isLoading && (
        <>
          <p>Is Loading...</p>
        </>
      )}
      <div  className={isAuthenticated ? 'authenticated-container' : 'unauthenticated-container'} >
      <RouterProvider router={router} />
      </div>
    </>
  );
};

export const SetUp = () => {
  return <AppRouter />;
};
