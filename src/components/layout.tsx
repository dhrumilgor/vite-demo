import NavComponents from "./Nav";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <NavComponents />
      <Outlet />
    </div>
  );
};

export default Layout;
