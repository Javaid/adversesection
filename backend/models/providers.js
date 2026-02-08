const {DataTypes} = require("sequelize");
const squelize=require("../config/db");

const provider=squelize.define("provider",{
    
    providerName:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    npi:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,

    },
    speciality: DataTypes.STRING,
    location: DataTypes.STRING,
    NPI_Status: DataTypes.STRING,
    MIPS: DataTypes.STRING,
    Payment: DataTypes.STRING,
    Medicare: DataTypes.STRING,
    Risk: DataTypes.STRING,
   
},
);
module.exports = provider;