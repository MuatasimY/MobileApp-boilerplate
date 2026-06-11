import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_BETTER_AUTH_BASE_URL || "http://localhost:5000",
  plugins: [
    expoClient({
      scheme: Constants.expoConfig?.scheme || "myapp",
      storagePrefix: "boilerplate",
      storage: SecureStore,
    }),
  ],
});
