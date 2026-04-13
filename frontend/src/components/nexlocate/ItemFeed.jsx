import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import ItemCard from './ItemCard';

const LOCATIONS = ['All Locations', 'Library', 'Cafeteria', 'Computer Lab', 'Main Gate',
  'Hostel Block A', 'Hostel Block B', 'Sports Ground', 'Auditorium', 'Admin Block', 'Parking Lot', 'Other'];

const ItemFeed = ({ items, loading, onClaim, currentUserId, search, setSearch, typeFilter, setTypeFilter, locationFilter, setLocationFilter }) => {
  return (
    <div className="nl-feed-panel">
      {/* Search & Filters */}
      <div className="nl-search-bar">
        <div className="nl-search-wrap">
          <Search className="nl-search-icon" size={17} />
          <input
            className="nl-search-input"
            placeholder="Search by item name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="nl-filter-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="lost">🔍 Lost</option>
          <option value="found">📦 Found</option>
        </select>
        <select
          className="nl-filter-select"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        >
          {LOCATIONS.map(l => (
            <option key={l} value={l === 'All Locations' ? '' : l}>{l}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      {!loading && (
        <p style={{ padding: '0 28px 4px', fontSize: '13px', color: 'var(--text-dim)' }}>
          {items.length} item{items.length !== 1 ? 's' : ''} found
        </p>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="nl-item-grid">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} style={{ borderRadius: '22px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
              <div className="nl-skeleton" style={{ height: '170px' }} />
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="nl-skeleton" style={{ height: '14px', width: '50%' }} />
                <div className="nl-skeleton" style={{ height: '18px', width: '80%' }} />
                <div className="nl-skeleton" style={{ height: '13px', width: '95%' }} />
                <div className="nl-skeleton" style={{ height: '13px', width: '60%' }} />
                <div className="nl-skeleton" style={{ height: '38px', marginTop: '6px' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && items.length === 0 && (
        <div className="nl-empty">
          <div className="nl-empty-icon">🔎</div>
          <h3>Nothing found</h3>
          <p>Try adjusting your search or filters, or be the first to report!</p>
        </div>
      )}

      {/* Item grid */}
      {!loading && items.length > 0 && (
        <motion.div className="nl-item-grid" layout>
          <AnimatePresence>
            {items.map(item => (
              <ItemCard
                key={item._id}
                item={item}
                onClaim={onClaim}
                currentUserId={currentUserId}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default ItemFeed;
