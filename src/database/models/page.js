"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Page extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
        },
      });

      this.hasMany(models.Table, {
        onDelete: "cascade",
      });
    }
  }
  Page.init(
    {
      UserId: DataTypes.STRING,
      Name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Page",
      tableName: "pages",
    }
  );

  return Page;
};
