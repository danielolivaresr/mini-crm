import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Check } from 'lucide-react';
import api        from '../../api/axios';
import Button     from '../../components/ui/Button';
import Card       from '../../components/ui/Card';
import PageHeader from '../../components/ui/PageHeader';
import Modal      from '../../components/Modal';
import TaskForm   from './TaskForm';

// Formateador de fecha en español
const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  });
};

// Calcula si una fecha ya pasó (para tareas vencidas)
const isOverdue = (dateString, completed) => {
  if (!dateString || completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateString) < today;
};

export default function TasksPage() {
  const [tasks, setTasks]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState('pending');

  const [modalOpen, setModalOpen]   = useState(false);
  const [editing, setEditing]       = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter === 'pending')   params.completed = false;
      if (filter === 'completed') params.completed = true;

      const res = await api.get('/tasks', { params });
      setTasks(res.data);
    } catch (err) {
      console.error('Error cargando tareas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [filter]);

  const handleCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (task) => {
    setEditing(task);
    setModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editing) {
        await api.put(`/tasks/${editing.id}`, formData);
      } else {
        await api.post('/tasks', formData);
      }
      setModalOpen(false);
      await loadTasks();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al guardar');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (task) => {
    if (!confirm(`¿Eliminar la tarea "${task.title}"?`)) return;
    try {
      await api.delete(`/tasks/${task.id}`);
      await loadTasks();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar');
    }
  };

  const handleToggle = async (task) => {
    try {
      await api.patch(`/tasks/${task.id}/toggle`);
      await loadTasks();
    } catch (err) {
      console.error('Error al cambiar estado:', err);
    }
  };

  return (
    <div>
      <PageHeader
        title="Tareas"
        description="Gestiona tus recordatorios y seguimientos"
        actions={
          <Button onClick={handleCreate}>
            <Plus size={16} />
            Nueva tarea
          </Button>
        }
      />

      <div className="flex gap-2 mb-4">
        <FilterChip active={filter === 'pending'}   onClick={() => setFilter('pending')}>   Pendientes  </FilterChip>
        <FilterChip active={filter === 'completed'} onClick={() => setFilter('completed')}> Completadas </FilterChip>
        <FilterChip active={filter === 'all'}       onClick={() => setFilter('all')}>       Todas       </FilterChip>
      </div>

      {loading ? (
        <Card>
          <div className="p-8 text-center text-sm text-slate-500">Cargando tareas...</div>
        </Card>
      ) : tasks.length === 0 ? (
        <Card>
          <div className="p-12 text-center">
            <p className="text-slate-700 font-medium mb-1">
              {filter === 'pending'   && 'No tienes tareas pendientes 🎉'}
              {filter === 'completed' && 'No tienes tareas completadas todavía'}
              {filter === 'all'       && 'No tienes tareas todavía'}
            </p>
            <p className="text-sm text-slate-500 mb-4">
              {filter === 'pending'
                ? 'Buen trabajo manteniendo todo al día.'
                : 'Crea una nueva tarea para empezar.'}
            </p>
            {filter !== 'pending' && (
              <Button onClick={handleCreate}>
                <Plus size={16} />
                Crear tarea
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <Card>
          <ul className="divide-y divide-slate-200">
            {tasks.map(task => {
              const completed = !!task.completed;
              const overdue   = isOverdue(task.due_date, completed);
              return (
                <li
                  key={task.id}
                  className="flex items-start gap-3 px-5 py-3 hover:bg-slate-50"
                >
                  <button
                    onClick={() => handleToggle(task)}
                    className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                      completed
                        ? 'bg-navy-900 border-navy-900 text-white'
                        : 'bg-white border-slate-300 hover:border-navy-500 hover:bg-navy-50'
                    }`}
                    title={completed ? 'Marcar como pendiente' : 'Marcar como completada'}
                  >
                    {completed && <Check size={14} strokeWidth={3} />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${
                      completed ? 'text-slate-400 line-through' : 'text-slate-900'
                    }`}>
                      {task.title}
                    </p>

                    {task.description && (
                      <p className={`text-sm mt-0.5 ${
                        completed ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                      {task.due_date && (
                        <span className={overdue ? 'text-red-600 font-medium' : ''}>
                          📅 {formatDate(task.due_date)}
                          {overdue && ' (vencida)'}
                        </span>
                      )}
                      {task.client_name && <span>👤 {task.client_name}</span>}
                      {task.lead_title  && <span>🎯 {task.lead_title}</span>}
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(task)}
                      className="p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded"
                      title="Editar"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(task)}
                      className="p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded"
                      title="Eliminar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar tarea' : 'Nueva tarea'}
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
              form="task-form"
              disabled={submitting}
            >
              {submitting ? 'Guardando...' : 'Guardar'}
            </Button>
          </>
        }
      >
        <TaskForm
          initialData={editing}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
}

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