"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class product_translation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Product, { foreignKey: "id" });
    }
  }
  product_translation.init(
    {
      product_id: DataTypes.INTEGER,
      locale: DataTypes.STRING,
      name: DataTypes.STRING,
      content: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "product_translation",
      tableName: "products_translations",
    }
  );
  return product_translation;
};
