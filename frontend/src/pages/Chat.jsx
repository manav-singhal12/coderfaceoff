export default function ChatUI() {
    const messages = [
      { id: 1, name: "Jhon 😎", text: "hi, good morning", isActive: false },
      { id: 2, name: "Abhilash 🤯", text: "hey where are you????", isActive: false },
      { id: 3, name: "Aman 💖", text: "hlo How do you do", isActive: true },
      { id: 4, name: "George Jose", text: "Now I'm in France", isActive: false },
      { id: 5, name: "Hani Rahman", text: "hi, good morning", isActive: false },
    ];
  
    return (
      <div className="flex h-screen bg-black text-white">
        {/* Sidebar */}
        <div className="w-1/4 bg-[#282828] p-4">
          <h2 className="text-lg font-semibold">Messages</h2>
          <input
            type="text"
            placeholder="Search Messages"
            className="w-full bg-[#282828] p-2 mt-2 rounded text-gray-300"
          />
          <div className="flex mt-4 border-b border-gray-700">
            <button className="text-yellow-400 border-b-2 border-yellow-400 px-3 py-2">
              Primary
            </button>
            <button className="px-3 py-2 text-gray-400">General</button>
            <button className="px-3 py-2 text-gray-400">Request(2)</button>
          </div>
          <ul className="mt-4 space-y-2">
            {messages.map((msg) => (
              <li
                key={msg.id}
                className={`flex items-center justify-between p-2 rounded ${
                  msg.isActive ? "bg-yellow-400 text-black" : "hover:bg-gray-800"
                }`}
              >
                <span>{msg.name}</span>
                <span className="text-gray-500 text-sm">{msg.text}</span>
              </li>
            ))}
          </ul>
        </div>
  
        {/* Chat Window */}
        <div className="flex-1 p-6 bg-[#282828]">
          {/* Chat Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <img
                src="./logo.png"
                alt="User"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="text-lg">Aman 💖</h3>
                <span className="text-sm text-gray-500">Active 1 min ago</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button>📞</button>
              <button>➕</button>
              <button>🎥</button>
              <button>ℹ️</button>
            </div>
          </div>
  
          {/* Messages */}
          <div className="mt-6 space-y-4">
            <div className="flex justify-start">
              <span className="bg-yellow-400 text-black px-4 py-2 rounded-lg">
                Hi, how are you? 😁
              </span>
            </div>
            <div className="flex justify-end">
              <span className="bg-white text-black px-4 py-2 rounded-lg">
                I’m doing well.. 😎
              </span>
            </div>
            <div className="flex justify-start">
              {/* <img
                src="./logo.png"
                alt="Sent Image"
                className="rounded-lg h-8 w-8"
              /> */}
            </div>
            <div className="flex justify-start">
              <span className="bg-yellow-400 text-black px-4 py-2 rounded-lg">
                How is This
              </span>
            </div>
          </div>
  
          {/* Message Input */}
          <div className=" flex items-center space-x-3 p-4 bg-gray-800 rounded mt-90">
            <button className="text-gray-400">😊</button>
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 bg-transparent outline-none  text-gray-300"
            />
            <button className="text-gray-400">🎤</button>
            <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg">
              ➤
            </button>
          </div>
        </div>
      </div>
    );
  }
  