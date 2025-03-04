import type { NextApiRequest, NextApiResponse } from "next";

export interface TalentPassportSocial {
  "follower_count": string;
  "following_count": string;
  "profile_bio": string;
  "profile_display_name": string;
  "profile_image_url": string;
  "profile_name": string;
  "profile_url": string;
  "source": string;
}

interface TalentSocialsErrorResponse {
  error: string;
}

interface PassportCredentialsResponse {
  passport: {
    passport_socials: TalentPassportSocial[];
  }
}

export const revalidate = 86400; // Cache for 24 hours

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    TalentPassportSocial[] | TalentSocialsErrorResponse
  >,
) {
  const { address } = req.query;

  if (!address || typeof address !== "string") {
    return res.status(400).json({ error: "Address parameter is missing or invalid" });
  }

  const response = await fetch(`https://api.talentprotocol.com/api/v2/passports/${address}`, {
    method: "GET",
    headers: {
      "X-API-KEY": process.env.TALENT_PASSPORT_API_KEY!,
    },
  });

  if (response.status !== 200) {
    console.error("Failed to fetch socials", response.json());
    return res.status(500).json({ error: "Failed to fetch socials" });
  }
  
  const { passport } = await response.json() as PassportCredentialsResponse;
  const { passport_socials } = passport;

  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=86400");
  return res.status(200).json(passport_socials.map((social) => ({
    follower_count: social.follower_count,
    following_count: social.following_count,
    profile_bio: social.profile_bio,
    profile_display_name: social.profile_display_name,
    profile_image_url: social.profile_image_url,
    profile_name: social.profile_name,
    profile_url: social.profile_url,
    source: social.source,
  })));
}

export default handler;
