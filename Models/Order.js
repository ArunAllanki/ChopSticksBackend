const express = require("express");
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  OrderId: {
    type: Number,
    required: true,
  },
  Completed: {
    type: Boolean,
    required: true,
  },
  OrderDate: {
    type: String,
    required: true,
    trim: true,
  },
  OrderTime: {
    type: String,
    required: true,
    trim: true,
  },
  Name: {
    type: String,
    required: true,
    trim: true,
    timestamps: true,
  },
  MobileNo: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/,
  },
  RollNo: {
    type: String,
    required: true,
    trim: true,
  },
  OrderList: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
