import User from '../models/user.js'; // Assuming you have a User model

// Function to fetch user profile
export const getUserProfile = async (req, res) => {
  try {
    const { email } = req.params;
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Return user profile data
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Function to update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { email } = req.params;
    // Find user by email
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Update user profile
    user = await User.findOneAndUpdate({ email }, req.body, { new: true });
    // Return updated user profile data
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Function to delete user account
export const deleteUserAccount = async (req, res) => {
  try {
    const { email } = req.params;
    // Delete user by email
    await User.findOneAndDelete({ email });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
