import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Navbar } from './components/Navbar';
import { LoginForm } from './components/LoginForm';
import { TrainingForm } from './components/TrainingForm';
import { StatsPage } from './components/StatsPage';
import { ProfileForm } from './components/ProfileForm';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {session && <Navbar />}
        <div className="pt-16">
          <Routes>
            <Route
              path="/login"
              element={session ? <Navigate to="/training/new" replace /> : <LoginForm />}
            />
            <Route
              path="/training/new"
              element={session ? <TrainingForm /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/stats"
              element={session ? <StatsPage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/profile"
              element={session ? <ProfileForm /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/"
              element={<Navigate to={session ? "/training/new" : "/login"} replace />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;