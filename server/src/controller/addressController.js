const Address = require("../Model/addressModel.js");

// 📌 Add new address
const addAddress = async (req, res) => {
  try {
    const { label, isDefault, ...addressData } = req.body;

    // If new address is default, unset old default
    if (isDefault) {
      await Address.updateMany({ user: req._id }, { $set: { isDefault: false } });
    }

    const address = await Address.create({ ...addressData, label, isDefault, user: req._id });
    return res.status(201).json({ success: true, message: "Address saved", data: address });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

// 📌 Get all addresses for a user
const getUserAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req._id }).sort({ isDefault: -1, createdAt: -1 });
    return res.status(200).json({ success: true, data: addresses });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

// 📌 Update an address
const updateAddress = async (req, res) => {
  try {
    const { label, isDefault, ...rest } = req.body;

    if (isDefault) {
      await Address.updateMany({ user: req._id }, { $set: { isDefault: false } });
    }

    const updated = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req._id },
      { ...rest, label, isDefault },
      { new: true }
    );

    return res.status(200).json({ success: true, message: "Address updated", data: updated });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

// 📌 Delete an address
const deleteAddress = async (req, res) => {
  try {
    await Address.findOneAndDelete({ _id: req.params.id, user: req._id });
    return res.status(200).json({ success: true, message: "Address deleted" });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

module.exports = { addAddress, getUserAddresses, updateAddress, deleteAddress };
