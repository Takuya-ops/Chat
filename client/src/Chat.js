import React, { useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

const Chat = ( socket, username, room ) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        message: currentMessage,
        author: username,
        room: room,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList([...messageList, messageData]);
      setCurrentMessage("");
    }
  };

  socket.on("receive_message", (data) => {
    console.log(data);
    setMessageList([...messageList, data]);
  });

  return (
    <div className='chat-window'>
      <div className='chat-header'>
        <p>ライブチャット</p>
      </div>
      <div className='chat-body'>
        <ScrollToBottom className='message-container'>
          {messageList.map((messageContent) => (
            <div
              className='message'
              id={username == messageContent.author ? "you" : "other"}
            >
              <div>
                <div className='message-content'>
                  <p>{messageContent.message}</p>
                </div>
                <div className='message-meta'>
                  <p id='time'>{messageContent.time}</p>
                  <p id='author'>{messageContent.author}</p>

                </div>
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>
      <div className='chat-footer'>
        <input
          type="text"
          placeholder='メッセージ内容・・・'
          onChange={(e) => setCurrentMessage(e.target.value)}
          value={currentMessage}
        />
        <button onClick={() => sendMessage()}>&#9658;</button>
      </div>
    </div>
  )
}

export default Chat;