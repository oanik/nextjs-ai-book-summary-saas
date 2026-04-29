import { NextRequest, NextResponse } from 'next/server';
import { mkdir, readFile, writeFile } from 'fs/promises';
import OpenAI from 'openai';
import { join } from 'path';
import { PdfReader } from 'pdfreader';
import { z } from 'zod';

import { auth } from '../../../../../../lib/auth';
import { prisma } from '../../../../../../lib/db/prisma';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SUMMARY_MODEL = process.env.OPENAI_BOOK_SUMMARY_MODEL || 'gpt-4o-mini';
const MAX_SOURCE_CHARS = 15000;
const EXTRACTED_TEXT_DIR = join(process.cwd(), 'storage', 'book-text');

const requestSchema = z.object({
  bookId: z.coerce.number().int().positive(),
});

const tableOfContentsItemSchema = z.object({
  chapterNumber: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().min(1),
});

const generatedSummarySchema = z.object({
  mainSummary: z.string().min(1),
  keyTakeaways: z.array(z.string().min(1)).min(3).max(7),
  targetAudience: z.string().min(1),
  mainThemes: z.array(z.string().min(1)).min(2).max(6),
  tableOfContents: z
    .array(
      tableOfContentsItemSchema.extend({
        detailedSummary: z.string().min(1),
      }),
    )
    .min(3)
    .max(12),
});

type BookSummaryPayload = z.infer<typeof generatedSummarySchema>;
type StreamMessage = {
  message: string;
  completed?: boolean;
  error?: boolean;
};

const sendEvent = (controller: ReadableStreamDefaultController, encoder: TextEncoder, payload: StreamMessage) => {
  controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
};

const stripCodeFences = (value: string) =>
  value
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/, '');

const getExtractedTextPath = (bookId: number) => join(EXTRACTED_TEXT_DIR, `${bookId}.txt`);

const getPdfPath = (book: { originalPdfPath: string | null; originalPdfUrl: string | null }) => {
  if (book.originalPdfPath) {
    return book.originalPdfPath;
  }

  if (book.originalPdfUrl) {
    return join(process.cwd(), 'public', book.originalPdfUrl.replace(/^\/+/, ''));
  }

  return null;
};

const readPdfText = async (pdfPath: string) => {
  const dataBuffer = await readFile(pdfPath);

  return new Promise<string>((resolve, reject) => {
    const lines: string[] = [];

    new PdfReader().parseBuffer(dataBuffer, (error, item) => {
      if (error) {
        reject(error);
        return;
      }

      if (!item) {
        resolve(lines.join('\n').trim());
        return;
      }

      if ('text' in item && typeof item.text === 'string') {
        lines.push(item.text);
      }
    });
  });
};

const extractBookText = async (
  book: {
    id: number;
    description: string | null;
    originalPdfPath: string | null;
    originalPdfUrl: string | null;
  },
  onProgress: (message: string) => void,
) => {
  const extractedTextPath = getExtractedTextPath(book.id);

  try {
    const cachedText = await readFile(extractedTextPath, 'utf8');
    if (cachedText.trim()) {
      onProgress('Loaded cached extracted text.');
      return cachedText;
    }
  } catch {
    // Ignore missing cache file and continue with extraction.
  }

  const pdfPath = getPdfPath(book);
  if (!pdfPath) {
    onProgress('No PDF path found, using the book description instead.');
    return book.description?.trim() || '';
  }

  onProgress('Extracting text from PDF...');

  const extractedText = await readPdfText(pdfPath);

  if (!extractedText) {
    onProgress('The PDF did not contain readable text, using the book description instead.');
    return book.description?.trim() || '';
  }

  await mkdir(EXTRACTED_TEXT_DIR, { recursive: true });
  await writeFile(extractedTextPath, extractedText, 'utf8');
  onProgress(`Extracted and cached ${extractedText.length} characters from the PDF.`);

  return extractedText;
};

const buildFullSummary = (summary: BookSummaryPayload) =>
  [
    summary.mainSummary,
    '',
    `Target audience: ${summary.targetAudience}`,
    '',
    'Main themes:',
    ...summary.mainThemes.map((theme) => `- ${theme}`),
  ].join('\n');

