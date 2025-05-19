import { GoogleGenAI } from "@google/genai";
import { marked } from "marked";

// Load API key from environment variables (secure)
const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY|| "" });

// Define the type for the tool's data
interface GenerateToolData {
  text: string;
}

class GenerateTool {
  private api: any;
  private data: GenerateToolData;
  private wrapper: HTMLDivElement | undefined;
  private input: HTMLInputElement | undefined;

  static get toolbox() {
    return {
      title: "Generate",
      icon: "💠",
    };
  }

  constructor({ data, api }: { data: Partial<GenerateToolData>; api: any }) {
    this.api = api;
    this.data = { text: data.text ?? "" }; // Ensure `text` is never undefined
  }

  render() {
    this.wrapper = document.createElement("div");

    this.input = document.createElement("input");
    this.input.type = "text";
    this.input.placeholder = "Type a topic and press Enter...";
    this.input.value = this.data.text || "";

    this.input.addEventListener("keydown", async (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        await this.handleGenerate();
      }
    });

    this.wrapper.appendChild(this.input);
    return this.wrapper;
  }

  async handleGenerate() {
    if (!this.input || !this.input.value.trim()) return;

    this.input.disabled = true;
    this.input.placeholder = "Generating...";
    try {
        const generatedText = await this.generateAIResponse(this.input.value);

        // ✅ Process AI-generated content into structured EditorJS blocks
        const lines = generatedText.split("\n");
        const blocks = [];
        let currentList = [];

        for (const line of lines) {
            if (line.startsWith("- ") || line.startsWith("• ")) {
                // ✅ Collect bullets into a list
                currentList.push(this.formatText(line.replace(/^[-•]\s*/, "")));
            } else {
                // ✅ Insert previous list block (if exists)
                if (currentList.length > 0) {
                    blocks.push({ type: "list", data: { style: "unordered", items: currentList } });
                    currentList = [];
                }
                // ✅ Insert formatted paragraph
                blocks.push({ type: "paragraph", data: { text: this.formatText(line) } });
            }
        }

        // ✅ Insert the last list block (if any bullets remain)
        if (currentList.length > 0) {
            blocks.push({ type: "list", data: { style: "unordered", items: currentList } });
        }

        // ✅ Insert structured blocks into EditorJS
        blocks.forEach((block) => this.api.blocks.insert(block.type, block.data));

        // ✅ Remove input field after generating content
        if (this.wrapper && this.input) {
            this.wrapper.removeChild(this.input);
            this.input = undefined;
        }
    } catch (error) {
        if (this.input) this.input.value = "Error generating content.";
    } finally {
        if (this.input) {
            this.input.disabled = false;
            this.input.placeholder = "Type a topic and press Enter...";
        }
    }
}

/**
 * ✅ Converts **bold text** and other Markdown-like formatting into EditorJS-compatible HTML
 */
formatText(text: string): string {
    return text
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // Convert **bold** to <b>bold</b>
        .replace(/__(.*?)__/g, "<b>$1</b>");    // Convert __bold__ to <b>bold</b>
}

  async generateAIResponse(prompt: string): Promise<string> {
    if (!prompt.trim()) return "No input provided.";

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: `Explain "${prompt}" **clearly and concisely** within **210 words max**.` }] }],
      });

      const markdownText = response.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to generate content.";
      return marked.parse(markdownText);
      return response.text || "AI response error.";
    } catch (error) {
      console.error("Error generating AI content:", error);
      return "Failed to generate content.";
    }
  }

  save(): GenerateToolData {
    return { text: this.input?.value || "" };
  }
}

export default GenerateTool;