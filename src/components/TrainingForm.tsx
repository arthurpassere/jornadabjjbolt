import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Clock, Calendar, Book, Users, Award, Edit3 } from 'lucide-react';

const defaultFormData = {
  gi: true,
  duration: 60,
  date: new Date().toISOString().split('T')[0],
  techniques: '',
  rounds: 5,
  roundDuration: 5,
  submissions: 0,
  sweeps: 0,
  takedowns: 0,
  positives: '',
  improvements: '',
  notes: ''
};

export function TrainingForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { error } = await supabase.from('trainings').insert({
        user_id: user.id,
        gi: formData.gi,
        duration: formData.duration || 60,
        date: formData.date,
        techniques_learned: formData.techniques ? formData.techniques.split(',').map(t => t.trim()) : [],
        rounds: formData.rounds || 5,
        round_duration: formData.roundDuration || 5,
        submissions: formData.submissions || 0,
        sweeps: formData.sweeps || 0,
        takedowns: formData.takedowns || 0,
        notes_positive: formData.positives || '',
        notes_improvement: formData.improvements || '',
        additional_notes: formData.notes || ''
      });

      if (error) throw error;
      alert('Treino registrado com sucesso!');
      setFormData(defaultFormData); // Reset form after successful submission
    } catch (error) {
      console.error('Error:', error);
      alert('Erro ao registrar treino');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Registrar Treino</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Training Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Treino
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    checked={formData.gi}
                    onChange={() => setFormData(prev => ({ ...prev, gi: true }))}
                  />
                  <span className="ml-2">Com Kimono</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    checked={!formData.gi}
                    onChange={() => setFormData(prev => ({ ...prev, gi: false }))}
                  />
                  <span className="ml-2">Sem Kimono</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Duração (minutos)</span>
                </div>
              </label>
              <input
                type="number"
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.duration || 60}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Data do Treino</span>
                </div>
              </label>
              <input
                type="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
          </div>

          {/* Training Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center space-x-2">
                  <Book className="h-4 w-4" />
                  <span>Técnicas Aprendidas (separadas por vírgula)</span>
                </div>
              </label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                value={formData.techniques}
                onChange={(e) => setFormData(prev => ({ ...prev, techniques: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Quantidade de Rolas</span>
                  </div>
                </label>
                <input
                  type="number"
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.rounds || 5}
                  onChange={(e) => setFormData(prev => ({ ...prev, rounds: parseInt(e.target.value) || 5 }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Duração dos Rolas (min)</span>
                  </div>
                </label>
                <input
                  type="number"
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.roundDuration || 5}
                  onChange={(e) => setFormData(prev => ({ ...prev, roundDuration: parseInt(e.target.value) || 5 }))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Estatísticas do Treino</span>
            </div>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Finalizações</label>
              <input
                type="number"
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.submissions || 0}
                onChange={(e) => setFormData(prev => ({ ...prev, submissions: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Raspagens</label>
              <input
                type="number"
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.sweeps || 0}
                onChange={(e) => setFormData(prev => ({ ...prev, sweeps: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quedas</label>
              <input
                type="number"
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.takedowns || 0}
                onChange={(e) => setFormData(prev => ({ ...prev, takedowns: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            <div className="flex items-center space-x-2">
              <Edit3 className="h-5 w-5" />
              <span>Notas do Treino</span>
            </div>
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">O que foi bem</label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                value={formData.positives}
                onChange={(e) => setFormData(prev => ({ ...prev, positives: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">O que precisa melhorar</label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                value={formData.improvements}
                onChange={(e) => setFormData(prev => ({ ...prev, improvements: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notas adicionais</label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Registrar Treino'}
          </button>
        </div>
      </div>
    </form>
  );
}