import { SavedResumeView } from "@/components/resume-library/saved-resume-view";

export const instant = false;

type SavedResumePageProps = {
  params: Promise<{ id: string }>;
};

export default async function SavedResumePage({
  params,
}: SavedResumePageProps) {
  const { id } = await params;

  return <SavedResumeView resumeId={id} />;
}
