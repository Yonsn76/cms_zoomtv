# 🌐 ENDPOINTS COMPLETOS - API ZOOM TV

## 🔗 Base URL: `https://apizoomtv-production.up.railway.app/api`

---

## 📰 NOTICIAS (`/api/noticias`)

### GET Endpoints
| Método | Endpoint | Descripción | Parámetros |
|--------|----------|-------------|------------|
| `GET` | `/` | Obtener todas las noticias | `?category=actualidad&status=published&search=texto` |
| `GET` | `/:id` | Obtener noticia por ID | - |
| `GET` | `/featured/featured` | Obtener noticias destacadas | - |
| `GET` | `/category/:category` | Obtener noticias por categoría | - |
| `GET` | `/search/search` | Buscar noticias | `?q=texto` |

### POST Endpoints
| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| `POST` | `/` | Crear noticia | Ver estructura abajo |

### PUT Endpoints
| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| `PUT` | `/:id` | Actualizar noticia | Campos opcionales |
| `PUT` | `/:id/publish` | Publicar noticia | - |
| `PUT` | `/:id/archive` | Archivar noticia | - |

### DELETE Endpoints
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `DELETE` | `/:id` | Eliminar noticia |

**Estructura de Noticia:**
```json
{
  "id": "noticia-001",
  "title": "Título de la noticia",
  "author": "Nombre del autor",
  "date": "2024-01-15",
  "summary": "Resumen de la noticia",
  "content": "Contenido completo...",
  "category": "actualidad",
  "status": "published",
  "featured": true,
  "imageUrl": "https://example.com/imagen.jpg",
  "tags": ["tag1", "tag2"],
  "seoTitle": "SEO Title",
  "seoDescription": "SEO Description",
  "seoKeywords": ["keyword1", "keyword2"]
}
```

**Categorías válidas:** `actualidad`, `deportes`, `musica`, `nacionales`, `regionales`
**Estados válidos:** `published`, `draft`, `archived`

---

## 👥 USUARIOS (`/api/usuarios`)

### GET Endpoints
| Método | Endpoint | Descripción | Parámetros |
|--------|----------|-------------|------------|
| `GET` | `/` | Obtener todos los usuarios | `?role=admin&active=true` |
| `GET` | `/:id` | Obtener usuario por ID | - |

### PUT Endpoints
| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| `PUT` | `/:id` | Actualizar usuario | Campos opcionales |
| `PUT` | `/:id/toggle-status` | Activar/desactivar usuario | - |

### DELETE Endpoints
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `DELETE` | `/:id` | Eliminar usuario |

**Estructura de Usuario:**
```json
{
  "username": "usuario123",
  "email": "usuario@ejemplo.com",
  "password": "password123",
  "role": "author",
  "active": true,
  "profile": {
    "firstName": "Nombre",
    "lastName": "Apellido",
    "bio": "Biografía del usuario",
    "avatar": "https://example.com/avatar.jpg"
  },
  "permissions": ["create", "read", "update", "delete"]
}
```

**Roles válidos:** `admin`, `editor`, `author`

---

## 📁 MEDIA (`/api/media`)

### GET Endpoints
| Método | Endpoint | Descripción | Parámetros |
|--------|----------|-------------|------------|
| `GET` | `/` | Listar todos los archivos | `?search=texto&type=image` |
| `GET` | `/file/:filename` | Obtener archivo | - |
| `GET` | `/info/:filename` | Obtener información del archivo | - |
| `GET` | `/:filename` | Descargar archivo | - |

### POST Endpoints
| Método | Endpoint | Descripción | Form Data |
|--------|----------|-------------|-----------|
| `POST` | `/upload` | Subir archivo | `file`, `alt`, `caption` |
| `POST` | `/upload-multiple` | Subir múltiples archivos | `files[]`, `alt`, `caption` |

### DELETE Endpoints
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `DELETE` | `/:filename` | Eliminar archivo |

**Tipos de archivo válidos:** `image`, `document`

---

## ⏰ HORARIO (`/api/horario`)

