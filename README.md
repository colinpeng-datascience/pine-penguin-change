# Pine Penguin Change

A Chrome extension that completely transform your browsing experience with ChatGPT. 
Every text can be changed! Any way you like! All you have to do is give us a prompt and we will customize everything online for you.

## Install

First clone this repo on your local machine

Then install dependencies

```bash
npm install
```

Copy `.env-example` into a new file named `.env` and add your ChatGPT API Key.

Run the server so the extension can communicate with ChatGPT.

```bash
node server.js
```

This will automate interaction with ChatGPT through OpenAI's API, thanks to the [chatgpt-api](https://github.com/transitive-bullshit/chatgpt-api) library.

Add the extension

1. Go to chrome://extensions in your Google Chrome browser
2. Check the Developer mode checkbox in the top right-hand corner
3. Click "Load Unpacked" to see a file-selection dialog
4. Select your local `chatgpt-chrome-extension/extension` directory

## User Guide

1. Go to the option page by right click on the logo and click option
2. Input how you would like your website contents to be changed.
    example prompt could be 
    
    `Make things more suitable to teenagers.` 
3. Start browsing regularly and enjoy the customized experience.
4. If you wish to stop, come back to the option page and clear the prompt.

## Troubleshooting

If ChatGPT is taking a very long time to respond or not responding at all then it could mean that their servers are currently overloaded. You can confirm this by going to [chat.openai.com/chat](https://chat.openai.com/chat) and seeing whether their website works directly.

## Prompts

There are tons of different options. The only limit is your imagenation! 

Example prompt could be: 

`Make things more suitable to teenagers.` 

`Rewrite in grade 10 level vocabulary.` 

`Make everything funny.` 

`Change everything to Chinese` 

## Related
Huge thanks to <a href="https://twitter.com/gabe_ragland">Gabe</a> for creating [ChatGPT Chrome Extension](https://github.com/gragland/chatgpt-chrome-extension)

Huge thanks to <a href="https://twitter.com/transitive_bs">Travis Fischer</a> for creating [chatgpt-api](https://github.com/transitive-bullshit/chatgpt-api)

## License

MIT © Pine Peng (follow me on <a href="https://github.com/colinpeng-datascience">Github</a>)
