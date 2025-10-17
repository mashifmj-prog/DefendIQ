/* API interactions and AI support */
const API_URLS = {
  grok: 'https://api.x.ai/v1/grok',
  openai: 'https://api.openai.com/v1/chat/completions',
  gemini: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent'
};
let selectedAPI = localStorage.getItem('defendiq_api') || 'grok';
const API_KEYS = {
  grok: localStorage.getItem('grok_api_key') || '',
  openai: localStorage.getItem('openai_api_key') || '',
  gemini: localStorage.getItem('gemini_api_key') || ''
};

const AFFIRMATIONS = {
  morning: [
    "Good morning, {name}! At {age}, you're ready to conquer the day with confidence! As a {maritalStatus} {gender} in {region}, your positivity is your shield. Remember, strong passwords protect your online world.",
    "Rise and shine, {name}! Your {maritalStatus} life in {region} is inspiring—start the day strong with a clear mind and secure habits. Enable MFA for extra peace of mind.",
    "Hello, {name}! At {age}, you're building a bright future in {region}. Keep that {gender} energy high this morning! Report suspicious activity to stay safe.",
    "Good morning, {name}! Let's kick off this day in {region} with energy. As a {age}-year-old {gender}, your {maritalStatus} path is bright—stay vigilant with cybersecurity.",
    "Rise and shine, {name}! Good morning! Your journey at {age} in {region} is unique and powerful. Embrace it with positivity and secure online practices."
  ],
  afternoon: [
    "Good afternoon, {name}! Keep shining at {age} in {region}—you're doing great as a {maritalStatus} {gender}! Use unique passwords for added security.",
    "Hey {name}, halfway through the day in {region}—stay strong and safe with your {maritalStatus} resilience! Enable MFA today.",
    "{name}, your {age}-year-old focus this afternoon is inspiring. As a {gender} in {region}, keep it up! Report suspicious activity.",
    "Good afternoon, {name}! Your {maritalStatus} life in {region} is thriving—stay positive and secure from threats.",
    "Hey {name}, at {age}, you're midway through a fantastic day in {region}. Your {gender} strength is admirable! Stay cautious online."
  ],
  evening: [
    "Good evening, {name}! Reflect on your wins today at {age} in {region}—you're unstoppable as a {maritalStatus} {gender}! Secure your night with MFA.",
    "Hey {name}, unwind with pride in your {maritalStatus} progress in {region}! Use strong passwords for peace of mind.",
    "{name}, evening vibes are perfect for relaxing at {age}. As a {gender} in {region}, stay secure with regular checks.",
    "Good evening, {name}! Your {maritalStatus} journey in {region} is full of achievements—celebrate them safely.",
    "Hey {name}, reflect on the day at {age}. Your {gender} resilience in {region} is inspiring! Report any suspicious activity."
  ],
  night: [
    "Good night, {name}! Rest well at {age} in {region}, knowing you're growing stronger every day as a {maritalStatus} {gender}. Secure your devices before bed.",
    "{name}, sleep tight and dream of crushing it tomorrow in {region}! Use MFA for peaceful nights.",
    "Night, {name}! Your {maritalStatus} resilience at {age} in {region} is your superpower. Stay safe.",
    "Good night, {name}! Recharge for tomorrow's adventures in {region}—you're amazing as a {gender}. Report suspicious activity.",
    "{name}, rest easy at {age}. Your {maritalStatus} journey in {region} is filled with potential. Stay secure."
  ]
};

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  if (hour < 20) return 'evening';
  return 'night';
}

function getSeason() {
  const month = new Date().getMonth();
  return month >= 2 && month <= 4 ? 'Spring' :
         month >= 5 && month <= 7 ? 'Winter' :
         month >= 8 && month <= 10 ? 'Summer' :
         'Autumn';
}

function assessKnowledge(userInput) {
  const keywords = {
    'password': ['password', 'passphrase', 'authentication', 'login'],
    'phishing': ['phishing', 'email', 'scam', 'suspicious link'],
    'deepfake': ['deepfake', 'fake video', 'altered media'],
    'reporting': ['report', 'incident', 'security issue'],
    'social engineering': ['social engineering', 'manipulation', 'trust'],
    'mfa': ['mfa', 'multi-factor', 'two-factor', '2fa'],
    'culture': ['culture', 'security awareness', 'workplace security']
  };
  let score = knowledgeLevel.score;
  let newKeywords = [...knowledgeLevel.keywords];

  Object.keys(keywords).forEach(module => {
    if (keywords[module].some(kw => userInput.toLowerCase().includes(kw))) {
      score += 10;
      if (!newKeywords.includes(module)) newKeywords.push(module);
    }
  });

  if (userInput.toLowerCase().includes('not ready') || userInput.toLowerCase().includes('unsure')) {
    score -= 5;
  }

  knowledgeLevel = { score: Math.max(0, score), keywords: newKeywords };
  localStorage.setItem('defendiq_knowledge', JSON.stringify(knowledgeLevel));
  return knowledgeLevel;
}

