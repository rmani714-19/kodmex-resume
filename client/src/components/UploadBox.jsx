import { appConfig } from "@shared/config.js";

export default function UploadBox({
  file,
  onFileChange,
  onSubmit,
  loading,
  roleOverride,
  onRoleOverrideChange
}) {
  return (
    <div className="app-card">
      <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-300 hover:bg-emerald-50/40">
        <label className="block cursor-pointer text-sm font-medium text-slate-700">
          Import existing resume
          <input
            type="file"
            accept={appConfig.resumeUpload.formats.map((format) => `.${format}`).join(",")}
            className="mt-3 block w-full text-sm text-slate-500"
            onChange={onFileChange}
          />
        </label>
        <p className="mt-2 text-xs text-slate-500">
          Accepted: {appConfig.resumeUpload.formats.join(", ").toUpperCase()} | Max {appConfig.resumeUpload.maxSizeMB} MB
        </p>
        {file ? (
          <p className="mt-2 text-sm text-slate-700">
            {file.name} | {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        ) : null}
      </div>

      <label className="mt-4 block">
        <span className="field-label">Role Override</span>
        <input
          className="field-input"
          value={roleOverride}
          onChange={onRoleOverrideChange}
          placeholder="Optional target role"
        />
      </label>

      <button
        type="button"
        className="button-primary relative z-10 mt-4 w-full"
        onClick={onSubmit}
        disabled={loading}
      >
        {loading ? "Importing Resume..." : "Upload and Auto Fill"}
      </button>
    </div>
  );
}
