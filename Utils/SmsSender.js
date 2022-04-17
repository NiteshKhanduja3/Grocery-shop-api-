const axios = require("axios");

const SmsSender = async(message,number) =>{
   await axios({
        method: 'post',
        url: 'https://www.fast2sms.com/dev/bulkV2',
        headers: {"authorization": "ZsUK5ijmuhg1dXLJMYeCP79V62pt0ycBFkARGNQazEWOnl4SvHoiZrptc1KygGY4LWxj7VFURI09mCnw",
        "Content-Type":"application/json"},
        data: {
          "route" : "q",
          "message" : message,
          "language" : "english",
          "flash" : 0,
          "numbers" :number,
          
        }
      });
}

module.exports= SmsSender;