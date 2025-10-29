import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PiggyBank, CreditCard, Loader2 } from 'lucide-react';

// Define the action creator locally
const applyPayment = (cardId, amount) => ({ type: 'APPLY_PAYMENT', payload: { cardId, amount } });

const OnlineBankingMFE = () => {
  const dispatch = useDispatch();
  const cards = useSelector(state => state.banking.cards);
  const selectedCardId = useSelector(state => state.banking.selectedCardId);
  const [paymentAmount, setPaymentAmount] = useState(500);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const selectedCard = cards.find(c => c.id === selectedCardId);

  const handlePayment = () => {
    if (selectedCard && paymentAmount > 0 && paymentAmount <= selectedCard.balance) {
      // Action dispatched to shared store, affecting the state read by CreditCardMFE
      dispatch(applyPayment(selectedCardId, paymentAmount));
      // Reset payment amount or provide success feedback
      setPaymentAmount(0);
      alert('Payment applied successfully to the shared store!');
    } else if (selectedCard) {
      alert(`Payment failed. Payment amount must be between $1 and $${selectedCard.balance.toFixed(2)}.`);
    } else {
      alert('Please select a credit card first in the Credit Card MFE.');
    }
  };

  return (
    <>
        <style>
            {`
            .ob-mfe-container {
                background-color: #fff;
                padding: 1.5rem;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                border-radius: 0.75rem;
                border: 1px solid #fef3c7; /* yellow-100 */
                flex: 1;
                min-width: 300px;
                height: 100%;
            }
            .mfe-title {
                font-size: 1.25rem;
                font-weight: 700;
                color: #b45309; /* amber-800 */
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
            }
            .mfe-icon {
                width: 1.25rem;
                height: 1.25rem;
                margin-right: 0.5rem;
                color: #f59e0b; /* amber-500 */
            }
            .mfe-info {
                font-size: 0.875rem;
                color: #6b7280;
                margin-bottom: 1rem;
            }
            .loading-state {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 12rem;
            }
            .loading-spinner {
                width: 2rem;
                height: 2rem;
                animation: spin 1s linear infinite;
                color: #f59e0b;
            }
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            .data-card {
                padding: 1rem;
                border-radius: 0.5rem;
                margin-bottom: 1rem;
                background-color: #fefce8; /* yellow-50 */
                border: 1px solid #fcd34d; /* amber-300 */
            }
            .data-label {
                font-size: 0.875rem;
                color: #4b5563;
                margin-bottom: 0.25rem;
            }
            .data-value {
                font-size: 1.5rem;
                font-weight: 700;
                color: #b45309;
                display: flex;
                align-items: center;
            }
            .data-icon {
                width: 1.25rem;
                height: 1.25rem;
                margin-right: 0.5rem;
            }
            .form-group {
                margin-top: 1.5rem;
                padding-top: 1.5rem;
                border-top: 1px solid #fef08a; /* yellow-200 */
            }
            .form-label {
                font-size: 1rem;
                font-weight: 600;
                color: #b45309;
                margin-bottom: 0.5rem;
                display: block;
            }
            .input-field {
                width: 100%;
                padding: 0.75rem;
                border: 1px solid #fcd34d;
                border-radius: 0.375rem;
                margin-bottom: 1rem;
                font-size: 1rem;
            }
            .pay-button {
                width: 100%;
                padding: 0.75rem;
                background-color: #f59e0b; /* amber-500 */
                color: white;
                font-weight: 700;
                border-radius: 0.5rem;
                transition: background-color 0.3s;
                cursor: pointer;
            }
            .pay-button:hover {
                background-color: #d97706; /* amber-600 */
            }
            .pay-button:disabled {
                background-color: #fcd34d; /* amber-300 */
                cursor: not-allowed;
            }
            .no-card-info {
                color: #9ca3af;
                text-align: center;
                margin-top: 2rem;
            }
            `}
        </style>

        <div className="ob-mfe-container">
            <h2 className="mfe-title">
                <PiggyBank className="mfe-icon" size={20} />
                Online Banking MFE (Remote App)
            </h2>

            {loading ? (
                <div className="loading-state">
                    <Loader2 className="loading-spinner" size={32} />
                </div>
            ) : (
                <>
                    <div className="data-card">
                        <div className="data-label">Card Selected in Remote A:</div>
                        <div className="data-value">
                            <CreditCard className="data-icon" />
                            {selectedCard ? selectedCard.name : 'None Selected'}
                        </div>
                    </div>

                    {selectedCard && (
                        <>
                            <div className="data-card">
                                <div className="data-label">Current Balance:</div>
                                <div className="data-value">${selectedCard.balance.toFixed(2)}</div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Payment Amount</label>
                                <input
                                    type="number"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                                    className="input-field"
                                    min="1"
                                    max={selectedCard.balance}
                                />
                                <button
                                    onClick={handlePayment}
                                    className="pay-button"
                                    disabled={paymentAmount <= 0 || paymentAmount > selectedCard.balance}
                                >
                                    Apply Payment
                                </button>
                                <p className="mfe-info" style={{marginTop: '0.5rem'}}>*Payment will update the shared balance for all apps.</p>
                            </div>
                        </>
                    )}

                    {!selectedCard && (
                        <div className="no-card-info">
                            <p>Please select a credit card in the panel on the left.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    </>
  );
};

export default OnlineBankingMFE;
