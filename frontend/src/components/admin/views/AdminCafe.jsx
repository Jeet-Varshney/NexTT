import { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Search, X, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE from '../../../config/api.js';

const AdminCafe = () => {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', price: '', category: 'Snacks', status: 'Available' });

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/cafe/menu`);
      const data = await res.json();
      if (res.ok) setItems(data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
     try {
       await fetch(`${API_BASE}/api/cafe/menu/${id}`, { method: 'DELETE' });
       setItems(prev => prev.filter(i => i._id !== id && i.id !== id));
     } catch(err) {
       console.error("Deletion failed.");
     }
  };

  const handleAdd = async (e) => {
     e.preventDefault();
     if (!newItem.name || !newItem.price) return;
     try {
        const url = editId ? `${API_BASE}/api/cafe/menu/${editId}` : `${API_BASE}/api/cafe/menu`;
        const method = editId ? 'PUT' : 'POST';

        const res = await fetch(url, {
           method, headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(newItem)
        });
        const savedItem = await res.json();
        
        if (editId) {
           setItems(prev => prev.map(i => (i._id === editId || i.id === editId) ? savedItem : i));
        } else {
           setItems(prev => [savedItem, ...prev]);
        }

        setShowModal(false);
        setEditId(null);
        setNewItem({ name: '', price: '', category: 'Snacks', status: 'Available' });
     } catch (err) {
        console.error("Failed pushing new item.");
     }
  };

  const handleEditClick = (item) => {
     setEditId(item._id || item.id);
     setNewItem({ 
       name: item.name, price: item.price, category: item.category, 
       status: item.status || (item.isAvailable ? 'Available' : 'Out of Stock') 
     });
     setShowModal(true);
  };
  
  return (
    <div>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Cafeteria Management</h2>
          <button className="nt-btn nt-btn-primary" style={{ padding: '10px 20px' }} onClick={() => {
             setEditId(null);
             setNewItem({ name: '', price: '', category: 'Snacks', status: 'Available' });
             setShowModal(true);
          }}>
            <Plus size={16} /> Add Item
          </button>
       </div>

       <div className="admin-table-container">
         <div className="admin-filter-bar">
            <div className="input-group" style={{ maxWidth: 300 }}>
              <Search className="input-icon" size={16} />
              <input type="text" className="auth-input" style={{ padding: '10px 16px 10px 40px', background: 'rgba(0,0,0,0.3)', borderRadius: 10 }} placeholder="Search menu..." />
            </div>
            <select className="auth-input" style={{ maxWidth: 150, padding: '10px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: 10, color: 'white' }}>
               <option>All Categories</option>
               <option>Snacks</option>
               <option>Beverages</option>
            </select>
         </div>
         
         <table className="admin-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
               {items.map(i => (
                 <tr key={i.id || i._id}>
                    <td style={{ fontWeight: 600 }}>{i.name}</td>
                    <td>{i.category}</td>
                    <td>₹{i.price}</td>
                    <td>
                      <span className={`status-badge ${i.status === 'Available' || i.isAvailable ? 'status-active' : 'status-danger'}`}>
                        {i.status || (i.isAvailable ? 'Available' : 'Out of Stock')}
                      </span>
                    </td>
                    <td>
                       <div style={{ display: 'flex', gap: 8 }}>
                         <button className="btn-action" title="Edit Entry" onClick={() => handleEditClick(i)}>
                           <Edit2 size={16}/>
                         </button>
                         <button className="btn-action reject" title="Remove Entry" onClick={() => handleDelete(i.id || i._id)}>
                           <Trash2 size={16}/>
                         </button>
                       </div>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
       </div>

    <AnimatePresence>
       {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
             <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.9, opacity: 0 }}
                style={{ background: 'var(--bg-card)', padding: 32, borderRadius: 24, border: '1px solid var(--glass-border)', width: '100%', maxWidth: 400 }}
             >
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                   <h3 style={{ fontSize: 20, margin: 0 }}>{editId ? 'Edit Menu Item' : 'Push Menu Item'}</h3>
                   <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20}/></button>
                </div>
                
                <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                   <input required type="text" placeholder="Item Name (ex: Butter Naan)" className="auth-input" style={{ background: 'rgba(0,0,0,0.3)', color: 'white' }} value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
                   <div style={{ display: 'flex', gap: 16 }}>
                      <input required type="number" placeholder="Price (₹)" className="auth-input" style={{ background: 'rgba(0,0,0,0.3)', color: 'white' }} value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} />
                      <select required className="auth-input" style={{ background: 'rgba(0,0,0,0.3)', color: 'white' }} value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
                         <option style={{ color:'black' }} value="Snacks">Snacks</option>
                         <option style={{ color:'black' }} value="Meals">Meals</option>
                         <option style={{ color:'black' }} value="Beverages">Beverages</option>
                         <option style={{ color:'black' }} value="Combos">Combos</option>
                      </select>
                   </div>
                   <select required className="auth-input" style={{ background: 'rgba(0,0,0,0.3)', color: 'white' }} value={newItem.status} onChange={e => setNewItem({...newItem, status: e.target.value})}>
                      <option style={{ color:'black' }} value="Available">Available</option>
                      <option style={{ color:'black' }} value="Out of Stock">Out of Stock</option>
                   </select>
                   <button type="submit" className="nt-btn nt-btn-primary" style={{ marginTop: 8 }}><CheckSquare size={18} style={{ marginRight: 8 }} /> {editId ? 'Save Edits' : 'Deploy to Menu'}</button>
                </form>
             </motion.div>
          </div>
       )}
    </AnimatePresence>

    </div>
  );
};

export default AdminCafe;
