"use client";

import {
  createEmptyCertification,
  useResumeEditorStore,
} from "@/lib/resume/editor-store";
import { TrashIcon } from "@/components/ui/icons";

const inputClassName =
  "h-10 w-full rounded-lg border border-line bg-surface/40 px-3.5 text-sm text-ink transition-colors placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-ring/20 focus:outline-none";

const labelClassName = "block text-[11px] font-medium text-muted";

/**
 * Certification list. Entries are always editable in place — certifications
 * are short records, so there is no separate collapsed state.
 */
export function CertificationsEditor() {
  const certifications =
    useResumeEditorStore(
      (state) => state.workingResume?.certifications,
    ) ?? [];
  const addCertification = useResumeEditorStore(
    (state) => state.addCertification,
  );
  const updateCertification = useResumeEditorStore(
    (state) => state.updateCertification,
  );
  const removeCertification = useResumeEditorStore(
    (state) => state.removeCertification,
  );

  return (
    <div className="space-y-3">
      {certifications.length === 0 ? (
        <p className="text-[11px] italic text-muted">
          No certifications added yet.
        </p>
      ) : null}

      {certifications.map((item, index) => (
        <fieldset
          key={item.id}
          className="rounded-xl border border-line bg-surface/50 p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <legend className="sr-only">Certification {index + 1}</legend>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              Certification {index + 1}
            </span>
            <button
              type="button"
              onClick={() => removeCertification(item.id)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-danger/70 transition-colors hover:bg-danger-soft hover:text-danger focus-visible:ring-2 focus-visible:ring-danger/30 focus-visible:outline-none"
              aria-label="Remove certification"
            >
              <TrashIcon className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor={`cert-name-${item.id}`} className={labelClassName}>
                Name
              </label>
              <input
                id={`cert-name-${item.id}`}
                type="text"
                value={item.name}
                onChange={(event) =>
                  updateCertification(item.id, { name: event.target.value })
                }
                placeholder="AWS Certified Cloud Practitioner"
                className={`mt-1.5 ${inputClassName}`}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor={`cert-issuer-${item.id}`} className={labelClassName}>
                Issuing organization
              </label>
              <input
                id={`cert-issuer-${item.id}`}
                type="text"
                value={item.issuer}
                onChange={(event) =>
                  updateCertification(item.id, { issuer: event.target.value })
                }
                placeholder="Amazon Web Services"
                className={`mt-1.5 ${inputClassName}`}
              />
            </div>

            <div>
              <label htmlFor={`cert-issue-${item.id}`} className={labelClassName}>
                Issue date
              </label>
              <input
                id={`cert-issue-${item.id}`}
                type="text"
                value={item.issueDate}
                onChange={(event) =>
                  updateCertification(item.id, { issueDate: event.target.value })
                }
                placeholder="2024-05"
                className={`mt-1.5 ${inputClassName}`}
              />
            </div>

            <div>
              <label htmlFor={`cert-exp-${item.id}`} className={labelClassName}>
                Expiration <span className="text-muted/60">(optional)</span>
              </label>
              <input
                id={`cert-exp-${item.id}`}
                type="text"
                value={item.expirationDate}
                onChange={(event) =>
                  updateCertification(item.id, {
                    expirationDate: event.target.value,
                  })
                }
                placeholder="2027-05"
                className={`mt-1.5 ${inputClassName}`}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor={`cert-url-${item.id}`} className={labelClassName}>
                Credential URL <span className="text-muted/60">(optional)</span>
              </label>
              <input
                id={`cert-url-${item.id}`}
                type="text"
                value={item.credentialUrl}
                onChange={(event) =>
                  updateCertification(item.id, {
                    credentialUrl: event.target.value,
                  })
                }
                placeholder="credly.com/badges/…"
                className={`mt-1.5 ${inputClassName}`}
              />
            </div>
          </div>
        </fieldset>
      ))}

      <button
        type="button"
        onClick={() => addCertification(createEmptyCertification())}
        className="inline-flex h-10 items-center justify-center rounded-lg border border-line bg-surface px-4 text-xs font-medium text-ink transition-colors hover:bg-surface/50 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
      >
        Add certification
      </button>
    </div>
  );
}
