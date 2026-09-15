import axios  from 'axios'


async function sendMessage(payload) {
try {
    const {data}= await axios.post("/api/agent/chat",payload)
    return data
} catch (error) {
    console.log(error)
    return null 
}
}

export default sendMessage
