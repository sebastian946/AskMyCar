import { apiClient } from "../client";

export const history = new Map<string, string>();

export interface Car_Model {
  brand: string;
  model: string;
  year: string;
}

export interface Manual_response {
  status: "found" | "scraped";
  car: Car_Model;
  message: string;
}

export interface Chat_Response {
  question: string;
  answer: string;
  source: string[];
}

// POST Manual Car
export function getManual(data: Car_Model) {
  return apiClient<Manual_response>("/askmycar/get_manual", {
    body: data,
  });
}

// Chat with the bot
export async function chatBot(data: Car_Model) {
  const response = await apiClient<Chat_Response>("/askmycar/chat_ai", {
    body: data,
  });
  history.set(response.question, response.answer);
}
