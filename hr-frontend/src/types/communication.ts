export interface MessageTemplate {
  id: string;
  title: string;
  body: string;
}

export interface MessageThread {
  id: string;
  candidateName: string;
  role: string;
  lastMessageAt: string;
  unread: boolean;
}

export interface MessageItem {
  id: string;
  threadId: string;
  sender: "recruiter" | "candidate";
  body: string;
  sentAt: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  category: "resume" | "cover_letter" | "offer_letter" | "feedback";
  candidateName: string;
  uploadedAt: string;
  version: number;
}
