import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function run() {


  const thread = await openai.beta.threads.create();

  console.log("THREAD ID:", thread.id);

  //message
  await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: "How do I create a video wall in OptiSigns?"
  });


  const runResult = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: "asst_txj62JqKupCSFXPGIMH1rBZg"
  });

  let status = runResult.status;

  while (status !== "completed") {

    await new Promise(r => setTimeout(r, 2000));

    const check = await openai.beta.threads.runs.retrieve(runResult.id, {
  thread_id: thread.id
});

    status = check.status;
  }

  const messages = await openai.beta.threads.messages.list(thread.id);

  const last = messages.data[0];

  if (last.content[0].type === "text") {
    console.log("\nBOT:", last.content[0].text.value);
  }

}

run();