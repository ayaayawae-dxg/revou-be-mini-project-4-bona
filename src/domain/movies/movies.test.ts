import { PoolConnection } from "mysql2/promise";
import moviesRepository from "../movies/movies.repository";
import moviesService from "../movies/movies.service";
import { GetMoviesByIdResponse } from "./movies.model";

jest.mock("./movies.repository", () => ({
  checkDuplicateTitle: jest.fn(),
  checkUpdateDuplicateTitle: jest.fn(),
  create: jest.fn(),
  get: jest.fn(),
  getDetail: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));

describe("movies service", () => {
  let connection: PoolConnection;

  beforeEach(() => {
    connection = {} as PoolConnection;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("get", () => {
    it("should return movies data", async () => {
      const mockMovieData = [
        {
          id: 1,
          title: "Test title 1",
          duration: 120,
          show_time: [
            "2024-04-15 03:55:00",
            "2024-05-13 03:00:00",
            "2024-05-13 08:30:00",
          ],
          genre: ["Test genre 1", "test genre 2"],
        },
      ];

      (moviesRepository.get as jest.Mock).mockResolvedValueOnce(mockMovieData);

      const moviesData = await moviesService.get(connection, {});
      expect(moviesData).toHaveLength(1);
      expect(moviesData[0].id).toBe(1);
    });

    it("should return empty array if no movies found", async () => {
      (moviesRepository.get as jest.Mock).mockResolvedValue([]);

      const moviesData = await moviesService.get(connection, {});
      expect(moviesData).toEqual([]);
    });
  });

  describe("get by id", () => {
    it("should return movie data with detail", async () => {
      const mockMovieData = [
        {
          id: 1,
          title: "Test title 1",
          rating: "G",
          duration: 120,
          synopsis: "Test sinopsis",
          show_time: ["2024-04-15 03:55:00", "2024-05-13 03:00:00"],
          cast: [
            { actor: "Actor 1", as_character: "Character A" },
            { actor: "Actor 2", as_character: "Character B" },
          ],
          director: ["Director 1"],
          genre: ["Horror", "Comedy"],
        },
      ];

      (moviesRepository.getDetail as jest.Mock).mockResolvedValueOnce(
        mockMovieData
      );

      const movieData = await moviesService.getById(connection, { movieId: 1 });
      expect(movieData.id).toBe(1);
    });

    it("should return no data if no movies found", async () => {
      (moviesRepository.get as jest.Mock).mockResolvedValue([]);

      const moviesData = await moviesService.get(connection, {});
      expect(moviesData).toEqual([]);
    });
  });

  describe("create", () => {
    it("should create a new movie", async () => {
      const createMovieRequest = {
        duration: 120,
        rating: "R",
        synopsis: "Test Synopsis",
        title: "Test title",
        director: ["Test director"],
        cast: [
          { actor: "test director 1", as_character: "Test character 1" },
          { actor: "test director 2", as_character: "Test character 2" },
        ],
        genre: ["Test Genre 1", "Test Genre 2", "Test Genre 3"],
      };

      (moviesRepository.checkDuplicateTitle as jest.Mock).mockResolvedValueOnce(
        false
      );
      (moviesRepository.create as jest.Mock).mockResolvedValueOnce({ id: 1 });

      const result = await moviesService.create(connection, createMovieRequest);

      expect(result.id).toBeDefined();
    });

    it("should throw an error if the movie title is duplicate", async () => {
      const createMovieRequest = {
        duration: 120,
        rating: "R",
        synopsis: "Test Synopsis",
        title: "Test title",
        director: ["Test director"],
        cast: [
          { actor: "test director 1", as_character: "Test character 1" },
          { actor: "test director 2", as_character: "Test character 2" },
        ],
        genre: ["Test Genre 1", "Test Genre 2", "Test Genre 3"],
      };

      (moviesRepository.checkDuplicateTitle as jest.Mock).mockResolvedValueOnce(
        true
      );

      await expect(
        moviesService.create(connection, createMovieRequest)
      ).rejects.toThrow("Movies with same title already registered.");
    });
  });

  describe("update", () => {
    it("should update existing movie", async () => {
      const mockMovieId = 1;
      const mockMovieTitle = "Test title";

      const updateMovieRequest = {
        id: mockMovieId,
        duration: 120,
        rating: "R",
        synopsis: "Test Synopsis",
        title: mockMovieTitle,
        director: ["Test director"],
        cast: [
          { actor: "test director 1", as_character: "Test character 1" },
          { actor: "test director 2", as_character: "Test character 2" },
        ],
        genre: ["Test Genre 1", "Test Genre 2", "Test Genre 3"],
      };

      (
        moviesRepository.checkUpdateDuplicateTitle as jest.Mock
      ).mockResolvedValueOnce(false);
      (moviesRepository.update as jest.Mock).mockResolvedValueOnce({
        id: mockMovieId,
        title: mockMovieTitle,
      });

      const result = await moviesService.update(connection, updateMovieRequest);

      expect(result.id).toBe(1);
    });

    it("should throw an error if the updated movie title is duplicate", async () => {
      const mockMovieId = 1;
      const mockMovieTitle = "Test title";

      const updateMovieRequest = {
        id: mockMovieId,
        duration: 120,
        rating: "R",
        synopsis: "Test Synopsis",
        title: mockMovieTitle,
        director: ["Test director"],
        cast: [
          { actor: "test director 1", as_character: "Test character 1" },
          { actor: "test director 2", as_character: "Test character 2" },
        ],
        genre: ["Test Genre 1", "Test Genre 2", "Test Genre 3"],
      };

      (
        moviesRepository.checkUpdateDuplicateTitle as jest.Mock
      ).mockResolvedValueOnce(true);

      await expect(
        moviesService.update(connection, updateMovieRequest)
      ).rejects.toThrow("Movies with same title already registered");
    });
  });

  describe("delete", () => {
    it("should delete movie", async () => {
      const deleteMovieRequest = { movieId: 1 };

      (moviesRepository.remove as jest.Mock).mockResolvedValueOnce(null);
      
      await moviesService.remove(connection, deleteMovieRequest);
      expect(moviesRepository.remove).toHaveBeenCalledWith(connection, 1);
    });
  });
});
