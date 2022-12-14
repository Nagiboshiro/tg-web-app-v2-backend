const TelegramBot = require('node-telegram-bot-api');
const express = require('express')
const cors = require('cors')


const token = '5490204105:AAE5vE-WFchaKaXPWhGWDOYeL1E74koedQw'
const webAppUrl = 'https://creative-twilight-f458e1.netlify.app'

const bot = new TelegramBot(token, {polling: true});
const app = express()

app.use(express.json())
app.use(cors())

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '/start') {
        await bot.sendMessage(chatId, 'Заполни форму', {
            reply_markup: {
                keyboard: [
                    [{text: 'Заполни форму', web_app: {url: webAppUrl + '/form/'}}]
                ]
            }
        })
        await bot.sendMessage(chatId, 'Заходи в наш интернет магазин по кнопке', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Сделать заказ', web_app: {url: webAppUrl}}]
                ]
            }
        })

    }

    if (msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data)

            await bot.sendMessage(chatId, "Спасибо за обратную связь")
            await bot.sendMessage(chatId, "Ваша страна:" + data?.country)
            await bot.sendMessage(chatId, "Ваша улица:" + data?.street)

            setTimeout(async () => {
                await bot.sendMessage(chatId, "More info")

            }, 3000)

        } catch (e) {
            console.log(e)
        }
    }

    bot.sendMessage(chatId, 'Received your message' + chatId);
});

const PORT = 8000;

app.post('/data', async (req, res) => {
    const {queryId, products, totalPrice} = req.body;

    await bot.answerWebAppQuery(queryId, {
        type: 'article',
        id: queryId,
        title: 'Успешная покупка',
        input_message_content: {
            message_text: 'Вы приобрели товар на сумму' + totalPrice
        }
    })

    return res.status(200).json({});

})

app.listen(PORT, () => console.log('server start on port ' + PORT))