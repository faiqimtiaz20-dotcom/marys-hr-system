export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: "interview" | "job" | "application" | "system";
};

export const mockNotifications: NotificationItem[] = [
  {
    id: "n1",
    title: "Interview scheduled",
    message: "Noor Fatima interview is scheduled at 2:15 PM.",
    time: "8 min ago",
    unread: true,
    type: "interview",
  },
  {
    id: "n2",
    title: "New application",
    message: "Senior Recruiter role received 6 new applications.",
    time: "21 min ago",
    unread: true,
    type: "application",
  },
  {
    id: "n3",
    title: "Job published",
    message: "Backend Engineer role was published successfully.",
    time: "1 hr ago",
    unread: false,
    type: "job",
  },
  {
    id: "n4",
    title: "System update",
    message: "Dashboard analytics snapshot refreshed.",
    time: "2 hr ago",
    unread: false,
    type: "system",
  },
];
