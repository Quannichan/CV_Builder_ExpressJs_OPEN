const  OpenAI =  require("openai");

const token = process.env.OPENAI_KEY;
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

async function CallOpenAI(content){

  const client = new OpenAI({ baseURL: endpoint, apiKey: token });

  const response = await client.chat.completions.create({
    messages: [
      { role:"system", content: "You are a helpful assistant." },
      { role:"user", content: content }
    ],
      temperature: 1.0,
      top_p: 1.0,
      model: model
    });

  return response.choices[0].message.content; 
}

module.exports = {CallOpenAI}