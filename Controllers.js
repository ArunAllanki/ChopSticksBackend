const item_model = require("./Models/Item");
const order_model = require("./Models/Order");
require("dotenv").config();
const twilio = require("twilio");
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;
const client = twilio(accountSid, authToken);

const sendOrder = async (req, res) => {
  try {
    var { OrderId, OrderDate, OrderTime, Name, MobileNo, RollNo, OrderList } =
      req.body;
    Name = `${Name}`;
    MobileNo = `${MobileNo}`;
    RollNo = `${RollNo}`;
    Completed = false;

    OrderId = await CreateId(MobileNo);

    const newOrder = new order_model({
      OrderId,
      Completed,
      OrderDate,
      OrderTime,
      Name,
      MobileNo,
      RollNo,
      OrderList,
    });
    await newOrder
      .save()
      .then()
      // const sendSMS = async () => {
      //   await client.messages
      //     .create({
      //       from: twilioNumber,
      //       to: `${MobileNo}`,
      //       body: `Hey ${Name}!
      //   Your order in RCE chopsticks is placed successfully with order Id- ${OrderId}`,
      //     })
      //     .then(() => {
      //       console.log("SMS sent succesfully");
      //     })
      //     .catch((err) => {
      //       console.log(err, "not sent");
      //     });
      // };
      // sendSMS();

      // const message = client.messages.create({
      //   body: `Hello ${Name}! Your order has been successfully placed in RCE chopsticks with Order Id- ${OrderId}`,
      //   from: "whatsapp:+14155238886",
      //   to: `whatsapp:+91${MobileNo}`,
      // });
      // console.log(message.body);
      .catch((err) => {
        console.error(err);
      });
    res.setHeader("Content-Type", "application/json");
    res.status(201).json({ ID: OrderId });
    const sendSMS = async () => {
      await client.messages
        .create({
          from: twilioNumber,
          to: `+91${MobileNo}`,
          body: `
          Hey ${Name}! Your order in RCE chopsticks is placed successfully with order Id- ${OrderId}`,
        })
        .then(() => {
          console.log("SMS sent succesfully");
        })
        .catch((err) => {
          console.log("SMS not sent", err);
        });
    };
    sendSMS();
  } catch (error) {
    console.log(error);
    res.ok == false;
    res.status(500).json({ message: "Error while sending order" });
  }
};

const createItem = async (req, res) => {
  try {
    const { name, price, veg, active } = req.body;
    const Item = new item_model({ name, price, veg, active });
    await Item.save();
    res.status(201).json(Item);
  } catch (error) {
    console.log(`Error creating item : ${error}`);
    res.status(500).json({ message: "Error creating item" });
  }
};

const getAllItems = async (req, res) => {
  try {
    const allItems = await item_model.find({});
    res.status(200).json(allItems);
  } catch (error) {
    console.log(`Error getting items:${error}`);
    res.status(500).json({ message: `Error getting items:${error}` });
  }
};

const DeleteItem = async (req, res) => {
  try {
    const { Id } = req.body;
    item_model
      .findByIdAndDelete(Id)
      .then((response) => res.status(200).json(response));
  } catch (error) {
    console.log("Error while deleting Item");
    res.status(500).json({ message: "Error while deleting Item" });
  }
};

const PauseItem = async (req, res) => {
  try {
    const { Id } = req.body;
    if (!Id) {
      return res.status(400).json({ message: "Item Id is required" });
    }
    item_model
      .findOneAndUpdate({ _id: Id }, { $set: { active: false } }, { new: true })
      .then((response) => res.status(200).json(response));
  } catch (error) {
    console.log("Error while pausing Item", error);
    res.status(500).json({ message: "Error while pausing Item" });
  }
};

const ResumeItem = async (req, res) => {
  try {
    const { Id } = req.body;
    if (!Id) {
      return res.status(400).json({ message: "Item Id is required" });
    }
    item_model
      .findOneAndUpdate({ _id: Id }, { $set: { active: true } }, { new: true })
      .then((response) => res.status(200).json(response));
  } catch (error) {
    console.log("Error while pausing Item", error);
    res.status(500).json({ message: "Error while pausing Item" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const allOrders = await order_model.find();
    res.status(200).json(allOrders);
  } catch (error) {
    console.log(`Error getting Orders:${error}`);
    res.status(500).json({ message: `Error getting Orders:${error}` });
  }
};

const CompleteOrder = async (req, res) => {
  try {
    const { Id } = req.body;
    order_model
      .findOneAndUpdate(
        { OrderId: Id },
        { $set: { Completed: true } },
        { new: true }
      )
      .then((response) => res.status(200).json(response));
  } catch (error) {
    console.log("Error while deleting order");
    res.status(500).json({ message: "Error while deleting order" });
  }
};

const ClearOrders = async (req, res) => {
  try {
    await order_model
      .deleteMany({ Completed: true })
      .then((response) => res.status(200).json(response));
  } catch (error) {
    console.log("Error while clearing orders");
    res.status(500).json({ message: "Error while deleting orders" });
  }
};

async function CreateId(mNumber) {
  try {
    const allOrders = await order_model.find();
    console.log("Total no.of orders :", allOrders.length);
    // if (allOrders) {
    //   return `${allOrders.length + 1}${mNumber[0]}${mNumber[-1]}`;
    // } else {
    //   return 1;
    // }

    return parseInt(
      `${allOrders.length}${mNumber[0]}${mNumber[mNumber.length - 1]}`
    );
  } catch (err) {
    console.error("Error fetching the last document:", err);
  }
}

module.exports = {
  createItem,
  getAllItems,
  DeleteItem,
  PauseItem,
  ResumeItem,
  sendOrder,
  getAllOrders,
  CompleteOrder,
  ClearOrders,
};
