"use strict";
const { SequelizeSlugify } = require("sequelize-slugify");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.product_translation, { foreignKey: "product_id" });
    }
  }
  Product.init(
    {
      slash_price: DataTypes.STRING,
      name_default: DataTypes.STRING,
      price: DataTypes.FLOAT,
      slug: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      category_id: DataTypes.INTEGER,
      image: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
      type: DataTypes.BOOLEAN,
      sku: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "products",
    }
  );
  SequelizeSlugify.slugifyModel(Product, {
    source: ["name_default"],
  });
  return Product;
};
