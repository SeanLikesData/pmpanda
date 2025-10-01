import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, projectId } = await req.json();
    console.log("Chat request:", { projectId, messageCount: messages.length });
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase credentials not configured");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Define tools for updating PRD and Spec
    const tools = projectId ? [
      {
        type: "function",
        function: {
          name: "update_prd",
          description: "Update the Product Requirements Document (PRD) markdown content for the current project. Use this when the user asks you to write, update, or modify the PRD.",
          parameters: {
            type: "object",
            properties: {
              content: {
                type: "string",
                description: "The full markdown content for the PRD"
              }
            },
            required: ["content"],
            additionalProperties: false
          }
        }
      },
      {
        type: "function",
        function: {
          name: "update_spec",
          description: "Update the Technical Specification (Spec) markdown content for the current project. Use this when the user asks you to write, update, or modify the technical spec.",
          parameters: {
            type: "object",
            properties: {
              content: {
                type: "string",
                description: "The full markdown content for the Spec"
              }
            },
            required: ["content"],
            additionalProperties: false
          }
        }
      }
    ] : [];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: `You are PMPanda's AI product manager assistant. Help users develop product requirements documents (PRDs), technical specifications, and provide strategic product management guidance. Be concise, actionable, and maintain awareness of the product context.

${projectId ? `You are currently working on project ID: ${projectId}. You have access to tools to update the PRD and Spec documents. When the user asks you to write or update these documents, use the appropriate tools to save the content.` : ''}`
          },
          ...messages,
        ],
        stream: true,
        ...(tools.length > 0 && { tools })
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Stream response and handle tool calls
    const reader = response.body?.getReader();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        if (!reader) {
          controller.close();
          return;
        }

        let buffer = "";
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (!line.trim() || line.startsWith(":")) continue;
              if (!line.startsWith("data: ")) continue;

              const data = line.slice(6);
              if (data === "[DONE]") {
                controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
                continue;
              }

              try {
                const parsed = JSON.parse(data);
                const toolCalls = parsed.choices?.[0]?.delta?.tool_calls;

                // Handle tool calls
                if (toolCalls && projectId) {
                  for (const toolCall of toolCalls) {
                    if (toolCall.function?.name && toolCall.function?.arguments) {
                      const args = JSON.parse(toolCall.function.arguments);
                      console.log("Tool call:", toolCall.function.name, args);

                      if (toolCall.function.name === "update_prd") {
                        const { error } = await supabase
                          .from("projects")
                          .update({ prd_content: args.content })
                          .eq("id", projectId);
                        
                        if (error) {
                          console.error("Error updating PRD:", error);
                        } else {
                          console.log("PRD updated successfully");
                        }
                      } else if (toolCall.function.name === "update_spec") {
                        const { error } = await supabase
                          .from("projects")
                          .update({ spec_content: args.content })
                          .eq("id", projectId);
                        
                        if (error) {
                          console.error("Error updating Spec:", error);
                        } else {
                          console.log("Spec updated successfully");
                        }
                      }
                    }
                  }
                }

                // Forward the data to client
                controller.enqueue(encoder.encode(`data: ${data}\n\n`));
              } catch (e) {
                console.error("Error parsing SSE data:", e);
              }
            }
          }

          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
