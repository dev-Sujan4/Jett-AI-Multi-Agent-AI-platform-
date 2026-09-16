import { getModel } from "../config/llmModels.js"
import { generatePpt } from "../utils/generatePpt.js"
import { getFromS3 } from "../utils/getFromS3.js"
import { uploadToS3 } from "../utils/uploadToS3.js"

export const pptAgent=async (state) => {
    
    try {
        const llm=await getModel("ppt")
        const prompt=`You are a professional presentation designer.

Return ONLY valid JSON.

Format:

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
}
]
}

Rules:

- Generate exactly 6 content slides.
- Each slide should have 4-6 concise bullet points.
- No markdown.
- No explanation.
- No code block.
- Return ONLY JSON.

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