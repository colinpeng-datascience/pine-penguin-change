import dotenv from "dotenv-safe";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { ChatGPTAPI } from "chatgpt";
import { oraPromise } from "ora";

const app = express().use(cors()).use(bodyParser.json());

const gptApi = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY
});

class Conversation {
  conversationId = null;
  parentMessageId = null;

  constructor(conversationId, parentMessageId) {
    this.conversationId = (conversationId)? conversationId : null;
    this.parentMessageId = (parentMessageId)? parentMessageId : null;
  }

  async sendMessage(msg) {

    const res = await gptApi.sendMessage(
      msg,
      this.conversationId && this.parentMessageId
        ? {
            conversationId: this.conversationId,
            parentMessageId: this.parentMessageId,
          }
        : {}
    );
    
    if (res.conversationId) {
      this.conversationId = res.conversationId;
    }
    if (res.parentMessageId) {
      this.parentMessageId = res.parentMessageId;
    }

    if (res.response) {
      return {text: res.response, conversationId: res.conversationId,
         parentMessageId: res.parentMessageId}
    }
    return res;
  }
}



app.post("/", async (req, res) => {


  
  try {
    var conversation;
    if (req.body.conversationId && req.body.parentMessageId){
      conversation = new Conversation(req.body.conversationId, req.body.parentMessageId);
    } else{
      conversation = new Conversation(null, null);
      req.body.message = "In this conversation, I will send you text from multiple websites."+
        " Transform them according to the following rules. \n" + req.body.message + 
        " \nThe text could be one single word or a paragraph." +
        " Not everything have to be transformed. " + 
        "Make the output at most roughly the same length as the input."
    }

    const rawReply = await oraPromise(
      conversation.sendMessage(req.body.message),
      {
        text: req.body.message,
      }
    );

    res.json({reply: rawReply.text, conversationId: rawReply.conversationId,
      parentMessageId: rawReply.parentMessageId});
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

async function start() {
  await oraPromise(
    new Promise((resolve) => app.listen(3000, () => resolve())),
    {
      text: `You may now use the extension`,
    }
  );
}

start();