"use strict";
const { SequelizeSlugify } = require("sequelize-slugify");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order.init(
    {
      order_number: DataTypes.STRING,
      psid: DataTypes.STRING,
      total: DataTypes.FLOAT,
      user_id: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
      sku: DataTypes.UUID,
      cart_data: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: "Orders",
      tableName: "orders",
    }
  );
  return Order;
};
