require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool   = require('../db/connection');


//  DATOS DEMO
const CLIENTS = [
  { name: 'María González Pérez',    email: 'mgonzalez@inversionesatlantico.es',  phone: '928 451 230', company: 'Inversiones Atlántico S.L.',     notes: 'Cliente desde 2022. Interesada en ampliar servicios cloud.' },
  { name: 'Carlos Hernández Vega',   email: 'chernandez@logisur.com',             phone: '922 387 419', company: 'Logística del Sur',             notes: 'Director de operaciones. Tomador de decisiones.' },
  { name: 'Ana Belén Rodríguez',     email: 'ana.rodriguez@bufeterodriguez.es',   phone: '928 220 158', company: 'Bufete Rodríguez & Asociados',  notes: 'Despacho de abogados de 12 personas. Necesita gestión documental.' },
  { name: 'Javier Martín Suárez',    email: 'jmartin@constructoraisleña.com',     phone: '922 109 472', company: 'Constructora Isleña S.A.',      notes: 'Empresa familiar. Trato cercano y reuniones presenciales.' },
  { name: 'Laura Pérez Domínguez',   email: 'laura@boutiquelp.es',                phone: '928 559 803', company: 'Boutique La Palma',             notes: 'E-commerce de moda. Quiere automatizar facturación.' },
  { name: 'Roberto Santana Cabrera', email: 'rsantana@tecnocanarias.com',         phone: '928 442 901', company: 'Tecnocanarias',                  notes: 'CTO. Muy técnico, valora documentación detallada.' },
  { name: 'Elena Ramos Torres',      email: 'elena@hotelmaspalomas.com',          phone: '928 765 432', company: 'Hotel Maspalomas Premium',       notes: 'Cadena hotelera de 4 establecimientos.' },
  { name: 'Francisco Jiménez Mora',  email: 'fjimenez@distribucionescanaria.es',  phone: '922 845 612', company: 'Distribuciones Canaria',         notes: 'Distribuidor de alimentación. Ámbito regional.' },
  { name: 'Patricia Navarro Reyes',  email: 'pnavarro@clinicadental.es',          phone: '928 334 217', company: 'Clínica Dental Navarro',         notes: 'Necesita sistema de citas integrado.' },
  { name: 'Daniel Quintana Ortega',  email: 'dquintana@quintanarq.com',           phone: '922 661 488', company: 'Quintana Arquitectos',           notes: 'Estudio de arquitectura. 3 socios.' },
  { name: 'Isabel Romero Cruz',      email: 'iromero@academiarc.com',             phone: '928 117 503', company: 'Academia Romero Cruz',          notes: 'Centro de formación de oposiciones.' },
  { name: 'Manuel Alonso Pérez',     email: 'malonso@autoreparacion.es',          phone: '928 906 754', company: 'Auto Reparación Alonso',        notes: 'Taller mecánico. Quiere mejorar comunicación con clientes.' },
  { name: 'Sofía García Méndez',     email: 'sofia@floristeriagm.com',            phone: '922 287 119', company: 'Floristería García Méndez',     notes: 'Pyme local. Negocio estable.' },
  { name: 'Antonio Castro Vidal',    email: 'acastro@gestoriacastro.es',          phone: '928 552 901', company: 'Gestoría Castro',                notes: 'Asesoría fiscal y laboral. Cliente clave.' },
  { name: 'Beatriz López Fernández', email: 'blopez@editorialatlantico.com',      phone: '922 478 200', company: 'Editorial Atlántico',            notes: 'Editorial independiente especializada en literatura local.' },
];

