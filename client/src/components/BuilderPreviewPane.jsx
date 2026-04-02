import ResumePreview from "./ResumePreview.jsx";

export default function BuilderPreviewPane({ resume, selectedTemplate, resumeRef }) {
  return <ResumePreview resume={resume} selectedTemplate={selectedTemplate} resumeRef={resumeRef} />;
}
