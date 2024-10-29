import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const openai = new OpenAI();

const response = openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0,
    messages: [{
        role: 'system',
        content: 'You are ukrainian'
    },
    {
        role: 'user',
        content: 'Привіт, ти розумієш українську мову?'
    }]
});

response.then((data) => {
    console.log("🚀 ~ response.then ~ data:", data.choices);
})