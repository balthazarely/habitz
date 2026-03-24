export async function POST(req: Request) {
  console.log(req);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error(
        "[/api/ask] Anthropic error:",
        JSON.stringify(errorBody, null, 2),
      );
      throw new Error(
        `Anthropic error: ${response.status} - ${errorBody.error?.message}`,
      );
    }

    const data = await response.json();
    return Response.json({ answer: data.content[0].text });
  } catch (err) {
    console.error("[/api/emoji] Error:", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
