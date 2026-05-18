# Tiny CRM

> Aplicación web para la gestión de clientes, oportunidades comerciales y tareas.
> Trabajo Final del Ciclo Superior de Desarrollo de Aplicaciones Web (DAW).

Aplicación CRM ligera, accesible y desplegada en producción, orientada a pequeñas empresas y autónomos que necesiten centralizar la gestión de su cartera de clientes y el seguimiento de sus oportunidades comerciales.

## Demo en producción

- **Aplicación:** https://tinycrm-prod.up.railway.app

## Funcionalidades

- Autenticación de usuarios con tokens JWT
- Sistema de roles (administrador y usuario estándar)
- Gestión de clientes (CRUD completo)
- Gestión de oportunidades comerciales con estados (nuevo, en progreso, ganado, perdido)
- Gestión de tareas asociadas a clientes y oportunidades
- Dashboard con estadísticas en tiempo real
- Filtros y búsqueda en los listados
- Interfaz responsive con sistema de diseño propio

## Stack tecnológico

**Backend**
- Node.js + Express
- MySQL (mysql2 con promesas)
- JWT (jsonwebtoken)
- bcryptjs para hash de contraseñas

**Frontend**
- React 19
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React (iconos)

**Infraestructura**
- Railway (backend, frontend y MySQL)
- GitHub (repositorio y CI/CD automático)

## Arquitectura

El sistema sigue una arquitectura cliente-servidor desacoplada: frontend y backend son aplicaciones independientes que se comunican mediante una API REST con autenticación JWT.