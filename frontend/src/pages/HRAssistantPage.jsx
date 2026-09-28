import React, { useState } from 'react';
import { api } from '../services/api';
import { MessageSquare, Send, Sparkles, BookOpen, AlertCircle, FileText, CornerDownRight } from 'lucide-react';

export default function HRAssistantPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hello! I am your HR Knowledge Assistant. I can answer inquiries regarding company policies, including leave entitlements, remote work (WFH), attendance rules, grievance redressal, and code of conduct. What would you like to know?",
      sources: ['leave policy', 'work from home policy', 'attendance policy', 'grievance policy', 'code of conduct'],
    }
  ]);

  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sampleQuestions = [
    "What is the annual paid vacation and sick leave policy?",
    "What is the hybrid work-from-home (WFH) policy?",
    "What is the formal employee grievance redressal process?",
    "What is the standard resignation notice period and code of conduct?",
    "What are the core working hours and attendance guidelines?"
  ];

  const handleAsk = async (queryText) => {
    const q = queryText || question;
    if (!q || !q.trim()) return;

    setError('');
    const userMessage = { role: 'user', text: q };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);

    try {
      const response = await api.askAssistant(q);
      const assistantMessage = {
        role: 'assistant',
        text: response.answer,
        sources: response.sources || [],
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err.message || 'Failed to retrieve policy response.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>
          HR Knowledge & Policy Assistant
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: 2 }}>
          Semantic RAG system querying organizational policies using Java TF-IDF vector retrieval and Gemini synthesis.
        </p>
      </div>

      {/* Suggested Inquiries */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700, color: '#64748b', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sparkles size={14} color="#7c3aed" /> Suggested Policy Questions:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {sampleQuestions.map((sq, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAsk(sq)}
              className="btn btn-secondary"
              style={{
                fontSize: '0.82rem',
                padding: '6px 12px',
                borderRadius: 20,
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                textAlign: 'left'
              }}
            >
              <CornerDownRight size={13} color="#2563eb" />
              {sq}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: 16 }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Chat Conversation Box */}
      <div className="chat-container">
        <div className="chat-history">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`chat-message ${m.role}`}
              style={{
                background: m.role === 'user' ? '#2563eb' : '#ffffff',
                border: m.role === 'assistant' ? '1px solid #e2e8f0' : 'none',
                boxShadow: m.role === 'assistant' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
              }}
            >
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{m.text}</div>

              {m.sources && m.sources.length > 0 && (
                <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <BookOpen size={12} /> Policy Citations & Sources:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                    {m.sources.map((s, sIdx) => (
                      <span
                        key={sIdx}
                        style={{
                          fontSize: '0.75rem',
                          background: '#f1f5f9',
                          color: '#475569',
                          padding: '2px 8px',
                          borderRadius: 4,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          border: '1px solid #e2e8f0'
                        }}
                      >
                        <FileText size={11} />
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="chat-message assistant" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: '0.88rem' }}>
                <Sparkles size={16} color="#7c3aed" className="animate-spin" />
                Retrieving policy documentation and generating answer...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          className="chat-input-bar"
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
        >
          <input
            type="text"
            className="form-input"
            placeholder="Ask a question about HR leave, attendance, remote work, grievance, or conduct policies..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !question.trim()}
            style={{ padding: '0 24px' }}
          >
            Ask
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
