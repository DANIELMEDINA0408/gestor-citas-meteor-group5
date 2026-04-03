import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { PacientesCollection } from '../api/PacientesCollection';
import { CitasCollection } from '../api/CitasCollection';
import { PacienteForm } from './PacienteForm';
import { CitaForm } from './CitaForm';

export const App = () => {
  const { pacientes, citas, isLoading } = useTracker(() => {
    const pacientesSub = Meteor.subscribe('pacientes');
    const citasSub = Meteor.subscribe('citas');

    return {
      pacientes: PacientesCollection.find({}, { sort: { createdAt: -1 } }).fetch(),
      citas: CitasCollection.find({}, { sort: { createdAt: -1 } }).fetch(),
      isLoading: !pacientesSub.ready() || !citasSub.ready(),
    };
  });

  return (
    <div className="app">
      <div className="app-header">
        <h1>Gestor de Citas - Piedra Azul</h1>
        <p>
          Base del proyecto en Meteor.js + React alineada con el sistema de
          agendamiento trabajado durante el semestre.
        </p>
      </div>

      <div className="grid">
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
                    <strong>{paciente.nombre}</strong>
                    <span className="texto-secundario">
                      Documento: {paciente.documento}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

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
                      <strong>{cita.motivo}</strong>
                      <div className="texto-secundario">Fecha: {cita.fecha}</div>
                      <div className="texto-secundario">
                        Paciente: {paciente ? paciente.nombre : 'No asignado'}
                      </div>
                      <span
                        className={`estado ${
                          cita.estado === 'confirmada'
                            ? 'estado-confirmada'
                            : 'estado-programada'
                        }`}
                      >
                        {cita.estado || 'programada'}
                      </span>
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
