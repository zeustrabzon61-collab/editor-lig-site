import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Trash2 } from 'lucide-react';
import { getCurrentUser, getGlobalChat, addGlobalChatMessage, deleteGlobalChatMessage } from '../utils/storage';

const GlobalChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const user = getCurrentUser();
  const isAdmin = localStorage.getItem('pso_admin_auth') === 'true';
  const chatEndRef = useRef(null);

  const loadChat = () => {
    setMessages(getGlobalChat());
  };

  useEffect(() => {
    loadChat();
    // Chat her 5 saniyede bir güncellensin (basit polling)
    const interval = setInterval(loadChat, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!inputText.trim() || !user) return;
    addGlobalChatMessage(user, inputText);
    setInputText('');
    loadChat();
  };

  const handleDelete = (id) => {
    if (!isAdmin) return;
    deleteGlobalChatMessage(id);
    loadChat();
  };

  return (
    <div className="global-chat-container">
      {/* Toggle Button */}
      <button 
        className="chat-toggle-btn animate-float"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window glass-card animate-scale-in">
          <div className="chat-header">
            <h3>Genel Sohbet</h3>
            <span className="online-indicator">Canlı</span>
          </div>

          <div className="chat-messages">
            {messages.length > 0 ? messages.map((m) => (
              <div key={m.id} className={`chat-msg ${user && m.user === user.psoUsername ? 'own-msg' : ''}`}>
                <div className="msg-avatar">
                  {m.avatar ? <img src={m.avatar} alt="" /> : <User size={12} />}
                </div>
                <div className="msg-content">
                  <div className="msg-info">
                    <span className="msg-user">{m.user}</span>
                    <span className="msg-time">{new Date(m.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {isAdmin && (
                      <button onClick={() => handleDelete(m.id)} className="delete-msg-btn">
                        <Trash2 size={10} />
                      </button>
                    )}
                  </div>
                  <p className="msg-text">{m.text}</p>
                </div>
              </div>
            )) : (
              <div className="no-msgs">Henüz mesaj yok. İlk yazan sen ol!</div>
            )}
            <div ref={chatEndRef} />
          </div>

          {user ? (
            <div className="chat-input-area">
              <input 
                type="text" 
                placeholder="Mesajınızı yazın..." 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button onClick={handleSend} className="chat-send-btn">
                <Send size={18} />
              </button>
            </div>
          ) : (
            <div className="chat-login-prompt">
              Mesaj yazmak için giriş yapmalısınız.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalChat;
