import { JobForm } from "@/components/jobs/job-form";
import { getJobById } from "@/services/jobs-service";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const job = await getJobById(jobId);
  return <JobForm mode="edit" initialJob={job ?? undefined} />;
}
