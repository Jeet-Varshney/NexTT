import { motion } from 'framer-motion';
import { MapPin, Clock, Tag, AlertCircle } from 'lucide-react';

// Emoji fallbacks per type when no image
const TYPE_EMOJI = { lost: '🔍', found: '📦' };

const timeAgo = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const ItemCard = ({ item, onClaim, currentUserId }) => {
  const isOwner   = item.userId === currentUserId;
  const isClaimed = item.status === 'claimed';

  return (
    <motion.div
      className="nl-item-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      layout
    >
      {/* Image or Placeholder */}
      {item.imageUrl ? (
        <img src={item.imageUrl} alt={item.title} className="nl-item-img" />
      ) : (
        <div className="nl-item-img-placeholder">
          {TYPE_EMOJI[item.type] || '📦'}
        </div>
      )}

      <div className="nl-item-body">
        {/* Type badge */}
        <span className={`nl-item-type-badge nl-badge-${isClaimed ? 'claimed' : item.type}`}>
          {isClaimed ? '✓ Claimed' : item.type === 'lost' ? '🔍 Lost' : '📦 Found'}
        </span>

        <h3 className="nl-item-title">{item.title}</h3>
        <p className="nl-item-desc">{item.description}</p>

        <div className="nl-item-meta">
          <span className="nl-meta-chip">
            <MapPin size={11} /> {item.location}
          </span>
          <span className="nl-meta-chip">
            <Clock size={11} /> {timeAgo(item.createdAt)}
          </span>
          {item.date && (
            <span className="nl-meta-chip">
              <Tag size={11} /> {item.date}
            </span>
          )}
        </div>

        <button
          className="nl-claim-btn"
          onClick={() => onClaim(item)}
          disabled={isOwner || isClaimed}
          title={isOwner ? 'Your own report' : isClaimed ? 'Already claimed' : 'Claim this item'}
          style={{ marginTop: '12px' }}
        >
          {isOwner
            ? '📋 Your Report'
            : isClaimed
            ? '✓ Item Claimed'
            : '🙋 Claim This Item'}
        </button>
      </div>
    </motion.div>
  );
};

export default ItemCard;
