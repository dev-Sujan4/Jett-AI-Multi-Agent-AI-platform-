import { Code2, FileText, Globe, ImageIcon, MessageSquare, Mic, Paperclip, Send, Zap, Presentation, X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import sendMessage from '../features/sendMessage'
import { useDispatch, useSelector } from 'react-redux'
import { addMessage } from '../redux/messageSlice'
import { createConversation } from '../features/createConversation'
import { addConversation, setConvTitle, setSelectedConversation } from '../redux/conversationSlice'
import { updateConversation } from '../features/updateConversation'
import { removeDocument } from '../features/removeDocument'

function ChatInput() {
    const [value,setValue]=useState("")
    const [selectedAgent ,setSelectedAgent]=useState("Auto")
       const { selectedConversation } = useSelector(
        (state) => state.conversation)

    const [selectedFile, setSelectedFile] = useState(null)
    const fileRef = useRef(null)
    const dispatch = useDispatch()

    useEffect(() => {
        setSelectedFile(null)
        if (fileRef.current) {
            fileRef.current.value = ""
        }
    }, [selectedConversation?._id])

    const handleRemoveFile = async () => {
        setSelectedFile(null)
        if (fileRef.current) {
            fileRef.current.value = ""
        }
        if (selectedConversation?._id) {
            try {
                await removeDocument(selectedConversation._id)
            } catch (err) {
                console.error("Error removing document:", err)
            }
        }
    }

    const handleSendMessage = async () => {

        let conversation = selectedConversation

        if (!conversation){
          const conv =   await createConversation()
          dispatch(setSelectedConversation(conv))
          dispatch(addConversation(conv))
          conversation=conv
        }

        if (conversation.title=="New Chat"){
            await updateConversation({id:conversation?._id,title:value.trim()})
            dispatch(setConvTitle({conversationId:conversation?._id,title:value.slice(0,40)}))

            
        }

            console.log(selectedFile)
    const formData = new FormData()
    formData.append("prompt", value.trim())
    formData.append("conversationId", conversation?._id)
    formData.append("agent", selectedAgent.toLowerCase())

    if (selectedFile) {
    formData.append("file", selectedFile)
}



        dispatch (addMessage ({role:"user",content: value.trim()}))
        setValue("")
        const data = await sendMessage(formData)
        dispatch(addMessage({role:"assistant",content: data?.response,images:data?.images}))
        console.log(data)
    }

    const agents = [
    {
      id: "auto",
      icon: Zap,
      label: "Auto"
    },

    {
      id: "chat",
      icon: MessageSquare,
      label: "Chat"
    },

    {
      id: "coding",
      icon: Code2,
      label: "Coding"
    },

    {
      id: "pdf",
      icon: FileText,
      label: "PDF"
    },

    {
      id: "ppt",
      icon: Presentation,
      label: "PPT"
    },

    {
      id: "vision",
      icon: ImageIcon,
      label: "Vision"
    },

    {
      id: "search",
      icon: Globe ,
      label: "Search"
    }

  ]

  return (
    <div className="w-full overflow-hidden px-2.5 sm:px-3 md:px-5 py-2.5 sm:py-4 border-t border-white/[0.06] bg-[#0d0f14]">
        <div className="flex flex-col gap-1.5 sm:gap-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-3 sm:px-4 pt-2.5 sm:pt-3.5 pb-2.5 sm:pb-3">


            <div className='flex w-full gap-1.5 sm:gap-2 flex-wrap items-center'>
            {agents.map((agent)=>{
                  const isActive = selectedAgent === agent.label
                  const Icon = agent.icon
                  return(
                    <div
                    key={agent.id}
                onClick={() => setSelectedAgent(agent.label)}
                className={`
            flex-shrink-0
            cursor-pointer
            inline-flex
            items-center
            gap-1 sm:gap-1.5
            px-2.5 sm:px-3
            py-1 sm:py-1.5
            rounded-full
            text-[11px] sm:text-xs
            font-medium
            border 
            transition-all

            ${isActive
                    ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white border-transparent shadow-[0_1px_8px_rgba(99,102,241,.35)]"
                    : "bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.07]"
                  }
          `}>


            <Icon size={13}
                  className={
                    isActive
                      ? "text-white"
                      : "text-slate-500"
                  } />

                  {agent.label}

                    </div>
                  )
            })}
            </div>

            {selectedFile && (
                <div className="flex items-center gap-1.5 sm:gap-2 self-start max-w-full bg-white/[0.05] border border-white/[0.08] px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs text-slate-300">
                    {selectedFile.type?.startsWith('image/') || /\.(png|jpe?g|webp|gif|svg|bmp)$/i.test(selectedFile.name || '') ? (
                        <ImageIcon size={13} className="text-indigo-400 shrink-0" />
                    ) : (
                        <FileText size={13} className="text-indigo-400 shrink-0" />
                    )}
                    <span className="truncate max-w-[130px] xs:max-w-[180px] sm:max-w-xs md:max-w-md" title={selectedFile.name}>
                        {selectedFile.name}
                    </span>
                    <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="flex items-center justify-center w-4 h-4 rounded-full text-slate-400 hover:text-slate-200 hover:bg-white/[0.08] transition-colors cursor-pointer"
                        title="Remove file"
                        aria-label="Remove file"
                    >
                        <X size={12} />
                    </button>
                </div>
            )}

            <textarea
            placeholder='Ask Anything...'
            onChange={(e)=>setValue(e.target.value)}
            value = {value}
             className="w-full bg-transparent outline-none resize-none text-[13px] sm:text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50 min-h-[40px] sm:min-h-[52px]"
             rows={2}/>


             <div className='flex items-center justify-between pt-0.5'>
                <div className='flex items-center gap-1'>

<input type="file" accept='.pdf,image/*' hidden ref={fileRef} onChange={(e) => {
              const file = e.target.files[0]
              if (file) {
                setSelectedFile(file)
              }
            }} />

    
                    <button className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer" onClick={() => fileRef.current.click()} aria-label="Attach file">
                        <Paperclip size={15}/>
                    </button>
                    <button className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer" aria-label="Voice input">
                        <Mic size={15}/>
                    </button>
                </div>
                <button
                disabled={!value}
                onClick={handleSendMessage}
                aria-label="Send message"
                className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg border-none cursor-pointer transition-all duration-150 ${value.trim()?"bg-gradient-to-br from-indigo-500 to-violet-700 hover:opacity-90 text-white":"bg-white/0.05 text-slate-600 cursor-not-allowed"}`}>
                    <Send size={14}/>
                </button>

             </div>

        </div>
      
    </div>
  )
}

export default ChatInput

