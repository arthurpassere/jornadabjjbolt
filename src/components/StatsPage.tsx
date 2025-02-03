import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import type { Training } from '../types/database';

export function StatsPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrainings();
  }, []);

  const loadTrainings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('trainings')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (error) throw error;
      setTrainings(data || []);
    } catch (error) {
      console.error('Error loading trainings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrainingStats = () => {
    if (!trainings.length) return null;

    const totalTrainings = trainings.length;
    const totalTime = trainings.reduce((sum, t) => sum + t.duration, 0);
    const totalSubmissions = trainings.reduce((sum, t) => sum + t.submissions, 0);
    const totalSweeps = trainings.reduce((sum, t) => sum + t.sweeps, 0);
    const totalTakedowns = trainings.reduce((sum, t) => sum + t.takedowns, 0);

    return {
      totalTrainings,
      totalTime,
      totalSubmissions,
      totalSweeps,
      totalTakedowns,
      avgTime: Math.round(totalTime / totalTrainings),
      avgSubmissions: (totalSubmissions / totalTrainings).toFixed(1),
      avgSweeps: (totalSweeps / totalTrainings).toFixed(1),
      avgTakedowns: (totalTakedowns / totalTrainings).toFixed(1),
    };
  };

  const stats = getTrainingStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!trainings.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Nenhum treino registrado
          </h2>
          <p className="text-gray-600">
            Registre seus treinos para ver suas estatísticas aqui.
          </p>
        </div>
      </div>
    );
  }

  const chartData = trainings.map((training) => ({
    date: format(new Date(training.date), 'dd/MM', { locale: ptBR }),
    submissions: training.submissions,
    sweeps: training.sweeps,
    takedowns: training.takedowns,
    duration: training.duration,
  }));

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Total de Treinos
          </h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalTrainings}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Tempo Total (min)
          </h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalTime}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Média de Tempo (min)
          </h3>
          <p className="text-3xl font-bold text-blue-600">{stats.avgTime}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Total Finalizações
          </h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalSubmissions}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Evolução de Finalizações, Raspagens e Quedas
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="submissions"
                  name="Finalizações"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="sweeps"
                  name="Raspagens"
                  stroke="#059669"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="takedowns"
                  name="Quedas"
                  stroke="#dc2626"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Duração dos Treinos
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="duration"
                  name="Duração (min)"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}