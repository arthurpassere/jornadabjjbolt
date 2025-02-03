import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserCircle } from 'lucide-react';
import type { UserProfile, Belt, AgeGroup } from '../types/database';

const defaultProfile: Partial<UserProfile> = {
  name: '',
  age_group: 'under18',
  academy: '',
  belt: 'white',
  stripes: 0,
  training_frequency: 0,
  training_years: 0,
};

export function ProfileForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Partial<UserProfile>>(defaultProfile);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setProfile(data);
      } else {
        // Create a new profile if one doesn't exist
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({ ...defaultProfile, id: user.id });

        if (insertError) throw insertError;
        setProfile(defaultProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      alert('Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { error } = await supabase
        .from('profiles')
        .upsert({ ...profile, id: user.id });

      if (error) throw error;
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Erro ao salvar perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-6">
          <UserCircle className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Seu Perfil</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={profile.name || ''}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Faixa Etária
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={profile.age_group || 'under18'}
              onChange={(e) => setProfile({ ...profile, age_group: e.target.value as AgeGroup })}
            >
              <option value="under18">Menor de 18</option>
              <option value="18-24">18-24</option>
              <option value="25-34">25-34</option>
              <option value="35-44">35-44</option>
              <option value="45-54">45-54</option>
              <option value="55+">55+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Academia
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={profile.academy || ''}
              onChange={(e) => setProfile({ ...profile, academy: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Faixa
              </label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={profile.belt || 'white'}
                onChange={(e) => setProfile({ ...profile, belt: e.target.value as Belt })}
              >
                <option value="white">Branca</option>
                <option value="blue">Azul</option>
                <option value="purple">Roxa</option>
                <option value="brown">Marrom</option>
                <option value="black">Preta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Graus
              </label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={profile.stripes || 0}
                onChange={(e) => setProfile({ ...profile, stripes: parseInt(e.target.value) })}
              >
                {[0, 1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Treinos por Semana
              </label>
              <input
                type="number"
                min="0"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={profile.training_frequency || 0}
                onChange={(e) =>
                  setProfile({ ...profile, training_frequency: parseInt(e.target.value) })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Anos de Treino
              </label>
              <input
                type="number"
                min="0"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={profile.training_years || 0}
                onChange={(e) =>
                  setProfile({ ...profile, training_years: parseInt(e.target.value) })
                }
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar Perfil'}
          </button>
        </div>
      </div>
    </form>
  );
}