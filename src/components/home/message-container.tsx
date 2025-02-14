import ChatBubble from "./chat-bubble";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConversationStore } from "@/store/chat-store";
import { useEffect, useRef } from "react";

const MessageContainer = () => {
  const { selectedConversation } = useConversationStore();
  const messages = useQuery(api.messages.getMessages, {
    conversation: selectedConversation!._id,
  });
  const me = useQuery(api.users.getMe);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  }, [messages]);

  // Return null or a loading state if `me` is undefined
  if (!me) {
    return null; // Or return a loading spinner
  }

  return (
    <div className='relative p-2 md:p-3 flex-1 overflow-auto h-[calc(100vh-120px)] md:h-[calc(100vh-130px)] bg-chat-tile-light dark:bg-chat-tile-dark'>
      <div className='mx-2 md:mx-12 flex flex-col gap-2 md:gap-3'>
        {messages?.map((msg, idx) => (
          <div 
            key={msg._id} 
            ref={idx === messages.length - 1 ? lastMessageRef : undefined}
            className="w-full max-w-full md:max-w-[85%]"
          >
            <ChatBubble
              message={msg}
              me={me}
              previousMessage={idx > 0 ? messages[idx - 1] : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageContainer;