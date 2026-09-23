import { searchTool } from "../config/tavily.js"

export const searchAgent = async (state) => {
    try {
        const results = await searchTool.invoke({
            query:state.prompt
        })
         return{
            ...state,
            searchResults : results,
            images: results.images ? results.images.slice(0, 3) : []
         }
    } catch (error) {
        return {
            ...state,
            searchResults : [],
            images: []
        }
    }
}