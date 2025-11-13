import { openai } from '@ai-sdk/openai';
import { assert } from 'convex-helpers';
import { generateText } from 'ai';
import type { StorageActionWriter } from 'convex/server';
import { Id } from '../_generated/dataModel';

const AI_MODELS = {
  image: openai.chat('gpt-5-mini-2025-08-07'),
  pdf: openai.chat('gpt-5-mini-2025-08-07'),
  html: openai.chat('gpt-5-mini-2025-08-07'),
} as const;

const SUPPORTED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
] as const;

const SYSTEM_PROMPTS = {
  image: `You are an AI assistant that extracts and describes text content from images. 
  Provide a concise summary of the text found in the image, including any relevant details such as font style, color, and layout. 
  If no text is found, respond with "No text found in the image."`,
  pdf: `You are an AI assistant that extracts and summarizes text content from PDF documents. 
  Provide a concise summary of the main points and key information contained in the document.`,
  html: `You are an AI assistant that extracts and summarizes text content from HTML files. 
  Translate the HTML content into markdown format, preserving the structure and formatting of the original document.`,
};

export type extractTextContentArgs = {
  mimeType: string;
  bytes?: ArrayBuffer;
  fileName: string;
  storageId: Id<'_storage'>;
};
export async function extractTextContent(
  ctx: { storage: StorageActionWriter },
  args: extractTextContentArgs,
): Promise<string> {
  const { mimeType, bytes, fileName, storageId } = args;
  const url = await ctx.storage.getUrl(storageId);
  assert(url, 'Failed to get file URL from storage');
  if (SUPPORTED_IMAGE_TYPES.some((type) => type === mimeType)) {
    return extractImageText(url);
  }
  if (mimeType.toLowerCase().includes('pdf')) {
    return extractPdfText(url, mimeType, fileName);
  }
  if (mimeType.toLowerCase().includes('text')) {
    return extractTextFileContent(ctx, storageId, bytes, mimeType);
  }
  throw new Error(`Unsupported mime type for text extraction: ${mimeType}`);
}
async function extractImageText(url: string): Promise<string> {
  const result = await generateText({
    model: AI_MODELS.image,
    system: SYSTEM_PROMPTS.image,
    messages: [
      {
        role: 'user',
        content: [{ type: 'image', image: new URL(url) }],
      },
    ],
  });
  return result.text;
}

async function extractPdfText(
  url: string,
  mimeType: string,
  filename: string,
): Promise<string> {
  const result = await generateText({
    model: AI_MODELS.pdf,
    system: SYSTEM_PROMPTS.pdf,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'file', data: new URL(url), mediaType: mimeType, filename },

          {
            type: 'text',
            text: 'Please summarize the content of this PDF document.',
          },
        ],
      },
    ],
  });
  return result.text;
}

async function extractTextFileContent(
  ctx: { storage: StorageActionWriter },
  storageId: Id<'_storage'>,
  bytes: ArrayBuffer | undefined,
  mimeType: string,
): Promise<string> {
  const arrayBuffer =
    bytes || (await (await ctx.storage.get(storageId))?.arrayBuffer());
  if (!arrayBuffer) {
    throw new Error('Failed to get file content');
  }
  const text = new TextDecoder().decode(arrayBuffer);
  if (mimeType.toLowerCase() !== 'text/plain') {
    const result = await generateText({
      model: AI_MODELS.html,
      system: SYSTEM_PROMPTS.html,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text },
            {
              type: 'text',
              text: 'Please convert the above content into markdown format.',
            },
          ],
        },
      ],
    });
    return result.text;
  }
  return text;
}
