import { Router } from "express";
import { createClient, deleteClient, getClientById, getClients, updateClient } from "../controllers/clientController.js";


const clientRoutes = Router();



clientRoutes.post("/add-customer",createClient);
clientRoutes.get("/get-customers/:ownerId",getClients);
clientRoutes.get("/get-customer/:clientId",getClientById);
clientRoutes.put("/update-customer/:clientId",updateClient);
clientRoutes.delete("/delete-customer/:clientId",deleteClient);   

export default clientRoutes;