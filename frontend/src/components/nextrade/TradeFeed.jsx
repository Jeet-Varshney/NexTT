import { Search } from 'lucide-react';
import TradeItemCard from './TradeItemCard';

const TradeFeed = ({ items, search, setSearch, filter, setFilter, onOpenChat, loading }) => {
  const filtered = items.filter(item => {
    if (filter !== 'All' && item.category !== filter) return false;
    if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ padding: '20px 28px' }}>
      <div className="nk-search-bar" style={{ padding: '0 0 20px 0' }}>
        <div className="nk-search-wrap">
          <Search className="nk-search-icon" size={16} />
          <input
            type="text"
            className="nk-search-input"
            placeholder="Search books, drafters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="nk-filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All Categories</option>
          <option value="Books">Books</option>
          <option value="Notes/Modules">Notes/Modules</option>
          <option value="Instruments">Instruments</option>
          <option value="Stationary">Stationary</option>
          <option value="Electronics">Electronics</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {loading ? (
        <div className="nt-item-grid" style={{ padding: 0 }}>
          {[1,2,3].map(i => <div key={i} className="nl-skeleton" style={{ height: '340px', borderRadius: '20px' }}/>)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="nl-empty">
          <Search size={48} style={{ opacity: 0.3 }} />
          <h3>No items found</h3>
          <p>Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="nt-item-grid" style={{ padding: 0 }}>
          {filtered.map(item => (
            <TradeItemCard key={item._id} item={item} onOpenChat={onOpenChat} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TradeFeed;
