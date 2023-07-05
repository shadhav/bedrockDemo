import React, { useState, useEffect } from 'react';

const ChatbotApp = (props) => {
    const [chatMessages, setChatMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isBuffering, setIsBuffering] = useState(false)
    const [apiMethod, setApiMethod] = useState('')
    const [selectedModel, setSelectedModel] = useState('')

    useEffect(() => {
        // Code to run after component has mounted
        setChatMessages([
            { author: `${props.modelSelected} Bot`, message: `Welcome to the ${props.modelSelected} Chatbot!` }
        ])

        if(props.modelSelected == "AI21") {
            setApiMethod(`/api/call-python4`)
        } else if (props.modelSelected == "Amazon") {
            setApiMethod(`/api/call-python1`)
        } else {
            setApiMethod(`/api/conversation/predict-claude`)
        }
        
        setSelectedModel(props.modelSelected)
    }, [props.modelSelected]);

    const sendMessage = () => {
        setIsBuffering(true);
        const messageElement = {
            author: 'You',
            message: userInput
        };

        setChatMessages(prevChatMessages => [...prevChatMessages, messageElement]);

        let payload = {}

        switch (selectedModel) {
            case 'Anthropic':
                payload = {
                    modelId: 'anthropic.claude-instant-v1',
                    contentType: 'application/json',
                    accept: '*/*',
                    body: JSON.stringify({
                        prompt: userInput,
                        max_tokens_to_sample: 300,
                        temperature: 0.5,
                        top_k: 250,
                        top_p: 1,
                        stop_sequences: ['\n\nHuman:']
                    })
                };
                break;
            case 'AI21':
                payload = {
                    prompt: userInput,
                    maxTokens: 200,
                    temperature: 0.5,
                    topP: 0.5,
                    stopSequences: [],
                    countPenalty: { scale: 0 },
                    presencePenalty: { scale: 0 },
                    frequencyPenalty: { scale: 0 }
                };
                break;
            case 'Amazon':
                payload = {
                    inputText: userInput,
                    textGenerationConfig: {
                        maxTokenCount: 400,
                        temperature: 0.8,
                        topP: 1,
                        stopSequences: []
                    }
                };
                break;
            default:
                break;
        }

        // const 
        if (selectedModel == "Amazon") {
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
                    const botResponse = response.output_text;
                    const botMessageElement = {
                        author: `${selectedModel} Bot`,
                        message: botResponse
                    };
                    setChatMessages(prevChatMessages => [...prevChatMessages, botMessageElement]);
                })
                .catch(error => {
                    console.error('Error:', error);
                }).finally(() => {
                    
                    setIsBuffering(false)
                });
        } else {
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
                })
                .catch(error => {
                    console.error('Error:', error);
                }).finally(() => {
                    
                    setIsBuffering(false)
                });
        }
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

    const formatBotResponse2 = (response) => {
        const regexNumberedList = /^\d+\.\s/;
        const regexBulletedList = /^[\-\*\+\•]/;
        const regexURL = /\b(?:[\w-]+\.)+(?:com)\b/i;
      
        const lines = response.trim().split('\n');
      
        let isNumberedList = false;
        let isBulletedList = false;
      
        const resultLines = [];
      
        lines.forEach((line, index) => {
          if (regexNumberedList.test(line)) {
            isNumberedList = true;
            if (!isBulletedList && index > 0) {
              resultLines.push('</ul>');
            }
            if (!isNumberedList) {
              resultLines.push('<ol>');
            }
            resultLines.push(`<li>${line.replace(regexNumberedList, '').replace(regexURL, '<a href="http://$&" target="_blank">$&</a>')}</li>`);
            isBulletedList = false;
          } else if (regexBulletedList.test(line)) {
            isBulletedList = true;
            if (!isNumberedList && index > 0) {
              resultLines.push('</ol>');
            }
            if (!isBulletedList) {
              resultLines.push('<ul>');
            }
            resultLines.push(`<li>${line.replace(regexBulletedList, '').replace(regexURL, '<a href="http://$&" target="_blank">$&</a>')}</li>`);
            isNumberedList = false;
          } else {
            resultLines.push(line.replace(regexURL, '<a href="http://$&" target="_blank">$&</a>'));
          }
        });
      
        if (isNumberedList || isBulletedList) {
          resultLines.push(isNumberedList ? '</ol>' : '</ul>');
        }
      
        return resultLines.join('\n');
      };

    const clearChatHistory = () => {
        setChatMessages([
            { author: `${selectedModel} Bot`, message: `Welcome to the ${selectedModel} Chatbot!` }
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
                <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your message..."
                />
                <button type="button" onClick={sendMessage} disabled={isBuffering}>Send</button>
            </div>
            <button type="button" className="ClearHistory" onClick={clearChatHistory} disabled={chatMessages.length === 1 ? true:false}>Clear Chat History</button>
        </div>
    );
};

export default ChatbotApp;
