import type { EventHandlerRequest, H3Event } from "h3";
import { Paprika } from "../paprika/client";
import { PaprikaApiInvalidLoginDetailsError } from "../paprika/errors";
import { ServerResponse } from 'node:http';
import formidable from "formidable";
import { decompressGzipStreamToText } from "../utils/compression";
import { getFirst } from "~/lib/utils/conversion";
import { createReadStream } from 'node:fs'
import { Readable } from 'node:stream'
import type { ReadableStream } from "node:stream/web";

// We cache client objects rather than creating them on every request since
// each object instantiates a Cache() object which might have it's own in-memory
// cache or open a connection to an external data source. Thus caching the
// paprika client also caches this Cache() object with it's connections or
// in-memory cache.
const clientCache: Record<string, Paprika | undefined> = {};

export function getPaprikaClient(event: H3Event<EventHandlerRequest>) {
	const headers = getHeaders(event);
	const auth = headers.authorization?.trim().split(/\s+/)[1];
	if (!auth) {
		throw new PaprikaApiInvalidLoginDetailsError();
	}
	let client = clientCache[auth];
	if (!client) {
		client = new Paprika({ auth });
		clientCache[auth] = client;
	}
	return client;
}

export async function createPaprikaResponse(getRes: () => Promise<unknown>) {
	try {
		const response = await getRes()
		if (response instanceof ServerResponse) {
			return response
		}
		if (response instanceof Error) {
			throw response
		}
		
		return {
			result: response,
		};
	} catch (error) {
		if (error instanceof PaprikaApiInvalidLoginDetailsError) {
			return new Response(
				JSON.stringify({
					error: { code: 0, message: "Invalid or expired credentials." },
				}),
				{
					status: 401,
					headers: { "content-type": "application/json" },
				},
			);
		}
		throw error;
	}
}

export async function getGzippedPayload(event: H3Event<EventHandlerRequest>) {
	const form = formidable({ multiples: true })

	const { files } = await new Promise<{
		fields: formidable.Fields
		files: formidable.Files
	}>((resolve, reject) => {
		form.parse(event.node.req, (err, fields, files) => {
			if (err) reject(err)
			else resolve({ fields, files })
		})
	})
	const file = getFirst(files.data)
	if (!file) {
		throw Error("Request has invalid payload")
	}

	const toWebReadable = (nodeStream: Readable): ReadableStream<unknown> => {
		return Readable.toWeb(nodeStream)
	}
	const nodeStream = createReadStream(file.filepath)
	const webStream = toWebReadable(nodeStream)

	const payloadText = await decompressGzipStreamToText(webStream)

	return JSON.parse(payloadText)
}