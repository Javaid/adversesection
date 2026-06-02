const {DataTypes} = require('sequelize');
const sequelize=require('../config/db');
const provider=require('./provider.model');
const address = sequelize.define("Address",
  {
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    postal_code: DataTypes.STRING,
    phone: DataTypes.STRING,
    address_type: DataTypes.STRING,
  },
  { timestamps: false }
);


// ONLY ONE foreign key(one to many relationship)
address.belongsTo(provider, { foreignKey: "providerId" });
provider.hasMany(address, { foreignKey: "providerId" });

module.exports=address;