'use strict';

var express = require('express'); // app server
var bodyParser = require('body-parser'); // parser for post requests
var AssistantV2 = require('ibm-watson/assistant/v2'); // watson sdk
const { IamAuthenticator, BearerTokenAuthenticator } = require('ibm-watson/auth');
var cors = require('cors')
var app = express();
const axios = require('axios')
// require('./health/health')(app);
app.use(cors())
// Bootstrap application settings
app.use(express.static('./public')); // load UI from public folder
app.use(bodyParser.json());

// Create the service wrapper

let authenticator;
if (process.env.ASSISTANT_IAM_APIKEY) {
  authenticator = new IamAuthenticator({
    apikey: process.env.ASSISTANT_IAM_APIKEY
  });
} else if (process.env.BEARER_TOKEN) {
  authenticator = new BearerTokenAuthenticator({
    bearerToken: process.env.BEARER_TOKEN
  });
}

var assistant = new AssistantV2({
  version: '2020-12-23',
  authenticator: authenticator,
  url: process.env.ASSISTANT_URL,
  disableSslVerification: true
});

// Endpoint to be call from the client side
app.post('/api/message', function (req, res) {
  console.log('/////')
  let assistantId = process.env.ASSISTANT_ID || '<assistant-id>';
  if (!assistantId || assistantId === '<assistant-id>') {
    return res.json({
      output: {
        text: "Error"

      }
    });
  }
  console.log(req.body,'llll')

  var textIn = req.body.message ? req.body.message : '';

// var token = req.body.token ? req.body.token : ""
  var payload = {
    assistantId: assistantId,
    sessionId: req.body.session_id,
    
    input: {
      message_type: 'text',
      text: textIn,
    },
  };
let userdata={
  token:req.body.token,
    userid:req.body.userid,
}
console.log(userdata,'assistant userdata++++++++++')
  // Send the input to the assistant service
  assistant.message(payload, async function (err, data) {
    if (err) {
      console.log(err,'err')
      const status = err.code !== undefined && err.code > 0 ? err.code : 500;
      if(err.message=="Invalid Session")
      {
        assistant.createSession(
          {
            assistantId: process.env.ASSISTANT_ID || '{assistant_id}',
          },
          function (error, response) {
            if (error) {
              console.log(error, 'error')
              return res.send(error);
            } else {
              // console.log(response.result.session_id,'sesionid__response+++++++')
              response.message=req.body.message ? req.body.message :""
              return res.send(response);
            }
          }
        );
      }
    }
    else{
    console.log(data.result.output,'data')
    if(data.result.output && data.result.output.intents.length > 0 && data.result.output.intents[0].intent=="Highest_Score")
    {
      UserScoreAccType(res,userdata.token,userdata.userid,'high')
    }
    else if(data.result.output && data.result.output.intents.length > 0 && data.result.output.intents[0].intent=="Lowest_Score"){
     UserScoreAccType(res,userdata.token,userdata.userid,'low')
      

    }
    else if(data.result.output && data.result.output.intents.length > 0 && data.result.output.intents[0].intent=="Weak_Point"){
      UserCategoryReportType(res,userdata.token,userdata.userid,'weak')
       
 
     }
     else if(data.result.output && data.result.output.intents.length > 0 && data.result.output.intents[0].intent=="Strong_Point"){
      UserCategoryReportType(res,userdata.token,userdata.userid,'strong')
       
 
     }
     else if(data.result.output && data.result.output.intents.length > 0 && data.result.output.intents[0].intent=="Quiz_Details"){
     
      console.log('&&&&&&&7777777777777777777777')
      return res.json([{type:'details'}]);

 
     }
     else if(data.result.output && data.result.output.intents.length > 0 && data.result.output.intents[0].intent=="Category_Details"){
     
      console.log('&&&&&&&7777777777777777777777')
      return res.json([{text:'category',type:'categoryform'}]);

 
     }
     else if(data.result.output && data.result.output.intents.length > 0 && data.result.output.intents[0].intent=="Last_Assessment"){
     
      return res.json([{text:'last'}]);

 
     }
     else if(data.result.output && data.result.output.intents.length==0&&data.result.output.generic[0].text=="I am your virtual assistant, I am here to help you with the details of State Street quiz portal")
     {
       data.result.output.generic[0].type="Welcome"
       return res.json(data.result.output.generic)
     }
     else if(data.result.output && data.result.output.generic.length >0 && data.result.output.generic[0].text=="showmedetails")
     {
       console.log('reached right location')
        let showresult=data.result.output.generic.slice(1,2)
        showresult[0].type="showmedetails"
        console.log(showresult,'indetails')
       return res.json(showresult)

     }
    else
    {
      console.log("bot response++++",data.result.output)
      data.result.output.generic[0].type="simple"
    return res.json(data.result.output.generic);
    }
  }
  });
});

