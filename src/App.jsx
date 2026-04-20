import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import './styles/global.css';

const lazyWithRetry = (componentImport) =>
  lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem('page-has-been-force-refreshed') || 'false'
    );

    try {
      const component = await componentImport();
      window.sessionStorage.setItem('page-has-been-force-refreshed', 'false');
      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        window.sessionStorage.setItem('page-has-been-force-refreshed', 'true');
        return window.location.reload();
      }
      throw error;
    }
  });

const Services      = lazyWithRetry(() => import('./pages/Services'));
const Booking       = lazyWithRetry(() => import('./pages/Booking'));
const Gallery       = lazyWithRetry(() => import('./pages/Gallery'));
const Auth          = lazyWithRetry(() => import('./pages/Auth'));
const Dashboard     = lazyWithRetry(() => import('./pages/Dashboard'));
const Admin         = lazyWithRetry(() => import('./pages/Admin'));
const Profile       = lazyWithRetry(() => import('./pages/Profile'));
const Notifications = lazyWithRetry(() => import('./pages/Notifications'));
const Contact       = lazyWithRetry(() => import('./pages/Contact'));
const Experience    = lazyWithRetry(() => import('./pages/Experience'));

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
