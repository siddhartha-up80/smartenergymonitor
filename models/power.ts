import { Schema, model, models } from "mongoose";

const PowerSchema = new Schema({
  time: {
    type: Date,
    default: Date.now,
  },
  power: {
    type: String,
  },
});

const Power = models.Power || model("Power", PowerSchema);

export default Power;
