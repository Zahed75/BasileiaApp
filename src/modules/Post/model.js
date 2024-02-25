const mongoose = require('mongoose');

const UploadSchema=new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.mongoose.Types.objectId,
            required: [true, 'Owner Id is required'],

        },
        files:{
            type:String,
            required:false,
        },
        like:{
            type:Number,
            default:0
        },

        comments:{
            type:String,
            max:[500,"Your comments must be at least 500 characters"]
        },
        shares:{
            type:Number,
            default:0
        },
        followers:{
            userId:{
                type:mongoose.Schema.mongoose.Types.object,
                required: [false, 'User Id is required']
            }
        },

        
    },{timestamps:true},
    
  

 )

 const FileUpload=mongoose.model('files',UploadSchema);

 module.exports=FileUploadModel;