import './App.css';
import gptLogo from './assets/chatgpt.svg';
import addBtn from './assets/add-30.png';
import msgIcon from './assets/message.svg';
//import home from './assets/home.svg';
//import saved from './assets/bookmark.svg';
import rocket from './assets/rocket.svg';
import sendBtn from './assets/send.svg';
import userIcon from './assets/ui.jpg';
import gptImgLogo from './assets/chatgptLogo.svg';
import {useRef,useEffect,useState} from 'react';
import {sendMsgToOpenAI,getEngines} from './openai';
import React, { useContext } from 'react';
import { ThemeContext } from './ThemeProvider';

function App() {
  const msgEnd = useRef(null);
  const [input, setInput]= useState('');
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [engines, setEngines] = useState([]);
  const [selectedEngine, setSelectedEngine] = useState(null);
  const[messages, setMessages] = useState([
    {
    text: "Hi I am CleverConvo, a state-of-the-art language model developed by OpenAI. Im designed to understand and generate human-like text based on the input I receive. You can ask me questions, have conversations, seak information, or even request assistance with various tasks. just let me know how i can help you.",
    isBot: true,
    }
]);


useEffect(() => {
  async function fetchEngines() {
    try {
      const enginesData = await getEngines();
      setEngines(enginesData);
      console.log(enginesData);
    } catch (error) {
      console.error("Error fetching engines:", error);
    }
  }
fetchEngines();
}, []);
const handleEngineSelect = (engine) => {
  setSelectedEngine(engine);
  
};
useEffect(()=> { 
  msgEnd.current?.scrollIntoView({behavior:"smooth"});
}, [messages]);

const handleSend = async() => {
  const text = input;
  setInput('');
  
  await setMessages([
    ...messages,
    {text, isBot: false}
  ]);
 
      const res = await sendMsgToOpenAI(text,selectedEngine);
      
      await setMessages([
        ...messages,
        { text, isBot: false },
        { text: res, isBot: true }
      ]);
      
  }
const handleEnter = async (e)=> {
    if(e.key ==='Enter') await handleSend();
  }
  const handleQuery = async (e)=>{
  const text = e.target.value;
   
    setMessages([
      ...messages,
      {text, isBot: false}
    ]);
    const res = await sendMsgToOpenAI(text,selectedEngine);
    setMessages([
      ...messages,
    {text, isBot: false},
    {text: res, isBot: true}
]);

  }
  
return (
   
    <div className={`App ${theme}`}>
      <div className="sideBar">
        <div className="upperSide">
          <div className="upperSideTop"><img src={gptLogo} alt="logo" className="logo"/><span className="brand">CleverConvo</span></div>
          <button className="midBtn" onClick={()=>{window.location.reload()}}><img src={addBtn} alt="New Chat" className="addBtn"/>New Chat</button>
          
          <div className="upperSideBottom">
          <div>
      <button className="updateModel"><img src={rocket} alt="update" className="updateImg" />Customize  Model
      <select onChange={(e) => handleEngineSelect(e.target.value)}>
        <option value="">Select an Engine</option>
        {engines.map((engine) => (
          <option key={engine.id} value={engine.id}>
            {engine.id}
          </option>
        ))}
      </select>
      {selectedEngine && (
        <div>
          <p>{selectedEngine.name}</p>
          
        </div>
      )}
      </button> 
    </div>
    <button className="theme" onClick={toggleTheme}>Toggle Theme</button>
   
          </div>
          </div>
        <div className="lowerSide">
        
        
        <h3>How can I help you today ?</h3> 
        <button className="query" onClick={handleQuery} value={"What is Programming ?"}><img src={msgIcon} alt="query" />What is Programming ?</button>
        <button className="query" OnClick={handleQuery} value={"How to use an API ?"}><img src={msgIcon} alt="query" />How to use an API ?</button>
        </div>
        

      </div>
      <div className="main">
      
        <div className="chats">
    
          {messages.map((message, i) =>
            <div key={i} className={message.isBot?"chat bot":"chat"}>
            <img className ='chatImg' src={message.isBot?gptImgLogo:userIcon} alt="" /><p className="txt">{ message.text}</p>
          </div>
          )}
          <div ref={msgEnd}/>
          </div>
        <div className="chatFooter">
          <div className="inp">
            <input type="text" placeholder='Type your message here...' value={input} onKeyDown ={handleEnter} onChange={(e)=>{setInput(e.target.value)}}/><button className="send" onClick={handleSend}><img src={sendBtn} alt="Send"/></button>
          </div>
          <p>CleverConvo may produce inaccurate information about people, places, or facts. CleverConvo Febraury 9 Version. </p>
        </div>
      </div>
      
        
     
    </div>
    
  );
}

export default App;
