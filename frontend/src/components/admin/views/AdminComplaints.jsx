import { useState } from 'react';
import { ShieldAlert, CheckCircle2, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_COMPLAINTS = [
  { id: 'CMP001', student: 'demo', category: 'Hostel Maintenance', title: 'Fan not working in Room 102', status: 'Pending', date: 'Today' },
  { id: 'CMP002', student: 'rohan_s', category: 'IT & Wi-Fi', title: 'Library Wi-Fi disconnecting frequently', status: 'In Progress', date: 'Yesterday' },
  { id: 'CMP003', student: 'priyanka99', category: 'Mess & Food', title: 'Food was served cold during dinner', status: 'Resolved', date: '2 Days Ago' },
];

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);

  const handleResolve = (id) => {
    setComplaints(prev => prev.map(c => 
      c.id === id ? { ...c, status: 'Resolved' } : c
    ));
  };

  return (
    <div>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Complaint Resolution Center</h2>
       </div>

       <div className="admin-table-container">
         <div className="admin-filter-bar">
            <div className="input-group" style={{ maxWidth: 300 }}>
              <Search className="input-icon" size={16} />
              <input type="text" className="auth-input" style={{ padding: '10px 16px 10px 40px', background: 'rgba(0,0,0,0.3)', borderRadius: 10 }} placeholder="Search complaints..." />
            </div>
            <select className="auth-input" style={{ maxWidth: 150, padding: '10px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: 10, color: 'white' }}>
               <option style={{ color: 'black' }} value="All">All Status</option>
               <option style={{ color: 'black' }} value="Pending">Pending</option>
               <option style={{ color: 'black' }} value="In Progress">In Progress</option>
               <option style={{ color: 'black' }} value="Resolved">Resolved</option>
            </select>
         </div>
         
         <table className="admin-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Category</th>
                <th>Issue Description</th>
                <th>Student</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
               {complaints.map(c => (
                 <tr key={c.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{c.id}</td>
                    <td><span style={{ fontWeight: 600, color: 'var(--info)' }}>{c.category}</span></td>
                    <td style={{ maxWidth: 250, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</td>
                    <td>{c.student}</td>
                    <td>
                      <span className={`status-badge ${c.status === 'Resolved' ? 'status-active' : c.status === 'In Progress' ? 'status-pending' : 'status-danger'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                       <div style={{ display: 'flex', gap: 8 }}>
                         {c.status !== 'Resolved' && (
                           <button 
                             className="btn-action approve" 
                             title="Mark as Resolved" 
                             onClick={() => handleResolve(c.id)}
                           >
                             <CheckCircle2 size={16} />
                           </button>
                         )}
                       </div>
                    </td>
                 </tr>
               ))}
               {complaints.length === 0 && (
                 <tr>
                   <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                      No active complaints found. 
                   </td>
                 </tr>
               )}
            </tbody>
         </table>
       </div>
    </div>
  );
};

export default AdminComplaints;
