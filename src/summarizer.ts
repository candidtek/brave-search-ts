/**
 * Brave SummarizerSearch API TypeScript Definitions
 *
 * This file contains all type definitions for the Brave SummarizerSearch API,
 * including request parameters and response types.
 */

import type { MetaUrl, SearchApiResponseBase, Thumbnail } from './common.ts';

/**
 * Status values for summarizer
 */
export enum SummarizerStatus {
	/**
	 * Failed
	 */
	failed = 'failed',

	/**
	 * Complete
	 */
	complete = 'complete'
}

/**
 * Types of summary message subsets
 */
export enum SummaryMessageType {
	/**
	 * The start of an ordered list of entities
	 * Value can be ol or ul, which means an ordered list or an unordered list of entities follows respectively
	 */
	enumStart = 'enum_start',

	/**
	 * The start of an unordered list of entities
	 * There is no value
	 */
	enumEnd = 'enum_end',

	/**
	 * An entity in the summary message
	 * Value is the SummaryEntity response model
	 */
	enumItem = 'enum_item',

	/**
	 * A text excerpt in the summary message
	 */
	token = 'token'
}

/**
 * Types of enumeration lists
 */
export enum SummaryEnumListType {
	/**
	 * An ordered list of entities
	 */
	ol = 'ol',

	/**
	 * An unordered list of entities
	 */
	ul = 'ul'
}

/**
 * Query parameters for Summarizer Search API
 * @see https://api-dashboard.search.brave.com/app/documentation/summarizer-search/query#SummarizerSearchAPI
 */
export interface SummarizerSearchApiQueryParams {
	/**
	 * The key is equal to value of field summary.key in WebSearchApiResponse
	 */
	key: string;

	/**
	 * Returns extra entities info with the summary response.
	 * @default false
	 */
	entity_info?: boolean;
}

/**
 * Top level response model for successful Summarizer Search API requests
 * Access to Summarizer requires a subscription to Pro AI plan.
 * @see https://api-dashboard.search.brave.com/app/documentation/summarizer-search/responses#SummarizerSearchApiResponse
 */
export interface SummarizerSearchApiResponse extends SearchApiResponseBase {
	/**
	 * The type of summarizer search API result. The value is always summarizer.
	 */
	type: 'summarizer';

	/**
	 * The current status of summarizer for the given key.
	 * The value can be either failed or complete.
	 */
	status: SummarizerStatus;

	/**
	 * The title for the summary.
	 */
	title?: string;

	/**
	 * Details for the summary message.
	 */
	summary?: SummaryMessage[];

	/**
	 * Enrichments that can be added to the summary message.
	 */
	enrichments?: SummaryEnrichments;

	/**
	 * Followup queries relevant to the current query.
	 */
	followups?: string[];

	/**
	 * Details on the entities in the summary message.
	 */
	entities_info?: SummaryEntityInfo[];
}

/**
 * The summary message
 * @see https://api-dashboard.search.brave.com/app/documentation/summarizer-search/responses#SummaryMessage
 */
export interface SummaryMessage {
	/**
	 * The type of subset of a summary message.
	 */
	type: SummaryMessageType;

	/**
	 * The summary entity or the explanation for the type field.
	 * For type enum_start the value can be ol or ul, which means an ordered
	 * list or an unordered list of entities follows respectively.
	 * For type enum_end there is no value.
	 * For type token the value is a text excerpt.
	 * For type enum_item the value is the SummaryEntity response model.
	 */
	data?: string | SummaryEnumListType | SummaryEntity;
}

/**
 * Index-based location in a text
 * @see https://api-dashboard.search.brave.com/app/documentation/summarizer-search/responses#TextLocation
 */
export interface SummaryTextLocation {
	/**
	 * The 0-based index, where the important part of the text starts.
	 */
	start: number;

	/**
	 * The 0-based index, where the important part of the text ends.
	 */
	end: number;
}

/**
 * An entity in the summary message
 * @see https://api-dashboard.search.brave.com/app/documentation/summarizer-search/responses#SummaryEntity
 */
export interface SummaryEntity {
	/**
	 * A unique identifier for the entity.
	 */
	uuid: string;

	/**
	 * The name of the entity.
	 */
	name: string;

	/**
	 * The URL where further details on the entity can be found.
	 */
	url?: string;

	/**
	 * A text message describing the entity.
	 */
	text?: string;

	/**
	 * The image associated with the entity.
	 */
	images?: SummaryImage[];

	/**
	 * The location of the entity in the summary message.
	 */
	locations?: SummaryTextLocation[];
}

/**
 * Metadata on an image
 * @see https://api-dashboard.search.brave.com/app/documentation/summarizer-search/responses#ImageProperties
 */
export interface SummaryImageProperties {
	/**
	 * The image URL.
	 */
	url: string;
}

/**
 * A model describing an image
 * @see https://api-dashboard.search.brave.com/app/documentation/summarizer-search/responses#Image
 */
export interface SummaryImage {
	/**
	 * The thumbnail associated with the image.
	 */
	thumbnail?: Thumbnail;

	/**
	 * The URL of the image.
	 */
	url?: string;

	/**
	 * Metadata on the image.
	 */
	properties?: SummaryImageProperties;

	/**
	 * Text associated with the image.
	 */
	text?: string;
}

/**
 * Enrichments associated with the summary message
 * @see https://api-dashboard.search.brave.com/app/documentation/summarizer-search/responses#SummaryEnrichments
 */
export interface SummaryEnrichments {
	/**
	 * The raw summary message.
	 */
	raw: string;

	/**
	 * The images associated with the summary.
	 */
	images?: SummaryImage[];

	/**
	 * The answers in the summary message.
	 */
	answers?: SummaryAnswer[];

	/**
	 * The entities in the summary message.
	 */
	entities?: SummaryEntity[];

	/**
	 * References based on which the summary was built.
	 */
	context?: SummaryContext[];
}

/**
 * The answer if the query is a question
 * @see https://api-dashboard.search.brave.com/app/documentation/summarizer-search/responses#SummaryAnswer
 */
export interface SummaryAnswer {
	/**
	 * The answer text.
	 */
	answer: string;

	/**
	 * A score associated with the answer.
	 */
	score?: number;

	/**
	 * The location of the answer in the summary message.
	 */
	highlight?: SummaryTextLocation;
}

/**
 * A reference for the summary
 * @see https://api-dashboard.search.brave.com/app/documentation/summarizer-search/responses#SummaryContext
 */
export interface SummaryContext {
	/**
	 * The title of the reference.
	 */
	title: string;

	/**
	 * The URL where the reference can be found.
	 */
	url: string;

	/**
	 * Details on the URL associated with the reference.
	 */
	meta_url?: MetaUrl;
}

/**
 * Details on the entity in the summary message
 * @see https://api-dashboard.search.brave.com/app/documentation/summarizer-search/responses#SummaryEntityInfo
 */
export interface SummaryEntityInfo {
	/**
	 * The name of the provider.
	 */
	provider?: string;

	/**
	 * Description of the entity.
	 */
	description?: string;
}
