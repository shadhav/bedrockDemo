import './App.css';
import { withAuthenticator, Button } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import React, { useState } from 'react';
import ChatbotApp from './ChatbotApp';

const modelOptions = [
    'Claude',
    'Titan',
    // 'Stable Diffusion',
    'AI21'
]

function App({ signOut, user }) {
    const [modelSelected, setModelSelected] = useState('Claude');



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
                            onClick={() => setModelSelected(option)}
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
