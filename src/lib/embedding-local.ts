import { pipeline } from "@xenova/transformers";

let extractor: any;

export async function getEmbeddings(text: string): Promise<number[]> {
  if (!extractor) {
    extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }

  const output = await extractor(text, {
    pooling: "mean",
    normalize: true,
  });

  return Array.from(output.data);
}

// const embedding = await getEmbeddings("hello world");
// console.log("Embedding length:", embedding.length);
