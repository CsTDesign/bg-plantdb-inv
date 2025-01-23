import {
  NextApiRequest,
  NextApiResponse
} from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { orderId } = req.query;

  if (!orderId || Array.isArray(orderId)) {
    return res.status(400).json({
      error: "Invalid order ID"
    });
  }

  res.status(200).json({ orderId });
}