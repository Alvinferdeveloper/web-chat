type Suscription = {
    planId: number;
    id: string;
}

export type Message = {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
};

export type Conversation = {
  id: string;
  user_id: string;
  title?: string;
  url: string;
  summary: string;
  context: string;
  created_at: string;
  messages: Message[];
};