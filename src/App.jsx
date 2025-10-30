import React from 'react';
import { MemoryRouter, Routes, Route, Link } from 'react-router-dom';

export default function MFE5App() {
  return (
    <MemoryRouter initialEntries={["/"]}>
      <div style={{ border: '4px solid #d32f2f', padding: 12 }}>
        <h2>MFE5 (repo5)</h2>
        <nav>
          <Link to="/">Home</Link> | <Link to="/about">About</Link>
        </nav>
        <hr />
        <Routes>
          <Route path="/" element={<div>MFE5 home</div>} />
          <Route path="/about" element={<div>About MFE5</div>} />
          <Route path="*" element={<div>MFE5 - not found</div>} />
        </Routes>
      </div>
    </MemoryRouter>
  );
}