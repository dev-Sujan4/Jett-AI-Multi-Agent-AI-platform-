import { getModel } from "../config/llmModels.js"
import { generatePpt } from "../utils/generatePpt.js"
import { getFromS3 } from "../utils/getFromS3.js"
import { uploadToS3 } from "../utils/uploadToS3.js"

export const pptAgent=async (state) => {
    
    try {
        const llm=await getModel("ppt")
        const prompt=`You are a professional presentation designer.
        const prompt=`You are JettAI Presentation Designer — a world-class TED Talk-level slide architect.

Return ONLY valid JSON.
TASK: Generate a professional presentation as a JSON object.

Format:

STRICT JSON SCHEMA (follow this EXACTLY):
{
"title":"",
"subtitle":"",
"slides":[
{
"title":"",
"points":[
"",
"",
"",
""
]
  "title": "Presentation Title",
  "subtitle": "A compelling one-line subtitle",
  "slides": [
    {
      "title": "Slide Heading",
      "points": [
        "Concise, impactful bullet point",
        "Another clear and specific point"
      ]
    }
  ]
}
]
}

Rules:

CONTENT RULES:
- Generate exactly 6 content slides.
- Each slide should have 4-6 concise bullet points.
- No markdown.
- No explanation.
- No code block.
- Return ONLY JSON.
- Each slide must have 4-6 concise, specific bullet points.
- Write like a keynote speaker: persuasive, clear, and engaging. Avoid generic filler.
- Each bullet should deliver a distinct insight or fact — no repetition across slides.
- Use active voice and strong verbs. Avoid passive constructions.

OUTPUT RULES:
- Return ONLY the raw JSON object. No markdown, no code fences, no explanation, no extra text.

Topic:

${state.prompt}`
const res=await llm.invoke(prompt)
const cleaned = typeof res.content === "string" ? res.content.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim() : res.content
const data=JSON.parse(cleaned)

const ppt = await generatePpt(data)

const buffer=await ppt.write({
    outputType:"nodebuffer"
})

const filename=`ppt-${Date.now()}.pptx`

await uploadToS3(filename,buffer,"application/vnd.openxmlformats-officedocument.presentationml.presentation")
const downloadUrl=await getFromS3(filename,60*10)

return {
    ...state,
    aiResponse:`# ✅ Presentation Generated

**${data.title}**

📥 [Download PPT](${downloadUrl})

_Link expires in 10 minutes._`
}


    }
    catch(error){
        console.log(error)
         return {
            ...state,
            aiResponse:error?.data?.message || "failed to generate ppt"
        }
    }
}