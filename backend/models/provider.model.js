const {DataTypes} = require("sequelize");
const squelize=require("../config/db");
const provider=squelize.define("NppesProvider",{
    npi: {
        type:DataTypes.BIGINT,
        unique:true,

    },
    first_name: DataTypes.STRING,
    last_name:DataTypes.STRING,
    organization_name:DataTypes.STRING,
    gender:DataTypes.STRING,
},{
    timestamps:false

});
module.exports=provider;