app.get('/api/session', function (req, res) {
  assistant.createSession(
    {
      assistantId: process.env.ASSISTANT_ID || '{assistant_id}',
    },
    function (error, response) {
      if (error) {
        console.log(error, 'error')
        return res.send(error);
      } else {

        return res.send(response);
      }
    }
  );
});

app.post('/api/customQuestions', async (req, res) => {
  console.log('reached here at api+++++++++++', req.body)
  let token = req.body.token
  let userid = req.body.userid
  try {
    let response = await axios.get('https://statestreetquizdev-phase3.mybluemix.net/api/user/getQuestionList', {
      headers: {
        Authorization: 'Bearer' + ' ' + `${token}`//the token is a variable which holds the token
      }, params: { userId: userid }
    })

    var questionsarray=[]
    response.data.forEach((ele)=>{
      ele.type="question"
      questionsarray.push(ele)
    })
    return res.json(response.data)
  }

  catch (e) {
    // console.log(e,'Error')
  }
})
let UserCategoryReportType= async(res,token,userid,type)=>{
  
  try {
    let response = await axios.get('https://statestreetquizdev-phase3.mybluemix.net/api/user/getUserCategoryReport', {
      headers: {
        Authorization: 'Bearer' + ' ' + `${token}`//the token is a variable which holds the token
      }, params: { userId: userid, type: type }
    })
    console.log('strong point',response)

if(type=="strong")
return res.json([{type:"strongpoint",text:response.data[0].category}])
else
return res.json([{type:"weakpoint",text:response.data[0].category}])

  }

  catch (e) {
    // console.log(e,'Error')
  }
}

let UserScoreAccType= async(res,token,userid,type)=>{
    try {
     
      let response = await axios.get('https://statestreetquizdev-phase3.mybluemix.net/api/user/getUserScoreAccType', {
        headers: {
          Authorization: 'Bearer' + ' ' + `${token}`//the token is a variable which holds the token
        }, params: { userId: userid, scoreType: type }
      })
  
      console.log('response type of score----------','HIghestScore:-'+response.data)
   

      if(type=="high")
      
      return res.json ([{type:'highscore',
      AssessmentName:response.data.assessmentName,
      HighestScore:response.data.score}])
      else
      console.log('in lowest+++++++',response.data.score)
      return res.json([{type:'lowscore',
      AssessmentName:response.data.assessmentName,
      ben:response.data.score}])

    }
  
    catch (e) {
      // console.log(e,'Error')
    }
  }

