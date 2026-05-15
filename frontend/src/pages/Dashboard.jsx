import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Target, CheckSquare, TrendingUp, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import api         from '../api/axios';
import Card        from '../components/ui/Card';
import Badge       from '../components/ui/Badge';
import PageHeader  from '../components/ui/PageHeader';
import StatCard    from '../components/ui/StatCard';

const STATUS_META = {
  nuevo:        { label: 'Nuevo',        variant: 'info'    },
  en_progreso:  { label: 'En progreso',  variant: 'warning' },
  ganado:       { label: 'Ganado',       variant: 'success' },
  perdido:      { label: 'Perdido',      variant: 'danger'  },
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value || 0);

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short',
  });
};

// Saludo dinámico según la hora
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 20) return 'Buenas tardes';
  return 'Buenas noches';
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error('Error cargando estadísticas:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <PageHeader title="Dashboard" />
        <Card>
          <div className="p-8 text-center text-sm text-slate-500">
            Cargando estadísticas...
          </div>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return (
      <div>
        <PageHeader title="Dashboard" />
        <Card>
          <div className="p-8 text-center text-sm text-slate-500">
            No se pudieron cargar las estadísticas.
          </div>
        </Card>
      </div>
    );
  }

  const openLeads = stats.leadsByStatus.nuevo + stats.leadsByStatus.en_progreso;

  return (
    <div>
      <PageHeader
        title={`${getGreeting()}, ${user?.name?.split(' ')[0] || ''}`}
        description="Resumen general de tu actividad comercial"
      />

      {/* MÉTRICAS PRINCIPALES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Clientes"
          value={stats.totalClients}
          icon={Users}
        />
        <StatCard
          label="Oportunidades abiertas"
          value={openLeads}
          icon={Target}
          hint={`${stats.leadsByStatus.ganado} ganadas · ${stats.leadsByStatus.perdido} perdidas`}
        />
        <StatCard
          label="Pipeline"
          value={formatCurrency(stats.pipelineValue)}
          icon={TrendingUp}
          hint="Valor total estimado"
        />
        <StatCard
          label="Tareas pendientes"
          value={stats.pendingTasks}
          icon={CheckSquare}
          hint={stats.overdueTasks > 0 ? `${stats.overdueTasks} vencida${stats.overdueTasks > 1 ? 's' : ''}` : 'Todo al día'}
          trend={stats.overdueTasks > 0 ? 'danger' : 'success'}
        />
      </div>

      {/* SECCIÓN DE DOS COLUMNAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Oportunidades recientes */}
        <Card>
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Últimas oportunidades
            </h2>
            <Link
              to="/leads"
              className="text-xs text-navy-700 hover:text-navy-900 font-medium"
            >
              Ver todas →
            </Link>
          </div>
          {stats.recentLeads.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No hay oportunidades todavía
            </div>
          ) : (
            <ul className="divide-y divide-slate-200">
              {stats.recentLeads.map(lead => {
                const meta = STATUS_META[lead.status] || STATUS_META.nuevo;
                return (
                  <li key={lead.id} className="px-5 py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {lead.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {lead.client_name} · {formatCurrency(lead.value)}
                      </p>
                    </div>
                    <Badge variant={meta.variant}>{meta.label}</Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        {/* Próximas tareas */}
        <Card>
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Próximas tareas
            </h2>
            <Link
              to="/tasks"
              className="text-xs text-navy-700 hover:text-navy-900 font-medium"
            >
              Ver todas →
            </Link>
          </div>
          {stats.upcomingTasks.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No hay tareas pendientes con fecha
            </div>
          ) : (
            <ul className="divide-y divide-slate-200">
              {stats.upcomingTasks.map(task => {
                const isOverdue = new Date(task.due_date) < new Date(new Date().setHours(0,0,0,0));
                return (
                  <li key={task.id} className="px-5 py-3 flex items-center justify-between gap-3">
                    <p className="text-sm text-slate-900 truncate flex-1">
                      {task.title}
                    </p>
                    <span className={`text-xs whitespace-nowrap flex items-center gap-1 ${
                      isOverdue ? 'text-red-600 font-medium' : 'text-slate-500'
                    }`}>
                      {isOverdue && <AlertCircle size={12} />}
                      {formatDate(task.due_date)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}