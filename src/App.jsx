import React from 'react';
import { CivicDataProvider } from './hooks/useCivicData';
import AppRoutes from './routes/AppRoutes';
import CommunityFeed from "./pages/CommunityFeed";
import { BrowserRouter, Routes, Route } from "react-router-dom";

<Route path="/feed" element={<CommunityFeed />} />


export default function App() {
  return (
    <CivicDataProvider>
      <AppRoutes />
    </CivicDataProvider>
  );
}
