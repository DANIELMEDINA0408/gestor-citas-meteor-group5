import '/imports/api/Publications.js';
import { Meteor } from 'meteor/meteor';
import { PacientesCollection } from '/imports/api/PacientesCollection';
import { CitasCollection } from '/imports/api/CitasCollection';

Meteor.startup(() => {
  // servidor listo
});

Meteor.methods({
  //MÉTODOS PACIENTE
  async 'pacientes.insert'(data) {
    const { nombre, documento } = data;

    return await PacientesCollection.insertAsync({
      nombre,
      documento,
      createdAt: new Date(),
    });
  },
  async 'pacientes.update'({ id, nombre, documento }) {
      if (!id) throw new Meteor.Error('invalid-id', 'ID requerido');
      const updateData = {};
      if (nombre !== undefined) updateData.nombre = nombre;
      if (documento !== undefined) updateData.documento = documento;
      return await PacientesCollection.updateAsync(id, { $set: updateData });
    },
  
  async 'pacientes.remove'(id) {
    if (!id) throw new Meteor.Error('invalid-id', 'ID requerido');
    await CitasCollection.removeAsync({ pacienteId: id });
    return await PacientesCollection.removeAsync(id);
  },

  //METODOS CITA
  async 'citas.insert'(data) {
    const { fecha, motivo, pacienteId, estado } = data;

    return await CitasCollection.insertAsync({
      fecha,
      motivo,
      pacienteId,
      estado: estado || 'pendiente',
      createdAt: new Date(),
    });
  },
  
  async 'citas.update'({ id, fecha, motivo, estado }) {
    if (!id) throw new Meteor.Error('invalid-id', 'ID requerido');
    const updateData = {};
    if (fecha !== undefined) updateData.fecha = fecha;
    if (motivo !== undefined) updateData.motivo = motivo;
    if (estado !== undefined) updateData.estado = estado;
    return await CitasCollection.updateAsync(id, { $set: updateData });
  },

  async 'citas.remove'(id) {
    if (!id) throw new Meteor.Error('invalid-id', 'ID requerido');
    return await CitasCollection.removeAsync(id);
  },
});