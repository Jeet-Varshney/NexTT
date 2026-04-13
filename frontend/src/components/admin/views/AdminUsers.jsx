import { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, BadgeCheck } from 'lucide-react';
import API_BASE from '../../../config/api.js';

const AdminUsers = ({ activeUser }) => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/users`);
      const data = await res.json();
      if (res.ok) setUsers(data);
    } catch (err) {}
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleUpdate = async (username, newRoleStr) => {
    let newRole = 'Admin';
    let newPerms = [];
    if (newRoleStr === 'Student') { newRole = 'Student'; newPerms = []; }
    if (newRoleStr === 'Super Admin') { newRole = 'Super Admin'; newPerms = ['all']; }
    if (newRoleStr === 'Cafeteria Admin') { newRole = 'Admin'; newPerms = ['cafe']; }
    if (newRoleStr === 'Marketplace Admin') { newRole = 'Admin'; newPerms = ['trade']; }

    try {
      await fetch(`${API_BASE}/api/auth/role`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUsername: username, newRole, newPermissions: newPerms })
      });
      fetchUsers(); // Sync state
    } catch (err) {}
  };
  
  return (
    <div>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>System Users</h2>
       </div>

       <div className="admin-table-container">
         <table className="admin-table">
            <thead>
              <tr>
                <th>Identifier</th>
                <th>Name & Contact</th>
                <th>Role</th>
                <th>Status</th>
                <th>Enrolled</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
               {users.map(u => (
                 <tr key={u.username}>
                    <td style={{ color: 'var(--text-muted)' }}>{u.rollNo}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{u.username}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>{u.email}</div>
                    </td>
                    <td>
                      <select 
                        className="auth-input" 
                        disabled={activeUser?.role !== 'Super Admin'}
                        title={activeUser?.role !== 'Super Admin' ? 'Only Super Admins can alter roles' : 'Change User Role'}
                        style={{ padding: '6px 12px', background: 'rgba(0,0,0,0.3)', color: u.role === 'Super Admin' ? 'var(--info)' : 'white', borderRadius: 8, fontSize: 12, opacity: activeUser?.role !== 'Super Admin' ? 0.7 : 1 }}
                        value={u.role === 'Super Admin' ? 'Super Admin' : u.permissions?.includes('cafe') ? 'Cafeteria Admin' : u.permissions?.includes('trade') ? 'Marketplace Admin' : 'Student'}
                        onChange={(e) => handleRoleUpdate(u.username, e.target.value)}
                      >
                         <option style={{color:'black'}} value="Student">Student</option>
                         <option style={{color:'black'}} value="Cafeteria Admin">Cafeteria Admin</option>
                         <option style={{color:'black'}} value="Marketplace Admin">Marketplace Admin</option>
                         <option style={{color:'black'}} value="Super Admin">Super Admin</option>
                      </select>
                    </td>
                    <td>
                      <span className={`status-badge status-active`}>
                        Active
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{new Date(u.createdAt || Date.now()).toLocaleDateString()}</td>
                    <td>
                       <div style={{ display: 'flex', gap: 8 }}>
                         {u.role !== 'Super Admin' && (
                           <button className="btn-action reject" title="Block User"><ShieldAlert size={16}/></button>
                         )}
                       </div>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
       </div>
    </div>
  );
};

export default AdminUsers;
