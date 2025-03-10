const express = require("express");
const router = express.Router();
const Controller = require("./Controllers");

router.post("/add-item", Controller.createItem);
router.get("/all-items", Controller.getAllItems);
router.post("/send-order", Controller.sendOrder);
router.get("/all-orders", Controller.getAllOrders);
router.patch("/complete-order", Controller.CompleteOrder);
router.delete("/clear-orders", Controller.ClearOrders);
router.delete("/delete-item", Controller.DeleteItem);
router.patch("/pause-item", Controller.PauseItem);
router.patch("/resume-item", Controller.ResumeItem);
router.delete("/clear-comps", Controller.ClearOrders);
module.exports = router;
