import { EdgeTTS } from "npm:edge-tts-universal@1.4.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { text, voice } = await req.json();

    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "text is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const tts = new EdgeTTS(text, voice || "en-US-GuyNeural", {
      rate: "+0%",
      volume: "+0%",
      pitch: "+0Hz",
    });

    const result = await tts.synthesize();
    const audioArrayBuffer = await result.audio.arrayBuffer();
    const audioBytes = new Uint8Array(audioArrayBuffer);

    let binary = "";
    for (let i = 0; i < audioBytes.length; i++) {
      binary += String.fromCharCode(audioBytes[i]);
    }
    const base64Audio = btoa(binary);

    return new Response(JSON.stringify({ audio: base64Audio }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("TTS Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});