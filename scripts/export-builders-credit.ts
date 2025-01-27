#!/usr/bin/env tsx
import fs from 'fs';
import path from 'path';
import { Address } from "viem";

// @ts-ignore
const API_KEY = process.env.TALENT_PASSPORT_API_KEY;
const OUTPUT_ALL = 'scripts/outdir/all_builders_credit.csv';
const OUTPUT_VALID = 'scripts/outdir/valid_builders_credit.csv';

async function main() {
  if (!fs.existsSync(OUTPUT_ALL)) {
    appendRowToCSV(OUTPUT_ALL, ["score", "address", "is_valid", "ens", "basename", "farcaster", "lens", "human_checkmark", "coinbase_verified_id", "worldcoin", "gitcoin"]);
  }
  if (!fs.existsSync(OUTPUT_VALID)) {
    appendRowToCSV(OUTPUT_VALID, ["score", "address", "is_valid", "ens", "basename", "farcaster", "lens", "human_checkmark", "coinbase_verified_id", "worldcoin", "gitcoin"]);
  }

  const totalPages = 5000 / 25;
  for (let i = 1; i <= totalPages; i++) {
    console.log(`[+] Fetching page: ${i}/${totalPages}`);

    const passports = await getPassports(i);

    for (const passport of passports) {
      console.log(`[+] Fetching passport credentials for ${passport.main_wallet}`);

      const credentials = await getCredentials(passport.passport_id);
      const isValid = isValidUser(passport.human_checkmark, credentials);

      const row = [
        passport.score.toString(),
        passport.main_wallet,
        isValid ? "yes" : "no",
        credentials["ens"] || "-",
        credentials["basename"] || "-",
        credentials["farcaster"] || "-",
        credentials["lens"] || "-",
        passport.human_checkmark ? "yes" : "no",
        credentials["coinbase_verified_id"] || "-",
        credentials["worldcoin"] || "-",
        credentials["gitcoin"] || "-",
      ];

      appendRowToCSV(OUTPUT_ALL, row);

      if (isValid) {
        appendRowToCSV(OUTPUT_VALID, row);
      }

      await sleep(2000);
    }
  }
}

const getPassports = async (page: number): Promise<{
  passport_id: number;
  human_checkmark: boolean;
  main_wallet: Address;
  score: number;
}[]> => {
  const response = await fetch(`https://api.talentprotocol.com/api/v2/passports?page=${page}`, {
    method: "GET",
    headers: {
      "X-API-KEY": API_KEY
    },
  });

  const { passports } = await response.json();
  return passports;
}

const getCredentials = async (passportId: number): Promise<Record<string, string>> => {
  const response = await fetch(`https://api.talentprotocol.com/api/v2/passport_credentials?passport_id=${passportId}`, {
    method: "GET",
    headers: {
      "X-API-KEY": API_KEY
    },
  });

  const { passport_credentials } = await response.json();
  return passport_credentials.reduce((acc, curr) => ({
    ...acc,
    [curr.type]: curr.value,
  }));
}

const isValidUser = (humanCheckmark: boolean, credentials: Record<string, string>): boolean => {
  const isValidName = !!credentials["ens"]
    || !!credentials["basename"]
    || !!credentials["farcaster"]
    || !!credentials["lens"];

  const isValidHuman = humanCheckmark
    || !!credentials["coinbase_verified_id"]
    || !!credentials["worldcoin"]
    || (credentials["gitcoin"] && parseInt(credentials["gitcoin"].replace("Humanity Score: ", "")) >= 15)

  return isValidName && isValidHuman;
}

const sleep = (milliseconds: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

const appendRowToCSV = (filePath: string, row: string[]) => {
  const csvRow = row.map(item => `"${item}"`).join(',') + '\n';
  const fullPath = path.resolve(filePath);
  fs.appendFileSync(fullPath, csvRow, 'utf8');
};

main().then(() => console.log("[*] Finished!"));