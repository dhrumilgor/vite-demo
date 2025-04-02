import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchUsers = async ({ page, search, sortBy }) => {
  const { data } = await axios.get(
    `https://dummyjson.com/users?page=${page}&limit=10&search=${search}&sortBy=${sortBy}`
  );
  return data;
};

const exportToCSV = (users) => {
  const headers = "ID,First Name,Last Name,Email\n";
  const rows = users.map(user => `${user.id},${user.firstName},${user.lastName},${user.email}`).join("\n");
  const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "users.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function UserTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("id");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", page, search, sortBy],
    queryFn: () => fetchUsers({ page, search, sortBy }),
    keepPreviousData: true,
  });

  return (
    <div className="max-w-3xl mx-auto p-4">
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-2 border rounded mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      
      <select
        className="w-full p-2 border rounded mb-4"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="id">ID</option>
        <option value="firstName">First Name</option>
        <option value="lastName">Last Name</option>
        <option value="email">Email</option>
      </select>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading data</p>}
      
      {data && (
        <>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded mb-4"
            onClick={() => exportToCSV(data.users)}
          >
            Export to CSV
          </button>

          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2 cursor-pointer" onClick={() => setSortBy("id")}>ID</th>
                <th className="border p-2 cursor-pointer" onClick={() => setSortBy("firstName")}>First Name</th>
                <th className="border p-2 cursor-pointer" onClick={() => setSortBy("lastName")}>Last Name</th>
                <th className="border p-2 cursor-pointer" onClick={() => setSortBy("email")}>Email</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <tr key={user.id} className="odd:bg-white even:bg-gray-100">
                  <td className="border p-2">{user.id}</td>
                  <td className="border p-2">{user.firstName}</td>
                  <td className="border p-2">{user.lastName}</td>
                  <td className="border p-2">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between mt-4">
            <button
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>Page {page} of {Math.ceil(data.total / 10)}</span>
            <button
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={data.skip + data.limit >= data.total}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}