import './App.css';
import '@aws-amplify/ui-react/styles.css';
import React, { useState, useEffect } from 'react';
import ChatbotApp from './ChatbotApp';
import Anthropic from './Anthropic';
import Amazon from './Amazon';
import AI21 from './AI21'
import StableDiffusion from './StableDiffusion';


const modelOptions = [
    'Anthropic: Claude',
    'Amazon: Titan',
    'AI21: Jurassic2',
    'Stability AI: Stable Diffusion'
]

const App = (props) => {
    const [modelSelected, setModelSelected] = useState('Anthropic: Claude');
    const [anthropicMessages, setAnthropicMessages] = useState([]);
    const [amazonMessages, setAmazonMessages] = useState([]);
    const [ai21Messages, setAi21Messages] = useState([]);
    const [infoModal, setInfoModal] = useState(false)

    // useEffect(() => {
    //     setModelSelected(props.model)
    // }, [props.model]);



    const getModelComponent = () => {
        switch(modelSelected){
            case 'Anthropic: Claude':
                return (
                    <Anthropic modelSelected={modelSelected} anthropicMessages={anthropicMessages} setAnthropicMessages={setAnthropicMessages} />
                );
            case 'Amazon: Titan':
                return (
                    <Amazon modelSelected={modelSelected} amazonMessages={amazonMessages} setAmazonMessages={setAmazonMessages} />
                );
            case 'AI21: Jurassic2':
                return (
                    <AI21 modelSelected={modelSelected} ai21Messages={ai21Messages} setAi21Messages={setAi21Messages} />
                );
            case 'Stability AI: Stable Diffusion':
                return (
                    <StableDiffusion modelSelected={modelSelected} />
                );
            default:
                break;
      }
    }



    return (
        <div className="App">
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
                {/* <ChatbotApp modelSelected={modelSelected} /> */}
                { getModelComponent() }
            </div>
            <div className="InfoModal" style={{
                height: `100vh`,
                width: infoModal ? '940px': '40px',

            }}>
                <div className="InnerInfoModal" style={{ display: infoModal ? 'unset': 'none' }}>
                    <h1>Amazon Bedrock</h1>
                    <p>This Demo was built with Amazon Bedrock.</p>

                    <p>Amazon Bedrock is a new service that makes FMs from Amazon and leading AI startups including AI21 Labs, Anthropic, and Stability AI accessible via an API. Bedrock is the easiest way for customers to build and scale generative AI-based applications using FMs, democratizing access for all builders.</p>
                    <div className="llm-section">
                        <h2>Amazon Titan By Amazon</h2>
                        <p>Amazon is a leader in applying ML to e-commerce, cloud computing, online advertising, and digital streaming services. The Amazon Titan models leverage Amazon’s 20+ years of ML experience.</p>
                    </div>
                    <div className="llm-section">
                        <h2>Claude By Anthropic</h2>
                        <p>Anthropic is an AI safety and research company offering the Claude family of large language models. These models are purpose-built for AI-based assistance use-cases such as obtaining customer service or comprehending documents.</p>
                    </div>
                    <div className="llm-section">
                        <h2>Stable Diffusion By Stability AI</h2>
                        <p>Stability AI is a generative AI company with a goal to inspire global creativity and innovation.</p>
                    </div>
                    <div className="llm-section">
                        <h2>Jurrasic 2 by AI21 Labs </h2>
                        <p>AI21 Labs enables businesses to build generative AI powered solutions by providing API access to our proprietary best-in-class language models, driving innovation, unlocking new capabilities, scaling businesses, and much more...</p>
                    </div>
                </div>
                <div className="InfoModalButton" onClick={ () => setInfoModal(!infoModal) }>
                    { infoModal === false &&
                        <svg viewBox="0 0 32 32">
                            <path d="M14 9.5c0-0.825 0.675-1.5 1.5-1.5h1c0.825 0 1.5 0.675 1.5 1.5v1c0 0.825-0.675 1.5-1.5 1.5h-1c-0.825 0-1.5-0.675-1.5-1.5v-1z"></path>
                            <path d="M20 24h-8v-2h2v-6h-2v-2h6v8h2z"></path>
                            <path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13z"></path>
                        </svg>
                    }
                    { infoModal &&
                        <svg className="closeModal" viewBox="0 0 32 32">
                            <path d="M31.708 25.708c-0-0-0-0-0-0l-9.708-9.708 9.708-9.708c0-0 0-0 0-0 0.105-0.105 0.18-0.227 0.229-0.357 0.133-0.356 0.057-0.771-0.229-1.057l-4.586-4.586c-0.286-0.286-0.702-0.361-1.057-0.229-0.13 0.048-0.252 0.124-0.357 0.228 0 0-0 0-0 0l-9.708 9.708-9.708-9.708c-0-0-0-0-0-0-0.105-0.104-0.227-0.18-0.357-0.228-0.356-0.133-0.771-0.057-1.057 0.229l-4.586 4.586c-0.286 0.286-0.361 0.702-0.229 1.057 0.049 0.13 0.124 0.252 0.229 0.357 0 0 0 0 0 0l9.708 9.708-9.708 9.708c-0 0-0 0-0 0-0.104 0.105-0.18 0.227-0.229 0.357-0.133 0.355-0.057 0.771 0.229 1.057l4.586 4.586c0.286 0.286 0.702 0.361 1.057 0.229 0.13-0.049 0.252-0.124 0.357-0.229 0-0 0-0 0-0l9.708-9.708 9.708 9.708c0 0 0 0 0 0 0.105 0.105 0.227 0.18 0.357 0.229 0.356 0.133 0.771 0.057 1.057-0.229l4.586-4.586c0.286-0.286 0.362-0.702 0.229-1.057-0.049-0.13-0.124-0.252-0.229-0.357z"></path>
                        </svg>
                    }

                    
                </div>
            </div>
        </div>
    );
}

// export default withAuthenticator(App);
export default App;
