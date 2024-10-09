import Store from "../models/storeModel.js";
import mongoose from 'mongoose';


export const createStore = async (req, res) => {
  try {
    const newStore = new Store(req.body);
    await newStore.save();
    res.status(201).json({
      success: true,
      message: "Store created successfully",
      stores: newStore,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getStores = async (req, res) => {
  const { ownerId } = req.params;

  try {
    // Filter stores by ownerId without populating the owner details
    const stores = await Store.find({ owner: ownerId });
    res.status(200).json(stores);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getStoreById = async (req, res) => {
    const { storeId } = req.params;

    try {
        const store = await Store.findById(storeId);
        if (!store) {
            return res.status(404).json({ success: false, message: "Store not found" });
        }
        res.status(200).json(store);
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const updateStore = async (req, res) => {
    const { storeId } = req.params;

    // Check if the provided storeId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(storeId)) {
        return res.status(400).json({ success: false, message: "Invalid Store ID" });
    }

    try {
        const store = await Store.findById(storeId);
         if (!store) {
            return res.status(404).json({ success: false, message: "Store not found" });
        }

        const updatedStore = await Store.findByIdAndUpdate(storeId, req.body, { new: true });
        res.status(200).json({ success: true, message: "Store updated successfully", stores: updatedStore });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const deleteStore = async (req, res) => {
    const { storeId } = req.params;

    // Check if the provided storeId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(storeId)) {
        return res.status(400).json({ success: false, message: "Invalid Store ID" });
    }

    try {
        const store = await Store.findById(storeId);
        if (!store) {
            return res.status(404).json({ success: false, message: "Store not found" });
        }

        await Store.findByIdAndDelete(storeId);
        res.status(200).json({ success: true, message: "Store deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
