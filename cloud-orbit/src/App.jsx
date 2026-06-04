import { useState } from 'react'
import {Routes, Route} from 'react-router-dom';
import './App.css'
import CloudMetricsChart from './CloudMetricsChart';
import Home from './Home';

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chart" element={<CloudMetricsChart />} />
    </Routes>
    </>
  )
}

export default App
