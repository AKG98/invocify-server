import Client from '../models/clientModel.js';
import mongoose from 'mongoose';

export const createClient = async (req, res) => {
  const {phone} = req.body;
  try {
    // Check if the provided email is already in use
    const client = await Client.findOne({phone});
    if (client) {
      return res.status(409).json({ success: false, message: "Client already exists" });
    }
    const newClient = new Client(req.body);
    await newClient.save();
    res.status(200).json({success: true, message: "Client created successfully"});
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getClients = async (req, res) => {
  const { ownerId } = req.params;

  try {
    // Filter stores by ownerId without populating the owner details
    const clients = await Client.find({ owner: ownerId });
    res.status(200).json(clients);
  } 
  catch (error) {
    res.status(400).send(error);
  }
};

export const getClientById = async (req, res) => {
    const { clientId } = req.params;

    try {
        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ success: false, message: "Client not found" });
        }

        res.status(200).json(client);
    } catch (error) {
        res.status(400).send(error);
    }
};


export const updateClient = async (req, res) => {
    const { clientId } = req.params;

    try {
        // Check if the provided storeId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(clientId)) {
          return res.status(404).json({ success: false, message: "Invalid Client" });
        }

        const client = await Client.findById(clientId);
         if (!client) {
            return res.status(404).json({ success: false, message: "Client not found" });
        }

        const updatedClient = await Client.findByIdAndUpdate(clientId, req.body, { new: true });

        res.status(200).json({ success: true, message: "Client updated successfully", client: updatedClient });
    } catch (error) {
        res.status(500).send(error);
    }
};

export const deleteClient = async (req, res) => {
    const { clientId } = req.params;

    try {
        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ success: false, message: "Client not found" });
        }

        await Client.findByIdAndDelete(clientId);
        res.status(200).json({ success: true, message: "Client deleted successfully" });
    } catch (error) {
      res.status(500).send(error);
    }
};
