import { useState, useEffect } from 'react';
import Input from '../../components/ui/Input';
import api   from '../../api/axios';

const STATUS_OPTIONS = [
  { value: 'nuevo',        label: 'Nuevo' },
  { value: 'en_progreso',  label: 'En progreso' },
  { value: 'ganado',       label: 'Ganado' },
  { value: 'perdido',      label: 'Perdido' },
];

export default function LeadForm({ initialData, onSubmit }) {
  const [form, setForm] = useState({
    client_id: '',
    title:     '',
    value:     '',
    status:    'nuevo',
    notes:     '',
  });

  const [clients, setClients] = useState([]);

  // Cargar la lista de clientes para el selector
  useEffect(() => {
    api.get('/clients')
      .then(res => setClients(res.data))
      .catch(err => console.error('Error cargando clientes:', err));
  }, []);

  // Si recibimos datos iniciales (modo editar), rellenar formulario
  useEffect(() => {
    if (initialData) {
      setForm({
        client_id: initialData.client_id || '',
        title:     initialData.title     || '',
        value:     initialData.value     || '',
        status:    initialData.status    || 'nuevo',
        notes:     initialData.notes     || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      client_id: parseInt(form.client_id),
      value:     parseFloat(form.value) || 0,
    });
  };

  // Clases del select reutilizadas
  const selectClass =
    'w-full px-3 py-2 text-sm bg-surface border border-line-strong rounded-md ' +
    'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary';

  return (
    <form id="lead-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-ink-soft">
          Cliente *
        </label>
        <select
          name="client_id"
          value={form.client_id}
          onChange={handleChange}
          required
          className={selectClass}
        >
          <option value="">Selecciona un cliente</option>
          {clients.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <Input
        label="Título de la oportunidad *"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Ej: Renovación contrato anual"
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Valor estimado (€)"
          name="value"
          type="number"
          step="0.01"
          min="0"
          value={form.value}
          onChange={handleChange}
          placeholder="0.00"
        />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-ink-soft">
            Estado
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className={selectClass}
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-ink-soft">
          Notas
        </label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 text-sm bg-surface border border-line-strong rounded-md placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>
    </form>
  );
}