app.post('/api/getLob',async(req,res)=>{
  console.log('reached here at api+++++++++++', req.body)
  let token = req.body.token
  let userid = req.body.userid
  try {
    let response = await axios.get('https://statestreetquizdev-phase3.mybluemix.net/api/user/getLobByUser', {
      headers: {
        Authorization: 'Bearer' + ' ' + `${token}`//the token is a variable which holds the token
      }, params: { userId: userid }
    })

    return res.json(response.data)
  }

  catch (e) {
    // console.log(e,'Error')
  }
})
app.post('/api/getUserAssessmentByLob',async(req,res)=>{
  console.log('reached here at lob+++++++++++', req.body)
  let token = req.body.token
  let userid = req.body.userid
  let lobid=req.body.lobid
  try {
    let response = await axios.get('https://statestreetquizdev-phase3.mybluemix.net/api/user/getUserAssessmentByLob', {
      headers: {
        Authorization: 'Bearer' + ' ' + `${token}`//the token is a variable which holds the token
      }, params: { userId: userid,lobId:lobid }
    })

    return res.json(response.data)
  }

  catch (e) {
    // console.log(e,'Error')
  }
})

// http://localhost:8080/api/user/getUserAssessmentHistory?userId=51758196&lobId=1&assessmentId=9

app.post('/api/getUserAssessmentHistory',async(req,res)=>{
  console.log('getUserAssessmentHistory', req.body)
  let token = req.body.token
  let userid = req.body.userid
  let lobid=req.body.lobid
  let assessmentid=req.body.assessmentid
  let type=req.body.type
  try {
    let response = await axios.get('https://statestreetquizdev-phase3.mybluemix.net/api/user/getUserAssessmentHistory', {
      headers: {
        Authorization: 'Bearer' + ' ' + `${token}`//the token is a variable which holds the token
      }, params: { userId: userid,lobId:lobid,assessmentId:assessmentid,type:type}
    })

    console.log('last-------------',type,response.data)
   if(type=="Last")
   {
  
response.data[0].type="last"
return res.json(response.data)
  }
  else{
    console.log(response.data,'in userassessment history')

    var newarray=[]
    response.data.forEach((ele)=>{
      ele.type="detailshow"
      newarray.push(ele)
    })
    console.log(newarray,'in userassessment history new+++++')
    return res.json(newarray)
  }
  }
  catch (e) {
    console.log(e,'Error')
  }
})

// http://localhost:8080/api/user/getUserCategoryReport?userId=51758196&type=
app.post('/api/getUserCategoryReport',async(req,res)=>{
  console.log('reached here at api+++++++++++', req.body)
  let token = req.body.token
  let userid = req.body.userid
  
  try {
    let response = await axios.get('https://statestreetquizdev-phase3.mybluemix.net/api/user/getUserCategoryReport', {
      headers: {
        Authorization: 'Bearer' + ' ' + `${token}`//the token is a variable which holds the token
      }, params: { userId: userid,type:"All" }
    })
    // response.data.map(ele=>{
    //   return ele.type='category'
    // })
    

    console.log(response.data,'_________________category reeposrt')
    return res.json(response.data)
  }

  catch (e) {
    // console.log(e,'Error')
  }
})
// http://localhost:8080/api/user/getUserQuesCategoryList?userId=51758196

app.post('/api/getUserQuesCategoryList',async (req,res)=>{
  try{
    let token = req.body.token
    let userid = req.body.userid
    let response = await axios.get('https://statestreetquizdev-phase3.mybluemix.net/api/user/getUserQuesCategoryList', {
      headers: {
        Authorization: 'Bearer' + ' ' + `${token}`//the token is a variable which holds the token
      }, params: { userId: userid }
    })
return res.json(response.data)
  }
  catch(e){
    console.log(e,'error')
  }
})
// http://localhost:8080/api/user/getUserCatWiseReport?userId=51758196&catName=PROCESS
app.post('/api/getUserCatWiseReport',async (req,res)=>{
  try{
    let token = req.body.token
    let userid = req.body.userid
    let category = req.body.categoryname
    let response = await axios.get('https://statestreetquizdev-phase3.mybluemix.net/api/user/getUserCatWiseReport', {
      headers: {
        Authorization: 'Bearer' + ' ' + `${token}`//the token is a variable which holds the token
      }, params: { userId: userid ,catName:category}
    })
    response.data.map(ele=>{
      return ele.type='category'
    })
return res.json(response.data)
  }
  catch(e){
    console.log(e,'error')
  }
})
module.exports = app;
