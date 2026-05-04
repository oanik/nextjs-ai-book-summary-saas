import type {
  BookDetails,
  CreateBookFailure,
  CreateBookPayload,
  CreateBookSuccess,
  UploadFileResponse,
} from '../model/types';

const safeJson = async <T>(response: Response): Promise<T | null> => {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
};

export const uploadUserFile = async (file: File, type: 'cover' | 'pdf'): Promise<UploadFileResponse | null> => {
  const uploadFormData = new FormData();
  uploadFormData.append('file', file);
  uploadFormData.append('type', type);

  const response = await fetch('/api/user/upload', {
    method: 'POST',
    body: uploadFormData,
  });

  if (!response.ok) {
    return null;
  }

  return safeJson<UploadFileResponse>(response);
};

export const createBook = async (
  payload: CreateBookPayload,
): Promise<{ ok: true; data: CreateBookSuccess } | { ok: false; data: CreateBookFailure }> => {
  const response = await fetch('/api/user/books', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = (await safeJson<CreateBookSuccess | CreateBookFailure>(response)) ?? {};

  if (!response.ok) {
    return { ok: false, data: data as CreateBookFailure };
  }

  return { ok: true, data: data as CreateBookSuccess };
};

export const generateSummary = async (bookId: number): Promise<Response> => {
  return fetch('/api/user/books/generate-summary', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ bookId }),
  });
};

export const fetchBookDetails = async (bookId: string): Promise<BookDetails | null> => {
  const response = await fetch(`/api/user/books/${bookId}/details`);

  if (!response.ok) {
    return null;
  }

  return safeJson<BookDetails>(response);
};
