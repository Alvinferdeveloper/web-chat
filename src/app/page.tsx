import Header from "./components/layout/header";
import ChatWrapper from "./components/chat/chatWrapper";

export default async function Home() {
  return (
    <div className="h-screen bg-dark flex flex-col">
      <Header />
      <main className="flex-grow overflow-hidden">
        <ChatWrapper />
      </main>
    </div>
  );
}

