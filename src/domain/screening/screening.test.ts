import { PoolConnection } from "mysql2/promise";

import screeningRepository from "./screening.repository";
import screeningService from "./screening.service";

jest.mock("./screening.repository", () => ({
  create: jest.fn(),
  checkDuplicateShowtime: jest.fn()
}));

describe("screening service", () => {
  let connection: PoolConnection;

  beforeEach(() => {
    connection = {} as PoolConnection;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create screening", async () => {
      const createScreeningRequest = {
        movie_id: 5,
        theatre_id: 2,
        show_time: [
          "2024-05-11 01:00:00",
          "2024-05-11 02:00:00",
          "2024-05-11 03:00:00",
          "2024-05-11 04:00:00",
        ],
      };

      (screeningRepository.checkDuplicateShowtime as jest.Mock).mockResolvedValueOnce(false);
      (screeningRepository.create as jest.Mock).mockResolvedValueOnce(null);

      await screeningService.create(connection, createScreeningRequest);
      expect(screeningRepository.create).toHaveBeenCalledWith(
        connection,
        createScreeningRequest
      );
    });

    it("should throw an error if show time is duplicate", async () => {
      const createScreeningRequest = {
        movie_id: 5,
        theatre_id: 2,
        show_time: [
          "2024-05-11 01:00:00",
          "2024-05-11 02:00:00",
          "2024-05-11 03:00:00",
          "2024-05-11 04:00:00",
        ],
      };

      (screeningRepository.checkDuplicateShowtime as jest.Mock).mockResolvedValueOnce(true);

      expect(screeningService.create(connection, createScreeningRequest)).rejects.toThrow("Duplicate show time")
    });
  });
});
