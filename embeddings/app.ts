import dotenv from 'dotenv';
import OpenAI from 'openai';
import fs from 'fs';
import pdf from '@cyber2024/pdf-parse-fixed';
import { Document, serviceContextFromDefaults, storageContextFromDefaults, TextNode, VectorStoreIndex } from 'llamaindex';

dotenv.config({path: '../.env'});

const buffer = fs.readFileSync('./thesis.pdf');
const parsedPDF = await pdf(buffer);

const serviceContext = serviceContextFromDefaults({
    chunkSize: 4000,
    chunkOverlap: 500
});
const storageContext = await storageContextFromDefaults({
    persistDir: './storage'
})
const document = new Document({ text: parsedPDF.text });

console.log('creating index');
const index = await VectorStoreIndex.fromDocuments([document], {serviceContext, storageContext});
console.log('index created', index);

const query = 'Which technologies can be used to solve congestion at airports?';

const retriever = index.asRetriever();

const matchingNodes = await retriever.retrieve(query);
console.log('matchingNodes', matchingNodes);

const knowledge = matchingNodes.map((node) => {
    const textNode = node.node as TextNode;

    return textNode.text;
}).join(' ');

console.log(knowledge);

const openai = new OpenAI();

const responseList = openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0,
    messages: [
        {
            role: 'system',
            content: `You are an aviation expert. Here is your knowledge to answer the user's question: ${knowledge}`
        },
        {
            role: 'user',
            content: query
        }
    ]
});

responseList.then((data) => {
    console.log("🚀 ~ response.then ~ data:", data.choices[0]);
})
