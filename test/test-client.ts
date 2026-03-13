import OpenAI from "openai";
import dotenv from "dotenv";
import readline from "readline";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const assistantId = "asst_txj62JqKupCSFXPGIMH1rBZg";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function startChat() {

  console.log("OptiBot CLI started");
  console.log("Type 'exit' to quit\n");

  const thread = await openai.beta.threads.create();

  console.log("Thread:", thread.id, "\n");

  async function ask() {

    rl.question("You: ", async (question) => {

      if (question === "exit") {
        rl.close();
        process.exit(0);
      }

      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: question
      });

      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistantId
      });

      let status = run.status;

      while (status !== "completed") {

        await new Promise(r => setTimeout(r, 1500));

        const check = await openai.beta.threads.runs.retrieve(
          run.id,
          { thread_id: thread.id }
        );

        status = check.status;
      }

      const messages = await openai.beta.threads.messages.list(thread.id);

      const last = messages.data[0];

      if (last.content[0].type === "text") {
        console.log("\nBot:", last.content[0].text.value, "\n");
      }

      ask();
    });
  }

  ask();
}

startChat();