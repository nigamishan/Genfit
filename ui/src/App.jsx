import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import FormWizard from './pages/FormWizard';
import WorkoutPlan from './pages/WorkoutPlan';
import Dashboard from './pages/Dashboard';
import './styles/App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<FormWizard />} />
          <Route path="/workout-plan" element={<WorkoutPlan />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;