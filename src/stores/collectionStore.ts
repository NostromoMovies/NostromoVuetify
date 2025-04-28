import { ref } from 'vue';

interface CollectionItem {
  collectionItemID: number;
  collectionID: number;
  tmdbMovieID?: number;
  tmdbTvID?: number;
}

interface Collection {
  collectionID: number;
  posterPath: string | null;
  order: number;
  name: string;
  items: CollectionItem[];
}

export const useCollectionStore = () => {
  const collections = ref<Collection[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchCollections = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch('/api/collection/all', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('apikey')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      console.log("Fetched collections:", data);

      collections.value = data.map((item: any) => ({
        collectionID: item.collectionID,
        posterPath: item.posterPath ?? null,
        order: item.order ?? 0,
        name: item.name ?? "",
        items: item.items ?? []
      }));

    } catch (e) {
      console.error("Failed to fetch collections:", e);
      error.value = (e as Error).message;
    } finally {
      loading.value = false;
    }
  };

  return {
    collections,
    loading,
    error,
    fetchCollections
  };
};
