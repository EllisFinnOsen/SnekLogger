import { useState, useEffect } from "react";
import { useSQLiteContext, type SQLiteDatabase } from "expo-sqlite";

interface Pet {
  id: number;
  name: string;
  species: string;
  morph: string;
  birthDate: string;
  weight: number;
  imageURL: string;
}

const useFetch = (query: string) => {
  const [data, setData] = useState<Pet[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const database = useSQLiteContext();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const results = (await database.getAllAsync(query)) as Pet[];
      setData(results);
      setError(null);
    } catch (err) {
      console.error("Error fetching data from database:", err);
      const error = err as Error;
      setError(error.message || "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [query, database]);

  // Define refetch as a function
  const refetch = async () => {
    await fetchData();
  };

  return { data, isLoading, error, refetch };
};

export default useFetch;
