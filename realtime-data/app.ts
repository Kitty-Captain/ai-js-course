import dotenv from 'dotenv';
import OpenAI from 'openai';
import { getProductId } from './lib/get-product-id.js';

dotenv.config({path: '../.env'});

const openai = new OpenAI();

type RecommendProps = { description: string };
const functions: any = {
    async recommendProduct(obj: RecommendProps) {
        console.log('Recommend product function called by OpenAI', obj.description);
        const productId = await getProductId(obj.description);

        return productId;
    }
}
const responseList = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0,
    messages: [{
        role: 'system',
        content: 'You are a helpful assistant that recommends products to users.'
    },
    {
        role: 'user',
        content: 'I\'m looking for a pair of running shoes'
    }],
    functions: [
        {
            name: 'recommendProduct',
            description: 'Takes a short description and returns a recommended product',
            parameters: {
                type: 'object',
                properties: {
                    description: {
                        type: 'string',
                        description: 'A short description of the product the user is looking for, ideally a copy paste from the user`s message'
                    }
                }
            }
        }
    ]
});

console.log("🚀 ~ response.then ~ data:", responseList.choices[0]);

const {function_call} = responseList.choices[0].message;

if (function_call) {
    const fn = functions[function_call.name];
    const args = JSON.parse(function_call.arguments);
    const result = await fn(args);

    console.log('Result', result);
}
