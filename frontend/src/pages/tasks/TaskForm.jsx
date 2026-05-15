import { useState, useEffect } from 'react';
import Input from '../../components/ui/Input';
import api   from '../../api/axios';

export default function TaskForm({ initialData, onSubmit }) {
  const [form, setForm] = useState({
    title:       '',
    description: '',
    due_date:    '',
    client_id:   '',
    lead_id:     '',
    completed:   false,
  });

  const [clients, setClients] = useState([]);
  const [leads, setLeads]     = useState([]);

  // Cargar clientes y oportunidades en paralelo
  useEffect(() => {
    Promise.all([
      api.get('/clients'),
      api.get('/leads'),
    ])
      .then(([clientsRes, leadsRes]) => {
        setClients(clientsRes.data);
        setLeads(leadsRes.data);
      })
      .catch(err => console.error('Error cargando datos:', err));
  }, []);

  // Si recibimos datos iniciales (modo editar), rellenar
  useEffect(() => {
    if (initialData) {
      setForm({
        title:       initialData.title       || '',
        description: initialData.description || '',
        due_date:    initialData.due_date
          ? initialData.due_date.slice(0, 10)   // formato YYYY-MM-DD
          : '',
        client_id:   initialData.client_id || '',
        lead_id:     initialData.lead_id   || '',
        completed:   !!initialData.completed,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title:       form.title,
      description: form.description || null,
      due_date:    form.due_date    || null,
      client_id:   form.client_id ? parseInt(form.client_id) : null,
      lead_id:     form.lead_id   ? parseInt(form.lead_id)   : null,
      completed:   form.completed,
    });
  };

  // Filtramos oportunidades por cliente seleccionado, si lo hay
  const filteredLeads = form.client_id
    ? leads.filter(l => l.client_id === parseInt(form.client_id))
    : leads;

  const selectClass =
    'w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md ' +
    'focus:outline-none focus:ring-2 focus:ring-navy-500/30 focus:border-navy-500';

  return (
    <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Título *"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Ej: Llamar al cliente para confirmar reunión"
        required
        autoFocus
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">
          Descripción
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={2}
          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-500/30 focus:border-navy-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Fecha límite"
          name="due_date"
          type="date"
          value={form.due_date}
          onChange={handleChange}
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Cliente
          </label>
          <select
            name="client_id"
            value={form.client_id}
            onChange={(e) => {
              handleChange(e);
              // Al cambiar de cliente, limpiar la oportunidad
              setForm(f => ({ ...f, client_id: e.target.value, lead_id: '' }));
            }}
            className={selectClass}
          >
            <option value="">Sin asignar</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">
          Oportunidad
        </label>
        <select
          name="lead_id"
          value={form.lead_id}
          onChange={handleChange}
          className={selectClass}
          disabled={!form.client_id && filteredLeads.length === 0}
        >
          <option value="">Sin asignar</option>
          {filteredLeads.map(l => (
            <option key={l.id} value={l.id}>{l.title}</option>
          ))}
        </select>
        {form.client_id && filteredLeads.length === 0 && (
          <p className="text-xs text-slate-500">
            Este cliente no tiene oportunidades.
          </p>
        )}
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          name="completed"
          checked={form.completed}
          onChange={handleChange}
          className="w-4 h-4 rounded border-slate-300 text-navy-900 focus:ring-2 focus:ring-navy-500/30"
        />
        <span className="text-sm text-slate-700">
          Marcar como completada
        </span>
      </label>
    </form>
  );
}