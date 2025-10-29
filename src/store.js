import { createStore, combineReducers } from 'redux';

/**
 * MOCK REDUX STORE SETUP
 * This store is ONLY used when the MFE runs in isolation.
 */

const INITIAL_STATE = {
    cards: [
        { id: 'cc-1', name: 'Visa Platinum', balance: 500.50, limit: 5000 },
        { id: 'cc-2', name: 'Mastercard Gold', balance: 2500.00, limit: 3000 },
        { id: 'cc-3', name: 'Amex Rewards', balance: 10.99, limit: 10000 },
    ],
    selectedCardId: 'cc-1',
};

const bankingReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_SELECTED_CARD':
            return {
                ...state,
                selectedCardId: action.payload,
            };
        case 'APPLY_PAYMENT':
            // Mock payment logic
            const newCards = state.cards.map(card => {
                if (card.id === action.payload.cardId) {
                    return {
                        ...card,
                        balance: Math.max(0, card.balance - action.payload.amount),
                    };
                }
                return card;
            });
            return {
                ...state,
                cards: newCards,
            };
        default:
            return state;
    }
};

const rootReducer = combineReducers({
    banking: bankingReducer,
});

const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export { store };