function recommendModule() {
  const availableModules = [
    'Key Message',
    'Deepfake Awareness',
    'Reporting Security Incidents',
    'Culture Survey',
    'Social Engineering',
    'Phishing Simulation',
    'Password Training'
  ];
  const completed = stats.badges;
  const uncompleted = availableModules.filter(m => !completed.includes(m));

  if (!uncompleted.length) return { module: null, message: "Wow, you've completed all modules! Review your progress or revisit a module to stay sharp!" };

  const { score, keywords } = knowledgeLevel;
  let recommended = uncompleted[0];
  let message = '';

  if (score < 30) {
    recommended = 'Key Message';
    message = `Based on our chats, you're building a great foundation! I recommend starting with the "Key Message" module to get a solid overview of cybersecurity basics. It's perfect for you right now!`;
  } else if (score < 60) {
    recommended = keywords.includes('phishing') ? 'Phishing Simulation' : 'Password Training';
    message = `You're picking up key concepts, ${userProfile.name}! I think you're ready for the "${recommended}" module to ${recommended === 'Phishing Simulation' ? 'practice spotting phishing attempts' : 'strengthen your password habits'}. Let's keep growing!`;
  } else {
    recommended = uncompleted.find(m => ['Deepfake Awareness', 'Social Engineering', 'Reporting Security Incidents'].includes(m)) || uncompleted[0];
    message = `You're doing amazing, ${userProfile.name}! With your knowledge, the "${recommended}" module will challenge you to ${recommended === 'Deepfake Awareness' ? 'spot advanced threats' : recommended === 'Social Engineering' ? 'understand manipulation tactics' : 'master incident reporting'}. You're ready for this!`;
  }

  if (keywords.includes('not ready') || keywords.includes('unsure')) {
    message += ` I know you might feel a bit hesitant, but you've shown great progress in our chats! This module is designed to be approachable, and I'll be here to support you every step of the way. You’ve got this!`;
  }

  return { module: recommended, message };
}

async function getAIAffirmation(userInput = '') {
  if (!API_KEYS[selectedAPI]) {
    const apiKey = prompt(`Enter your ${selectedAPI.toUpperCase()} API key:`);
    if (apiKey) {
      localStorage.setItem(`${selectedAPI}_api_key`, apiKey);
      API_KEYS[selectedAPI] = apiKey;
    } else {
      return 'Please provide an API key for AI support. Redirecting to https://x.ai/api for details.';
    }
  }

  try {
    const knowledge = assessKnowledge(userInput);
    const recommendation = recommendModule();
    const prompt = `You are a positive, affirming digital friend. User profile: Name - ${userProfile.name}, Age - ${userProfile.age}, Marital Status - ${userProfile.maritalStatus}, Gender - ${userProfile.gender}, Region - ${userProfile.region}. Time: ${getTimeOfDay()}. Season: ${getSeason()}. User message: "${userInput}". Knowledge score: ${knowledge.score}, Keywords: ${knowledge.keywords.join(', ')}. Respond encouragingly, assess their knowledge, recommend a module (${recommendation.module || 'none'}) with positive reasoning if they're hesitant, and include a subtle cybersecurity tip. Keep it positive, never negative.`;
    const response = await fetch(API_URLS[selectedAPI], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEYS[selectedAPI]}`
      },
      body: JSON.stringify({
        model: selectedAPI === 'grok' ? 'grok-beta' : selectedAPI === 'openai' ? 'gpt-4o-mini' : 'gemini-1.5-flash-latest',
        messages: [{
          role: 'system',
          content: 'You are a positive, affirming digital friend.'
        }, {
          role: 'user',
          content: prompt
        }]
      })
    });
    if (!response.ok) throw new Error('AI API request failed');
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (err) {
    console.error('AI affirmation failed:', err);
    return 'AI support unavailable. Using standard affirmation.';
  }
}
