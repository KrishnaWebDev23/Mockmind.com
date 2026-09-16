// supabase/functions/text-to-speech/index.ts
import { createClient } from "https://esm.sh";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { text, voice } = await req.json();
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

    // 1. Fetch audio via a standard HTTP POST (Supported by Supabase)
    const response = await fetch("https://openai.com", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        input: text,
        voice: voice || "alloy",
      }),
    });

    if (!response.ok) throw new Error("OpenAI API failed");

    // 2. Convert and send base64 back safely
    const audioBuffer = await response.arrayBuffer();
    const audioBytes = new Uint8Array(audioBuffer);
    const base64Audio = btoa(String.fromCodePoint(...audioBytes));

    return new Response(JSON.stringify({ audio: base64Audio }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: corsHeaders 
    });
  }
});
