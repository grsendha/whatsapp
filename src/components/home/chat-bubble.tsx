import { MessageSeenSvg } from "@/lib/svgs";
import { IMessage, useConversationStore } from "@/store/chat-store";
import ChatBubbleAvatar from "./chat-bubble-avatar";
import DateIndicator from "./date-indicator";
import Image from "next/image";
import { messages } from "@/dummy-data/db";
import { useState } from "react";
import { Bot, X } from "lucide-react";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription } from "../ui/dialog";
import ReactPlayer from "react-player";

type ChatBubbleProps = {
	message: IMessage,
	me: any,
	previousMessage?: IMessage
}
const ChatBubble = ({ me, message, previousMessage }: ChatBubbleProps) => {

	const [open, setOpen] = useState(false);
	const date = new Date(message._creationTime);
	const hour = date.getHours().toString().padStart(2, "0");
	const minute = date.getMinutes().toString().padStart(2, "0");
	const time = `${hour}:${minute}`;

	const { selectedConversation } = useConversationStore();
	const isMember = selectedConversation?.participants.includes(message.sender?._id) || false;

	const isGroup = selectedConversation?.isGroup || false;
	const fromMe = message?.sender._id === me._id;
	const fromAI = message.sender?.name === "Gemini";
	const bgClass = fromMe ? 'bg-green-chat' : !fromAI ? 'bg-gray-primary' : 'bg-blue-500 text-white';
	if (!fromMe) {
		return (<>
			<DateIndicator message={message} previousMessage={previousMessage} />
			<div className="flex gap-1 w-2/3">
				<ChatBubbleAvatar message={message} isMember={isMember} isGroup={isGroup} fromAI={fromAI} />
				<div className={`flex flex-col z-20 max-w-fit px-2 pt-1 rounded-md shadow-md relative ${bgClass}`}>
					{!fromAI && <OtherMessageIndicator />}
					{fromAI && <Bot size={16} className="absolute bottom-[2px] left-2" />}
					{fromAI && <div>
						<h4 className="font-bold "> {message.sender.name} </h4>
						<hr className="mb-2 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />
					</div>
					}
					{message.messageType === "text" && <TextMessage message={message} />}
					{message.messageType === "image" && <ImageMessage message={message} handleClick={() => setOpen(true)} />}
					{message.messageType === "video" && (<VideoMessage message={message} />)}
					{open && <ImageDialog
						src={message.content}
						open={open}
						onClose={() => setOpen(false)} />}
					<MessageTime time={time} fromMe={fromMe} />
				</div>
			</div>
		</>);
	}
	return (<>
		<DateIndicator message={message} previousMessage={previousMessage} />
		<div className="flex gap-1 w-2/3 ml-auto">
			<div className={`flex flex-col z-20 max-w-fit ml-auto px-2 pt-1 rounded-md shadow-md relative ${bgClass}`}>
				<SelfMessageIndicator />
				{message.messageType === "text" && <TextMessage message={message} />}
				{message.messageType === "image" && <ImageMessage message={message} handleClick={() => setOpen(true)} />}
				{message.messageType === "video" && (<VideoMessage message={message} />)}
				{open && <ImageDialog
					src={message.content}
					open={open}
					onClose={() => setOpen(false)} />}
				<MessageTime time={time} fromMe={fromMe} />
			</div>
		</div>
	</>)
};
export default ChatBubble;

const VideoMessage = ({ message }: { message: IMessage }) => {
	return <ReactPlayer url={message.content}
		width="400px" height="250px" controls={true} light={true}
	></ReactPlayer>
}

const ImageDialog = ({ src, onClose, open }: { open: boolean; src: string; onClose: () => void }) => {
	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
			<DialogContent className='min-w-[750px]'>
				<DialogDescription className='relative h-[450px] flex justify-center'>
					<Image src={src} fill className='rounded-lg object-contain' alt='image' />
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
};

const ImageMessage = ({ message, handleClick }: { message: IMessage; handleClick: () => void }) => {
	return (
		<div className='w-[250px] h-[250px] m-2 relative'>
			<Image
				onClick={handleClick}
				src={message.content}
				fill
				className='cursor-pointer object-cover rounded'
				alt='image'

			/>
		</div>
	);
};

const MessageTime = ({ time, fromMe }: { time: string; fromMe: boolean }) => {
	return (
		<p className='text-[10px] mt-2 self-end flex gap-1 items-center'>
			{time} {fromMe && <MessageSeenSvg />}
		</p>
	);
};

const OtherMessageIndicator = () => (
	<div className="absolute bg-white dark:bg-gray-primary top-0 -left-[4px] w-3 h-3 rounded-bl-full" />
)
const SelfMessageIndicator = () => (
	<div className='absolute bg-green-chat top-0 -right-[3px] w-3 h-3 rounded-br-full overflow-hidden' />
);

const TextMessage = ({ message }: { message: IMessage }) => {
	const isLink = /^(ftp|http|https):\/\/[^ "]+$/.test(message.content); // Check if the content is a URL

	return (
		<div>
			{isLink ? (
				<a
					href={message.content}
					target='_blank'
					rel='noopener noreferrer'
					className={`mr-2 text-sm font-light text-blue-400 underline`}
				>
					{message.content}
				</a>
			) : (
				<p className={`mr-2 text-sm font-light`}>{message.content}</p>
			)}
		</div>
	);
};

