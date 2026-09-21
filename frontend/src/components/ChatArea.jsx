import { useEffect } from 'react'
import MessageList from './MessageList'
import Nav from './Nav'
import ChatInput from './ChatInput'
import { useDispatch, useSelector } from 'react-redux'
import getMessages from '../features/getMessages'
import { setMessages } from '../redux/messageSlice'


function ChatArea() {
    const { selectedConversation } = useSelector(
    (state) => state.conversation)
    const dispatch = useDispatch()
  useEffect(() => {
    const getMesg = async () => {
      if (selectedConversation?._id) {
        const data = await getMessages(selectedConversation._id);
        dispatch(setMessages(data || []));
      } else {
        dispatch(setMessages([]));
      }
    };

    getMesg();
  }, [selectedConversation?._id]);
  return (
    <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
      <Nav/>
      <MessageList/>
      <ChatInput/>
    </div>
  )
}

export default ChatArea