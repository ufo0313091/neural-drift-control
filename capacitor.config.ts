import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.urgeos.app",
  appName: "衝動コントロール",
  webDir: "dist-cap",
  server: { androidScheme: "https" },
  ios: {
    contentInset: "always",
    backgroundColor: "#0a0a0a",
    preferredContentMode: "mobile",
  },
};

export default config;
