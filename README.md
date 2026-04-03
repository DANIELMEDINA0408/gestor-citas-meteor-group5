# Gestor de Citas - Meteor + React

Proyecto base alineado con el dominio de **Piedra Azul**, enfocado en la gestión de **pacientes** y **citas**.

## Tecnologías
- Meteor.js
- React
- MongoDB (colecciones de Meteor)
- JavaScript
- CSS

## Entidades
### Paciente
- `_id`
- `nombre`
- `documento`
- `createdAt`

### Cita
- `_id`
- `fecha`
- `motivo`
- `pacienteId`
- `estado`
- `createdAt`

## Estructura
```
gestor-citas-meteor/
├── client/
├── imports/
│   ├── api/
│   └── ui/
├── server/
├── tests/
└── .meteor/
```

## Estado actual
El proyecto deja montada una base funcional para:
- registrar pacientes
- listar pacientes
- registrar citas
- listar citas
- relacionar una cita con un paciente

## Pendiente para el equipo
- completar CRUD completo
- validaciones adicionales
- mejora de flujos y reglas del negocio

## Ejecución
```bash
meteor npm install
meteor
```

Luego abrir `http://localhost:3000`.
