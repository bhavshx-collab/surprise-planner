import { useEffect, useState, useRef } from "react";
import { supabase } from "./supabase";

export default function EventChat({ eventId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Fetch initial messages and subscribe to new ones
  useEffect(() => {
    if (!eventId) return;

    const fetchMessages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("event_messages")
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        setMessages(data || []);
      }
      setLoading(false);
      scrollToBottom();
    };

    fetchMessages();

    // Subscribe to real-time inserts for this specific event's chat
    const channel = supabase
      .channel(`chat_${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "event_messages",
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const msgText = newMessage.trim();
    setNewMessage(""); // Optimistic UI clear

    const { error } = await supabase.from("event_messages").insert([
      {
        event_id: eventId,
        user_id: currentUser.id || currentUser.user_id,
        user_name: currentUser.name || currentUser.email?.split("@")[0] || "Anonymous",
        message: msgText,
      },
    ]);

    if (error) {
      console.error("Error sending message:", error);
      // Optional: show a toast here if you pass it down
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "var(--text-3)" }}>
        Loading chat...
      </div>
    );
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "400px", background: "var(--bg-1)",
      border: "1px solid var(--border)", borderRadius: "var(--radius)",
      overflow: "hidden"
    }}>
      {/* Chat Header */}
      <div style={{
        padding: "16px", background: "var(--bg-2)", borderBottom: "1px solid var(--border)",
        fontFamily: "'Outfit', sans-serif", fontSize: "16px", fontWeight: "500", color: "var(--accent-primary)"
      }}>
        Adventure Group Chat
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: "center", color: "var(--text-3)", fontSize: "14px", marginTop: "40px" }}>
            No messages yet. Say hi to your fellow adventurers! 👋
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.user_id === (currentUser?.id || currentUser?.user_id);
            return (
              <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
                {!isMe && (
                  <span style={{ fontSize: "11px", color: "var(--text-3)", marginBottom: "4px", marginLeft: "4px" }}>
                    {msg.user_name}
                  </span>
                )}
                <div style={{
                  maxWidth: "80%", padding: "10px 14px",
                  background: isMe ? "var(--accent-primary)" : "var(--bg-2)",
                  color: isMe ? "#000" : "var(--text-1)",
                  borderRadius: isMe ? "12px 12px 0 12px" : "12px 12px 12px 0",
                  fontSize: "14px", lineHeight: "1.5"
                }}>
                  {msg.message}
                </div>
                <span style={{ fontSize: "10px", color: "var(--text-3)", marginTop: "4px" }}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} style={{
        display: "flex", gap: "10px", padding: "16px", borderTop: "1px solid var(--border)", background: "var(--bg-2)"
      }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={!currentUser}
          style={{
            flex: 1, padding: "12px 16px", borderRadius: "50px", border: "1px solid var(--border)",
            background: "var(--bg-1)", color: "var(--text-1)", fontFamily: "'Inter', sans-serif", fontSize: "14px", outline: "none"
          }}
        />
        <button
          type="submit"
          disabled={!newMessage.trim() || !currentUser}
          style={{
            padding: "0 24px", borderRadius: "50px", border: "none",
            background: "var(--accent-primary)", color: "#000", fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: "600",
            cursor: (!newMessage.trim() || !currentUser) ? "not-allowed" : "pointer",
            opacity: (!newMessage.trim() || !currentUser) ? 0.5 : 1, transition: "opacity 0.2s"
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
