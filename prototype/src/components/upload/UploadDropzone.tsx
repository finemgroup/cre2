import type { CSSProperties, ReactElement } from 'react';

import { PrototypeActionButton } from '@/components/overlays/PrototypeActionButton';
import { MaterialIcon, StatusBadge } from '@/components/studio/StudioPrimitives';
import type { MockUploadFile } from '@/lib/staged-import';

export function UploadDropzone({ files }: { files: MockUploadFile[] }): ReactElement {
  return (
    <div className="mock-upload-dropzone">
      <PrototypeActionButton feature="Studio file dropzone" className="upload-zone">
        <MaterialIcon name="upload_file" />
        <strong>Drop OM, rent roll, and T12 files here</strong>
        <span>Mock queue only. Source-use and review gates apply before promotion.</span>
      </PrototypeActionButton>
      <div className="upload-queue">
        {files.map((file) => (
          <div className="upload-file-row" key={file.id}>
            <MaterialIcon name="description" />
            <div>
              <strong id={`${file.id}-label`}>{file.name}</strong>
              <span>
                {file.type} · {file.progress}%
              </span>
              <div
                className="progress-bar progress-bar-compact"
                role="progressbar"
                aria-labelledby={`${file.id}-label`}
                aria-valuenow={file.progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuetext={`${file.progress}% complete`}
              >
                <div
                  className="progress-fill"
                  style={{ '--progress-fill': `${file.progress}%` } as CSSProperties}
                />
              </div>
              {file.issue ? <small role="alert">{file.issue}</small> : null}
            </div>
            <StatusBadge status={file.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
