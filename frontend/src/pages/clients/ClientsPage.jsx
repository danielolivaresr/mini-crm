import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import PageHeader from '../../components/ui/PageHeader';
import Modal from '../../components/Modal';
import ClientForm from './ClientForm';

export default function ClientsPage() {
  // Datos y estado de carga
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal de crear/editar
  const [modalOpen, setModalOpen]   = useState(false);
  const [editing, setEditing]       = useState(null); // null = crear, objeto = editar
  const [submitting, setSubmitting] = useState(false);

  // Cargar lista al montar
  const loadClients = async () => {
    setLoading(true);
    try {
      const res = await api.get('/clients');
      setClients(res.data);
    } catch (err) {
      console.error('Error cargando clientes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar lista al montar
  useEffect(() => {
    loadClients();
  }, []);

  // Abrir modal en modo crear
  const handleCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  // Abrir modal en modo editar
  const handleEdit = (client) => {
    setEditing(client);
    setModalOpen(true);
  };

  // Guardar (crear o editar)
  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editing) {
        await api.put(`/clients/${editing.id}`, formData);
      } else {
        await api.post('/clients', formData);
      }
      setModalOpen(false);
      await loadClients();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al guardar');
    } finally {
      setSubmitting(false);
    }
  };

  // Eliminar con confirmación
  const handleDelete = async (client) => {
    if (!confirm(`¿Eliminar a ${client.name}? Esta acción no se puede deshacer.`)) {
      return;
    }
    try {
      await api.delete(`/clients/${client.id}`);
      await loadClients();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar');
    }
  };

  return (
    <div>
      <PageHeader
        title="Clientes"
        description="Gestiona tu cartera de clientes"
        actions={
          <Button onClick={handleCreate}>
            <Plus size={16} />
            Nuevo cliente
          </Button>
        }
      />

      {/* Estados: cargando, vacío, lista */}
      {loading ? (
        <Card>
          <div className="p-8 text-center text-sm text-slate-500">
            Cargando clientes...
          </div>
        </Card>
      ) : clients.length === 0 ? (
        <Card>
          <div className="p-12 text-center">
            <p className="text-slate-700 font-medium mb-1">
              No tienes clientes todavía
            </p>
            <p className="text-sm text-slate-500 mb-4">
              Crea tu primer cliente para empezar.
            </p>
            <Button onClick={handleCreate}>
              <Plus size={16} />
              Crear primer cliente
            </Button>
          </div>
        </Card>
      ) : (
        <Card>
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Nombre</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Empresa</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Email</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Teléfono</th>
                <th className="px-5 py-3 w-px"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {clients.map(client => (
                <tr key={client.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 text-sm font-medium text-slate-900">
                    {client.name}
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-700">
                    {client.company || <span className="text-slate-400">—</span>}
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-700">
                    {client.email || <span className="text-slate-400">—</span>}
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-700">
                    {client.phone || <span className="text-slate-400">—</span>}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex gap-1 justify-end">
                      <button
                        onClick={() => handleEdit(client)}
                        className="p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded"
                        title="Editar"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(client)}
                        className="p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded"
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Modal de crear/editar */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar cliente' : 'Nuevo cliente'}
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
              form="client-form"
              disabled={submitting}
            >
              {submitting ? 'Guardando...' : 'Guardar'}
            </Button>
          </>
        }
      >
        <ClientForm
          initialData={editing}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
}