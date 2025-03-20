import { ImageResponse } from "next/og";
import type { NextApiRequest, NextApiResponse } from "next";

export const runtime = "edge";
export const revalidate = 86400; // Cache for 24 hours

const networkLogos: Record<string, string> = {
  "10": "/images/networks/optimism.png",
  "8453": "/images/networks/base.png",
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // @ts-ignore
  const searchParams = req.nextUrl.searchParams
  const logo = searchParams.get("logo");
  const chainId = searchParams.get("chainId");

  if (!logo || typeof logo !== "string") {
    return res.status(400).json({ error: "logo parameter is missing or invalid" });
  }
  if (!chainId || typeof chainId !== "string") {
    return res.status(400).json({ error: "chainId parameter is missing or invalid" });
  }
  if (!networkLogos[chainId]) {
    return res.status(400).json({ error: "invalid chainId parameter specified" });
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          fontSize: 12,
          color: 'black',
          width: '100%',
          height: '100%',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img src={logo} width={24} height={24}  alt="logo image" />
        <img
          alt="network logo"
          width={12}
          height={12}
          src={process.env.NEXT_PUBLIC_URL + networkLogos[chainId]}
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
          }}
        />
      </div>
    ),
    {
      width: 24,
      height: 24,
    },
  );
}

export default handler;
