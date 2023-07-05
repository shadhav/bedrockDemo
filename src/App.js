import './App.css';
import { withAuthenticator, Button } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import React, { useState, useEffect } from 'react';
import ChatbotApp from './ChatbotApp';

const modelOptions = [
    'Anthropic',
    'Amazon',
    // 'Stable Diffusion',
    'AI21'
]

const App = (props) => {
    const [modelSelected, setModelSelected] = useState('Anthropic');

    useEffect(() => {
        setModelSelected(props.model)
    }, [props.model]);

    const openInTab = (option) => {
        // setModelSelected(option)
        window.open(`http://localhost:3000/${option.toLowerCase()}`)
    }

    return (
        <div className="App">
            <div className="airwolf-header">

            </div>
            <div className="airwolf-header2">
                <div className="OtherModels">
                    {modelOptions.map((option) => (
                        <span
                            key={option}
                            className={`model-option ${modelSelected === option ? 'active' : ''}`}
                            onClick={() => openInTab(option)}
                        >
                            {option}
                        </span>
                    ))}
                </div>
            </div>

            <div id="ContentSection">
                <ChatbotApp modelSelected={modelSelected} />
            </div>
        </div>
    );
}

// export default withAuthenticator(App);
export default App;
