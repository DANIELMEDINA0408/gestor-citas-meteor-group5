import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';

export const PacienteForm = () => {
  const [nombre, setNombre] = useState('');
  const [documento, setDocumento] = useState('');

  const guardarPaciente = (e) => {
    e.preventDefault();

    if (!nombre.trim() || !documento.trim()) {
      alert('Completa todos los campos del paciente');
      return;
    }

    Meteor.call('pacientes.insert', { nombre, documento }, (error) => {
      if (error) {
        alert(error.reason || 'No fue posible registrar el paciente');
        return;
      }

      setNombre('');
      setDocumento('');
    });
  };

  return (
    <div>
      <h2>Registrar paciente</h2>

      <form className="formulario" onSubmit={guardarPaciente}>
        <input
          type="text"
          placeholder="Nombre del paciente"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          type="text"
          placeholder="Documento"
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
        />

        <button className="boton" type="submit">
          Guardar paciente
        </button>
      </form>
    </div>
  );
};
