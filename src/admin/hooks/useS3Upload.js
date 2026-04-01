import { useState, useCallback } from 'react';
import { uploadFile } from '../services/adminApi';

const INITIAL = { progress: 0, uploading: false, url: null, error: null };

/**
 * Handles the full multipart upload flow for a single file slot.
 *
 * Usage:
 *   const thumb = useS3Upload();
 *   await thumb.upload(file);
 *   thumb.url  // the permanent S3 file URL after success
 */
export function useS3Upload() {
  const [state, setState] = useState(INITIAL);

  const reset = useCallback(() => setState(INITIAL), []);

  const upload = useCallback(async (file) => {
    if (!file) return null;

    setState({ progress: 0, uploading: true, url: null, error: null });

    try {
      const { url } = await uploadFile(file, (progress) => {
        setState((s) => ({ ...s, progress }));
      });

      setState({ progress: 100, uploading: false, url, error: null });
      return url;
    } catch (err) {
      const message = err?.response?.data?.message || err.message || 'Upload failed';
      setState({ progress: 0, uploading: false, url: null, error: message });
      return null;
    }
  }, []);

  return { ...state, upload, reset };
}
