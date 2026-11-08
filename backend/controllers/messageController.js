
import mongoose from "mongoose";
import Message from "../models/Message.js";

const allowedStatuses = ["new", "read", "replied", "archived"];

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// PUBLIC: Submit a contact message
export const createMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    const newMessage = await Message.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: typeof phone === "string" ? phone.trim() : "",
      subject:
        typeof subject === "string" && subject.trim()
          ? subject.trim()
          : "General Inquiry",
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Your message has been sent successfully.",
      data: newMessage,
    });
  } catch (error) {
    console.error("Create message error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send your message.",
    });
  }
};

// ADMIN: Get all messages
export const getAllMessages = async (req, res) => {
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
        message: "Invalid message status filter.",
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
        { subject: { $regex: searchTerm, $options: "i" } },
        { message: { $regex: searchTerm, $options: "i" } },
      ];
    }

    const messages = await Message.find(filter).sort({
      createdAt: -1,
    });

    const [
      total,
      newMessages,
      readMessages,
      repliedMessages,
      archivedMessages,
    ] = await Promise.all([
      Message.countDocuments(),
      Message.countDocuments({ status: "new" }),
      Message.countDocuments({ status: "read" }),
      Message.countDocuments({ status: "replied" }),
      Message.countDocuments({ status: "archived" }),
    ]);

    return res.status(200).json({
      success: true,
      count: messages.length,
      stats: {
        total,
        new: newMessages,
        read: readMessages,
        replied: repliedMessages,
        archived: archivedMessages,
      },
      messages,
    });
  } catch (error) {
    console.error("Get messages error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages.",
    });
  }
};

// ADMIN: Get one message
export const getMessageById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID.",
      });
    }

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    if (message.status === "new") {
      message.status = "read";
      await message.save();
    }

    return res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Get message error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch message.",
    });
  }
};

// ADMIN: Update message status and notes
export const updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID.",
      });
    }

    if (
      status !== undefined &&
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid message status.",
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

    if (status === undefined && adminNotes === undefined) {
      return res.status(400).json({
        success: false,
        message: "Provide a status or admin notes to update.",
      });
    }

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    if (status !== undefined) {
      message.status = status;
    }

    if (adminNotes !== undefined) {
      message.adminNotes = adminNotes.trim();
    }

    await message.save();

    return res.status(200).json({
      success: true,
      message: "Message updated successfully.",
      data: message,
    });
  } catch (error) {
    console.error("Update message error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update message.",
    });
  }
};

// ADMIN: Delete message
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID.",
      });
    }

    const message = await Message.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully.",
    });
  } catch (error) {
    console.error("Delete message error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete message.",
    });
  }
};
