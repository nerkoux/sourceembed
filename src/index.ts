import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'node:crypto';

export interface SourceEmbedOptions {
	/** Cloudflare R2 access key ID */
	accessKeyId: string;
	/** Cloudflare R2 secret access key */
	secretAccessKey: string;
	/** Cloudflare R2 S3-compatible endpoint URL */
	endpoint: string;
	/** R2 bucket name */
	bucket: string;
	/** Public domain for serving files (without protocol) */
	publicDomain: string;
}

export interface StoreResult {
	/** The unique key/filename of the stored object */
	key: string;
	/** The full public URL to access the stored content */
	url: string;
}

export class SourceEmbed {
	private readonly s3: S3Client;
	private readonly bucket: string;
	private readonly publicDomain: string;

	public constructor(options: SourceEmbedOptions) {
		this.bucket = options.bucket;
		this.publicDomain = options.publicDomain;

		this.s3 = new S3Client({
			region: 'auto',
			endpoint: options.endpoint,
			credentials: {
				accessKeyId: options.accessKeyId,
				secretAccessKey: options.secretAccessKey,
			},
		});
	}

	/**
	 * Stores raw text (typically embed JSON) in R2 and returns a public URL.
	 * @param rawText - The text content to store
	 * @param extension - File extension (default: 'json')
	 * @returns The key and public URL of the stored object
	 */
	public async store(rawText: string, extension = 'json'): Promise<StoreResult> {
		const key = `${randomUUID()}.${extension}`;

		await this.s3.send(
			new PutObjectCommand({
				Bucket: this.bucket,
				Key: key,
				Body: rawText,
				ContentType: extension === 'json' ? 'application/json' : 'text/plain',
			})
		);

		return {
			key,
			url: `https://${this.publicDomain}/${key}`,
		};
	}

	/**
	 * Stores multiple raw texts in parallel.
	 * @param rawTexts - Array of text content to store
	 * @param extension - File extension (default: 'json')
	 * @returns Array of settled results (fulfilled with StoreResult or rejected with error)
	 */
	public async storeMany(rawTexts: string[], extension = 'json'): Promise<PromiseSettledResult<StoreResult>[]> {
		return Promise.allSettled(rawTexts.map((text) => this.store(text, extension)));
	}
}
