import { useState, useEffect } from 'react';
import { Eye, Trash2, CheckCircle } from 'lucide-react';
import API_BASE from '../../../config/api.js';

const AdminTrade = () => {
  const [items, setItems] = useState([]);

  const fetchTradeItems = async () => {
     try {
       const res = await fetch(`${API_BASE}/api/nextrade/items/all`);
       const data = await res.json();
       if (res.ok) setItems(data);
     } catch (err) {}
  };

  useEffect(() => {
     fetchTradeItems();
  }, []);

  const handleReview = async (id, newStatus) => {
    try {
      await fetch(`${API_BASE}/api/nextrade/items/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      setItems(prev => prev.map(i => (i.id === id || i._id === id) ? { ...i, status: newStatus } : i));
    } catch (err) {
      console.error("Failed to update status");
    }
  };
  
  return (
    <div>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>NexT Bazaar Moderation</h2>
       </div>

       <div className="admin-table-container">
         <table className="admin-table">
            <thead>
              <tr>
                <th>Listing ID</th>
                <th>Title / Category</th>
                <th>Seller</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
               {items.map(i => (
                 <tr key={i.id}>
                    <td style={{ color: 'var(--text-muted)' }}>{i.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{i.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase' }}>{i.category}</div>
                    </td>
                    <td>{i.seller}</td>
                    <td>₹{i.price}</td>
                    <td>
                      <span className={`status-badge ${
                        i.status === 'Active' ? 'status-active' : 
                        i.status === 'Flagged' ? 'status-pending' : 'status-danger'
                      }`}>
                        {i.status}
                      </span>
                    </td>
                     <td>
                       <div style={{ display: 'flex', gap: 8 }}>
                         <button className="btn-action"><Eye size={16}/></button>
                         {i.status === 'Flagged' && (
                           <button className="btn-action approve" title="Approve Listing" onClick={() => handleReview(i._id || i.id, 'active')}>
                             <CheckCircle size={16}/>
                           </button>
                         )}
                         {i.status !== 'removed' && (
                           <button className="btn-action reject" title="Remove Listing" onClick={() => handleReview(i._id || i.id, 'removed')}>
                             <Trash2 size={16}/>
                           </button>
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

export default AdminTrade;
