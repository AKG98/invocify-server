import Invoice from '../models/invoiceModel.js';
import Store from '../models/storeModel.js';
import Client from '../models/clientModel.js';


export const saveInvoice = async (req, res) => {
    const {invoiceNumber} = req.body;
    try {
        // Check if the invoice number already exists
        const invoiceExists = await Invoice.findOne({ invoiceNumber });
        if (invoiceExists) {
            return res.status(409).json({ success: false, message: "Invoice number already exists" });
        }
        const newInvoice = new Invoice(req.body);
        await newInvoice.save();
        res.status(200).json({success: true, message: "Invoice created successfully"});
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
    };

    export const getInvoices = async (req, res) => {
        const { ownerId } = req.params;
    
        try {
            // Fetch all invoices related to the owner
            const invoices = await Invoice.find({ ownerId: ownerId });
    
            // Collect store and client data for each invoice
            const enrichedInvoices = await Promise.all(
                invoices.map(async (invoice) => {
                    const store = await Store.findById(invoice.storeId);
                    const client = await Client.findById(invoice.clientId);
    
                    return {
                        ...invoice._doc, // Return the full invoice document
                        store,
                        client,
                    };
                })
            );
    
            // Send the enriched invoices back to the client
            res.status(200).json(enrichedInvoices);
        } catch (error) {
            res.status(400).send(error);
        }
    };
    

export const updateInvoice = async (req, res) => {
    const { invoiceId } = req.params;

    try {
         const invoice = await Invoice.findById(invoiceId);
         if (!invoice) {
            return res.status(404).json({ success: false, message: "Invoice not found" });
        }

        const updatedInvoice = await Invoice.findByIdAndUpdate(invoiceId, req.body, { new: true });

        res.status(200).json({ success: true, message: "Invoice updated successfully", invoice: updatedInvoice });
    } catch (error) {
        res.status(500).send(error);
    }
};

export const deleteInvoice = async (req, res) => {
    const { invoiceId } = req.params;

    try {
        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) {
            return res.status(404).json({ success: false, message: "Invoice not found" });
        }

        await Invoice.findByIdAndDelete(invoiceId);
        res.status(200).json({ success: true, message: "Invoice deleted successfully" });
    } catch (error) {
      res.status(500).send(error);
    }
};