// Plantillas de oportunidades — se asignan a los clientes en orden cíclico
const LEAD_TEMPLATES = [
  { title: 'Renovación contrato mantenimiento anual',     value: 4800,  status: 'en_progreso', notes: 'Presupuesto enviado. Pendiente firma.' },
  { title: 'Migración a infraestructura cloud',           value: 12500, status: 'nuevo',       notes: 'Reunión inicial pendiente.' },
  { title: 'Implantación módulo facturación electrónica', value: 3200,  status: 'ganado',      notes: 'Cerrada. Inicio del proyecto en 15 días.' },
  { title: 'Auditoría de seguridad informática',          value: 5500,  status: 'en_progreso', notes: 'Propuesta técnica aceptada. Negociando precio.' },
  { title: 'Sistema de gestión de citas online',          value: 2800,  status: 'nuevo',       notes: 'Necesita ver una demo.' },
  { title: 'Renovación equipos servidores',               value: 8900,  status: 'perdido',     notes: 'Eligieron a la competencia por precio.' },
  { title: 'Desarrollo app móvil para clientes',          value: 15000, status: 'en_progreso', notes: 'Definiendo alcance funcional.' },
  { title: 'Servicio de copias de seguridad gestionadas', value: 1800,  status: 'ganado',      notes: 'Contrato firmado por 24 meses.' },
  { title: 'Formación a empleados en ofimática',          value: 2400,  status: 'nuevo',       notes: 'Grupo de 8 personas.' },
  { title: 'Renovación licencias software',               value: 6700,  status: 'ganado',      notes: 'Renovación automática activada.' },
  { title: 'Consultoría transformación digital',          value: 18000, status: 'en_progreso', notes: 'Fase de análisis en marcha.' },
  { title: 'Instalación red WiFi profesional',            value: 3600,  status: 'nuevo',       notes: 'Visita técnica programada.' },
  { title: 'Adaptación al RGPD',                          value: 2200,  status: 'ganado',      notes: 'Documentación entregada.' },
  { title: 'Web corporativa y SEO',                       value: 4500,  status: 'perdido',     notes: 'Decidieron hacerlo internamente.' },
  { title: 'Centralita telefónica IP',                    value: 5200,  status: 'en_progreso', notes: 'Demo realizada. Esperando decisión.' },
  { title: 'Mantenimiento mensual sistemas',              value: 1500,  status: 'ganado',      notes: 'Cliente recurrente.' },
  { title: 'Auditoría de procesos',                       value: 7800,  status: 'nuevo',       notes: 'Primera reunión pendiente.' },
  { title: 'Integración con pasarela de pago',            value: 2900,  status: 'en_progreso', notes: 'En fase de pruebas.' },
  { title: 'Plan de contingencia y recuperación',         value: 4100,  status: 'ganado',      notes: 'Plan documentado y aprobado.' },
  { title: 'Modernización ERP',                           value: 22000, status: 'nuevo',       notes: 'Proyecto estratégico. Decisión a 3 meses.' },
];

// Plantillas de tareas con offsets de fecha relativos a hoy
const TASK_TEMPLATES = [
  { title: 'Llamar para confirmar reunión',           description: 'Verificar agenda y agradecer la disponibilidad', daysOffset: -3, completed: true  },
  { title: 'Enviar propuesta económica revisada',     description: 'Incluir descuento del 10% por volumen',          daysOffset: -1, completed: true  },
  { title: 'Preparar presentación comercial',         description: 'Adaptar slides al sector del cliente',           daysOffset:  2, completed: false },
  { title: 'Reunión seguimiento mensual',             description: '',                                               daysOffset:  5, completed: false },
  { title: 'Enviar factura proforma',                 description: 'IVA incluido. Plazo 30 días.',                   daysOffset:  1, completed: false },
  { title: 'Confirmar fecha de instalación',          description: '',                                               daysOffset:  7, completed: false },
  { title: 'Revisar contrato antes de firma',         description: 'Repasar cláusula 14 con asesor jurídico',        daysOffset:  3, completed: false },
  { title: 'Formación inicial al equipo del cliente', description: 'Duración 4h. Confirmar asistentes.',             daysOffset: 10, completed: false },
  { title: 'Llamada de cortesía postventa',           description: 'Comprobar satisfacción y posibles ampliaciones', daysOffset: -2, completed: false },  // vencida
  { title: 'Pedir referencias para nuevos clientes',  description: '',                                               daysOffset:  4, completed: false },
  { title: 'Enviar caso de éxito anterior',           description: 'El de la cadena hotelera con datos anonimizados', daysOffset: -5, completed: true  },
  { title: 'Programar demo personalizada',            description: '',                                               daysOffset:  6, completed: false },
  { title: 'Hacer seguimiento del email enviado',     description: 'Si no responde antes del viernes, llamar',       daysOffset:  2, completed: false },
  { title: 'Actualizar ficha de cliente en el CRM',   description: 'Cambio de persona de contacto',                  daysOffset: -7, completed: true  },
  { title: 'Renovar acuerdo de confidencialidad',     description: 'Vence el mes que viene',                         daysOffset: 14, completed: false },
];

