import { action, mutation, query, QueryCtx } from '../_generated/server';
import { v } from 'convex/values';
import { ConvexError } from 'convex/values';
import {
  contentHashFromArrayBuffer,
  Entry,
  EntryId,
  guessMimeTypeFromContents,
  guessMimeTypeFromExtension,
  vEntryId,
} from '@convex-dev/rag';
import { extractTextContent } from '../lib/extractTextContent';
import rag from '../system/ai/rag';
import { th } from 'zod/v4/locales';
import { Id } from '../_generated/dataModel';
import { paginationOptsValidator } from 'convex/server';
import { internal } from '../_generated/api';

function guessMimeType(fileName: string, bytes: ArrayBuffer): string {
  return (
    guessMimeTypeFromContents(bytes) ||
    guessMimeTypeFromExtension(fileName) ||
    'application/octet-stream'
  );
}

export const addFile = action({
  args: {
    fileName: v.string(),
    mimeType: v.string(),
    bytes: v.bytes(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: 'Unauthorized',
        code: 'UNAUTHORIZED',
      });
    }
    const orgId = identity.orgId as string;
    if (!orgId) {
      throw new ConvexError({
        message: 'Unauthorized',
        code: 'UNAUTHORIZED',
      });
    }
    const subscription = await ctx.runQuery(
      internal.system.subscriptions.getByOrganizationId,
      {
        organizationId: orgId,
      },
    );
    if (subscription?.status !== 'active') {
      throw new ConvexError({
        code: 'BAD_REQUEST',
        message: 'Not subscribe',
      });
    }

    const { fileName, bytes, category } = args;
    const mimeType = args.mimeType || guessMimeType(fileName, bytes);
    const blob = new Blob([bytes], { type: mimeType });

    const storageId = await ctx.storage.store(blob);

    const text = await extractTextContent(ctx, {
      mimeType,
      bytes,
      fileName,
      storageId,
    });
    const { entryId, created } = await rag.add(ctx, {
      //what search space to add this to,you cannot search across namespaces
      //if nor added,it will be considered global
      namespace: orgId,
      text,
      key: fileName,
      title: fileName,
      metadata: {
        storageId,
        uploadedBy: orgId,
        fileName,
        category: category ?? null,
      } as EntryMetadata,
      contentHash: await contentHashFromArrayBuffer(bytes),
      //to avoid re-inserting if the file content hasn't changed
    });
    if (!created) {
      console.log(`File with hash already exists,skipping insert:${fileName}`);
      await ctx.storage.delete(storageId);
    }
    return {
      url: await ctx.storage.getUrl(storageId),
      entryId,
    };
  },
});

export const deleteFile = mutation({
  args: {
    entryId: vEntryId,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: 'Unauthorized',
        code: 'UNAUTHORIZED',
      });
    }
    const orgId = identity.orgId as string;
    if (!orgId) {
      throw new ConvexError({
        message: 'Unauthorized',
        code: 'UNAUTHORIZED',
      });
    }

    const namespace = await rag.getNamespace(ctx, {
      namespace: orgId,
    });
    if (!namespace) {
      throw new ConvexError({
        message: 'invalid organization namespace',
        code: 'UNAUTHORIZED',
      });
    }
    const entry = await rag.getEntry(ctx, {
      entryId: args.entryId,
    });
    if (!entry) {
      throw new ConvexError({
        message: 'entry not found',
        code: 'not_found',
      });
    }
    if (entry.metadata?.uploadedBy !== orgId) {
      throw new ConvexError({
        message: 'unauthorized to delete this entry',
        code: 'UNAUTHORIZED',
      });
    }
    if (entry.metadata?.storageId) {
      await ctx.storage.delete(entry.metadata.storageId as Id<'_storage'>);
    }
    await rag.deleteAsync(ctx, { entryId: args.entryId });
  },
});

export const list = query({
  args: {
    category: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: 'Unauthorized',
        code: 'UNAUTHORIZED',
      });
    }
    const orgId = identity.orgId as string;
    if (!orgId) {
      throw new ConvexError({
        message: 'Unauthorized',
        code: 'UNAUTHORIZED',
      });
    }

    const namespace = await rag.getNamespace(ctx, {
      namespace: orgId,
    });
    if (!namespace) {
      return { page: [], isDone: true, continueCursor: '' };
    }
    const result = await rag.list(ctx, {
      namespaceId: namespace.namespaceId,
      paginationOpts: args.paginationOpts,
    });
    const files = await Promise.all(
      result.page.map((entry) => convertEntryToPublicFile(ctx, entry)),
    );
    const filteredFiles = args.category
      ? files.filter((file) => file.category === args.category)
      : files;
    return {
      page: filteredFiles,
      isDone: result.isDone,
      continueCursor: result.continueCursor,
    };
  },
});

export type PublicFile = {
  id: EntryId;
  name: string;
  type: string;
  size: string;
  status: 'ready' | 'processing' | 'error';
  url: string | null;
  category?: string;
};

type EntryMetadata = {
  storageId: Id<'_storage'>;
  uploadedBy: string;
  fileName: string;
  category?: string;
};

async function convertEntryToPublicFile(
  ctx: QueryCtx,
  entry: Entry,
): Promise<PublicFile> {
  const metadata = entry.metadata as EntryMetadata | undefined;
  const storageId = metadata?.storageId;

  let fileSize = 'unknown';
  if (storageId) {
    try {
      const storageMetadata = await ctx.db.system.get(storageId);
      if (storageMetadata) {
        fileSize = formatFileSize(storageMetadata.size);
      }
    } catch (err) {
      console.error('Error fetching storage metadata:', err);
    }
  }
  const filename = entry.key || 'unknown';
  const extension = filename.split('.').pop()?.toLowerCase() || 'txt';
  let status: 'ready' | 'processing' | 'error' = 'error';
  if (entry.status === 'ready') {
    status = 'ready';
  } else if (entry.status === 'pending') {
    status = 'processing';
  }
  const url = storageId ? await ctx.storage.getUrl(storageId) : null;

  return {
    id: entry.entryId,
    name: filename,
    type: extension,
    size: fileSize,
    status,
    url,
    category: metadata?.category || undefined,
  };
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) {
    return '0 Bytes';
  }
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
