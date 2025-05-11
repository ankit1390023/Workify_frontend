import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { BsFillChatDotsFill } from "react-icons/bs";
import { IoMdMicOff, IoMdMic, IoIosSend } from "react-icons/io";
import { motion } from "framer-motion";
import { useTheme } from '@/context/ThemeContext';

const API_END_POINT = import.meta.env.VITE_API_END_POINT;

let recognition = null;
if (typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false; // Change to false to avoid looping
    recognition.interimResults = false;
    recognition.lang = "en-US";
} else {
    console.error("Speech Recognition is not supported in this browser.");
}

const Chat = () => {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [listening, setListening] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { theme } = useTheme();

    const speak = (text) => {
        console.log("Text-to-Speech Output:", text);
        const synth = window.speechSynthesis;
        if (synth.speaking) synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;
        synth.speak(utterance);
    };

    const handleBotResponse = async (userMessage) => {
        try {
            setLoading(true);
            const chatToken = localStorage.getItem("acessToken");
            console.log("chat Tokewn", chatToken);
            const response = await axios.post(
                `${API_END_POINT}/user/ai`,
                { message: userMessage },
                {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("accessToken")}` // Ensure token is correctly retrieved
                    }
                }
            );
            const fullReply = response.data.reply || "No response from bot.";
            const botMessage = { sender: "bot", text: fullReply };

            setChat((prev) => [...prev, botMessage]);
            speak(fullReply);
        } catch (error) {
            console.error("Error:", error);
            const errorMessage = { sender: "bot", text: "Something went wrong. Please try again later." };
            setChat((prev) => [...prev, errorMessage]);
            speak(errorMessage.text);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!message.trim()) return;
        const userMessage = { sender: "user", text: message };
        setChat((prev) => [...prev, userMessage]);
        await handleBotResponse(message);
        setMessage("");
    };

    const toggleListening = () => {
        if (!recognition) return;

        if (listening) {
            recognition.stop();
            setListening(false);
        } else {
            recognition.start();
            setListening(true);
        }
    };

    useEffect(() => {
        if (!recognition) return;

        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript;
            console.log("Speech Recognition Output:", transcript);
            setChat((prev) => [...prev, { sender: "user", text: transcript }]);
            handleBotResponse(transcript);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setListening(false);
            alert("There was an error with speech recognition. Please try again.");
        };

        recognition.onend = () => {
            console.log("Speech recognition stopped.");
            setListening(false);
        };

        return () => {
            if (recognition) recognition.stop();
        };
    }, []);

    return (
        <div className="max-w-2xl sm:max-h-[400px]">
            <Button 
                onClick={() => setIsOpen(true)} 
                className="fixed bottom-4 right-4 w-16 h-16 rounded-full bg-blue-600 dark:bg-blue-700 text-white shadow-lg z-50 hover:bg-blue-700 dark:hover:bg-blue-800"
            >
                <BsFillChatDotsFill />
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px] bg-background border border-gray-200 dark:border-gray-800 p-6 shadow-lg rounded-lg">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold text-blue-600 dark:text-blue-400">AI Support Assistant</DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                            Ask me anything about job searching or using Workify!
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="h-96 overflow-y-auto mb-4">
                        {chat.map((msg, index) => (
                            <motion.div
                                key={index}
                                className={`mb-3 ${msg.sender === "user" ? "text-right" : "text-left"}`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className={`inline-block p-2 rounded-xl ${
                                    msg.sender === "user" 
                                        ? "bg-blue-600 dark:bg-blue-700 text-white" 
                                        : "bg-gray-200 dark:bg-gray-800 text-foreground"
                                }`}>
                                    {msg.text}
                                </div>
                            </motion.div>
                        ))}
                    </ScrollArea>

                    <div className="flex items-center space-x-2">
                        <Input
                            type="text"
                            placeholder="Type your message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                            className="bg-background text-foreground border-gray-300 dark:border-gray-700"
                        />
                        <Button 
                            onClick={toggleListening} 
                            className={`${listening ? "animate-pulse bg-green-500 dark:bg-green-600" : "bg-red-500 dark:bg-red-600"} hover:bg-opacity-80`}
                        >
                            {listening ? <IoMdMic /> : <IoMdMicOff />}
                        </Button>
                        <Button 
                            onClick={sendMessage} 
                            className="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700" 
                            disabled={loading}
                        >
                            {loading ? "Sending..." : <IoIosSend />}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Chat;
