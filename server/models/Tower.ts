import { Schema, model, Document } from "mongoose";

const TowerSchema = new Schema({
  creator_id: String,
  tower_id: String,
  radius: Number,
  gradient: Number,
  timestamp: { type: Date, default: Date.now() },
});

export interface Tower extends Document {
  creator_id: string,
  _id: string,
  radius: number,
  gradient: number,
  timestamp: Date,
}

const TowerModel = model<Tower>("Tower", TowerSchema);

export default TowerModel;