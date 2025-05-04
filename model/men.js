const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingschema=new Schema({
    
    title:{
        type:String,
        required:true,
        trim:true
    },

    description:{
        type:String,
        required:true,
        trim:true
    },
    price:{
        type:Number,
        // required:true,
        min:[0,"price cannot be zero"],
    },
    Rprice:{
        type:Number,
        // required:true,
        min:[0,"price cannot be zero"],
    },
    image:
    {
     url:{type:String,
        default:"https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?cs=srgb&dl=pexels-pixabay-267301.jpg&fm=jpg",
            set:(v)=>v==""?"https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?cs=srgb&dl=pexels-pixabay-267301.jpg&fm=jpg":v,

            
     },
    },
    
})

const men=mongoose.model("men",listingschema);
module.exports=men;