const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";

//--------------------------------------------------------------
export async function listModels() {
  const response = await fetch(`${OLLAMA_URL}/api/tags/`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
}

//--------------------------------------------------------------

export async function pullModel(model: string) {
  return new ReadableStream({
    async start(controller) {
      try {
        const response = await fetch(`${OLLAMA_URL}/api/pull/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: model,
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        if (!response.body) {
          throw new Error("No response body");
        }
        const reader = response.body.getReader();
        // return reader;
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            break;
          }
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line) {
              const parsedLine = JSON.parse(line); //.replace(/^data: /, ""));
              if (parsedLine.status) {
                controller.enqueue(parsedLine.status); //process.stdout.write(parsedLine.response);
              }
              if (parsedLine.error) {
                controller.error(parsedLine.error);
              }
              if (parsedLine.done) {
                controller.close();
                return;
              }
            }
          }
        }
        const data = await response.json();
        if (data.error) {
          throw new Error("Model not found - " + data.error);
        }
        controller.enqueue(data.status);
      } catch (error) {
        controller.error("Error pulling model - " + error);
      }
    },
  });
}

//--------------------------------------------------------------

export interface GenerateProps {
  model: string;
  prompt: string;
  stream?: boolean;
  system?: string;
}

export async function generate(req: GenerateProps) {
  console.log("sending request - " + req);
  return new ReadableStream<string>({
    async start(controller) {
      try {
        const response = await fetch(`${OLLAMA_URL}/api/generate/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(req),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (!response.body) {
          throw new Error("No response body");
        }
        const reader = response.body.getReader();

        // return reader;
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            break;
          }
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line) {
              const parsedLine = JSON.parse(line); //.replace(/^data: /, ""));
              if (parsedLine.response) {
                controller.enqueue(parsedLine.response); //process.stdout.write(parsedLine.response);
              }
              if (parsedLine.error) {
                controller.error(parsedLine.error);
              }
              if (parsedLine.done) {
                //console.log("");
                controller.close();
                return;
              }
            }
          }
        }
      } catch (error) {
        controller.error("Error generating completion -" + error);
      }
    },
  });
}

//--------------------------------------------------------------

interface MessageProps {
  role: "system" | "user" | "assistant"; // | "tool" | "function";
  content: string;
  images?: string[];
}

interface OptionsProps {
  temperature?: number;
  seed?: number;
  top_k?: number;
  repeat_penalty?: number;
  num_ctx?: number; //context window & also the number of tokens to generate
}

export interface ChatCompletionProps {
  model: string;
  messages: MessageProps[];
  prompt: string;
  stream?: boolean;
  format?: string;
  options?: OptionsProps;
}

export async function chatCompletion(req: ChatCompletionProps) {
  console.log("sending request - " + req);

  return new ReadableStream({
    async start(controller) {
      try {
        const response = await fetch(`${OLLAMA_URL}/api/chat/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(req),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        if (!response.body) {
          throw new Error("No response body");
        }

        const reader = response.body.getReader();
        // return reader;
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            break;
          }
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line) {
              const parsedLine = JSON.parse(line); //.replace(/^data: /, ""));
              if (parsedLine.message) {
                controller.enqueue(parsedLine.message); //process.stdout.write(parsedLine.response);
              }
              if (parsedLine.error) {
                controller.error(parsedLine.error);
              }
              if (parsedLine.done) {
                controller.close();
                return;
              }
            }
          }
        }
      } catch (error) {
        controller.error("Error generating completion -" + error);
      }
    },
  });
}

//-----------------------------------------------------------
