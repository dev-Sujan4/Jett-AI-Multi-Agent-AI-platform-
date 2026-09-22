import redis from "./redis.js"
import { getMessages } from "../utils/getMessages.js"

export const getMemory = async (conversationId) => {
    if (!conversationId) return []
    const key =`messages-${conversationId}` 
    const cached = await redis.get(key)

    if (cached && cached !== "null"){
        const parsed = JSON.parse(cached)
        return Array.isArray(parsed) ? parsed : []
    }
    const messages = await getMessages(conversationId)
    const validMessages = Array.isArray(messages) ? messages : []

    await redis.set(key,JSON.stringify(validMessages),"EX",24*60*60) 

    return validMessages
}

export const addMessage = async (conversationId, role, content) => {
  const key = `messages-${conversationId}`
  const rawMessages = await redis.get(key)
  

  const messages = rawMessages ? JSON.parse(rawMessages) : []

  messages.push({
    role,
    content
  })

  if (messages.length > 20) {
    messages.shift()
  }

  await redis.set(key, JSON.stringify(messages))
}