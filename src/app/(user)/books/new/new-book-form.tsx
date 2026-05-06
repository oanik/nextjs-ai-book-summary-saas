'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { createBook, generateSummary, uploadUserFile } from '../../../../features/books/api/client';
import type { CategoryOption } from '../../../../features/books/model/types';

type NewBookFormProps = {
  categories: CategoryOption[];
};

export default function NewBookForm({ categories }: NewBookFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState('');
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [summaryProgress, setSummaryProgress] = useState('');
  const [bookId, setBookId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    categoryId: '',
    description: '',
    publicationYear: '',
    isbn: '',
    tags: '',
    isFeatured: false,
    isPublished: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;
    const checked = (event.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setCoverImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePdfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setPdfFile(file);
  };

  /// Function for generate book summary by chatgpt api
  const handleGenerateSummary = async () => {
    if (!bookId) {
      toast.error('Create the book before generating a summary');
      return;
    }

    setGeneratingSummary(true);
    setSummaryProgress('Extracting text from PDF...');

    try {
      const response = await generateSummary(bookId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to generate summary' }));
        throw new Error(errorData.error || 'Failed to generate summary');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data:')) {
              const data = JSON.parse(line.slice(6));
              setSummaryProgress(data.message);

              if (data.error) {
                throw new Error(data.message || 'Failed to generate summary');
              }

              if (data.completed) {
                setGeneratingSummary(false);
                toast.success('Summary generated successfully');
                // Refreah book data
                window.location.reload();
                break;
              }
            }
          }
        }
      }
    } catch (error) {
      setGeneratingSummary(false);
      setSummaryProgress('');
      toast.error(error instanceof Error ? error.message : 'Failed to generate summary');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      let coverImageUrl = '';
      let pdfUrl = '';
      let pdfPath = '';

      if (coverImageFile) {
        const data = await uploadUserFile(coverImageFile, 'cover');

        if (data) {
          coverImageUrl = data.url;
        }
      }

      if (pdfFile) {
        const data = await uploadUserFile(pdfFile, 'pdf');

        if (data) {
          pdfUrl = data.url;
          pdfPath = data.path ?? '';
        }
      }

      const result = await createBook({
        title: formData.title,
        author: formData.author,
        categoryId: Number.parseInt(formData.categoryId, 10),
        description: formData.description,
        publicationYear: formData.publicationYear ? Number.parseInt(formData.publicationYear, 10) : null,
        isbn: formData.isbn || null,
        tags: formData.tags || null,
        coverImageUrl: coverImageUrl || null,
        pdfUrl: pdfUrl || null,
        pdfPath: pdfPath || null,
        isFeatured: formData.isFeatured,
        isPublished: formData.isPublished,
      });

      if (!result.ok) {
        const data = result.data;
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: data.error || 'Failed to create book' });
        }
        setLoading(false);
        return;
      }

      setBookId(result.data.id);
      setLoading(false);
      toast.success('Book created successfully! You can now generate summary and audio');
    } catch {
      setErrors({ general: 'Failed to create book' });
      setLoading(false);
    }
  };

  const audioStatus = bookId
    ? 'Book created. Audio generation can be wired to this book next.'
    : 'Create the book first to enable audio generation.';

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{errors.general}</div>
        )}

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-gray-900">📚 Book Information</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-700">
                  Title *
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter book title"
                />
              </div>

              <div>
                <label htmlFor="author" className="mb-2 block text-sm font-medium text-gray-700">
                  Author *
                </label>
                <input
                  id="author"
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter author name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="categoryId" className="mb-2 block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter book description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="coverImage" className="mb-2 block text-sm font-medium text-gray-700">
                  Upload Cover Image *
                </label>
                <input
                  id="coverImage"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                />
                {coverImagePreview && (
                  <Image
                    src={coverImagePreview}
                    alt="Cover preview"
                    width={128}
                    height={192}
                    className="mt-2 h-48 w-32 rounded-lg border object-cover"
                  />
                )}
              </div>

              <div>
                <label htmlFor="pdfFile" className="mb-2 block text-sm font-medium text-gray-700">
                  Upload PDF File *
                </label>
                <input
                  id="pdfFile"
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                />
                {pdfFile && <p className="mt-2 text-sm text-green-600">✓ {pdfFile.name}</p>}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="publicationYear" className="mb-2 block text-sm font-medium text-gray-700">
                  Publication Year
                </label>
                <input
                  id="publicationYear"
                  type="number"
                  name="publicationYear"
                  value={formData.publicationYear}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  placeholder="2024"
                />
              </div>

              <div>
                <label htmlFor="isbn" className="mb-2 block text-sm font-medium text-gray-700">
                  ISBN
                </label>
                <input
                  id="isbn"
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  placeholder="978-0-123456-78-9"
                />
              </div>

              <div>
                <label htmlFor="tags" className="mb-2 block text-sm font-medium text-gray-700">
                  Tags
                </label>
                <input
                  id="tags"
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  placeholder="business, finance"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-gray-900">🚀 Publishing Options</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600"
              />
              <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                Featured Book (Show on homepage)
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isPublished"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600"
              />
              <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
                Publish Book (Make visible to users)
              </label>
            </div>

            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-sm text-yellow-800">💡 Keep unpublished while generating summary and audio</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white hover:shadow-lg disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Book'}
          </button>
        </div>
      </form>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-gray-900">🤖 AI Summary Generation</h2>
        <div className="space-y-4">
          <p className="text-gray-600">Generate AI-powered summary using ChatGPT</p>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm text-blue-800">{summaryProgress || 'Generate Summary'}</p>
          </div>

          <button
            type="button"
            disabled={!bookId || generatingSummary}
            onClick={handleGenerateSummary}
            className="rounded-lg bg-linear-to-r from-green-600 to-emerald-600 px-6 py-3 font-semibold text-white hover:shadow-lg disabled:opacity-50"
          >
            {generatingSummary ? 'Generating Summary...' : 'Generate Summary with ChatGPT'}
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-gray-900">🎧 Audio Generation</h2>
        <div className="space-y-4">
          <p className="text-gray-600">Generate audio using Text-to-Speech</p>

          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
            <p className="text-sm text-purple-800">{audioStatus}</p>
          </div>

          <button
            type="button"
            disabled={!bookId}
            className="rounded-lg bg-linear-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white hover:shadow-lg disabled:opacity-50"
          >
            🎧 Generate Audio
          </button>
        </div>
      </div>
    </div>
  );
}
