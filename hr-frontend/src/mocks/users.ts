import type { OrgUser } from "@/types/core-entities";

/** Org directory users (blueprint `User` coverage; mock roster). */
export const mockOrgUsers: OrgUser[] = [
  {
    id: "usr_001",
    name: "Mary Johnson",
    email: "mary@maryshr.com",
    role: "owner_admin",
    status: "active",
  },
  {
    id: "usr_002",
    name: "Ahmad Rehman",
    email: "ahmad.recruiter@maryshr.com",
    role: "recruiter",
    status: "active",
  },
  {
    id: "usr_003",
    name: "Hira Shah",
    email: "hira@maryshr.com",
    role: "hr_manager",
    status: "active",
  },
  {
    id: "usr_004",
    name: "Areej Malik",
    email: "areej@maryshr.com",
    role: "recruiter",
    status: "active",
  },
  {
    id: "usr_005",
    name: "Ali Rehman",
    email: "ali@maryshr.com",
    role: "interviewer",
    status: "invited",
  },
  {
    id: "usr_006",
    name: "Zara Malik",
    email: "zara@maryshr.com",
    role: "viewer_analytics",
    status: "active",
  },
  {
    id: "usr_007",
    name: "Omar Siddiqui",
    email: "omar@maryshr.com",
    role: "interviewer",
    status: "suspended",
  },
];
