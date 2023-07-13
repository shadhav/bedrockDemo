import React, { useState, useEffect } from 'react';

const ChatbotApp = (props) => {
    const [chatMessages, setChatMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isBuffering, setIsBuffering] = useState(false)
    const [apiMethod, setApiMethod] = useState('/api/call-python4')
    const [selectedModel, setSelectedModel] = useState('')

    useEffect(() => {
        // Code to run after component has mounted
        if (props.ai21Messages.length === 0) {
            setChatMessages([
                { author: `${props.modelSelected.split(':')[1]} Bot`, message: `Welcome to the ${props.modelSelected} Chatbot!` }
            ])
        } else {
            setChatMessages(props.ai21Messages)
        }

        
        setSelectedModel(props.modelSelected)
    }, [props.modelSelected, props.ai21Messages, props.setAi21Messages]);

    const sendMessage = () => {
        setIsBuffering(true);
        const messageElement = {
            author: 'You',
            message: userInput
        };

        setChatMessages(prevChatMessages => [...prevChatMessages, messageElement]);
        props.setAi21Messages(prevChatMessages => [...prevChatMessages, messageElement]);

        let payload = {
            prompt: userInput,
            maxTokens: 200,
            temperature: 0.5,
            topP: 0.5,
            stopSequences: [],
            countPenalty: { scale: 0 },
            presencePenalty: { scale: 0 },
            frequencyPenalty: { scale: 0 }
        };

        setUserInput('');
        fetch(apiMethod, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(response => {
                const botResponse = formatBotResponse(response);
                const botMessageElement = {
                    author: `${selectedModel} Bot`,
                    message: botResponse
                };
                setChatMessages(prevChatMessages => [...prevChatMessages, botMessageElement]);
                props.setAi21Messages(prevChatMessages => [...prevChatMessages, botMessageElement]);
            })
            .catch(error => {
                console.error('Error:', error);
            }).finally(() => {
                
                setIsBuffering(false)
            });
        
    };

    const formatBotResponse = (response) => {
        const regexNumberedList = /^\d+\.\s/;
        const regexBulletedList = /^[\-\*\+\•]/;
        const regexURL = /\b(?:[\w-]+\.)+(?:com)\b/i;

        const lines = response.trim().split('\n');
        
        console.log("length of lines tested:")
        console.log(lines.length)
        let isNumberedList = false;
        let isBulletedList = false;

        lines.forEach(line => {
            console.log(line)
            if (regexNumberedList.test(line)) {
                console.log('contained numbered list')
                isNumberedList = true;
            } else if (regexBulletedList.test(line)) {
                console.log('contained bulleted list')
                isBulletedList = true;
            }
        });

        if (!isNumberedList && !isBulletedList) {
            return response.replace(regexURL, '<a href="http://$&" target="_blank">$&</a>');
        }

        let listType = isNumberedList ? 'ol' : 'ul';
        let result = `<${listType}>`;
        let listItems = '';

        lines.forEach(line => {
            if (isNumberedList && regexNumberedList.test(line)) {
                listItems += `<li>${line.replace(regexNumberedList, '').replace(regexURL, '<a href="http://$&" target="_blank">$&</a>')}</li>`;
            } else if (isBulletedList && regexBulletedList.test(line)) {
                listItems += `<li>${line.replace(regexBulletedList, '').replace(regexURL, '<a href="http://$&" target="_blank">$&</a>')}</li>`;
            } else {
                if (listItems) {
                    result += listItems;
                    listItems = '';
                }
                result += `${line.replace(regexURL, '<a href="http://$&" target="_blank">$&</a>')}\n`;
            }
        });

        if (listItems) {
            result += listItems;
        }

        result += `</${listType}>`;

        return result;
    };



    const clearChatHistory = () => {
        setChatMessages([
            { author: `${selectedModel.split(':')[1]} Bot`, message: `Welcome to the ${selectedModel} Chatbot!` }
        ])
        props.setAi21Messages([
            { author: `${selectedModel.split(':')[1]} Bot`, message: `Welcome to the ${selectedModel} Chatbot!` }
        ])
    }

    return (
        <div className="chat-container">
            {/* <h1>Claude Chatbot with Context</h1> */}
            <div className="chat-messages" id="chatMessages">
                {chatMessages.map((message, index) => (
                    <p key={index} className={`${message.author}-message`}>
                        <span className={`${message.author}-title`}><strong>{message.author}:</strong></span>
                        <span className="MessageText" dangerouslySetInnerHTML={{ __html: message.message }}></span>
                    </p>
                ))}
            </div>
            {isBuffering &&
                <div className="dots">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                </div>

            }
            <div className="user-input">
                <button type="button" className="ClearHistory" onClick={clearChatHistory} disabled={chatMessages.length === 1 ? true:false}>Clear Chat History</button>
                <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your message..."
                />
                <button type="button" onClick={sendMessage} disabled={isBuffering}>Send</button>
            </div>
        </div>
    );
};

export default ChatbotApp;
