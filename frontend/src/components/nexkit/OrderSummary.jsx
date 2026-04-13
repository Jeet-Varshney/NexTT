const OrderSummary = ({ file, settings, estimatedCost, deliveryAddress }) => {
  const pageText = settings.pageMode === 'All' ? 'All pages' : settings.pages;

  return (
    <div className="order-summary-card">
      <h3>Print Order Summary</h3>
      <div className="summary-row">
        <span>File</span>
        <strong>{file?.fileName || 'No document selected'}</strong>
      </div>
      <div className="summary-row">
        <span>Pages</span>
        <strong>{pageText}</strong>
      </div>
      <div className="summary-row">
        <span>Print type</span>
        <strong>{settings.color ? 'Color' : 'Black & White'}</strong>
      </div>
      <div className="summary-row">
        <span>Copies</span>
        <strong>{settings.copies}</strong>
      </div>
      <div className="summary-row"> 
        <span>Delivery</span>
        <strong>{deliveryAddress ? 'Delivery' : 'Pickup at Center'}</strong>
      </div>
      <div className="summary-total-row">
        <span>Total</span>
        <strong>₹{estimatedCost.toFixed(2)}</strong>
      </div>
    </div>
  );
};

export default OrderSummary;
