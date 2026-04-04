/**
 * Base types for repositories.
 * Repositories are responsible for database operations and should 
 * ALWAYS enforce tenant isolation (bandId).
 */

export interface BaseRepository<T> {
  findById(id: string, bandId: string): Promise<T | null>;
  findAll(bandId: string): Promise<T[]>;
  delete(id: string, bandId: string): Promise<void>;
}

/**
 * Common pagination and filtering types.
 */
export type QueryOptions = {
  skip?: number;
  take?: number;
  orderBy?: Record<string, 'asc' | 'desc'>;
};
