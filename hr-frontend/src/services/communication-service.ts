import { mockDocuments, mockMessages, mockMessageTemplates, mockThreads } from "@/mocks/communication";
import { DocumentItem, MessageItem, MessageTemplate, MessageThread } from "@/types/communication";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getMessageThreads(): Promise<MessageThread[]> {
  await wait(250);
  return mockThreads;
}

export async function getMessages(threadId: string): Promise<MessageItem[]> {
  await wait(250);
  return mockMessages.filter((item) => item.threadId === threadId);
}

export async function getMessageTemplates(): Promise<MessageTemplate[]> {
  await wait(200);
  return mockMessageTemplates;
}

export async function sendMessageMock(): Promise<{ success: boolean; message: string }> {
  await wait(300);
  return { success: true, message: "Message sent successfully (mock)." };
}

export async function getDocuments(): Promise<DocumentItem[]> {
  await wait(260);
  return mockDocuments;
}

export async function uploadDocumentMock(): Promise<{ success: boolean; message: string }> {
  await wait(420);
  return { success: true, message: "Document uploaded and indexed (mock)." };
}
