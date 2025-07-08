import { Message } from "ai/react";

type Suscription = {
    planId: number;
    id: string;
}

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