import axios from "axios"
import { getModel } from "../config/llmModels.js"
import { uploadToS3 } from "../utils/uploadToS3.js"
import { getFromS3 } from "../utils/getFromS3.js"

export const visionAgent=async (state) => {

    try {
         const llm=await getModel("image")
    const res=await llm.invoke(`
        You are an elite AI image prompt engineer.
    const res=await llm.invoke(`You are JettAI Vision Prompt Engineer — an expert at crafting prompts for AI image generators.

Convert the user request into a highly detailed image generation prompt.
TASK: Convert the user's request into a single, highly detailed image generation prompt.

Requirements:
PROMPT STRUCTURE (use this comma-separated format):
[Main Subject & Action], [Environment/Setting], [Lighting & Atmosphere], [Camera Angle & Lens], [Art Style & Medium], [Color Palette], [Quality Modifiers]

- Cinematic lighting
- Professional composition
- Ultra realistic
- High detail
- Beautiful color palette
- Sharp focus
- 8K quality
- Photorealistic
- Depth of field
- Professional photography
- Stunning visuals
QUALITY MODIFIERS TO INCLUDE:
- 8K resolution, ultra-detailed, sharp focus
- Photorealistic or stylistically appropriate rendering
- Professional composition and depth of field

Return only the image prompt.
RULES:
- Output ONLY the final image prompt as a single paragraph. No labels, no explanations, no bullet points.
- Be vivid and specific. Replace vague words with precise visual descriptions.
- Adapt the style to match the user's intent (photorealistic for real scenes, illustrated for creative concepts, etc.)

User Request:
${state.prompt}

        `)

const prompt=res.content.trim()

const imageUrl=`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`

const imageRes=await axios.get(imageUrl,{responseType:"arraybuffer"})
const buffer = Buffer.from(imageRes.data)
const filename = `${Date.now()}.png`

await uploadToS3(filename,buffer,"image/png")
const downloadUrl=await getFromS3(filename,60*24)

return {
    ...state,
    aiResponse:`
![Generated Image](${downloadUrl})

📥  [Download Image](${downloadUrl})

⏳ Link expires in 10 minutes.`
}
        
    } catch (error) {
        return {
    ...state,
    aiResponse:error?.response?.data?.message ||
            error?.message ||
            "failed to generate image"
    }
   
}
}