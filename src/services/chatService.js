
// Mock API service - ready to swap to real API later
export const API_MODE = 'mock'; // Change to 'real' when ready

// Mock travel tips for travel-related queries
const travelTips = {
  'travel planning': 'Here are some travel planning essentials: 1) Research your destination thoroughly, 2) Book flights and accommodation early, 3) Check visa requirements, 4) Get travel insurance, 5) Create a flexible itinerary!',
  'packing list': 'Essential packing items: passport/ID, comfortable walking shoes, weather-appropriate clothing, phone charger, medications, travel adapter, and a small first-aid kit. Don\'t forget to pack light!',
  'budget travel': 'Budget travel tips: Use public transportation, stay in hostels or budget hotels, cook your own meals when possible, look for free activities and attractions, and travel during off-peak seasons.',
  'weekend trip': 'Perfect weekend trip ideas: Choose destinations within 2-3 hours travel time, pack light with just a carry-on, plan 2-3 main activities, book accommodation in advance, and don\'t over-schedule!'
};

// Generate a simple session ID
const generateSessionId = () => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Simulate network latency
const simulateLatency = () => {
  return new Promise(resolve => {
    const delay = 600 + Math.random() * 900; // 600-1500ms
    setTimeout(resolve, delay);
  });
};

// Mock message processing
const generateMockReply = (message) => {
  const lowerMessage = message.toLowerCase();

  // Greetings
  if (lowerMessage.match(/\b(hi|hello|hey|greetings)\b/)) {
    return "Hey! How can I help you today? 😊";
  }

  // Comparison queries
  if (lowerMessage.match(/\b(vs|versus|or|compare|comparison)\b/) && lowerMessage.includes(' ')) {
    const parts = lowerMessage.split(/\b(vs|versus|or|compare|comparison)\b/);
    if (parts.length >= 2) {
      return `(mock) Here are some factors to compare these options:\n\n• **Performance**: Consider speed, efficiency, and reliability\n• **Cost**: Initial investment vs long-term value\n• **User Experience**: Ease of use and learning curve\n• **Support**: Documentation and community resources\n\nWould you like me to dive deeper into any specific aspect?`;
    }
  }

  // Quick facts queries
  if (lowerMessage.match(/\b(phone|address|hours|email|contact)\b.*\bof\b/)) {
    return "(mock) I'd look up that contact information and return it here. In a real implementation, I'd search through a database or call an API to get the most current details.";
  }

  // Travel-related queries
  for (const [key, tip] of Object.entries(travelTips)) {
    if (lowerMessage.includes(key)) {
      return tip;
    }
  }

  // Image requests
  if (lowerMessage.match(/\b(image|photo|picture)\s+of\b/)) {
    const subject = lowerMessage.replace(/.*\b(image|photo|picture)\s+of\s+/, '').trim();
    const slug = subject.replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '');
    return `Here's an image of ${subject}:\n\nImage: https://picsum.photos/seed/${slug}/800/480`;
  }

  // Code examples
  if (lowerMessage.includes('code') || lowerMessage.includes('example')) {
    return `Here's a simple example:\n\n\`\`\`javascript\nfunction greet(name) {\n  return \`Hello, \${name}! Welcome to the chat.\`;\n}\n\nconsole.log(greet('User'));\n\`\`\`\n\nThis demonstrates basic JavaScript function syntax with template literals.`;
  }

  // Default response
  return `You said: "${message}" — (mock reply)\n\n💡 **Quick tip**: Try asking about travel planning, comparisons, or request an image of something! I'm running in mock mode but ready to connect to real AI services.`;
};

// Main mock service function
export async function sendMessage({ message, sessionId }) {
  await simulateLatency();

  // Generate session ID if not provided
  const currentSessionId = sessionId || generateSessionId();

  // Generate mock reply
  const reply = generateMockReply(message);

  return {
    session_id: currentSessionId,
    message: message,
    reply: reply
  };
}

// To use real API later:
// export const API_MODE = 'real';
// export async function sendMessage({ message, sessionId }) {
//   const res = await fetch('https://ai-chat-hbt3.onrender.com/chat', {
//     method: 'POST',
//     headers: {'Content-Type':'application/json'},
//     body: JSON.stringify({ message, session_id: sessionId })
//   });
//   if (!res.ok) throw new Error('Network error');
//   return await res.json();
// }
