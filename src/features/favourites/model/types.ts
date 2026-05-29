export type FavouriteBook = {
  id: number;
  bookId: number;
  createdAt: string;
  book: {
    id: number;
    title: string;
    author: string;
    slug: string;
    coverImageUrl: string | null;
    category: {
      name: string;
    };
  };
};

export type AddFavouritePayload = {
  bookId: number;
};

export type AddFavouriteSuccess = {
  id: number;
  bookId: number;
};

export type FavouriteFailure = {
  error?: string;
  errors?: Record<string, string>;
};

export type RemoveFavouriteSuccess = {
  bookId: number;
};
