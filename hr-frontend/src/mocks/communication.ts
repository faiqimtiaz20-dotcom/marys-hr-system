import { DocumentItem, MessageItem, MessageTemplate, MessageThread } from "@/types/communication";

export const mockMessageTemplates: MessageTemplate[] = [
  {
    id: "tpl_001",
    title: "Interview Invitation",
    body: "Hi {{candidate_name}}, we would like to invite you for an interview for {{role}}.",
  },
  {
    id: "tpl_002",
    title: "Assessment Reminder",
    body: "Hi {{candidate_name}}, this is a reminder to complete your pending assessment.",
  },
  {
    id: "tpl_003",
    title: "Offer Follow-up",
    body: "Hi {{candidate_name}}, checking in regarding your offer decision for {{role}}.",
  },
];

export const mockThreads: MessageThread[] = [
  { id: "th_001", candidateName: "Noor Fatima", role: "Frontend Engineer", lastMessageAt: "2026-04-27 14:20", unread: true },
  { id: "th_002", candidateName: "Sami Ullah", role: "Product Designer", lastMessageAt: "2026-04-27 11:05", unread: false },
  { id: "th_003", candidateName: "Fahad Ali", role: "Backend Engineer", lastMessageAt: "2026-04-26 18:32", unread: false },
];

export const mockMessages: MessageItem[] = [
  { id: "msg_001", threadId: "th_001", sender: "recruiter", body: "Thanks for confirming your availability.", sentAt: "2026-04-27 13:55" },
  { id: "msg_002", threadId: "th_001", sender: "candidate", body: "I am available after 3 PM tomorrow.", sentAt: "2026-04-27 14:20" },
  { id: "msg_003", threadId: "th_002", sender: "recruiter", body: "Please review the design assignment details.", sentAt: "2026-04-27 10:42" },
  { id: "msg_004", threadId: "th_002", sender: "candidate", body: "Received, I will submit by evening.", sentAt: "2026-04-27 11:05" },
  { id: "msg_005", threadId: "th_003", sender: "candidate", body: "Can we reschedule to Friday?", sentAt: "2026-04-26 18:32" },
];

export const mockDocuments: DocumentItem[] = [
  { id: "doc_001", name: "Noor_Fatima_Resume.pdf", category: "resume", candidateName: "Noor Fatima", uploadedAt: "2026-04-24", version: 2 },
  { id: "doc_002", name: "Sami_Cover_Letter.pdf", category: "cover_letter", candidateName: "Sami Ullah", uploadedAt: "2026-04-21", version: 1 },
  { id: "doc_003", name: "Fahad_Offer_Letter.pdf", category: "offer_letter", candidateName: "Fahad Ali", uploadedAt: "2026-04-22", version: 1 },
  { id: "doc_004", name: "Noor_Feedback.docx", category: "feedback", candidateName: "Noor Fatima", uploadedAt: "2026-04-25", version: 3 },
];