### GET Endpoints
| Método | Endpoint | Descripción | Parámetros |
|--------|----------|-------------|------------|
| `GET` | `/` | Obtener todo el horario | `?day=LUNES&category=Noticias&isActive=true` |
| `GET` | `/weekly` | Horario semanal organizado | - |
| `GET` | `/:id` | Obtener programa por ID | - |
| `GET` | `/day/:day` | Horario por día | - |

### POST Endpoints
| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| `POST` | `/` | Crear programa | Ver estructura abajo |

### PUT Endpoints
| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| `PUT` | `/:id` | Actualizar programa | Campos opcionales |

### PATCH Endpoints
| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| `PATCH` | `/:id/toggle` | Activar/desactivar programa | - |

### DELETE Endpoints
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `DELETE` | `/:id` | Eliminar programa |

**Estructura de Programa:**
```json
{
  "title": "Nombre del programa",
  "description": "Descripción del programa",
  "day": "LUNES",
  "startTime": "08:00",
  "endTime": "09:00",
  "category": "Noticias",
  "type": "Programa en vivo",
  "priority": 1,
  "isActive": true,
  "notes": "Notas adicionales",
  "imageUrl": "https://example.com/programa.jpg",
  "color": "#3B82F6"
}
```

**Días válidos:** `LUNES`, `MARTES`, `MIÉRCOLES`, `JUEVES`, `VIERNES`, `SÁBADO`, `DOMINGO`
**Categorías válidas:** `Noticias`, `Música`, `Cine`, `Series`, `Anime`, `Entretenimiento`, `Deportes`, `Documentales`, `Otros`
**Tipos válidos:** `Programa en vivo`, `Película`, `Serie`, `Música`, `Anime`, `Documental`, `Otros`

---

## 📢 ANUNCIANTES (`/api/anunciantes`)

### GET Endpoints
| Método | Endpoint | Descripción | Parámetros |
|--------|----------|-------------|------------|
| `GET` | `/` | Obtener todos los anunciantes | `?status=active&category=Comercio` |
| `GET` | `/:id` | Obtener anunciante por ID | - |

### POST Endpoints
| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| `POST` | `/` | Crear anunciante | Ver estructura abajo |

### PUT Endpoints
| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| `PUT` | `/:id` | Actualizar anunciante | Campos opcionales |
| `PUT` | `/:id/status` | Cambiar estado del anunciante | `{"status": "active"}` |
| `PUT` | `/reorder` | Reordenar anunciantes | `{"anunciantes": [{"id": "...", "priority": 1}]}` |

### DELETE Endpoints
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `DELETE` | `/:id` | Eliminar anunciante |

**Estructura de Anunciante:**
```json
{
  "name": "Nombre del anunciante",
  "imageUrl": "https://example.com/anunciante.jpg",
  "description": "Descripción del anunciante",
  "isFlyer": false,
  "enableZoom": true,
  "status": "active",
  "category": "Comercio",
  "priority": 1,
  "website": "https://anunciante.com",
  "phone": "+1234567890"
}
```

**Estados válidos:** `active`, `inactive`, `pending`

---

## 📡 URL LIVE (`/api/urlLive`)

### GET Endpoints
| Método | Endpoint | Descripción | Parámetros |
|--------|----------|-------------|------------|
| `GET` | `/` | Obtener todas las URLs live | - |
| `GET` | `/live` | Obtener URL live activa | - |
| `GET` | `/:id` | Obtener URL live por ID | - |

### POST Endpoints
| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| `POST` | `/` | Crear URL live | Ver estructura abajo |

### PUT Endpoints
| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| `PUT` | `/:id` | Actualizar URL live | Campos opcionales |
| `PUT` | `/:id/live` | Activar URL live | - |
| `PUT` | `/:id/stop` | Detener URL live | - |

### DELETE Endpoints
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `DELETE` | `/:id` | Eliminar URL live |

**Estructura de URL Live:**
```json
{
  "nombre": "Nombre de la URL live",
  "url": "https://stream.ejemplo.com/live",
  "isLive": true,
  "isActive": true,
  "description": "Descripción de la URL live",
  "category": "Noticias"
}
```

