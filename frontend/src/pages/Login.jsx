import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Button from '../components/ui/Button';
import Input  from '../components/ui/Input';
import ThemeToggle from '../components/ThemeToggle';
import logo from '../assets/logo.svg';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas px-4">
      <ThemeToggle className="fixed top-4 right-4 p-2" />
      <div className="w-full max-w-sm">
        {/* Marca arriba */}
        <div className="text-center mb-8">
          <img src={logo} alt="" className="inline-block w-14 h-14 mb-3" />
          <h1 className="text-xl font-semibold text-ink">Pulsar CRM</h1>
          <p className="text-sm text-ink-muted mt-1">
            Inicia sesión para acceder a tu cuenta
          </p>
        </div>

        {/* Card del formulario */}
        <div className="bg-surface border border-line rounded-md shadow-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              autoFocus
            />

            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {error && (
              <div className="bg-danger-soft border border-danger-line text-danger-strong px-3 py-2 rounded-md text-xs">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-ink-faint mt-6">
          © 2026 Pulsar CRM.
        </p>
      </div>
    </div>
  );
}