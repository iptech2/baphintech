
import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    service: {
      type: String,
      required: true,
      trim: true,
    },

    preferredDate: {
      type: Date,
      default: null,
    },

    preferredTime: {
      type: String,
      trim: true,
      default: "",
    },

    message: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },

    adminNotes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Consultation = mongoose.model(
  "Consultation",
  consultationSchema
);

export default Consultation;
