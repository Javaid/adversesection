const {DataTypes} = require('sequelize');
const sequelize=require('../config/db');
const provider=require('./provider.model');

const taxonomy=sequelize.define('taxonomy',{
taxonomy_code:DataTypes.STRING,
taxonomy_description:DataTypes.STRING,
is_primary:DataTypes.BOOLEAN,
},{
    timestamps:false
});
provider.hasMany(taxonomy,{foreignKey:"providerId"});
taxonomy.belongsTo(provider,{foreignKey:"providerId"});
module.exports=taxonomy;
