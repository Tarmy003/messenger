"use client";

import { ListFilter, LogOut, Search } from "lucide-react";
import { Input } from "../ui/input";
import ThemeSwitch from "./theme-switch";
import Conversation from "./conversation";
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
import UserListDialog from "./user-list-dialog";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { GenericId } from "convex/values";
import { useEffect } from "react";
import { useConversationStore } from "@/store/chat-store";

const LeftPanel = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const conversations = useQuery(api.conversations.getMyConversations, isAuthenticated ? undefined : "skip")?.map((conv) => ({
    ...conv,
    lastMessage: conv.lastMessage ? {
      ...conv.lastMessage,
      sender: conv.lastMessage.sender as GenericId<"users">,
    } : undefined,
  }));

  const { selectedConversation, setSelectedConversation } = useConversationStore();

  useEffect(() => {
    const conversationIds = conversations?.map((c) => c._id);
    if (
      selectedConversation &&
      conversationIds &&
      !conversationIds.includes(selectedConversation._id)
    ) {
      setSelectedConversation(null);
    }
  }, [conversations, selectedConversation, setSelectedConversation]);

  if (isLoading) return null;

  return (
    <div className={`w-full md:w-1/4 border-gray-600 border-r min-w-[280px] h-full ${selectedConversation ? 'hidden md:block' : 'block'}`}>
      <div className="sticky top-0 bg-left-panel z-10">
        {/* Header */}
        <div className="flex flex-wrap justify-between bg-gray-primary p-2 md:p-3 items-center gap-2">
          <UserButton />
          <SignedIn>
            <SignOutButton />
          </SignedIn>

          <SignedOut>
            <SignInButton />
          </SignedOut>

          <div className="flex items-center gap-2 md:gap-3">
            {isAuthenticated && <UserListDialog />}
            <ThemeSwitch />
            <LogOut size={20} className="cursor-pointer" />
          </div>
        </div>
        <div className="p-2 md:p-3 flex items-center">
          {/* Search */}
          <div className="relative h-8 md:h-10 mx-2 md:mx-3 flex-1">
            <Search
              className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10"
              size={18}
            />
            <Input
              type="text"
              placeholder="Search or start a new chat"
              className="pl-8 md:pl-10 py-1 md:py-2 text-xs md:text-sm w-full rounded shadow-sm bg-gray-primary focus-visible:ring-transparent"
            />
          </div>
          <ListFilter className="cursor-pointer" />
        </div>
      </div>

      {/* Chat List */}
      <div className="my-2 md:my-3 flex flex-col gap-0 max-h-[calc(100vh-160px)] overflow-auto">
        {conversations?.map((conversation) => (
          <Conversation key={conversation._id} conversation={conversation} />
        ))}

        {conversations?.length === 0 && (
          <>
            <p className="text-center text-gray-500 text-xs md:text-sm mt-2 md:mt-3">
              No conversations yet
            </p>
            <p className="text-center text-gray-500 text-xs md:text-sm mt-2 md:mt-3">
              We understand you are an introvert, but you have got to start somewhere
              😊
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default LeftPanel;