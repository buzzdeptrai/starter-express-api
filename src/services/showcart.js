require("dotenv").config();
const request = require("request");
const axios = require("axios").default;
const db = require("../database/models/index");

let getListCart = async (req, res, next) => {
  console.log("__ begin product list");
  const dataRes = await db.Product.findAll();

  //console.log("__ product list", dataRes);

  const facebook_ProductList = dataRes.map(function (item) {
    return {
      title: item.name_default,
      subtitle: item.name_default + " " + item.price + " USD",
      image_url: item.image,
      buttons: [
        {
          type: "web_url",
          url: "https://buzz.chayquangcaoads.com/product-details/" + item.slug,
          title: "View Detail",
        },
        {
          type: "postback",
          title: "Add to cart",
          payload: "TO_CART_BUZZ_" + item.id,
        },
      ],
    };
  });
  console.log("__run api get product list", facebook_ProductList);

  return (response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: facebook_ProductList,
      },
    },
  });
};

let getCheckout = async (sender_psid) => {
  await axios
    .post(`https://buzz.chayquangcaoads.com/api/cart/${sender_psid}/update`, {
      step_session: "email",
    })
    .then(function (response) {})
    .catch(function (error) {
      console.log(error);
    });

  return (response = {
    text: "OK, your email order?",
    quick_replies: [
      {
        content_type: "user_email",
      },
    ],
  });
};

let handleStep = async (sender_psid, key_update, valueUpdate) => {
  let keyStepReturn = "";
  let next = "";
  switch (key_update) {
    case "email":
      keyStepReturn = "phone";
      next = "phone";
      break;
    case "phone":
      keyStepReturn = "full name";
      next = "name";
      break;
    case "name":
      keyStepReturn = "address";
      next = "address1";
      break;
    case "address1":
      keyStepReturn = "end_checkout";
      next = "end_checkout";
      break;
    default:
      keyStepReturn = "email";
  }

  $_dataUpdate = {
    step_session: next,
    [key_update]: valueUpdate,
  };
  await axios
    .post(
      `https://buzz.chayquangcaoads.com/api/cart/${sender_psid}/update`,
      $_dataUpdate
    )
    .then(function (response) {
      console.log("update Data", $_dataUpdate);
    })
    .catch(function (error) {
      console.log(error);
    });

  return (response = {
    text: `OK, your ${keyStepReturn}?`,
  });
};

let getMobilePhone = () => {
  return (response = {
    text: "OK, your mobile phone number?",
    quick_replies: [
      {
        content_type: "user_phone_number",
      },
    ],
  });
};
let endCheckOut = async (sender_psid, messMember) => {
  let facebook_ProductList = "";
  let orderNumber = "";
  let SumTotal = 0;
  let email = "";
  let phone = "";
  //let address1 = "";
  let name = "";
  await axios
    .get("https://buzz.chayquangcaoads.com/api/cart/" + sender_psid)
    .then(function (response) {
      let reData = response.data.data;

      orderNumber = reData.order_number;

      email = reData.email;
      phone = reData.phone;
      //address1 = reData.address1;
      name = reData.name;
      //SumTotal = SumTotal + item.price * item.quantity;
      response.data.data.__listDetail.map((item) => {
        facebook_ProductList =
          facebook_ProductList +
          `\n- ${item.name} ${item.price} X ${item.quantity}`;
        SumTotal = SumTotal + item.price * item.quantity;
      });
    })
    .catch((error) => {
      console.log("error get data");
    });
  return (response = {
    attachment: {
      type: "template",

      payload: {
        template_type: "button",
        text: `Order Success! #${orderNumber}  \nShow List Product : ${facebook_ProductList} 
            \n------------
            \nFull Name : ${name} \nPhone : ${phone} \nEmail : ${email} \nAmount : ${SumTotal} USD \nAddress : ${messMember}
            `,
        buttons: [
          {
            type: "postback",
            title: "CLEAR CART",
            payload: "CLEAR_CART",
          },
        ],
      },
    },
  });
};

