"use strict";
const { Model } = require("sequelize");
const crypto = require("crypto");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Page, {
        onDelete: "cascade",
      });
    }
    static getPassword(password) {
      //console.log("Function set password");
      let salt = crypto.randomBytes(16).toString("hex");
      // Hashing user's salt and password with 1000 iterations,
      let hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
        .toString(`hex`);
      let returnData = {
        salt: salt,
        hash: hash,
      };
      //console.log("data", returnData);
      return returnData;
    }

    static verifyPassword = function (password, userFind) {
      var hash = crypto
        .pbkdf2Sync(password, userFind.key_salt, 1000, 64, `sha512`)
        .toString(`hex`);
      return userFind.key_hash === hash;
    };
  }
  User.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      password: DataTypes.STRING,
      hash: DataTypes.STRING,
      salt: DataTypes.STRING,
      token: DataTypes.STRING,
      email: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
    }
  );
  return User;
};