---

## 📂 CATEGORÍAS (`/api/categorias`)

### GET Endpoints
| Método | Endpoint | Descripción | Parámetros |
|--------|----------|-------------|------------|
| `GET` | `/` | Obtener todas las categorías | - |
| `GET` | `/:id` | Obtener categoría por ID | - |

### POST Endpoints
| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| `POST` | `/` | Crear categoría | Ver estructura abajo |

### PUT Endpoints
| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| `PUT` | `/:id` | Actualizar categoría | Campos opcionales |

### DELETE Endpoints
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `DELETE` | `/:id` | Eliminar categoría |

**Estructura de Categoría:**
```json
{
  "name": "Nombre de la categoría",
  "slug": "slug-categoria",
  "description": "Descripción de la categoría",
  "color": "#FF6B6B",
  "icon": "icono",
  "order": 1,
  "active": true
}
```

---

## ✍️ AUTORES (`/api/autores`)

### GET Endpoints
| Método | Endpoint | Descripción | Parámetros |
|--------|----------|-------------|------------|
| `GET` | `/` | Obtener todos los autores | - |
| `GET` | `/:id` | Obtener autor por ID | - |

---

## 🏢 INFORMACIÓN DE EMPRESA (`/api/company`)

### GET Endpoints
| Método | Endpoint | Descripción | Parámetros |
|--------|----------|-------------|------------|
| `GET` | `/info` | Obtener información de la empresa | - |
| `GET` | `/team` | Obtener miembros del equipo | - |
| `GET` | `/team/:id` | Obtener miembro del equipo por ID | - |
| `GET` | `/history` | Obtener historia de la empresa | - |
| `GET` | `/values` | Obtener valores de la empresa | - |

### POST Endpoints
| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| `POST` | `/team` | Crear miembro del equipo | Ver estructura abajo |

### PUT Endpoints
| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| `PUT` | `/info` | Actualizar información de empresa | Ver estructura abajo |
| `PUT` | `/team/:id` | Actualizar miembro del equipo | Campos opcionales |
| `PUT` | `/history` | Actualizar historia de empresa | Ver estructura abajo |
| `PUT` | `/values` | Actualizar valores de empresa | Ver estructura abajo |

### DELETE Endpoints
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `DELETE` | `/team/:id` | Eliminar miembro del equipo |

**Estructura de Información de Empresa:**
```json
{
  "name": "Zoom TV",
  "slogan": "Tu canal de confianza",
  "description": "Descripción de la empresa",
  "logo": "https://example.com/logo.png",
  "address": "Dirección de la empresa",
  "phone": "+1234567890",
  "email": "info@zoomtv.com",
  "website": "https://zoomtv.com",
  "socialMedia": {
    "facebook": "https://facebook.com/zoomtv",
    "twitter": "https://twitter.com/zoomtv",
    "instagram": "https://instagram.com/zoomtv",
    "youtube": "https://youtube.com/zoomtv"
  }
}
```

**Estructura de Miembro del Equipo:**
```json
{
  "name": "Nombre del miembro",
  "position": "Cargo",
  "bio": "Biografía del miembro",
  "image": "https://example.com/miembro.jpg",
  "socialMedia": {
    "linkedin": "https://linkedin.com/in/miembro"
  },
  "order": 1,
  "isActive": true
}
```

**Estructura de Historia de Empresa:**
```json
{
  "title": "Nuestra Historia",
  "content": "Contenido de la historia...",
  "milestones": [
    {
      "year": "2020",
      "title": "Fundación",
      "description": "Descripción del hito"
    }
  ]
}
```

**Estructura de Valores de Empresa:**
```json
{
  "title": "Nuestros Valores",
  "vision": {
    "title": "Nuestra Visión",
    "content": "Contenido de la visión"
  },
  "mission": {
    "title": "Nuestra Misión",
    "content": "Contenido de la misión"
  },
  "values": [
    {
      "name": "Integridad",
      "description": "Descripción del valor",
      "icon": "integrity"
    }
  ]
}
```

