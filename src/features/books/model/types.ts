export type CategoryOption = {
  id: number;
  name: string;
};

export interface Chapter {
  id: number;
  chapterNumber: number;
  chapterTitle: string;
  chapterSummary: string;
  audioUrl: string | null;
  audioDuration: number;
}

export interface Summary {
  mainSummary: string;
  tableOfContents: unknown;
}

export interface BookDetails {
  id: number;
  title: string;
  author: string;
  description: string;
  publicationYear: number | null;
  isbn: string | null;
  coverImageUrl: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  summaryGenerated: boolean;
  audioGenerated: boolean;
  category: {
    name: string;
  };
  summary: Summary | null;
  chapters: Chapter[];
}

export type CreateBookPayload = {
  title: string;
  author: string;
  categoryId: number;
  description: string;
  publicationYear: number | null;
  isbn: string | null;
  tags: string | null;
  coverImageUrl: string | null;
  pdfUrl: string | null;
  pdfPath: string | null;
  isFeatured: boolean;
  isPublished: boolean;
};

export type CreateBookSuccess = {
  id: number;
};

export type CreateBookFailure = {
  error?: string;
  errors?: Record<string, string>;
};

export type UploadFileResponse = {
  url: string;
  path?: string;
};
