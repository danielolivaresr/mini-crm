import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import api         from '../../api/axios';
import Button      from '../../components/ui/Button';
import Card        from '../../components/ui/Card';
import Badge       from '../../components/ui/Badge';
import PageHeader  from '../../components/ui/PageHeader';
import Modal       from '../../components/Modal';
import LeadForm    from './LeadForm';

// Mapeo estado → variant de Badge + etiqueta visible
const STATUS_META = {
  nuevo:        { label: 'Nuevo',        variant: 'info'    },
  en_progreso:  { label: 'En progreso',  variant: 'warning' },
  ganado:       { label: 'Ganado',       variant: 'success' },
  perdido:      { label: 'Perdido',      variant: 'danger'  },
};

// Formateador de moneda en euros
const formatCurrency = (value) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value || 0);

export default function LeadsPage() {
  const [leads, setLeads]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const [modalOpen, setModalOpen]   = useState(false);
  const [editing, setEditing]       = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const res = await api.get('/leads', { params });
      setLeads(res.data);
    } catch (err) {
      console.error('Error cargando leads:', err);
    } finally {
      setLoading(false);
    }
  };

  // Recarga cuando cambia el filtro
  useEffect(() => {
    loadLeads();
  }, [statusFilter]);

  const handleCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (lead) => {
    setEditing(lead);
    setModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editing) {
        await api.put(`/leads/${editing.id}`, formData);
      } else {
        await api.post('/leads', formData);
      }
      setModalOpen(false);
      await loadLeads();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al guardar');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (lead) => {
    if (!confirm(`¿Eliminar la oportunidad "${lead.title}"?`)) return;
    try {
      await api.delete(`/leads/${lead.id}`);
      await loadLeads();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar');
    }
  };

  return (
    <div>
      <PageHeader
        title="Oportunidades"
        description="Gestiona tus oportunidades comerciales"
        actions={
          <Button onClick={handleCreate}>
            <Plus size={16} />
            Nueva oportunidad
          </Button>
        }
      />

      {/* FILTRO POR ESTADO */}
      <div className="flex gap-2 mb-4">
        <FilterChip active={statusFilter === ''}            onClick={() => setStatusFilter('')}>           Todos      </FilterChip>
        <FilterChip active={statusFilter === 'nuevo'}       onClick={() => setStatusFilter('nuevo')}>      Nuevos     </FilterChip>
        <FilterChip active={statusFilter === 'en_progreso'} onClick={() => setStatusFilter('en_progreso')}>En progreso</FilterChip>
        <FilterChip active={statusFilter === 'ganado'}      onClick={() => setStatusFilter('ganado')}>     Ganados    </FilterChip>
        <FilterChip active={statusFilter === 'perdido'}     onClick={() => setStatusFilter('perdido')}>    Perdidos   </FilterChip>
      </div>

      {loading ? (
        <Card>
          <div className="p-8 text-center text-sm text-slate-500">Cargando oportunidades...</div>
        </Card>
      ) : leads.length === 0 ? (
        <Card>
          <div className="p-12 text-center">
            <p className="text-slate-700 font-medium mb-1">
              {statusFilter ? 'No hay oportunidades con este estado' : 'No tienes oportunidades todavía'}
            </p>
            <p className="text-sm text-slate-500 mb-4">
              {statusFilter
                ? 'Prueba a cambiar el filtro o crea una oportunidad nueva.'
                : 'Crea tu primera oportunidad para empezar el seguimiento.'}
            </p>
            <Button onClick={handleCreate}>
              <Plus size={16} />
              Crear oportunidad
            </Button>
          </div>
        </Card>
      ) : (
        <Card>
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left  px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Título</th>
                <th className="text-left  px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Cliente</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Valor</th>
                <th className="text-left  px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Estado</th>
                <th className="px-5 py-3 w-px"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {leads.map(lead => {
                const meta = STATUS_META[lead.status] || STATUS_META.nuevo;
                return (
                  <tr key={lead.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 text-sm font-medium text-slate-900">{lead.title}</td>
                    <td className="px-5 py-3 text-sm text-slate-700">{lead.client_name}</td>
                    <td className="px-5 py-3 text-sm text-slate-700 text-right tabular-nums">
                      {formatCurrency(lead.value)}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={meta.variant}>{meta.label}</Badge>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="flex gap-1 justify-end">
                        <button
                          onClick={() => handleEdit(lead)}
                          className="p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded"
                          title="Editar"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(lead)}
                          className="p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded"
                          title="Eliminar"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar oportunidad' : 'Nueva oportunidad'}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setModalOpen(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form="lead-form"
              disabled={submitting}
            >
              {submitting ? 'Guardando...' : 'Guardar'}
            </Button>
          </>
        }
      >
        <LeadForm
          initialData={editing}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
}

// Componente interno para los chips de filtro
function FilterChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
        active
          ? 'bg-navy-900 text-white'
          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
      }`}
    >
      {children}
    </button>
  );
}