import { Meteor } from 'meteor/meteor';
import { PacientesCollection } from '/imports/api/PacientesCollection';
import { CitasCollection } from '/imports/api/CitasCollection';

Meteor.startup(() => {
  // servidor listo
});

Meteor.methods({
  async 'pacientes.insert'(data) {
    const { nombre, documento } = data;

    return await PacientesCollection.insertAsync({
      nombre,
      documento,
      createdAt: new Date(),
    });
  },

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
});