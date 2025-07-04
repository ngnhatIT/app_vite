import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../../app/store";
import ButtonComponent from "../../../components/ButtonComponent";
import {
  fetchUsersBySheet,
  removeUserFromSheet,
  updateUserPermissions,
} from "../workspceThunk";

const PERMISSIONS = ["View", "Edit", "Download", "Export", "Import", "Print"];

export default function WorkspacePermissions() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const { users, loading, error } = useSelector(
    (state: RootState) => state.workspace
  );

  const sheetId: string | undefined =
    location.state?.sheetId || users?.[0]?.sheetId; // fallback lấy tạm sheetId đầu tiên nếu có

  const [editedUsers, setEditedUsers] = useState<Record<string, string[]>>({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!sheetId) {
      console.warn("No sheetId provided!");
      navigate("/workspace/files");
      return;
    }

    dispatch(fetchUsersBySheet({ sheetId }));
  }, [sheetId, dispatch, navigate]);

  const handlePermissionToggle = (userId: string, perm: string) => {
    setEditedUsers((prev) => {
      const current = prev[userId] || [];
      if (current.includes(perm)) {
        return { ...prev, [userId]: current.filter((p) => p !== perm) };
      }
      return { ...prev, [userId]: [...current, perm] };
    });
  };

  const handleSave = () => {
    const payload = Object.entries(editedUsers).map(
      ([userId, permissions]) => ({
        userId,
        permissions,
      })
    );
    if (!sheetId) return;
    dispatch(updateUserPermissions({ sheetId, changes: payload }));
  };

  const handleRemove = (userId: string) => {
    if (!sheetId) return;
    dispatch(removeUserFromSheet({ sheetId, userId }))
      .unwrap()
      .then(() => dispatch(fetchUsersBySheet({ sheetId })));
  };

  const filteredUsers = users.filter((u) =>
    u.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!sheetId) {
    return (
      <div className="p-4 text-red-500">
        No sheetId provided. Redirecting...
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Workspace Permissions</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by username"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1 rounded"
          />
          <ButtonComponent label="Save Changes" onClick={handleSave} />
          <ButtonComponent label="Add Member" onClick={() => {}} />
        </div>
      </div>

      {loading && (
        <div className="text-center text-sm text-gray-500">Loading...</div>
      )}

      {error && <div className="text-red-400 text-sm mb-2">{error}</div>}

      <table className="w-full table-auto rounded mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>User Name</th>
            {PERMISSIONS.map((p) => (
              <th key={p}>{p}</th>
            ))}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {!loading && filteredUsers.length === 0 && (
            <tr>
              <td colSpan={PERMISSIONS.length + 3} className="text-center py-4">
                No users found
              </td>
            </tr>
          )}

          {filteredUsers.map((u, idx) => (
            <tr key={u.userId}>
              <td>{idx + 1}</td>
              <td>
                <div>
                  <div>{u.userName}</div>
                  <div className="text-xs text-gray-400">{u.userId}</div>
                </div>
              </td>
              {PERMISSIONS.map((perm) => (
                <td key={perm}>
                  <input
                    type="checkbox"
                    checked={(
                      editedUsers[u.userId] ||
                      u.permissionName?.split(",") ||
                      []
                    ).includes(perm)}
                    onChange={() => handlePermissionToggle(u.userId, perm)}
                  />
                </td>
              ))}
              <td>
                <ButtonComponent
                  label="Remove"
                  onClick={() => handleRemove(u.userId)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