let getCartByPsid = function (sender_psid) {
  return new Promise((resolve, reject) => {
    axios
      .get("https://buzz.chayquangcaoads.com/api/cart/" + sender_psid)
      .then(function ({ data }) {
        resolve(data);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

const productGetPromise = (product_id) => {
  return new Promise((resolve, reject) => {
    try {
      const data = db.Product.findOne({
        where: {
          id: product_id,
        },
      });
      resolve(data);
    } catch (err) {
      reject(new Error("Oops!.. get data Error"));
    }
  });
};

let reviewCart = async (sender_psid) => {
  let orderNumber = "";
  let SumTotal = 0;
  let facebook_ProductList = "";

  const dataRes = await db.Orders.findOne({
    where: {
      psid: sender_psid,
    },
  });
  orderNumber = dataRes.sku;
  let jsonData = JSON.parse(dataRes.cart_data);

  for (let x in jsonData) {
    let itemProduct = jsonData[x];
    console.log("data-get:", itemProduct);
    await productGetPromise(itemProduct.product_id)
      .then((result) => {
        console.log("data:" + itemProduct.quantity);
        console.log("price:" + result.price);
        SumTotal += result.price * itemProduct.quantity;

        facebook_ProductList += `\n- ${result.name_default} ${result.price} X ${itemProduct.quantity}`;
      })
      .catch((error) => {
        console.log("In the catch", error);
      });
  }
  console.log("end-foreach", facebook_ProductList);
  return (response = {
    attachment: {
      type: "template",

      payload: {
        template_type: "button",
        text: `Cart Detail \nOrderNumber: ${orderNumber}  \nShow List Product : ${facebook_ProductList}`,
        buttons: [
          {
            type: "postback",
            title: `Check Out ${SumTotal}`,
            payload: "CHECKOUT",
          },
          {
            type: "postback",
            title: "Review Cart",
            payload: "REVIEW_CART",
          },
          {
            type: "postback",
            title: "Clear Cart",
            payload: "CLEAR_CART",
          },
        ],
      },
    },
  });
};

let actionAddCart = async function (sender_psid, params) {
  console.log(sender_psid, params);
  let facebook_ProductList = "";
  let orderNumber = "";
  let SumTotal = 0;
  await axios
    .post("https://buzz.chayquangcaoads.com/api/cart", {
      social_id: sender_psid,
      data_cart: [{ id: params[1], quantity: 1 }],
    })
    .then(function (response) {
      console.log(response);
      orderNumber = response.data.data.order_number;
      //
      response.data.data.__listDetail.map((item) => {
        facebook_ProductList =
          facebook_ProductList +
          `\n- ${item.name} ${item.price} X ${item.quantity}`;
        SumTotal = SumTotal + item.price * item.quantity;
      });
    })
    .catch(function (error) {
      console.log(error);
    });

  return (response = {
    attachment: {
      type: "template",

      payload: {
        template_type: "button",
        text: `add cart success! \nOrderNumber: ${orderNumber}  \nShow List Product : ${facebook_ProductList}`,
        buttons: [
          {
            type: "postback",
            title: `Check Out ${SumTotal}`,
            payload: "CHECKOUT",
          },
          {
            type: "postback",
            title: "Review Cart",
            payload: "REVIEW_CART",
          },
          {
            type: "postback",
            title: "Clear Cart",
            payload: "CLEAR_CART",
          },
        ],
      },
    },
  });
};

let actionClearCart = async function (sender_psid) {
  //getListCart;
  await axios
    .get("https://buzz.chayquangcaoads.com/api/cart/" + sender_psid + "/delete")
    .then(function (response) {
      console.log("status", response.data);
    })
    .catch((error) => {
      console.log("error get data");
    });
  return (response = { text: "OK, Clear Cart Success!" });
};
module.exports = {
  getListCart: getListCart,
  getCheckout: getCheckout,
  reviewCart: reviewCart,
  actionAddCart: actionAddCart,
  actionClearCart: actionClearCart,
  getMobilePhone: getMobilePhone,
  endCheckOut: endCheckOut,
  getCartByPsid: getCartByPsid,
  handleStep: handleStep,
};
