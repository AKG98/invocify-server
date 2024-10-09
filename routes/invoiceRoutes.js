import { Router } from "express";
import { deleteInvoice, getInvoices, saveInvoice, updateInvoice } from "../controllers/invoiceController.js";


const invoiceRoutes = Router();

invoiceRoutes.post("/save-invoice",saveInvoice);
invoiceRoutes.get("/get-invoices/:ownerId",getInvoices);
invoiceRoutes.put("/update-invoice/:invoiceId",updateInvoice);
invoiceRoutes.delete("/delete-invoice/:invoiceId",deleteInvoice);  

export default invoiceRoutes;