//  EJECUCIÓN DEL SEEDER

async function seed() {
  try {
    console.log('🌱 Iniciando seed...\n');

    // 1. Asegurar usuario admin
    console.log('1. Comprobando usuario admin...');
    const [adminRows] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      ['admin@minicrm.com']
    );

    let adminId;
    if (adminRows.length === 0) {
      const hash = await bcrypt.hash('admin123', 10);
      const [result] = await pool.query(
        `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
        ['Admin', 'admin@minicrm.com', hash, 'admin']
      );
      adminId = result.insertId;
      console.log('   ✅ Usuario admin creado');
    } else {
      adminId = adminRows[0].id;
      console.log('   ✅ Usuario admin ya existía');
    }

    // 2. Limpiar datos previos del admin (idempotencia)
    console.log('\n2. Limpiando datos previos del admin...');
    await pool.query('DELETE FROM tasks   WHERE user_id = ?', [adminId]);
    await pool.query('DELETE FROM leads   WHERE user_id = ?', [adminId]);
    await pool.query('DELETE FROM clients WHERE user_id = ?', [adminId]);
    console.log('   ✅ Datos previos eliminados');

    // 3. Insertar clientes
    console.log('\n3. Insertando clientes...');
    const clientIds = [];
    for (const c of CLIENTS) {
      const [r] = await pool.query(
        `INSERT INTO clients (user_id, name, email, phone, company, notes)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [adminId, c.name, c.email, c.phone, c.company, c.notes]
      );
      clientIds.push(r.insertId);
    }
    console.log(`   ✅ ${CLIENTS.length} clientes insertados`);

    // 4. Insertar oportunidades — asigna por orden cíclico
    console.log('\n4. Insertando oportunidades...');
    const leadIds = [];
    for (let i = 0; i < LEAD_TEMPLATES.length; i++) {
      const l = LEAD_TEMPLATES[i];
      const clientId = clientIds[i % clientIds.length];
      const [r] = await pool.query(
        `INSERT INTO leads (client_id, user_id, title, value, status, notes)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [clientId, adminId, l.title, l.value, l.status, l.notes]
      );
      leadIds.push({ id: r.insertId, client_id: clientId });
    }
    console.log(`   ✅ ${LEAD_TEMPLATES.length} oportunidades insertadas`);

    // 5. Insertar tareas — algunas con cliente, otras con cliente+lead, otras sin nada
    console.log('\n5. Insertando tareas...');
    for (let i = 0; i < TASK_TEMPLATES.length; i++) {
      const t = TASK_TEMPLATES[i];

      // Calcular fecha relativa a hoy
      const date = new Date();
      date.setDate(date.getDate() + t.daysOffset);
      const dueDateStr = date.toISOString().slice(0, 10);

      // Asignación: alternamos para tener variedad
      let clientId = null, leadId = null;
      if (i % 3 === 0) {
        // Solo cliente
        clientId = clientIds[i % clientIds.length];
      } else if (i % 3 === 1) {
        // Cliente + oportunidad relacionada
        const lead = leadIds[i % leadIds.length];
        clientId = lead.client_id;
        leadId   = lead.id;
      }
      // Si i % 3 === 2 → tarea suelta sin asociaciones

      await pool.query(
        `INSERT INTO tasks (user_id, client_id, lead_id, title, description, due_date, completed)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [adminId, clientId, leadId, t.title, t.description || null, dueDateStr, t.completed ? 1 : 0]
      );
    }
    console.log(`   ✅ ${TASK_TEMPLATES.length} tareas insertadas`);

    console.log('\n🎉 Seed completado correctamente.\n');
    console.log('   Login: admin@minicrm.com / admin123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
}

seed();