import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import SwasyaMapLeaflet from './pages/SwasyaMapLeaflet'

import Kiosk from './pages/Kiosk'

const App = () => {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/kiosk" element={<Kiosk />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/swasya-map" element={<SwasyaMapLeaflet />} />
      </Routes>
    </main>
  )
}

export default App