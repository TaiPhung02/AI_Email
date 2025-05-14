"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Send, SparkleIcon } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import useThreads from "@/hooks/use-threads";
import PremiunBanner from "./premium-banner";

type Props = {
  isCollapsed: boolean;
};

const AskAI = ({ isCollapsed }: Props) => {
  const { accountId } = useThreads();
  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat",
    body: {
      accountId,
    },
    onError: (error) => {
      console.error("error", error);
    },
    initialMessages: [],
  });

  if (isCollapsed) {
    return null;
  }

  console.log("Messages:", messages);

  return (
    <div className="mb-14 p-4">
      <PremiunBanner />

      <div className="h-4"></div>

      <motion.div className="flex flex-1 flex-col items-end rounded-lg bg-gray-100 p-4 shadow-inner dark:bg-gray-900">
        <div
          className="no-scrollbar flex max-h-[50vh] w-full flex-col gap-2 overflow-y-scroll"
          id="message-container"
        >
          <AnimatePresence mode="wait">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                layout="position"
                className={cn(
                  "z-10 mt-2 max-w-[250px] rounded-2xl bg-gray-200 break-words dark:bg-gray-800",
                  {
                    "self-end text-gray-900 dark:text-gray-100":
                      message.role === "user",
                    "self-start bg-blue-500 text-white":
                      message.role === "assistant",
                  },
                )}
                layoutId={`container-${messages.length}`}
                transition={{
                  type: "easeOut",
                  duration: 0.2,
                }}
              >
                <div className="px-3 py-2 text-[15px] leading-[15px]">
                  {message.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {messages.length > 0 && <div className="h-4"></div>}

        <div className="w-full">
          {messages.length === 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-4">
                <SparkleIcon className="size-6 text-gray-600" />

                <div>
                  <p className="text-gray-900 dark:text-gray-100">
                    Ask AI anything about your emails
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Get answers to your questions about your emails
                  </p>
                </div>
              </div>

              <div className="h-2"></div>

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="rounded-md bg-gray-800 px-2 py-1 text-xs text-gray-200"
                  onClick={() => {
                    const event = {
                      target: document.createElement("input"),
                    } as React.ChangeEvent<HTMLInputElement>;
                    event.target.value = "What can I ask?";
                    handleInputChange(event);
                  }}
                >
                  What can I ask?
                </span>

                <span
                  className="rounded-md bg-gray-800 px-2 py-1 text-xs text-gray-200"
                  onClick={() => {
                    const event = {
                      target: document.createElement("input"),
                    } as React.ChangeEvent<HTMLInputElement>;
                    event.target.value = "When does my movie start?";
                    handleInputChange(event);
                  }}
                >
                  When does my movie start?
                </span>

                <span
                  className="rounded-md bg-gray-800 px-2 py-1 text-xs text-gray-200"
                  onClick={() => {
                    const event = {
                      target: document.createElement("input"),
                    } as React.ChangeEvent<HTMLInputElement>;
                    event.target.value = "What is my recruitment information?";
                    handleInputChange(event);
                  }}
                >
                  What is my recruitment information?
                </span>
              </div>
            </div>
          )}

          <form className="flex w-full" onSubmit={handleSubmit}>
            <input
              type="text"
              className="relative h-9 flex-grow rounded-full border border-gray-200 bg-white px-3 py-1 text-[15px] outline-none placeholder:text-[13px]"
              placeholder="Ask AI anything about your emails"
              value={input}
              onChange={handleInputChange}
            />

            <motion.div
              className="pointer-events-none absolute z-10 flex h-9 w-[250px] items-center overflow-hidden rounded-full bg-gray-200 break-words [word-break:break-word] dark:bg-gray-800"
              key={messages.length}
              layout="position"
              layoutId={`container-${messages.length}`}
              transition={{
                type: "easeOut",
                duration: 0.2,
              }}
              initial={{ opacity: 0.6, zIndex: -1 }}
              animate={{ opacity: 0.6, zIndex: -1 }}
              exit={{ opacity: 1, zIndex: 1 }}
            >
              <div className="px-3 py-2 text-[15px] leading-[15px] text-gray-900 dark:text-gray-100">
                {input}
              </div>
            </motion.div>

            <button
              type="submit"
              className="ml-2 flex size-9 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800"
            >
              <Send className="size-4 text-gray-500 dark:text-gray-300" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AskAI;