const generateStructuredSummary = async (book: { title: string; author: string }, sourceText: string) => {
  const completion = await openai.chat.completions.create({
    model: SUMMARY_MODEL,
    messages: [
      {
        role: 'system',
        content:
          'You are a professional book summarizer. Return only valid JSON. Do not wrap the JSON in markdown or add extra commentary.',
      },
      {
        role: 'user',
        content: `Create a complete book summary package for the following book.

        Return valid JSON with exactly this shape:
        {
          "mainSummary": "150-200 word summary",
          "keyTakeaways": ["5-7 concise takeaways"],
          "targetAudience": "who this book is for",
          "mainThemes": ["2-6 main themes"],
          "tableOfContents": [
            {
              "chapterNumber": 1,
              "title": "Chapter title",
              "description": "1-2 sentence preview",
              "detailedSummary": "120-160 word chapter summary"
            }
          ]
        }

        Rules:
        - Create 8-12 logical chapters when the source supports it, otherwise create the best structured outline possible with at least 3 chapters.
        - Use only information grounded in the provided source.
        - Keep the JSON valid and complete.

        Book title: ${book.title}
        Book author: ${book.author}
        Book content:
        ${sourceText.slice(0, MAX_SOURCE_CHARS)}`,
      },
    ],
    temperature: 0.4,
    max_tokens: 2600,
  });

  const rawContent = completion.choices[0].message.content;
  if (!rawContent) {
    throw new Error('OpenAI returned an empty response.');
  }

  const parsedContent = JSON.parse(stripCodeFences(rawContent));
  return generatedSummarySchema.parse(parsedContent);
};

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsedRequest = requestSchema.safeParse(await request.json());
    if (!parsedRequest.success) {
      return NextResponse.json({ error: 'bookId is required' }, { status: 400 });
    }

    const book = await prisma.book.findFirst({
      where: {
        id: parsedRequest.data.bookId,
        createdById: session.user.id,
      },
      select: {
        id: true,
        title: true,
        author: true,
        description: true,
        originalPdfPath: true,
        originalPdfUrl: true,
      },
    });

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendMessage = (message: string) => sendEvent(controller, encoder, { message });

        try {
          sendMessage('Starting summary generation...');

          const sourceText = await extractBookText(book, sendMessage);
          if (!sourceText) {
            throw new Error('No readable content was found for this book.');
          }

          sendMessage('Generating the structured book summary...');
          const generatedSummary = await generateStructuredSummary(book, sourceText);

          sendMessage('Saving summary and chapters...');
          await prisma.$transaction(async (tx) => {
            await tx.bookSummary.upsert({
              where: { bookId: book.id },
              update: {
                mainSummary: generatedSummary.mainSummary,
                keyTakeaways: generatedSummary.keyTakeaways,
                fullSummary: buildFullSummary(generatedSummary),
                tableOfContents: generatedSummary.tableOfContents.map((chapter) => ({
                  chapterNumber: chapter.chapterNumber,
                  title: chapter.title,
                  description: chapter.description,
                })),
              },
              create: {
                bookId: book.id,
                mainSummary: generatedSummary.mainSummary,
                keyTakeaways: generatedSummary.keyTakeaways,
                fullSummary: buildFullSummary(generatedSummary),
                tableOfContents: generatedSummary.tableOfContents.map((chapter) => ({
                  chapterNumber: chapter.chapterNumber,
                  title: chapter.title,
                  description: chapter.description,
                })),
              },
            });

            await tx.bookChapter.deleteMany({
              where: { bookId: book.id },
            });

            await tx.bookChapter.createMany({
              data: generatedSummary.tableOfContents.map((chapter) => ({
                bookId: book.id,
                chapterNumber: chapter.chapterNumber,
                chapterTitle: chapter.title,
                chapterSummary: chapter.detailedSummary,
                audioUrl: null,
                audioDuration: 0,
                displayOrder: chapter.chapterNumber,
              })),
            });

            await tx.book.update({
              where: { id: book.id },
              data: { summaryGenerated: true },
            });
          });

          sendEvent(controller, encoder, {
            message: 'Summary generation completed.',
            completed: true,
          });
          controller.close();
        } catch (error) {
          console.error('Error generating summary', error);
          sendEvent(controller, encoder, {
            message: error instanceof Error ? error.message : 'Failed to generate summary.',
            error: true,
          });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Failed to start summary generation', error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}
