import {type Config} from "drizzle-kit";

import {env} from "../../base/src/env";

export default {
    schema: "./src/server/db/schema.ts",
    dialect: "mysql",
    dbCredentials: {
        url: env.DATABASE_URL,
    },
    tablesFilter: ["project1_*"],
} satisfies Config;
