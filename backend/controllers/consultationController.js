
import mongoose from "mongoose";
import Consultation from "../models/Consultation.js";

const allowedStatuses = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
];

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidDate = (value) => {
  if (value === null || value === "") return true;

  if (typeof value !== "string") return false;

  const date = new Date(value);

  return !Number.isNaN(date.getTime());
};

// PUBLIC: Submit a consultation request
export const createConsultation = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      service,
      preferredDate,
      preferredTime,
      message,
    } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof phone !== "string" ||
      typeof service !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !service.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone and service are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    if (
      preferredDate !== undefined &&
      preferredDate !== null &&
      !isValidDate(preferredDate)
    ) {
      return res.status(400).json({
        success: false,
        message: "Preferred date must be valid.",
      });
    }

    if (
      preferredTime !== undefined &&
      typeof preferredTime !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Preferred time must be valid text.",
      });
    }

    if (message !== undefined && typeof message !== "string") {
      return res.status(400).json({
        success: false,
        message: "Message must be valid text.",
      });
    }

    const consultation = await Consultation.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      service: service.trim(),
      preferredDate: preferredDate || null,
      preferredTime: preferredTime?.trim() || "",
      message: message?.trim() || "",
    });

    return res.status(201).json({
      success: true,
      message: "Consultation request submitted successfully.",
      data: consultation,
    });
  } catch (error) {
    console.error("Create consultation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit consultation request.",
    });
  }
};

// ADMIN: Get all consultation requests
export const getAllConsultations = async (req, res) => {
  try {
    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const status =
      typeof req.query.status === "string"
        ? req.query.status
        : "";

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid consultation status filter.",
      });
    }

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      const searchTerm = escapeRegex(search);

      filter.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
        { phone: { $regex: searchTerm, $options: "i" } },
        { service: { $regex: searchTerm, $options: "i" } },
      ];
    }

    const consultations = await Consultation.find(filter).sort({
      createdAt: -1,
    });

    const [
      total,
      pending,
      confirmed,
      completed,
      cancelled,
    ] = await Promise.all([
      Consultation.countDocuments(),
      Consultation.countDocuments({ status: "pending" }),
      Consultation.countDocuments({ status: "confirmed" }),
      Consultation.countDocuments({ status: "completed" }),
      Consultation.countDocuments({ status: "cancelled" }),
    ]);

    return res.status(200).json({
      success: true,
      count: consultations.length,
      stats: {
        total,
        pending,
        confirmed,
        completed,
        cancelled,
      },
      consultations,
    });
  } catch (error) {
    console.error("Get consultations error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch consultation requests.",
    });
  }
};

// ADMIN: Get one consultation
export const getConsultationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid consultation ID.",
      });
    }

    const consultation = await Consultation.findById(id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found.",
      });
    }

    return res.status(200).json({
      success: true,
      consultation,
    });
  } catch (error) {
    console.error("Get consultation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch consultation.",
    });
  }
};

// ADMIN: Update consultation
export const updateConsultation = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      status,
      adminNotes,
      preferredDate,
      preferredTime,
    } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid consultation ID.",
      });
    }

    if (
      status !== undefined &&
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid consultation status.",
      });
    }

    if (
      adminNotes !== undefined &&
      typeof adminNotes !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Admin notes must be valid text.",
      });
    }

    if (
      preferredTime !== undefined &&
      typeof preferredTime !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Preferred time must be valid text.",
      });
    }

    if (
      preferredDate !== undefined &&
      preferredDate !== null &&
      !isValidDate(preferredDate)
    ) {
      return res.status(400).json({
        success: false,
        message: "Preferred date must be valid.",
      });
    }

    if (
      status === undefined &&
      adminNotes === undefined &&
      preferredDate === undefined &&
      preferredTime === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update.",
      });
    }

    const consultation = await Consultation.findById(id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found.",
      });
    }

    if (status !== undefined) {
      consultation.status = status;
    }

    if (adminNotes !== undefined) {
      consultation.adminNotes = adminNotes.trim();
    }

    if (preferredDate !== undefined) {
      consultation.preferredDate = preferredDate || null;
    }

    if (preferredTime !== undefined) {
      consultation.preferredTime = preferredTime.trim();
    }

    await consultation.save();

    return res.status(200).json({
      success: true,
      message: "Consultation updated successfully.",
      data: consultation,
    });
  } catch (error) {
    console.error("Update consultation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update consultation.",
    });
  }
};

// ADMIN: Delete consultation
export const deleteConsultation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid consultation ID.",
      });
    }

    const consultation = await Consultation.findByIdAndDelete(id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Consultation deleted successfully.",
    });
  } catch (error) {
    console.error("Delete consultation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete consultation.",
    });
  }
};
