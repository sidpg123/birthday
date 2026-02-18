import axios from "axios";

interface MemoryInput {
  imageUrl: string;
  caption?: string;
  order: number;
}

interface PublishWishPayload {
  wishId: string;
  senderName: string;
  recipientName: string;
  message: string;
  envelopeImageUrl: string;
  memories: MemoryInput[];
}

export const publishWish = async (payload: PublishWishPayload) => {
  const res = await axios.post("/api/wish/publish", payload);

  return res.data;
};
