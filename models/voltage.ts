import { Schema, model, models } from "mongoose";

const VoltageSchema = new Schema({
  time: {
    type: Date,
    default: Date.now,
  },
  voltage: {
    type: String,
  },
});

const Voltage = models.Voltage || model("Voltage", VoltageSchema);

export default Voltage;
