import { Pool } from "pg";
import { config } from "../config.js";

const databaseUrl = new URL(config.databaseUrl);
// Hosted database TLS must verify the server certificate, not merely encrypt traffic.
if (config.isProduction) databaseUrl.searchParams.set("sslmode", "verify-full");
export const pool = new Pool({ connectionString: databaseUrl.toString() });
