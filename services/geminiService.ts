import { GoogleGenAI } from "@google/genai";
import { API_MODELS } from "../constants";

// Helper to strip data URL prefix if present
const cleanBase64 = (dataUrl: string) => {
  return dataUrl.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
};

const getMimeType = (dataUrl: string) => {
    const match = dataUrl.match(/^data:(image\/\w+);base64,/);
    return match ? match[1] : 'image/jpeg';
};

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Performs the "Time Travel" by asking Gemini to edit/regenerate the image based on the era.
 * We use the 'gemini-2.5-flash-image' model which is capable of image-to-image + text instruction.
 */
export const generateTimeTravelScene = async (base64Image: string, prompt: string): Promise<string> => {
  try {
    const cleanData = cleanBase64(base64Image);
    const mimeType = getMimeType(base64Image);

    // We instruct the model to keep the person but change the setting.
    const fullPrompt = `Transform this image. ${prompt} Ensure the person's face remains recognizable but adapt their clothing and the background to match the description perfectly. The output should be photorealistic.`;

    const response = await ai.models.generateContent({
      model: API_MODELS.EDIT,
      contents: {
        parts: [
            {
                inlineData: {
                    data: cleanData,
                    mimeType: mimeType
                }
            },
            {
                text: fullPrompt
            }
        ]
      }
    });

    // Extract image from response
    // The model typically returns an image part in the response for this type of request
    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }
    
    throw new Error("No image generated.");

  } catch (error) {
    console.error("Time travel failed:", error);
    throw error;
  }
};

/**
 * Allows the user to edit the generated image with text commands (e.g. "Add a retro filter").
 * Uses 'gemini-2.5-flash-image'.
 */
export const editGeneratedImage = async (base64Image: string, instruction: string): Promise<string> => {
    try {
        const cleanData = cleanBase64(base64Image);
        const mimeType = getMimeType(base64Image);

        const response = await ai.models.generateContent({
            model: API_MODELS.EDIT,
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: cleanData,
                            mimeType: mimeType
                        }
                    },
                    {
                        text: instruction
                    }
                ]
            }
        });

        if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    return `data:image/png;base64,${part.inlineData.data}`;
                }
            }
        }

        throw new Error("No image generated from edit.");

    } catch (error) {
        console.error("Image editing failed:", error);
        throw error;
    }
}

/**
 * Analyzes the image using 'gemini-3-pro-preview'.
 */
export const analyzeImageContent = async (base64Image: string): Promise<string> => {
    try {
        const cleanData = cleanBase64(base64Image);
        const mimeType = getMimeType(base64Image);

        const response = await ai.models.generateContent({
            model: API_MODELS.ANALYZE,
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: cleanData,
                            mimeType: mimeType
                        }
                    },
                    {
                        text: "Analyze this image in detail. Describe the historical era depicted, the clothing worn by the subject, the background elements, and the overall mood and lighting."
                    }
                ]
            }
        });

        return response.text || "Could not analyze image.";

    } catch (error) {
        console.error("Image analysis failed:", error);
        throw error;
    }
}