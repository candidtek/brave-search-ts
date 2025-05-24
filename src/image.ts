/**
 * Brave ImageSearch API TypeScript Definitions
 *
 * This file contains all type definitions for the Brave ImageSearch API,
 * including request parameters and response types.
 */

import type { MetaUrl, SearchApiQueryParamsBase, SearchApiResponseBase, SearchLanguage, SearchQueryInfoBase, SearchResultBase, Thumbnail } from './common.ts';

/**
 * Safe search filter levels
 */
export enum ImageSafeSearchFilter {
	/**
	 * No filtering is done
	 */
	off = 'off',

	/**
	 * Drops all adult content from search results
	 */
	strict = 'strict'
}

/**
 * Query parameters for Image Search API
 * @see https://api-dashboard.search.brave.com/app/documentation/image-search/query#ImageSearchSearchAPI
 */
export interface ImageSearchApiQueryParams extends SearchApiQueryParamsBase {
	/**
	 * The search language preference.
	 * The 2 or more character language code for which the search results are provided.
	 * @default SearchLanguage.english
	 */
	search_lang?: SearchLanguage;

	/**
	 * The number of search results returned in response.
	 * The maximum is 150.
	 * @default 50
	 */
	count?: number;

	/**
	 * Filters search results for adult content.
	 * @default ImageSafeSearchFilter.strict
	 */
	safesearch?: ImageSafeSearchFilter;

	/**
	 * Whether to spellcheck provided query. If the spellchecker is enabled,
	 * the modified query is always used for search.
	 * @default true
	 */
	spellcheck?: boolean;
}

/**
 * Top level response model for successful Image Search API requests
 * @see https://api-dashboard.search.brave.com/app/documentation/image-search/responses#ImageSearchApiResponse
 */
export interface ImageSearchApiResponse extends SearchApiResponseBase {
	/**
	 * The type of search API result. The value is always images.
	 */
	type: 'images';

	/**
	 * Image search query string.
	 */
	query: SearchQueryInfoBase;

	/**
	 * The list of image results for the given query.
	 */
	results: ImageResult[];

	/**
	 * Additional information about the image search results.
	 */
	extra: ImageExtraInfo;
}

/**
 * A model representing an image result for the requested query
 * @see https://api-dashboard.search.brave.com/app/documentation/image-search/responses#ImageResult
 */
export interface ImageResult extends SearchResultBase {
	/**
	 * The type of image search API result. The value is always image_result.
	 */
	type: 'image_result';

	/**
	 * The title of the image.
	 */
	title?: string;

	/**
	 * The original page URL where the image was found.
	 */
	url?: string;

	/**
	 * The source domain where the image was found.
	 */
	source?: string;

	/**
	 * The ISO date time when the page was last fetched.
	 * The format is YYYY-MM-DDTHH:MM:SS+00:00.
	 */
	page_fetched?: string;

	/**
	 * The thumbnail for the image.
	 */
	thumbnail?: Thumbnail;

	/**
	 * Metadata for the image.
	 */
	properties?: ImageProperties;

	/**
	 * Aggregated information on the URL associated with the image search result.
	 */
	meta_url?: MetaUrl;

	/**
	 * The confidence level for the image result.
	 */
	confidence?: 'low' | 'medium' | 'high';
}

/**
 * Metadata on an image
 * @see https://api-dashboard.search.brave.com/app/documentation/image-search/responses#Properties
 */
export interface ImageProperties {
	/**
	 * The image URL.
	 */
	url?: string;

	/**
	 * The lower resolution placeholder image URL.
	 */
	placeholder?: string;
}

/**
 * Additional information about the image search results
 * @see https://api-dashboard.search.brave.com/app/documentation/image-search/responses#Extra
 */
export interface ImageExtraInfo {
	/**
	 * Indicates whether the image search results might contain offensive content.
	 */
	might_be_offensive: boolean;
}
