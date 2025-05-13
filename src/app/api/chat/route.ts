import { streamText, type Message, type LanguageModelV1 } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider"; // Tạo instance openrouter
import { auth } from "@clerk/nextjs/server";
import { OramaClient } from "@/lib/orama";

// Tạo instance openrouter
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { accountId, messages }: { accountId: string; messages: Message[] } =
      await req.json();

    const orama = new OramaClient(accountId);
    await orama.initialize();

    if (!messages || messages.length === 0) {
      return new Response("No messages provided", { status: 400 });
    }

    const lastMessage = messages[messages.length - 1]!;
    console.log("📩 lastMessage:", lastMessage);

    const context = await orama.vectorSearch({ term: lastMessage.content });
    console.log(`🔍 Found ${context.hits.length} relevant results.`);

    const systemPrompt = `
You are an AI email assistant embedded in an email client app. Your purpose is to help the user compose emails by answering questions, providing suggestions, and offering relevant information based on the context of their previous emails.
THE TIME NOW IS ${new Date().toLocaleString()}

START CONTEXT BLOCK
${context.hits.map((hit) => JSON.stringify(hit.document)).join("\n")}
END OF CONTEXT BLOCK

When responding:
- Be helpful, clever, and articulate.
- Use the provided email context.
- If info is missing, say you don't have enough context.
- Don't make things up or speculate.
- Be concise and relevant.
`.trim();

    // Sử dụng openrouter cho streamText
    const result = await streamText({
      model: openrouter(process.env.OPENROUTER_MODEL!), // Gọi model từ openrouter
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messages.filter((m) => m.role === "user"),
      ],
    });

    console.log("✅ streamText result (raw):", result);

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("❌ Error in /api/chat:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
