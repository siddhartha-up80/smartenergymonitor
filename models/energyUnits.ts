import { Schema, model, models } from "mongoose";

const EnergyUnitsSchema = new Schema({
  time: {
    type: Date,
    default: Date.now,
  },
  voltage: {
    type: String,
  },
  current: {
    type: String,
  },
  power: {
    type: String,
  },
  energyUnits: {
    type: String,
  },
});

const EnergyUnits =
  models.EnergyUnits || model("EnergyUnits", EnergyUnitsSchema);

export default EnergyUnits;
