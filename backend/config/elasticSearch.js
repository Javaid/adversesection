const {Client} =require('@elastic/elasticsearch');

const client=new Client({
    node:'http://localhost:9200'   ,
    apiVersion:'8.0' ,

});
module.exports=client;