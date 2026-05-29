import type {
  AddFavouritePayload,
  AddFavouriteSuccess,
  FavouriteFailure,
  RemoveFavouriteSuccess,
} from '../model/types';

const safeJson = async <T>(response: Response): Promise<T | null> => {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
};

export const addFavourite = async (
  payload: AddFavouritePayload,
): Promise<{ ok: true; data: AddFavouriteSuccess } | { ok: false; data: FavouriteFailure }> => {
  const response = await fetch('/api/user/favourites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = (await safeJson<AddFavouriteSuccess | FavouriteFailure>(response)) ?? {};

  if (!response.ok) {
    return { ok: false, data: data as FavouriteFailure };
  }

  return { ok: true, data: data as AddFavouriteSuccess };
};

export const removeFavourite = async (
  bookId: number,
): Promise<{ ok: true; data: RemoveFavouriteSuccess } | { ok: false; data: FavouriteFailure }> => {
  const response = await fetch(`/api/user/favourites/${bookId}`, {
    method: 'DELETE',
  });

  const data = (await safeJson<RemoveFavouriteSuccess | FavouriteFailure>(response)) ?? {};

  if (!response.ok) {
    return { ok: false, data: data as FavouriteFailure };
  }

  return { ok: true, data: data as RemoveFavouriteSuccess };
};
