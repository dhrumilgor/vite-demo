import { useAuth } from "../context/AuthContext";
import PaginatedTableWrapper from "./List";
import PaginatedTable from "./PaginatedTable";

const Dashboard = () => {
    const { isAuthenticated } = useAuth();
    return (
        <>
        <h1 className="text-3xl">Dashboard - {isAuthenticated}</h1>
        {/* <PaginatedTable/> */}
        <PaginatedTableWrapper />
        </>
    )
}

export default Dashboard;