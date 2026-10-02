import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminUsersPage = () => {

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/admin/users`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      if (data.success) {
        setUsers(data.users);
        setFilteredUsers(data.users);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();

    const filtered = users.filter((user) =>
      user?.name?.toLowerCase().includes(lowerSearch) ||
      user?.email?.toLowerCase().includes(lowerSearch) ||
      user?.phone?.toLowerCase().includes(lowerSearch)
    );

    setFilteredUsers(filtered);
  }, [search, users]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FDFBFB]">
        <div className="text-2xl font-black text-red-600 animate-pulse">
          SYNCHRONIZING USERS...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FDFBFB]">
        <div className="p-10 text-center bg-white border-2 border-red-200 shadow-xl rounded-3xl">
          <p className="text-xl font-bold text-red-600">{error}</p>
          <button
            onClick={fetchUsers}
            className="px-6 py-2 mt-4 font-bold text-white bg-red-600 rounded-xl"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBFB] p-8 lg:p-14 flex justify-center items-start w-full">

      <div className="w-full max-w-7xl">

        {/* HEADER */}
        <div className="flex flex-col items-center justify-between gap-6 mb-8 md:flex-row">

          <div>
            <h1 className="text-5xl font-black text-gray-900">
              Users Directory
            </h1>
            <p className="text-sm font-bold text-gray-400 uppercase">
              Management & System Access
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/create-user")}
            className="px-10 py-5 font-black text-white bg-gray-900 rounded-2xl hover:bg-red-600"
          >
            + CREATE NEW USER
          </button>

        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-4 text-sm bg-white border-2 border-gray-200 shadow-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-300"
          />
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border-t-8 border-red-600 overflow-hidden">

          <div className="overflow-x-auto">
            <table className="w-full">

              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-8 text-xs font-black text-left text-gray-400 uppercase">
                    User
                  </th>
                  <th className="p-8 text-xs font-black text-left text-gray-400 uppercase">
                    Contact
                  </th>
                  <th className="p-8 text-xs font-black text-left text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="p-8 text-xs font-black text-center text-gray-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>

                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-red-50">

                    <td className="p-8">
                      <div className="flex items-center gap-4">

                        <div className="flex items-center justify-center w-12 h-12 overflow-hidden bg-gray-100 rounded-xl">

                          {user.image ? (
                            <img
                              src={user.image}
                              alt="user"
                              className="object-cover w-full h-full"
                              onError={(e) => {
                                e.target.style.display = "none"
                              }}
                            />
                          ) : (
                            <span className="font-black text-gray-600">
                              {user.name?.charAt(0) || "U"}
                            </span>
                          )}

                        </div>

                        <p className="text-xl font-bold text-gray-800">
                          {user.name}
                        </p>

                      </div>
                    </td>

                    <td className="p-8">
                      <p className="font-medium text-gray-600">{user.email}</p>
                      <p className="text-sm font-bold text-gray-400">
                        {user.phone || "NO PHONE"}
                      </p>
                    </td>

                    <td className="p-8">
                      {user.isBlocked ? (
                        <span className="px-3 py-1 text-xs font-black text-red-600 bg-red-100 rounded-full">
                          BLOCKED
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-black text-green-600 bg-green-100 rounded-full">
                          ACTIVE
                        </span>
                      )}
                    </td>

                    <td className="p-8 text-center">
                      <button
                        onClick={() => navigate(`/admin/user/${user._id}`)}
                        className="px-4 py-2 mr-2 font-bold bg-gray-100 rounded-xl hover:bg-gray-900 hover:text-white"
                      >
                        View
                      </button>

                      <button
                        onClick={() => navigate(`/admin/user/edit/${user._id}`)}
                        className="px-4 py-2 font-bold text-red-600 border border-red-600 rounded-xl hover:bg-red-600 hover:text-white"
                      >
                        Edit
                      </button>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-16 text-center">
              <p className="text-2xl font-black text-gray-300 uppercase">
                No users found
              </p>
            </div>
          )}

        </div>

        <div className="flex justify-end mt-6 font-bold text-gray-400">
          Total:
          <span className="ml-2 text-red-600">{filteredUsers.length}</span>
        </div>

      </div>
    </div>
  );
};

export default AdminUsersPage;