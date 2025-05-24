/**
 * Brave SpellcheckSearch API TypeScript Definitions
 *
 * This file contains all type definitions for the Brave SpellcheckSearch API,
 * including request parameters and response types.
 */

import type { SearchApiQueryParamsBase, SearchApiResponseBase, SearchLanguage } from './common.ts';

/**
 * Query parameters for Spellcheck API
 * @see https://api-dashboard.search.brave.com/app/documentation/spellcheck/query#SpellcheckAPIQueryParameters
 */
export interface SpellcheckSearchApiQueryParams extends SearchApiQueryParamsBase {
	/**
	 * The spell check search language preference, where potentially the results could come from.
	 * The 2 or more character language code for which the spell check search results are provided.
	 * This is a just a hint for calculating spell check responses.
	 * @default SearchLanguage.english
	 */
	lang?: SearchLanguage;
}

/**
 * Top level response model for successful Spellcheck API requests
 * @see https://api-dashboard.search.brave.com/app/documentation/spellcheck/responses#SpellCheckSearchApiResponse
 */
export interface SpellcheckSearchApiResponse extends SearchApiResponseBase {
	/**
	 * The type of search api result. The value is always spellcheck.
	 */
	type: 'spellcheck';

	/**
	 * Spellcheck search query string. Only the original query is returned.
	 */
	query: SpellcheckSearchQuery;

	/**
	 * The list of spell-checked results for given query.
	 */
	results: SpellcheckResult[];
}

/**
 * A model representing information gathered around the requested query
 * @see https://api-dashboard.search.brave.com/app/documentation/spellcheck/responses#Query
 */
export interface SpellcheckSearchQuery {
	/**
	 * The original query that was requested.
	 */
	original: string;
}

/**
 * Spell-checked query result
 * @see https://api-dashboard.search.brave.com/app/documentation/spellcheck/responses#SpellCheckResult
 */
export interface SpellcheckResult {
	/**
	 * The spellcheck-corrected query.
	 */
	query: string;
}
