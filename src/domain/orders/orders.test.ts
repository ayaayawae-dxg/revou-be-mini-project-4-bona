import { PoolConnection } from "mysql2/promise";
import ordersRepository from "../orders/orders.repository";
import ordersService from "../orders/orders.service";
import screeningRepository from "../screening/screening.repository";
import { GetOrderHistoryResponse } from "./orders.model";

jest.mock("./orders.repository", () => ({
  create: jest.fn(),
  getOrderHistory: jest.fn(),
}));

jest.mock("../screening/screening.repository", () => ({
  getByMovieAndTime: jest.fn(),
  checkSeat: jest.fn(),
}));

describe("orders service", () => {
  let connection: PoolConnection;

  beforeEach(() => {
    connection = {} as PoolConnection;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create order", async () => {
      const mockScreeningId = 1;
      const mockIsSeatAvailable = true;

      const createOrderRequest = {
        movie_id: "1",
        show_time: "2024-05-19 06:00:00",
        seat_id: [4],
        user_id: 1,
      };

      (
        screeningRepository.getByMovieAndTime as jest.Mock
      ).mockResolvedValueOnce(mockScreeningId);
      (screeningRepository.checkSeat as jest.Mock).mockResolvedValueOnce(
        mockIsSeatAvailable
      );
      (ordersRepository.create as jest.Mock).mockResolvedValueOnce({
        id: "sdakm-123asd-m32j",
      });

      const ordersData = await ordersService.create(
        connection,
        createOrderRequest
      );
      expect(ordersData.id).toBe("sdakm-123asd-m32j");
    });

    it("should throw an error if the movie has no screening time", async () => {
      const createOrderRequest = {
        movie_id: "1",
        show_time: "2024-05-19 06:00:00",
        seat_id: [4],
        user_id: 1,
      };

      (
        screeningRepository.getByMovieAndTime as jest.Mock
      ).mockResolvedValueOnce(false);

      await expect(
        ordersService.create(connection, createOrderRequest)
      ).rejects.toThrow("No screening time for the selected movie");
    });

    it("should throw an error if the selected seat is not available", async () => {
      const mockScreeningId = 1;

      const createOrderRequest = {
        movie_id: "1",
        show_time: "2024-05-19 06:00:00",
        seat_id: [4],
        user_id: 1,
      };

      (
        screeningRepository.getByMovieAndTime as jest.Mock
      ).mockResolvedValueOnce(mockScreeningId);
      (screeningRepository.checkSeat as jest.Mock).mockResolvedValueOnce(false);

      await expect(
        ordersService.create(connection, createOrderRequest)
      ).rejects.toThrow("Seat is already filled. Please choose another seat.");
    });
  });

  describe("order history", () => {
    it("should get the user's history order", async () => {
      const getOrderHistoryRequest = { user_id: 1 };
      const mockOrderHistoryData = [
        {
          id: "439b8c0b-76ba-4d9d-b282-df17109586f2",
          status: "READY",
          seat_id: "4",
          seat: "A4",
          show_time: "2024-05-12 23:00:00",
          title: "Movies 2",
        },
        {
          id: "44a81953-a1b9-4f54-b0d5-16b7b3bd112e",
          status: "READY",
          seat_id: "5,6",
          seat: "B1,B2",
          show_time: "2024-05-12 23:00:00",
          title: "Movies 2",
        },
      ];

      (ordersRepository.getOrderHistory as jest.Mock).mockResolvedValueOnce(
        mockOrderHistoryData
      );

      const result = await ordersService.getOrderHistory(connection, getOrderHistoryRequest);
      expect(result).toHaveLength(2);
    });
  });
});