---

## 🔐 AUTENTICACIÓN (`/api/auth`)

### GET Endpoints
| Método | Endpoint | Descripción | Parámetros |
|--------|----------|-------------|------------|
| `GET` | `/me` | Obtener perfil del usuario actual | - |

### POST Endpoints
| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| `POST` | `/login` | Iniciar sesión | `{"email": "...", "password": "..."}` |
| `POST` | `/register` | Registrar usuario | Ver estructura de usuario |

### PUT Endpoints
| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| `PUT` | `/profile` | Actualizar perfil | `{"profile": {...}}` |
| `PUT` | `/change-password` | Cambiar contraseña | `{"currentPassword": "...", "newPassword": "..."}` |

---

## 🏥 HEALTH CHECK

### GET Endpoints
| Método | Endpoint | Descripción | Parámetros |
|--------|----------|-------------|------------|
| `GET` | `/api/health` | Estado del servidor | - |

---

## 📊 RESUMEN TOTAL DE ENDPOINTS

| Sección | GET | POST | PUT | PATCH | DELETE | Total |
|---------|-----|------|-----|-------|--------|-------|
| **Noticias** | 5 | 1 | 3 | 0 | 1 | 10 |
| **Usuarios** | 2 | 0 | 2 | 0 | 1 | 5 |
| **Media** | 4 | 2 | 0 | 0 | 1 | 7 |
| **Horario** | 4 | 1 | 1 | 1 | 1 | 8 |
| **Anunciantes** | 2 | 1 | 3 | 0 | 1 | 7 |
| **URL Live** | 3 | 1 | 3 | 0 | 1 | 8 |
| **Categorías** | 2 | 1 | 1 | 0 | 1 | 5 |
| **Autores** | 2 | 0 | 0 | 0 | 0 | 2 |
| **Empresa** | 5 | 1 | 4 | 0 | 1 | 11 |
| **Autenticación** | 1 | 2 | 2 | 0 | 0 | 5 |
| **Health Check** | 1 | 0 | 0 | 0 | 0 | 1 |
| **TOTAL** | **31** | **10** | **19** | **1** | **8** | **69** |

---

## ⚠️ NOTAS IMPORTANTES

1. **TODOS los endpoints son públicos** - No se requiere autenticación
2. **No necesitas tokens JWT** para ningún endpoint
3. **Puedes hacer GET, POST, PUT, PATCH, DELETE** sin restricciones
4. **Los campos marcados como opcionales** pueden omitirse
5. **Los valores de enums** deben coincidir exactamente con los valores válidos
6. **Las URLs de imágenes** deben ser válidas y accesibles
7. **Los emails** deben tener formato válido
8. **Las fechas** deben estar en formato ISO (YYYY-MM-DD)
9. **Las horas** deben estar en formato HH:MM (24 horas)
10. **Todos los endpoints devuelven JSON** con estructura `{success: boolean, data: any, message?: string}`

---

## 🚀 EJEMPLOS DE USO RÁPIDO

### Obtener todas las noticias:
```bash
curl https://api-zoomtv.onrender.com/api/noticias
```

### Crear una noticia:
```bash
curl -X POST https://api-zoomtv.onrender.com/api/noticias \
  -H "Content-Type: application/json" \
  -d '{"id":"test-001","title":"Mi Noticia","author":"Yo","date":"2024-01-15","summary":"Resumen","content":"Contenido","category":"actualidad","status":"published"}'
```

### Obtener horario del lunes:
```bash
curl https://api-zoomtv.onrender.com/api/horario/day/LUNES
```

### Obtener URL live activa:
```bash
curl https://api-zoomtv.onrender.com/api/urlLive/live
```

### Obtener información de la empresa:
```bash
curl https://api-zoomtv.onrender.com/api/company/info
```

---

## 📋 CREDENCIALES DE PRUEBA

- **Admin:** `admin@zoom.tv` / `123456`

---

**Total: 69 endpoints disponibles** 🚀
