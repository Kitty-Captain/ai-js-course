import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config({path: '../.env'});

const openai = new OpenAI();

const responseList = openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0,
    messages: [{
        role: 'system',
        content: `Create a list for a task that user will ask you.
        Don't and any other text.
        Respond in JSON strictly following this schema:
        {
            tasks: {
                title: string,
                description: string,
                difficulty: 'easy', 'medium', 'hard'
            }[]
        }
        `
    },
    {
        role: 'user',
        content: 'How can i create a website?'
    }]
});

responseList.then((data) => {
    console.log("🚀 ~ response.then ~ data:", JSON.parse(data.choices[0].message.content as string));
})



type Params = {n1: number, n2: number, n3: number};

const addAndMultiply = ({n1, n2, n3}: Params) => {
    const result = n1 + n2 * n3;

    console.log(`${n1} + ${n2} * ${n3} =`, result);
}

const functions: any = {
    addAndMultiply
};

const responseFunc = openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0,
    messages: [{
        role: 'system',
        content: 'You are a smart calculator'
    },
    {
        role: 'user',
        content: 'What is 2 plus 2 multiplied by 2'
    }],
    functions: [{
        name: 'addAndMultiply',
        description: 'Adds and multiplies 3 numbers',
        parameters: {
            type: 'object',
            properties: {
                n1: {type: 'number'},
                n2: {type: 'number'},
                n3: {type: 'number'},
            }
        }
    }]
});

responseFunc.then((data) => {
    console.log("🚀 ~ response.then ~ data:", data.choices[0]);
    const {function_call} = data.choices[0].message;

    if (function_call) {
        const {name, arguments: args} = function_call;
        const func = functions[name];

        func?.(JSON.parse(args));
    }
})