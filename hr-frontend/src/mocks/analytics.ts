export const funnelDropoffData = [
  { stage: "Applied", conversion: 100, dropoff: 0, medianDays: 1.2 },
  { stage: "Screening", conversion: 67, dropoff: 33, medianDays: 2.8 },
  { stage: "Assessment", conversion: 44, dropoff: 23, medianDays: 4.1 },
  { stage: "Interview", conversion: 31, dropoff: 13, medianDays: 5.2 },
  { stage: "Offer", conversion: 12, dropoff: 19, medianDays: 3.5 },
  { stage: "Hired", conversion: 6, dropoff: 6, medianDays: 2.2 },
];

export const recruiterPerformanceData = [
  { recruiter: "Areej Malik", processed: 92, responseHours: 5.4, satisfaction: 4.6, hireRate: 18 },
  { recruiter: "Hira Shah", processed: 84, responseHours: 6.1, satisfaction: 4.4, hireRate: 15 },
  { recruiter: "Ali Rehman", processed: 76, responseHours: 6.8, satisfaction: 4.3, hireRate: 14 },
];

export const timeToHireData = [
  { role: "Frontend Engineer", avgTimeToFill: 32, avgStageDays: 6.4, bottleneck: "Assessment" },
  { role: "Backend Engineer", avgTimeToFill: 36, avgStageDays: 7.1, bottleneck: "Interview" },
  { role: "Product Designer", avgTimeToFill: 29, avgStageDays: 5.8, bottleneck: "Offer" },
  { role: "Senior Recruiter", avgTimeToFill: 24, avgStageDays: 4.9, bottleneck: "Screening" },
];

export const sourceQualityData = [
  { source: "Referral", avgScore: 87, interviewRate: 52, offerRate: 24, hireRate: 16 },
  { source: "LinkedIn", avgScore: 76, interviewRate: 44, offerRate: 17, hireRate: 10 },
  { source: "Career Page", avgScore: 71, interviewRate: 38, offerRate: 14, hireRate: 8 },
  { source: "Agency", avgScore: 68, interviewRate: 35, offerRate: 12, hireRate: 7 },
];

export const offerAcceptanceData = [
  { month: "Jan", offersSent: 12, accepted: 8, acceptanceRate: 67 },
  { month: "Feb", offersSent: 10, accepted: 7, acceptanceRate: 70 },
  { month: "Mar", offersSent: 14, accepted: 10, acceptanceRate: 71 },
  { month: "Apr", offersSent: 16, accepted: 11, acceptanceRate: 69 },
];
