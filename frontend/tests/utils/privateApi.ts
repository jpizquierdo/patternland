// Note: the `PrivateService` is only available when generating the client
// for local environments
import { OpenAPI, PrivateService } from "../../src/client"

async function loadConfig() {
  const response = await fetch("/config.json");
  const config = await response.json();
  return config;
}

loadConfig().then((config) => {
  OpenAPI.BASE = config.VITE_API_URL;
})

export const createUser = async ({
  email,
  password,
}: {
  email: string
  password: string
}) => {
  return await PrivateService.createUser({
    requestBody: {
      email,
      password,
      is_verified: true,
      full_name: "Test User",
    },
  })
}
