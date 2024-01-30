require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TEL_TOKEN;
const url = process.env.WEBHOOK_URL;
const port = process.env.PORT || 3000;

const bot = new TelegramBot(token);
bot.setWebHook(`${url}/bot${token}`);

const app = express();
app.use(bodyParser.json());

app.post(`/bot${token}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// Bot command: /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Welcome to Arun K Nair's Bot. How can I assist you?", {
        "reply_markup": {
            "inline_keyboard": [
                [{ text: "About Arun", callback_data: 'about_arun' }],
                [{ text: "Skills & Experience", callback_data: 'skills_experience' }],
                [{ text: "Services", callback_data: 'services' }],
                [{ text: "Career Highlights", callback_data: 'career_highlights' }],
                [{ text: "Contact & Social Media", callback_data: 'social' }],
                [{ text: "Portfolio", callback_data: 'portfolio' }]
            ]
        }
    });
});

// Bot callback query handling
bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;

    try {
        switch (callbackQuery.data) {
            case 'about_arun':
                await bot.sendMessage(chatId, "Arun K Nair: Aspiring Technologist & Lifelong Learner\n\n🌐 Passionate About Technology and Innovation...");
                break;
            case 'skills_experience':
                await bot.sendMessage(chatId, "🔍 My Path in Technology...\n\n💻 Technical Proficiency...");
                break;
            case 'services':
                await bot.sendMessage(chatId, "Services Offered by Arun...");
                break;
            case 'career_highlights':
                await bot.sendMessage(chatId, "🏅 Leadership and Professional Growth...");
                break;
            case 'social':
                sendSocialMediaLinks(chatId);
                break;
            case 'portfolio':
                await bot.sendMessage(chatId, "Explore Arun's Portfolio: https://arunknair.netlify.app/");
                break;
            // Additional cases for other commands...
            default:
                await bot.sendMessage(chatId, "Not sure what you're looking for? Type /start to see the menu options again.");
        }
    } catch (error) {
        console.error(error);
        await bot.sendMessage(chatId, "Oops, something went wrong.");
    }
});

// Function to send social media links
function sendSocialMediaLinks(chatId) {
    const replyMarkup = {
        "reply_markup": {
            "inline_keyboard": [
                [{ text: "Twitter", url: "https://twitter.com/ArunKNa94162991" }],
                [{ text: "GitHub", url: 'https://github.com/AKN414-IND' }],
                [{ text: "LinkedIn", url: 'https://www.linkedin.com/in/arunknair-/' }],
                [{ text: "Portfolio", url: 'https://arunknair.netlify.app/' }],
                [{ text: "Contact", callback_data: 'contact_info' }]
            ]
        }
    };
    bot.sendMessage(chatId, "Explore Arun's Social Media and Portfolio:", replyMarkup);
}
app.listen(port, () => {
    console.log(`Bot is listening on port ${port}`);
});