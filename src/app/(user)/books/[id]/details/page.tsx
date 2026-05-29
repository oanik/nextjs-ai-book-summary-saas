'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { fetchBookDetails } from '@features/books/api/client';
import type { BookDetails } from '@features/books/model/types';

import { FavouriteButton } from './favourite-button';

function createCaptionTrack(summary: string): string {
  const sanitizedSummary = summary.replace(/\s+/g, ' ').trim();
  const vtt = `WEBVTT

00:00.000 --> 99:59.000
${sanitizedSummary || 'Audio chapter narration.'}
`;

  return `data:text/vtt;charset=utf-8,${encodeURIComponent(vtt)}`;
}

export default function BookDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const bookId = params.id;

  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState<BookDetails | null>(null);
  const [currentAudio, setCurrentAudio] = useState<number | null>(null);

  useEffect(() => {
    if (!bookId) {
      return;
    }

    async function fetchBook() {
      try {
        const data = await fetchBookDetails(bookId);
        if (data) {
          setBook(data);
        }
      } catch (error) {
        console.error('Failed to fetch book details', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBook();
  }, [bookId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Book not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
          <p className="text-gray-600 mt-2">by {book.author}</p>
        </div>
        <div className="flex items-center gap-3">
          <FavouriteButton
            bookId={book.id}
            initialIsFavourited={book.isFavourited}
            canUseFavourites={book.canUseFavourites}
          />
          <button
            onClick={() => router.push('/books')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
          >
            ← Back to Books
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 space-y-6">
          {book.coverImageUrl && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <Image
                src={book.coverImageUrl}
                alt={book.title}
                width={600}
                height={900}
                className="h-auto w-full rounded-lg shadow-lg"
              />
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Book Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-semibold text-gray-900">{book.category.name}</p>
              </div>
              {book.publicationYear && (
                <div>
                  <p className="text-sm text-gray-600">Publication Year</p>
                  <p className="font-semibold text-gray-900">{book.publicationYear}</p>
                </div>
              )}
              {book.isbn && (
                <div>
                  <p className="text-sm text-gray-600">ISBN</p>
                  <p className="font-semibold text-gray-900">{book.isbn}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    book.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {book.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Featured</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    book.isFeatured ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                  } `}
                >
                  {book.isFeatured ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">AI Generation Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Summary</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    book.summaryGenerated ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  } `}
                >
                  {book.summaryGenerated ? '✓ Generated' : '✗ Not Generated'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Audio</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    book.audioGenerated ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  } `}
                >
                  {book.audioGenerated ? '✓ Generated' : '✗ Not Generated'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">{book.description}</p>
          </div>

          {book.summary && (
            <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6 shadow-sm">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🤖</span>
                <h2 className="text-xl font-bold text-gray-900">AI-Generated Summary</h2>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{book.summary.mainSummary}</p>
              </div>
            </div>
          )}

          {book.chapters && book.chapters.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center space-x-2 mb-6">
                <span className="text-2xl">📚</span>
                <h2 className="text-xl font-bold text-gray-900">Chapters</h2>
              </div>
              <div className="space-y-4">
                {book.chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          Chapter {chapter.chapterNumber} : {chapter.chapterTitle}
                        </h3>
                        {chapter.audioDuration > 0 && (
                          <p className="text-sm text-gray-500 mt-1">
                            Duration: {Math.floor(chapter.audioDuration / 60)} min {chapter.audioDuration % 60} sec
                          </p>
                        )}
                      </div>
                      {chapter.audioUrl && (
                        <button
                          onClick={() => setCurrentAudio(currentAudio === chapter.id ? null : chapter.id)}
                          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                            currentAudio === chapter.id
                              ? 'bg-red-600 text-white hover:bg-red-700'
                              : 'bg-purple-600 text-white hover:bg-purple-700'
                          } `}
                        >
                          {currentAudio === chapter.id ? '⏸ Pause' : '▶ Play Audio'}
                        </button>
                      )}
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-4">{chapter.chapterSummary}</p>

                    {chapter.audioUrl && currentAudio === chapter.id && (
                      <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <audio
                          controls
                          autoPlay
                          className="w-full"
                          src={chapter.audioUrl}
                          onEnded={() => setCurrentAudio(null)}
                        >
                          <track
                            kind="captions"
                            srcLang="en"
                            label="English captions"
                            src={createCaptionTrack(chapter.chapterSummary)}
                            default
                          />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}

                    {!chapter.audioUrl && (
                      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800">⚠️ Audio not generated for this chapter</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!book.summary && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Summary Generated Yet</h3>
              <p className="text-gray-600 mb-6">Generate an AI summary to see the book summary and chapters here</p>
              <Link
                href="/books"
                className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
              >
                Back to Books
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
