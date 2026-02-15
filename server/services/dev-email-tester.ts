import fs from "fs";
import path from "path";

interface OTPLog {
  email: string;
  otp: string;
  timestamp: string;
}

const DEV_OTP_LOG_FILE = path.join(process.cwd(), ".dev-otp-log.json");

export function logOTPForDevelopment(email: string, otp: string): void {
  const isDev = process.env.NODE_ENV !== "production";

  if (!isDev) {
    return;
  }

  const log: OTPLog = {
    email,
    otp,
    timestamp: new Date().toISOString(),
  };

  try {
    let logs: OTPLog[] = [];

    if (fs.existsSync(DEV_OTP_LOG_FILE)) {
      const content = fs.readFileSync(DEV_OTP_LOG_FILE, "utf-8");
      logs = JSON.parse(content);
    }

    logs.unshift(log);
    logs = logs.slice(0, 10);

    fs.writeFileSync(DEV_OTP_LOG_FILE, JSON.stringify(logs, null, 2));
  } catch (error) {
    console.error("Failed to log OTP to file:", error);
  }
}

export function printOTPToConsole(email: string, otp: string): void {
  console.log("\n");
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║                  📧 OTP VERIFICATION CODE                 ║");
  console.log("╠═══════════════════════════════════════════════════════════╣");
  console.log(`║  Email: ${email.padEnd(50).substring(0, 50)} │`);
  console.log("║                                                           ║");
  console.log(`║  OTP Code:  ${otp}                               ║`);
  console.log("║                                                           ║");
  console.log("║  ⏱️  Valid for: 10 minutes                               ║");
  console.log("╚═══════════════════════════════════════════════════════════╝");
  console.log("\n");
}
