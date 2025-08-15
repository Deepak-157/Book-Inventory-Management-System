// server/controllers/users.js

const User = require("../models/User");

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Count total documents
    const total = await User.countDocuments();

    // Fetch users
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: {
        users,
        total,
        page,
        totalPages,
      },
    });
  } catch (err) {
    console.error("Error getting users:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error("Error getting user:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// server/controllers/users.js - update the updateUser function

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    // Only allow updating name and role
    const { name, role } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (role) updateData.role = role;

    // Check if user exists
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent users from updating their own role
    if (req.user.id === req.params.id && role && role !== user.role) {
      return res.status(403).json({
        success: false,
        message: "You cannot update your own role",
      });
    }

    // Check if role is being changed
    const isRoleChanged = role && role !== user.role;

    // Update user
    user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      data: user,
      roleChanged: isRoleChanged,
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
