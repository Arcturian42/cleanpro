import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { cn } from './lib/utils';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(email);

    if (success) {
      // Redirect based on role
      if (email === 'agent@cleanpro.demo') {
        navigate('/m/today');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError('Identifiants invalides. Utilisez les comptes de démo ci-dessous.');
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white mb-4 shadow-lg shadow-blue-200">
            <Sparkles size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">CleanPro</h1>
          <p className="text-slate-500 mt-2 text-lg">
            Gérez vos interventions, vos agents et vos factures simplement.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200 p-8 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@entreprise.fr"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700">
                  Mot de passe
                </label>
                <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  Mot de passe oublié ?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-3 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 italic">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Comptes de démonstration
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { label: 'Admin (Tout voir)', email: 'admin@cleanpro.demo' },
                { label: 'Manager (Opérations)', email: 'manager@cleanpro.demo' },
                { label: 'Agent (Mobile)', email: 'agent@cleanpro.demo' },
              ].map((demo) => (
                <button
                  key={demo.email}
                  type="button"
                  onClick={() => handleDemoLogin(demo.email)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-lg border text-sm transition-all text-left",
                    email === demo.email 
                      ? "border-blue-600 bg-blue-50 text-blue-700 font-medium" 
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600"
                  )}
                >
                  <span>{demo.label}</span>
                  <span className="text-[10px] opacity-60">{demo.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <p className="text-center text-slate-400 text-sm mt-8">
          © 2026 CleanPro — Gestion propreté facilitée
        </p>
      </div>
    </div>
  );
}
