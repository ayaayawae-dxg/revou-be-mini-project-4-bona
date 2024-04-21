import { PoolConnection } from "mysql2/promise";

import config from "../../config/config";
import { createError } from "../../common/createError";

import { CreateScreeningRequest, CreateScreeningResponse } from "./screening.model";
import screeningRepository from "./screening.repository";

const create = async (
  connection: PoolConnection,
  createScreeningRequest: CreateScreeningRequest
): Promise<void> => {
  const createMovie = await screeningRepository.create(connection, createScreeningRequest);
};

export default {
  create,
};
