import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import './styles/global.css';

const Services      = lazy(() => import('./pages/Services'));
const Booking       = lazy(() => import('./pages/Booking'));
const Gallery       = lazy(() => import('./pages/Gallery'));
const Auth          = lazy(() => import('./pages/Auth'));
const Dashboard     = lazy(() => import('./pages/Dashboard'));
const Admin         = lazy(() => import('./pages/Admin'));
const Profile       = lazy(() => import('./pages/Profile'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Contact       = lazy(() => import('./pages/Contact'));
const Experience    = lazy(() => import('./pages/Experience'));

function App() {
  return (
    <Sentry.ErrorBoundary fallback={<div style={{padding:'2rem',textAlign:'center'}}>Something went wrong.</div>}>
    <Router>
      <AuthProvider>
        <Layout>
          <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/book" element={<Booking />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/experience" element={<Experience />} />
          </Routes>
          </Suspense>
        </Layout>
      </AuthProvider>
    </Router>
    </Sentry.ErrorBoundary>
  );
}

export default Sentry.withProfiler(App);
