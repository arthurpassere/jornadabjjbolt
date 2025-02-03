import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Dumbbell, BarChart2, UserCircle, LogOut } from 'lucide-react';

export function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Dumbbell className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">JornadaBJJ</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/training/new"
              className="text-gray-700 hover:text-blue-600 flex items-center space-x-1"
            >
              <Dumbbell className="h-5 w-5" />
              <span>Registrar Treino</span>
            </Link>
            
            <Link
              to="/stats"
              className="text-gray-700 hover:text-blue-600 flex items-center space-x-1"
            >
              <BarChart2 className="h-5 w-5" />
              <span>Estatísticas</span>
            </Link>

            <Link
              to="/profile"
              className="text-gray-700 hover:text-blue-600 flex items-center space-x-1"
            >
              <UserCircle className="h-5 w-5" />
              <span>Perfil</span>
            </Link>

            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-blue-600 flex items-center space-x-1"
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="p-2 rounded-md text-gray-700 hover:text-blue-600">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}