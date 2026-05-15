import { useState, useEffect } from 'react';
import Input from '../../components/ui/Input';

export default function ClientForm({ initialData, onSubmit }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: '',
  });

  // Si recibimos datos iniciales (modo editar), rellenamos el formulario
  useEffect(() => {
    if (initialData) {
      setForm({
        name:    initialData.name    || '',
        email:   initialData.email   || '',
        phone:   initialData.phone   || '',
        company: initialData.company || '',
        notes:   initialData.notes   || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form id="client-form" onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre *"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
        autoFocus
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
        <Input
          label="Teléfono"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />
      </div>

      <Input
        label="Empresa"
        name="company"
        value={form.company}
        onChange={handleChange}
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">
          Notas
        </label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-500/30 focus:border-navy-500"
        />
      </div>
    </form>
  );
}