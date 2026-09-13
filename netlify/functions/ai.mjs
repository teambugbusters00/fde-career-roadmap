import OpenAI from "openai";

export default async (request) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const { mode = "study", prompt = "", context = "" } = await request.json();

    if (!process.env.GROQ_API_KEY) {
      return new Response(JSON.stringify({ error: "GROQ_API_KEY is not configured in Netlify environment variables." }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1"
    });

    const response = await client.responses.create({
      model: "openai/gpt-oss-20b",
      instructions: `You are the AI coach inside an FDE Career Command Center.
Help the user become a Forward Deployed Engineer. Be practical, technical and honest.
Give actionable suggestions, not generic motivation.
Prefer Learn -> Build -> Deploy -> Prove.
Current mode: ${mode}
User context:
${context}`,
      input: prompt
    });

    return new Response(JSON.stringify({ text: response.output_text }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Groq AI error:", error);
    return new Response(JSON.stringify({ error: "AI request failed. Check GROQ_API_KEY and Netlify function logs." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
