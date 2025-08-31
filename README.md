# Zoom TV CMS - Panel de Administración

Un sistema de gestión de contenido (CMS) moderno y completo para Zoom TV, desarrollado con React, TypeScript y Tailwind CSS.

## 🚀 Características

- **Gestión de Noticias**: Crear, editar y publicar noticias
- **Categorías**: Organizar contenido en categorías
- **Autores**: Administrar colaboradores y autores
- **Usuarios**: Gestión de usuarios y permisos
- **Medios**: Biblioteca de archivos multimedia
- **Analíticas**: Estadísticas y reportes de rendimiento
- **Configuración**: Opciones del sistema
- **Diseño Responsivo**: Interfaz adaptativa para todos los dispositivos
- **Tema Oscuro/Claro**: Soporte para múltiples temas
- **API REST**: Integración completa con el backend

## 🛠️ Tecnologías

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Estado**: React Context API
- **HTTP Client**: Axios
- **Iconos**: Lucide React
- **Gráficos**: Recharts
- **Formularios**: React Hook Form
- **Enrutamiento**: React Router DOM

## 📦 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd dashboard_cms
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Crear archivo .env.local
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

## 🔧 Configuración

### Backend API

El CMS se conecta a un backend Node.js/Express con MongoDB. Asegúrate de que el backend esté ejecutándose en `http://localhost:5000`.

### Variables de Entorno

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 📱 Uso

### Acceso al Sistema

1. Abre el navegador en `http://localhost:5173`
2. Inicia sesión con las credenciales proporcionadas
3. Navega por las diferentes secciones del panel

### Funcionalidades Principales

#### Panel Principal
- Vista general de estadísticas
- Noticias recientes
- Acciones rápidas

#### Gestión de Noticias
- Crear nuevas noticias
- Editar contenido existente
- Publicar/archivar noticias
- Gestionar estados (borrador, publicado, archivado)

#### Categorías
- Crear y editar categorías
- Asignar colores e iconos
- Organizar contenido

#### Autores
- Gestionar perfiles de autores
- Asignar noticias a autores
- Ver estadísticas por autor

#### Usuarios
- Crear cuentas de usuario
- Asignar roles y permisos
- Gestionar acceso al sistema

#### Medios
- Subir archivos multimedia
- Organizar biblioteca de medios
- Gestionar metadatos

#### Analíticas
- Ver estadísticas de visitas
- Reportes de rendimiento
- Métricas por categoría y autor

## 🎨 Personalización

### Temas

El sistema soporta temas claro y oscuro. Los usuarios pueden cambiar el tema desde la barra lateral.

### Colores

Los colores principales se pueden personalizar modificando las variables CSS en `src/index.css`.

## 🔒 Seguridad

- Autenticación JWT
- Autorización basada en roles
- Validación de formularios
- Sanitización de datos

## 📊 Estructura del Proyecto

```
src/
├── components/          # Componentes React
├── contexts/           # Contextos de estado
├── services/           # Servicios de API
├── types/              # Definiciones TypeScript
├── styles/             # Estilos CSS
├── hooks/              # Hooks personalizados
└── assets/             # Recursos estáticos
```

## 🚀 Despliegue

### Build de Producción

```bash
npm run build
```

### Servir Build

```bash
npm run preview
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas, contacta al equipo de desarrollo de Zoom TV.

---

**Zoom TV CMS** - Panel de administración de contenido moderno y eficiente.
