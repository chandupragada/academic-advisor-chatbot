const { useState, useRef, useEffect } = React;

// Simple SVG icon components
const SendIcon = () => (
  React.createElement('svg', {
    className: 'w-5 h-5',
    fill: 'none',
    stroke: 'currentColor',
    viewBox: '0 0 24 24'
  }, React.createElement('path', {
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 2,
    d: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
  }))
);

const BookOpenIcon = () => (
  React.createElement('svg', {
    className: 'w-5 h-5',
    fill: 'none',
    stroke: 'currentColor',
    viewBox: '0 0 24 24'
  }, React.createElement('path', {
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 2,
    d: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
  }))
);

const GraduationCapIcon = () => (
  React.createElement('svg', {
    className: 'w-6 h-6',
    fill: 'none',
    stroke: 'currentColor',
    viewBox: '0 0 24 24'
  }, React.createElement('path', {
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 2,
    d: 'M12 14l9-5-9-5-9 5 9 5z'
  }), React.createElement('path', {
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 2,
    d: 'M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z'
  }), React.createElement('path', {
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 2,
    d: 'M12 14v7'
  }))
);

const CalendarIcon = () => (
  React.createElement('svg', {
    className: 'w-5 h-5',
    fill: 'none',
    stroke: 'currentColor',
    viewBox: '0 0 24 24'
  }, React.createElement('path', {
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 2,
    d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
  }))
);

function AcademicAdvisorChatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your Rowan University academic advisor assistant. I can help you with course selection, major requirements, academic planning, and graduation timelines. What would you like to discuss today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickPrompts = [
    { icon: BookOpenIcon, text: "What courses should I take?", prompt: "I need help selecting courses for next semester" },
    { icon: GraduationCapIcon, text: "Major requirements", prompt: "Can you explain the requirements for my major?" },
    { icon: CalendarIcon, text: "Academic planning", prompt: "Help me plan my academic schedule for graduation" }
  ];

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      // 1. Prepare the conversation history for the backend
      const systemInstruction = `You are an expert academic advisor specifically for Rowan University students, helping with course selection, major requirements, and academic planning.

ROWAN GRADUATE CONTEXT:
- Location: Glassboro, NJ & Rowan Global (Online/Hybrid)
- Full-Time Status: Typically 9 credits per semester (vs 12 for undergrads)
- Degree Requirements: Usually 30-36 credits for a Master's degree
- Course Levels: 500-level, 600-level, and 700-level courses
- Registration: Self-Service Banner (SelfService) & Rowan Global
- Grading: GPA must often stay above 3.0 to remain in good standing

YOUR RESPONSIBILITIES:
- Assist with course selection for Master's programs (e.g., MBA, Computer Science, Engineering, Education)
- Explain the difference between Thesis tracks, Project tracks, and Exam tracks
- Help plan "Program of Study" (Core courses vs. Electives)
- Advise on 4+1 programs (Accelerated Bachelor's to Master's) if asked
- Explain policies on transfer credits (usually limited to 6-9 credits) and time limits for degree completion (usually 6 years)
- Support students with registration overrides and prerequisite checks

ADVISING STYLE:
- Be professional and encouraging.
- Ask about their specific program (e.g., "Are you in the MBA program or MS in Computer Science?")
- Ask if they are Full-time (9+ credits) or Part-time.
- Ask if they are planning a Thesis or Capstone project.
- Reference "Rowan Global" or the "Office of Graduate Studies" for specific forms.`;

      const geminiContents = [];
      
      // Convert history
      for (let i = 1; i < updatedMessages.length; i++) {
        const msg = updatedMessages[i];
        geminiContents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      }
      
      // Add system instruction to the first message
      if (geminiContents.length > 0 && geminiContents[0].role === 'user') {
        geminiContents[0].parts[0].text = systemInstruction + '\n\n' + geminiContents[0].parts[0].text;
      }

      // 2. CALL BACKEND (Python Server)
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          history: geminiContents 
        })
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data = await response.json();
      
      // 3. Handle the response
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format');
      }

      const assistantMessage = {
        role: 'assistant',
        content: data.candidates[0].content.parts[0].text
      };

      setMessages([...updatedMessages, assistantMessage]);

    } catch (error) {
      console.error('Error:', error);
      setMessages([...updatedMessages, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Make sure your Python backend server is running!'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (prompt) => {
    setInput(prompt);
  };

  return React.createElement('div', { className: 'flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-50' },
    // Header
    React.createElement('div', { className: 'bg-white border-b border-gray-200 px-6 py-4 shadow-sm' },
      React.createElement('div', { className: 'flex items-center gap-3' },
        React.createElement('div', { className: 'bg-yellow-500 p-2 rounded-lg' },
          React.createElement(GraduationCapIcon)
        ),
        React.createElement('div', {},
          React.createElement('h1', { className: 'text-xl font-bold text-amber-900' }, 'Rowan University Academic Advisor'),
          React.createElement('p', { className: 'text-sm text-gray-600' }, 'Course selection & academic planning assistant')
        )
      )
    ),

    // Messages
    React.createElement('div', { className: 'flex-1 overflow-y-auto px-4 py-6' },
      React.createElement('div', { className: 'max-w-3xl mx-auto space-y-4' },
        messages.map((msg, idx) =>
          React.createElement('div', {
            key: idx,
            className: `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`
          },
            React.createElement('div', {
              className: `max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-900 shadow-sm border border-gray-200'
              }`
            },
              React.createElement('p', { className: 'whitespace-pre-wrap' }, msg.content)
            )
          )
        ),
        loading && React.createElement('div', { className: 'flex justify-start' },
          React.createElement('div', { className: 'bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200' },
            React.createElement('div', { className: 'flex gap-1' },
              React.createElement('div', {
                className: 'w-2 h-2 bg-gray-400 rounded-full animate-bounce',
                style: { animationDelay: '0ms' }
              }),
              React.createElement('div', {
                className: 'w-2 h-2 bg-gray-400 rounded-full animate-bounce',
                style: { animationDelay: '150ms' }
              }),
              React.createElement('div', {
                className: 'w-2 h-2 bg-gray-400 rounded-full animate-bounce',
                style: { animationDelay: '300ms' }
              })
            )
          )
        ),
        React.createElement('div', { ref: messagesEndRef })
      )
    ),

    // Quick Prompts
    messages.length === 1 && React.createElement('div', { className: 'px-4 pb-4' },
      React.createElement('div', { className: 'max-w-3xl mx-auto' },
        React.createElement('p', { className: 'text-sm text-gray-600 mb-3 text-center' }, 'Quick start:'),
        React.createElement('div', { className: 'grid grid-cols-3 gap-2' },
          quickPrompts.map((item, idx) =>
            React.createElement('button', {
              key: idx,
              onClick: () => handleQuickPrompt(item.prompt),
              className: 'flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all'
            },
              React.createElement(item.icon),
              React.createElement('span', { className: 'text-xs text-gray-700 text-center' }, item.text)
            )
          )
        )
      )
    ),

    // Input
    React.createElement('div', { className: 'border-t border-gray-200 bg-white px-4 py-4' },
      React.createElement('div', { className: 'max-w-3xl mx-auto flex gap-2' },
        React.createElement('input', {
          type: 'text',
          value: input,
          onChange: (e) => setInput(e.target.value),
          onKeyPress: (e) => e.key === 'Enter' && handleSend(),
          placeholder: 'Ask about courses, requirements, or academic planning...',
          className: 'flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
          disabled: loading
        }),
        React.createElement('button', {
          onClick: handleSend,
          disabled: loading || !input.trim(),
          className: 'bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2'
        },
          React.createElement(SendIcon)
        )
      )
    )
  );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(AcademicAdvisorChatbot));