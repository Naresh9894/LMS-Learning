import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { theme } from './hooks/useAnimationVariants'

const Chatbot = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hey there! 👋 I'm your SmartLearn Hub Assistant. Ask me about courses, enrollments, or anything else!",
      timestamp: new Date().toISOString()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => { scrollToBottom() }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus()
  }, [isOpen])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return
    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, {
      role: 'user', content: userMessage, timestamp: new Date().toISOString()
    }])
    setIsLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chatbot/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, userId: userId || null, conversationId })
      })
      const data = await response.json()
      if (data.conversationId && !conversationId) setConversationId(data.conversationId)
      setMessages(prev => [...prev, {
        role: 'assistant', content: data.response,
        courses: data.courses ?? [], timestamp: data.timestamp
      }])
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I couldn't process that. Please try again.",
        timestamp: new Date().toISOString()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const clearChat = async () => {
    if (conversationId) {
      try {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chatbot/clear`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId })
        })
      } catch (error) { console.error('Clear error:', error) }
    }
    setMessages([{
      role: 'assistant',
      content: "Hey there! 👋 I'm your SmartLearn Hub Assistant. Ask me about courses, enrollments, or anything else!",
      timestamp: new Date().toISOString()
    }])
    setConversationId(null)
  }

  return createPortal(
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>

      {/* ── FAB Button ── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '60px', height: '60px', borderRadius: '50%',
            background: theme.gradients.gold,
            boxShadow: '0 8px 24px rgba(212,168,67,0.45)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.1)'
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(212,168,67,0.6)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(212,168,67,0.45)'
          }}
        >
          <svg width="26" height="26" fill="none" stroke={theme.navy.deepest} viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}

      {/* ── Chat Window ── */}
      {isOpen && (
        <div style={{
          width: '384px', height: '600px', borderRadius: '16px',
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
          background: theme.navy.mid,
          border: '1px solid rgba(212,168,67,0.25)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
        }}>

          {/* Header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 18px', flexShrink: 0,
            background: `linear-gradient(135deg, ${theme.navy.soft}, ${theme.navy.mid})`,
            borderBottom: '1px solid rgba(212,168,67,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'rgba(212,168,67,0.1)',
                border: '1.5px solid rgba(212,168,67,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px',
              }}>🤖</div>
              <div>
                <p style={{
                  color: theme.text.primary, fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 600, fontSize: '15px', margin: 0,
                }}>SmartLearn Hub Assistant</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80' }} />
                  <p style={{ color: theme.text.muted, fontSize: '11px', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>Online</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={clearChat} title="Clear chat"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '7px', borderRadius: '8px', color: theme.text.muted,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,168,67,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button onClick={() => setIsOpen(false)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '7px', borderRadius: '8px', color: theme.text.muted,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,168,67,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '16px',
            background: theme.navy.deepest,
            backgroundImage: `radial-gradient(circle, rgba(212,168,67,0.03) 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
            display: 'flex', flexDirection: 'column', gap: '12px',
          }}>
            {messages.map((msg, index) => (
              <div key={index}>
                <div style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '82%', padding: '10px 14px',
                    borderRadius: '16px',
                    borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                    borderBottomLeftRadius: msg.role === 'user' ? '16px' : '4px',
                    fontFamily: "'DM Sans', sans-serif",
                    ...(msg.role === 'user' ? {
                      background: theme.gradients.gold,
                      color: theme.navy.deepest,
                    } : {
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(212,168,67,0.12)',
                      color: theme.text.primary,
                    }),
                  }}>
                    <p style={{ fontSize: '13px', whiteSpace: 'pre-wrap', lineHeight: 1.5, margin: 0 }}>
                      {msg.content}
                    </p>
                    <p style={{
                      fontSize: '10px', marginTop: '4px', marginBottom: 0, opacity: 0.55,
                      color: msg.role === 'user' ? theme.navy.deepest : theme.text.muted,
                    }}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {/* Course Cards */}
                {msg.courses && msg.courses.length > 0 && (
                  <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {msg.courses.map((course) => (
                      <div key={course._id}
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(212,168,67,0.2)',
                          borderRadius: '12px', padding: '12px',
                          transition: 'box-shadow 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(212,168,67,0.15)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                      >
                        <div style={{ display: 'flex', gap: '10px' }}>
                          {course.image && (
                            <img src={course.image} alt={course.title} style={{
                              width: '52px', height: '52px', borderRadius: '8px',
                              objectFit: 'cover', border: '1px solid rgba(212,168,67,0.2)', flexShrink: 0,
                            }} />
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{
                              fontWeight: 600, fontSize: '13px', color: theme.text.primary,
                              margin: '0 0 2px', fontFamily: "'DM Sans', sans-serif",
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>{course.title}</p>
                            <p style={{
                              fontSize: '11px', color: theme.text.muted,
                              margin: '0 0 6px', fontFamily: "'DM Sans', sans-serif",
                            }}>{course.description}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontWeight: 700, fontSize: '13px', color: theme.gold.bright }}>
                                ${course.price}
                              </span>
                              <span style={{
                                fontSize: '10px', padding: '2px 8px', borderRadius: '999px',
                                color: theme.gold.bright,
                                background: 'rgba(212,168,67,0.1)',
                                border: '1px solid rgba(212,168,67,0.2)',
                              }}>{course.level || 'All levels'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing dots */}
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(212,168,67,0.12)',
                  borderRadius: '16px', borderBottomLeftRadius: '4px',
                  padding: '12px 16px', display: 'flex', gap: '5px', alignItems: 'center',
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: '7px', height: '7px', borderRadius: '50%',
                      background: theme.gold.bright,
                      animation: `chatDot 0.8s ${i * 0.15}s infinite ease-in-out`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '14px 16px', flexShrink: 0,
            background: theme.navy.mid,
            borderTop: '1px solid rgba(212,168,67,0.15)',
          }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                disabled={isLoading}
                style={{
                  flex: 1, borderRadius: '999px', padding: '9px 16px', fontSize: '13px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(212,168,67,0.2)',
                  color: theme.text.primary,
                  fontFamily: "'DM Sans', sans-serif",
                  outline: 'none', caretColor: theme.gold.bright,
                  opacity: isLoading ? 0.6 : 1,
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(212,168,67,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(212,168,67,0.2)'}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                style={{
                  width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0, border: 'none',
                  background: !input.trim() || isLoading ? 'rgba(212,168,67,0.15)' : theme.gradients.gold,
                  cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: !input.trim() || isLoading ? theme.text.muted : theme.navy.deepest,
                  transition: 'background 0.2s, transform 0.15s',
                }}
                onMouseEnter={e => { if (input.trim() && !isLoading) e.currentTarget.style.transform = 'scale(1.08)' }}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p style={{
              fontSize: '11px', textAlign: 'center', marginTop: '8px', marginBottom: 0,
              color: theme.text.muted, fontFamily: "'DM Sans', sans-serif",
            }}>Powered by AI · Enter to send</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatDot {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  , document.body)
}

export default Chatbot

