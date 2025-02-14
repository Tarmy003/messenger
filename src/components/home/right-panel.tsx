"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video, X, ArrowLeft } from "lucide-react";
import MessageInput from "./message-input";
import MessageContainer from "./message-container";
import ChatPlaceHolder from "@/components/home/chat-placeholder";
import GroupMembersDialog from "./group-members-dialog";
import { useConversationStore } from "@/store/chat-store";
import { useConvexAuth } from "convex/react";

const RightPanel = () => {
	const {selectedConversation, setSelectedConversation} = useConversationStore();
	const {isLoading} = useConvexAuth();

	if(isLoading) return null;
	if (!selectedConversation) return <ChatPlaceHolder />;

	const conversationName = selectedConversation.groupName || selectedConversation.name;
	const conversationImage = selectedConversation.groupImage || selectedConversation.image;

	return (
		<div className={`w-full md:w-3/4 flex flex-col ${selectedConversation ? 'block' : 'hidden md:block'}`}>
			<div className='w-full sticky top-0 z-50'>
				{/* Header */}
				<div className='flex justify-between bg-gray-primary p-2 md:p-3'>
					<div className='flex gap-2 md:gap-3 items-center'>
						<ArrowLeft 
							size={20} 
							className="cursor-pointer md:hidden"
							onClick={() => setSelectedConversation(null)}
						/>
						<Avatar className="h-8 w-8 md:h-10 md:w-10">
							<AvatarImage src={conversationImage || "/placeholder.png"} className='object-cover' />
							<AvatarFallback>
								<div className='animate-pulse bg-gray-tertiary w-full h-full rounded-full' />
							</AvatarFallback>
						</Avatar>
						<div className='flex flex-col'>
							<p className="text-sm md:text-base">{conversationName}</p>
							{selectedConversation.isGroup && <GroupMembersDialog selectedConversation={selectedConversation} />}
						</div>
					</div>

					<div className='flex items-center gap-3 md:gap-7 mr-2 md:mr-5'>
						<a href='/video-call' target='_blank'>
							<Video size={20} className="md:size-23" />
						</a>
						<X 
							size={16} 
							className='cursor-pointer hidden md:block' 
							onClick={() => setSelectedConversation(null)}
						/>
					</div>
				</div>
			</div>
			{/* CHAT MESSAGES */}
			<MessageContainer />

			{/* INPUT */}
			<MessageInput />
		</div>
	);
};
export default RightPanel;