/**
 * Brave SuggestSearch API TypeScript Definitions
 *
 * This file contains all type definitions for the Brave SuggestSearch API,
 * including request parameters and response types.
 */

import type { SearchApiQueryParamsBase, SearchApiResponseBase, SearchLanguage } from './common.ts';

/**
 * Query parameters for Suggest Search API
 * @see https://api-dashboard.search.brave.com/app/documentation/suggest/query#SuggestSearchAPI
 */
export interface SuggestSearchApiQueryParams extends SearchApiQueryParamsBase {
	/**
	 * The spell check search language preference, where potentially the results could come from.
	 * The 2 or more character language code for which the spell check search results are provided.
	 * This is a just a hint for calculating spell check responses.
	 * @default SearchLanguage.english
	 */
	lang?: SearchLanguage;

	/**
	 * The number of suggestion search results returned in response.
	 * The actual number of results delivered may be less than requested.
	 * Minimum is 1 and maximum is 20.
	 * @default 5
	 */
	count?: number;

	/**
	 * Whether to enhance suggestions with rich results.
	 * This requires a paid autosuggest subscription.
	 * @default false
	 */
	rich?: boolean;
}

/**
 * Top level response model for successful Suggest Search API requests
 * @see https://api-dashboard.search.brave.com/app/documentation/suggest/responses#SuggestSearchApiResponse
 */
export interface SuggestSearchApiResponse extends SearchApiResponseBase {
	/**
	 * The type of search api result. The value is always suggest.
	 */
	type: 'suggest';

	/**
	 * Query information.
	 */
	query: SuggestSearchQuery;

	/**
	 * The list of suggestions for the query.
	 */
	results: SuggestResult[];
}

/**
 * A model representing information gathered around the requested query
 * @see https://api-dashboard.search.brave.com/app/documentation/suggest/responses#Query
 */
export interface SuggestSearchQuery {
	/**
	 * The original query that was requested.
	 */
	original: string;
}

/**
 * Suggestions for a query
 * @see https://api-dashboard.search.brave.com/app/documentation/suggest/responses#SuggestResult
 */
export interface SuggestResult {
	/**
	 * Suggested query completion.
	 */
	query: string;

	/**
	 * Whether the suggested enriched query is an entity.
	 */
	is_entity?: boolean;

	/**
	 * The suggested query enriched title.
	 */
	title?: string;

	/**
	 * The suggested query enriched description.
	 */
	description?: string;

	/**
	 * The suggested query enriched image url.
	 */
	img?: string;
}
