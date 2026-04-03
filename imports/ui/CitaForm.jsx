import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';

export const CitaForm = ({ pacientes }) => {
  const [fecha, setFecha] = useState('');
  const [motivo, setMotivo] = useState('');
  const [pacienteId, setPacienteId] = useState('');

  const guardarCita = (e) => {
    e.preventDefault();

    if (!fecha || !motivo.trim() || !pacienteId) {
      alert('Completa todos los campos de la cita');
      return;
    }

    Meteor.call('citas.insert', { fecha, motivo, pacienteId }, (error) => {
      if (error) {
        alert(error.reason || 'No fue posible registrar la cita');
        return;
      }

      setFecha('');
      setMotivo('');
      setPacienteId('');
    });
  };

  return (
    <div>
      <h2>Registrar cita</h2>

      <form className="formulario" onSubmit={guardarCita}>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />

        <input
          type="text"
          placeholder="Motivo de la cita"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
        />

        <select
          value={pacienteId}
          onChange={(e) => setPacienteId(e.target.value)}
        >
          <option value="">Seleccione un paciente</option>
          {pacientes.map((paciente) => (
            <option key={paciente._id} value={paciente._id}>
              {paciente.nombre}
            </option>
          ))}
        </select>

        <button className="boton" type="submit">
          Guardar cita
        </button>
      </form>
    </div>
  );
};
