import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { PacientesCollection } from '../api/PacientesCollection';
import { CitasCollection } from '../api/CitasCollection';
import { PacienteForm } from './PacienteForm';
import { CitaForm } from './CitaForm';

export const App = () => {
  // Estado para edición de pacientes
  const [pacienteEditando, setPacienteEditando] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editDocumento, setEditDocumento] = useState('');

  // Estado para edición de citas
  const [citaEditando, setCitaEditando] = useState(null);
  const [editFecha, setEditFecha] = useState('');
  const [editMotivo, setEditMotivo] = useState('');
  const [editEstado, setEditEstado] = useState('');

  const { pacientes, citas, isLoading } = useTracker(() => {
    const pacientesSub = Meteor.subscribe('pacientes');
    const citasSub = Meteor.subscribe('citas');

    return {
      pacientes: PacientesCollection.find({}, { sort: { createdAt: -1 } }).fetch(),
      citas: CitasCollection.find({}, { sort: { createdAt: -1 } }).fetch(),
      isLoading: !pacientesSub.ready() || !citasSub.ready(),
    };
  });

  // --- Handlers de Paciente ---
  const iniciarEditarPaciente = (paciente) => {
    setPacienteEditando(paciente._id);
    setEditNombre(paciente.nombre);
    setEditDocumento(paciente.documento);
  };

  const guardarEditarPaciente = (id) => {
    if (!editNombre.trim() || !editDocumento.trim()) {
      alert('Completa todos los campos');
      return;
    }
    Meteor.call('pacientes.update', { id, nombre: editNombre, documento: editDocumento }, (error) => {
      if (error) {
        alert(error.reason || 'Error al actualizar paciente');
        return;
      }
      setPacienteEditando(null);
    });
  };

  const cancelarEditarPaciente = () => {
    setPacienteEditando(null);
  };

  const eliminarPaciente = (id, nombre) => {
    if (confirm(`¿Eliminar al paciente "${nombre}"? También se borrarán sus citas.`)) {
      Meteor.call('pacientes.remove', id);
    }
  };

  // --- Handlers de Cita ---
  const iniciarEditarCita = (cita) => {
    setCitaEditando(cita._id);
    setEditFecha(cita.fecha);
    setEditMotivo(cita.motivo);
    setEditEstado(cita.estado || 'pendiente');
  };

  const guardarEditarCita = (id) => {
    if (!editFecha || !editMotivo.trim() || !editEstado) {
      alert('Completa todos los campos');
      return;
    }
    Meteor.call('citas.update', { id, fecha: editFecha, motivo: editMotivo, estado: editEstado }, (error) => {
      if (error) {
        alert(error.reason || 'Error al actualizar cita');
        return;
      }
      setCitaEditando(null);
    });
  };

  const cancelarEditarCita = () => {
    setCitaEditando(null);
  };

  const eliminarCita = (id) => {
    if (confirm('¿Eliminar esta cita?')) {
      Meteor.call('citas.remove', id);
    }
  };

  return (
    <div className="app">
      <div className="app-header">
        <h1>Gestor de Citas - Piedra Azul</h1>
      </div>

      <div className="grid">
        {/* ===== PACIENTES ===== */}
        <div className="card">
          <PacienteForm />

          <div className="seccion-completa">
            <h2>Lista de pacientes</h2>

            {isLoading ? (
              <p className="vacio">Cargando información...</p>
            ) : pacientes.length === 0 ? (
              <p className="vacio">No hay pacientes registrados.</p>
            ) : (
              <ul className="lista">
                {pacientes.map((paciente) => (
                  <li key={paciente._id} className="item">
                    {pacienteEditando === paciente._id ? (
                      <div className="formulario-edicion">
                        <input
                          type="text"
                          value={editNombre}
                          onChange={(e) => setEditNombre(e.target.value)}
                          placeholder="Nombre"
                        />
                        <input
                          type="text"
                          value={editDocumento}
                          onChange={(e) => setEditDocumento(e.target.value)}
                          placeholder="Documento"
                        />
                        <div className="acciones-edicion">
                          <button className="boton-guardar" onClick={() => guardarEditarPaciente(paciente._id)}>
                            Guardar
                          </button>
                          <button className="boton-cancelar" onClick={cancelarEditarPaciente}>
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <strong>{paciente.nombre}</strong>
                        <span className="texto-secundario">Documento: {paciente.documento}</span>
                        <div className="acciones">
                          <button onClick={() => iniciarEditarPaciente(paciente)} className="boton-editar">
                            Editar
                          </button>
                          <button onClick={() => eliminarPaciente(paciente._id, paciente.nombre)} className="boton-eliminar">
                            Eliminar
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ===== CITAS ===== */}
        <div className="card">
          <CitaForm pacientes={pacientes} />

          <div className="seccion-completa">
            <h2>Lista de citas</h2>

            {isLoading ? (
              <p className="vacio">Cargando información...</p>
            ) : citas.length === 0 ? (
              <p className="vacio">No hay citas registradas.</p>
            ) : (
              <ul className="lista">
                {citas.map((cita) => {
                  const paciente = pacientes.find((p) => p._id === cita.pacienteId);

                  return (
                    <li key={cita._id} className="item">
                      {citaEditando === cita._id ? (
                        <div className="formulario-edicion">
                          <input
                            type="date"
                            value={editFecha}
                            onChange={(e) => setEditFecha(e.target.value)}
                          />
                          <input
                            type="text"
                            value={editMotivo}
                            onChange={(e) => setEditMotivo(e.target.value)}
                            placeholder="Motivo"
                          />
                          <select
                            value={editEstado}
                            onChange={(e) => setEditEstado(e.target.value)}
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="confirmada">Confirmada</option>
                            <option value="completada">Completada</option>
                          </select>
                          <div className="acciones-edicion">
                            <button className="boton-guardar" onClick={() => guardarEditarCita(cita._id)}>
                              Guardar
                            </button>
                            <button className="boton-cancelar" onClick={cancelarEditarCita}>
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <strong>{cita.motivo}</strong>
                          <div className="texto-secundario">Fecha: {cita.fecha}</div>
                          <div className="texto-secundario">
                            Paciente: {paciente ? paciente.nombre : 'No asignado'}
                          </div>
                          <span
                            className={`estado ${
                              cita.estado === 'confirmada'
                                ? 'estado-confirmada'
                                : cita.estado === 'completada'
                                ? 'estado-completada'
                                : 'estado-programada'
                            }`}
                          >
                            {cita.estado || 'pendiente'}
                          </span>
                          <div className="acciones">
                            <button onClick={() => iniciarEditarCita(cita)} className="boton-editar">
                              Editar
                            </button>
                            <button onClick={() => eliminarCita(cita._id)} className="boton-eliminar">
                              Eliminar
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
