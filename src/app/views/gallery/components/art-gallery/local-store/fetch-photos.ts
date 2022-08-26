// export type Photo = {
//   albumId: number;
//   id: number;
//   title: string;
//   url: string;
//   thumbnailUrl: string;
// };

export type Photo = {
  albumId: number | string;
  id: number | string;
  title: string;
  urlToBig: string;
  urlToSmall: string;
};

export async function fetchPhotosFromAlbum(album: number): Promise<Photo[] | []> {
  try {
    const photos: Photo[] = [];

    const url = `https://jsonplaceholder.typicode.com/albums/${album}/photos`;
    const response: Response = await fetch(url);
    const fetchedPhotos: any[] = await response.json();
    fetchedPhotos.map((photo) => {
      const processedPhotos = photos.push({
        albumId: photo.albumId,
        id: photo.id,
        title: photo.title,
        urlToBig: photo.url,
        urlToSmall: photo.thumbnailUrl
      });

      return processedPhotos;
    });

    // throw new Error(':('); // just throw error for test

    return photos;
  } catch {
    return [];
  }
}
