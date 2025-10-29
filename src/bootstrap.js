import React from 'react';
import { createRoot } from 'react-dom/client';

// The mount function handles rendering. It must dynamically import the main component
// to create an asynchronous boundary.
const mount = (el) => {
    import('./OnlineBankingMFE.jsx').then(({ default: OnlineBankingMFE }) => {
        const root = createRoot(el);
        // When federated, this component is already wrapped by the Host's Provider.
        root.render(<OnlineBankingMFE />);
    });
};

// If running in isolation (for development), mount immediately
// CRITICAL FIX: We must dynamically import the Provider and local store for isolation.
if (document.getElementById('root')) {
    Promise.all([
        import('react-redux'),
        import('./OnlineBankingMFE.jsx'),
        import('./store.js')
    ]).then(([
        { Provider },
        { default: OnlineBankingMFE },
        { store }
    ]) => {
        const root = createRoot(document.getElementById('root'));
        root.render(
            <Provider store={store}>
                <OnlineBankingMFE />
            </Provider>
        );
    });
}

export { mount };
