import { mockAnalyticsSnapshots } from "@/mocks/analytics-snapshots";
import { mockAuditLogs, mockFaqs, mockInvoices, mockProductUpdates, mockTeamMembers } from "@/mocks/admin";
import { mockOrgUsers } from "@/mocks/users";
import { AuditLogItem, FaqItem, Invoice, ProductUpdate, TeamMember } from "@/types/admin";
import type { AnalyticsSnapshot, OrgUser } from "@/types/core-entities";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getTeamMembers(): Promise<TeamMember[]> {
  await wait(220);
  return mockTeamMembers;
}

export async function inviteMemberMock(email: string): Promise<{ success: boolean; message: string }> {
  await wait(320);
  if (!email.includes("@")) return { success: false, message: "Please provide a valid email." };
  return { success: true, message: "Invitation sent successfully (mock)." };
}

export async function getAuditLogs(): Promise<AuditLogItem[]> {
  await wait(250);
  return mockAuditLogs;
}

export async function getFaqs(): Promise<FaqItem[]> {
  await wait(240);
  return mockFaqs;
}

export async function getInvoices(): Promise<Invoice[]> {
  await wait(200);
  return mockInvoices;
}

export async function getProductUpdates(): Promise<ProductUpdate[]> {
  await wait(200);
  return mockProductUpdates;
}

export async function getOrgUsers(): Promise<OrgUser[]> {
  await wait(200);
  return mockOrgUsers;
}

export async function getAnalyticsSnapshots(): Promise<AnalyticsSnapshot[]> {
  await wait(220);
  return mockAnalyticsSnapshots;
}

export async function updateTeamMemberRole(
  memberId: string,
  role: string,
): Promise<{ success: boolean; message: string }> {
  await wait(280);
  if (!memberId) return { success: false, message: "Member not found." };
  return { success: true, message: `Role updated to ${role}.` };
}

export async function suspendTeamMember(memberId: string): Promise<{ success: boolean; message: string }> {
  await wait(300);
  void memberId;
  return { success: true, message: "Member suspended." };
}

export async function revokeTeamInvitation(memberId: string): Promise<{ success: boolean; message: string }> {
  await wait(280);
  void memberId;
  return { success: true, message: "Invitation revoked." };
}
