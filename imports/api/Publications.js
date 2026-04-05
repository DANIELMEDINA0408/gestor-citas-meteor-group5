import { Meteor } from 'meteor/meteor';
import { PacientesCollection } from './PacientesCollection';
import { CitasCollection } from './CitasCollection';

Meteor.publish('pacientes', function () {
  return PacientesCollection.find({});
});

Meteor.publish('citas', function () {
  return CitasCollection.find({});
});