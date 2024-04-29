"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video, X } from "lucide-react";
import MessageInput from "./message-input";
import MessageContainer from "./message-container";
import ChatPlaceHolder from "@/components/home/chat-placeholder";
import GroupMembersDialog from "./group-members-dialog";
import { useConversationStore } from "@/store/chat-store";

const RightPanel = () => {
	const { selectedConversation, setSelectedConversation } = useConversationStore();
	if (!selectedConversation) return <ChatPlaceHolder />;

	const conversationName = selectedConversation.name || selectedConversation.groupName;
	const conversationImage = selectedConversation.image || selectedConversation.groupImage;



	return (
		<div className='w-3/4 flex flex-col'>
			<div className='w-full sticky top-0 z-50'>
				{/* Header */}
				<div className='flex justify-between bg-gray-primary p-3'>
					<div className='flex gap-3 items-center'>
						<Avatar>
							<AvatarImage src={conversationImage || "/placeholder.png"} className='object-cover' />
							<AvatarFallback>
								<div className='animate-pulse bg-gray-tertiary w-full h-full rounded-full' />
							</AvatarFallback>
						</Avatar>
						<div className='flex flex-col'>
							<p>{conversationName}</p>
							{selectedConversation.isGroup && <GroupMembersDialog selectedConversation={selectedConversation} />}
							{!selectedConversation.isGroup && selectedConversation.isOnline ?
								<div className="flex flex-row justify-start items-center py-1 gap-1">
									<div className=" w-2.5 h-2.5 bg-green-500 rounded-full border-2 " />
									<h1 className="">online</h1>
								</div>
								: <div className="flex flex-row justify-start items-center py-1 gap-1">
									<div className=" w-2.5 h-2.5 bg-red-500 rounded-full border-2 " />
									<h1 className="">offline</h1>
								</div>}
						</div>
					</div>

					<div className='flex items-center gap-7 mr-5'>
						<a href='/video-call' target='_blank'>
							<Video size={23} />
						</a>
						<X onClick={() => setSelectedConversation(null)} size={16} className='cursor-pointer' />
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