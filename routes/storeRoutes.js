import { Router } from "express";
import { createStore, deleteStore, getStoreById, getStores, updateStore } from "../controllers/storeController.js";

const storeRoutes = Router();



storeRoutes.post("/add-store",createStore);
storeRoutes.get("/get-stores/:ownerId",getStores);
storeRoutes.get("/get-store/:storeId",getStoreById);
storeRoutes.put("/update-store/:storeId",updateStore);
storeRoutes.delete("/delete-store/:storeId",deleteStore);   

export default storeRoutes;