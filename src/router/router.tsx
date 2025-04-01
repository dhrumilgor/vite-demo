import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import DefaultComponent from "../components/default";
import NotFoundComponent from "../components/notFound";
import { useQuery } from "@tanstack/react-query";
import Dashboard from "../components/dashboard";
import ProtectedRoutes from "./protectedRoutes";
import Layout from "../components/layout";
import Users from "../components/users";
import useAuthStore from "../store/authStore";

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
      {
        path: "/users",
        element: (
          <ProtectedRoutes>
            <Users />
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
  const { setAccessToken } = useAuthStore()
  async function callOnLoad() {
    // Could be GET or POST/PUT/PATCH/DELETE
    const userData = await fetch("https://jsonplaceholder.typicode.com/todos/1").then((res) =>
      res.json()
    );

    if(userData){
      setAccessToken("tokenset")

    }
    return userData;
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
      <div
        className={
          isAuthenticated
            ? "authenticated-container"
            : "unauthenticated-container"
        }
      >
        <RouterProvider router={router} />
      </div>
    </>
  );
};

export const SetUp = () => {
  return <AppRouter />;
};
