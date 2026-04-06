import moment from "moment";
import TraingleIcon from "../../../svg/triangle";

export default function Message({ message, me }) {
  return (
    <div
      className={`w-full flex mt-2 space-x-3 max-w-xs ${
        me ? "ml-auto justify-end " : ""
      }`}
    >
      {/* Message Container */}
      <div className="relative">
        {/* 👤 Sender Avatar (only for group & not me) */}
        {!me && message.conversation.isGroup && (
          <div className="absolute top-0.5 left-[-37px]">
            <img
              src={message.sender.picture}
              alt={message.sender.name}
              className="w-8 h-8 rounded-full"
            />
          </div>
        )}

        <div
          className={`relative h-full dark:text-dark_text_1 p-2 rounded-lg
          ${me ? "bg-green_3" : "dark:bg-dark_bg_2"}
          `}
        >
          {!me && message.conversation.isGroup && (
            <p className="text-xs font-semibold text-green-400 mb-1">
              {message.sender.name}
            </p>
          )}

          {/* Message */}
          <p className="float-left h-full text-sm pb-4 pr-8">
            {message.message}
          </p>

          {/* Time */}
          <span className="absolute right-1.5 bottom-1.5 text-xs text-dark_text_5 leading-none">
            {moment(message.createdAt).format("HH:mm")}
          </span>

          {/* Triangle */}
          {!me && (
            <span>
              <TraingleIcon className="dark:fill-dark_bg_2 rotate-[60deg] absolute top-[-5px] -left-1.5" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}