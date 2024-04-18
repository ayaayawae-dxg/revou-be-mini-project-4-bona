import { RowDataPacket } from "mysql2";

export interface GetIdByMovieAndTimeModel {
  movie_id: string;
  show_time: string;
}

export interface CheckSeatModel {
  screening_id: string;
  seat_id: number[];
}

export interface CreateScreeningRequest {
  movie_id: number;
  theatre_id: number;
  show_time: string[];
}

export interface CreateScreeningResponse {}