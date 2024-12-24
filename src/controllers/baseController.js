// baseController.js
const express = require("express");
const connectToDataBase  = require("../lib/mongodb");

const createBaseRouter = (Model) => {
  const router = express.Router();

  // Get all items
  router.get("/", async (req, res) => {
    try {
      
      await connectToDataBase();    
      const items = await Model.find({}).exec();
      res.status(200).json(items);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching items" });
    }
  });

  // Get item by ID
  router.get("/getById/:id", async (req, res) => {
    try {
      await connectToDataBase(); // Ensure DB connection
      const { id } = req.params;
      const item = await Model.findById(id).exec(); // Find by ID with exec
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.status(200).json(item);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching item" });
    }
  });

  // Create a new item
  router.post("/", async (req, res) => {
    try {
      await connectToDataBase(); // Ensure DB connection
      const newItem = new Model(req.body);
      const savedItem = await newItem.save(); // Save new item
      res.status(201).json(savedItem);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Error creating item" });
    }
  });

  // Update item by ID
  router.put("/updateById/:id", async (req, res) => {
    try {
      await connectToDataBase(); // Ensure DB connection
      const { id } = req.params;
      const updatedItem = await Model.findByIdAndUpdate(id, req.body, {
        new: true,
      }).exec(); // Update with exec
      if (!updatedItem) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.status(200).json(updatedItem);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Error updating item" });
    }
  });

  // Delete item by ID
  router.delete("/deleteById/:id", async (req, res) => {
    try {
      await connectToDataBase(); // Ensure DB connection
      const { id } = req.params;
      const deletedItem = await Model.findByIdAndDelete(id).exec(); // Delete with exec
      if (!deletedItem) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting item" });
    }
  });

  return router;
};

module.exports = createBaseRouter;