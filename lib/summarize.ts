export async function summarizeNote(content: string): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that summarizes user notes into concise bullet points.",
        },
        {
          role: "user",
          content: `Summarize the following note in markdown format:: ${content}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    }),
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "No summary available.";
}
