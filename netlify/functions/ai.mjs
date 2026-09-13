import OpenAI from "openai";

const ROADMAP = `Introduction; From X to FDE; Roles & Responsibilities; Frontend Skills; Backend Skills; Linux Skills; DSA & System Design; DSA Roadmap; System Design Roadmap; AI Engineering Skills; DevOps Skills; Customer Delivery & Field Skills; Requirements Gathering; Technical Scoping & Sequencing; Tradeoffs: Scope, Speed, Quality; Discovery & Scoping; Technical Writing; Communication; Enterprise Workflow; ROI & AI Impact; Stakeholder Management; Product Feedback Loop; Related Frontend Roadmap; Related Backend Roadmap; Related DevOps Roadmap; Related Linux Roadmap; Related AI Engineer Roadmap`;

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
Help the user become a Forward Deployed Engineer. Be practical, technical, honest and specific.
You can coach across EVERY roadmap area, not only AI: ${ROADMAP}
Prefer Learn -> Build -> Deploy -> Prove.
When useful, turn explanations into an exercise, production-shaped project, debugging task, interview drill, customer scenario, or proof artifact.
For customer-delivery topics, think like an FDE working with a real customer: clarify the problem, requirements, constraints, scope, sequencing, tradeoffs, stakeholders, ROI and production reliability.
For technical topics, explain concepts clearly, then give implementation or practice steps.
Do not claim that the source roadmap contains details it does not contain. If the user asks for details beyond the roadmap, clearly label them as practical guidance.
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
