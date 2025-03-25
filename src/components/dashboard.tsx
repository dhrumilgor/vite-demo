import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
    const { isAuthenticated } = useAuth();
    return (
        <>
        <h1 className="text-3xl">Dashboard - {isAuthenticated}</h1>
        </>
    )
}

export default Dashboard;