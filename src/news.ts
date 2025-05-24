/**
 * Brave NewsSearch API TypeScript Definitions
 *
 * This file contains all type definitions for the Brave NewsSearch API,
 * including request parameters and response types.
 */

import type {
	MetaUrl,
	SafeSearchFilter,
	SearchApiQueryParamsBase,
	SearchApiResponseBase,
	SearchFreshness,
	SearchLanguage,
	SearchQueryInfoBase,
	SearchResultBase,
	SearchUiLanguage,
	Thumbnail
} from './common.ts';

/**
 * Query parameters for News Search API
 * @see https://api-dashboard.search.brave.com/app/documentation/news-search/query#NewsSearchSearchAPI
 */
export interface NewsSearchApiQueryParams extends SearchApiQueryParamsBase {
	/**
	 * The search language preference.
	 * The 2 or more character language code for which the search results are provided.
	 * @default SearchLanguage.english
	 */
	search_lang?: SearchLanguage;

	/**
	 * User interface language preferred in response.
	 * Usually of the format '<language_code>-<country_code>'.
	 * @default SearchUiLanguage.englishUnitedStates
	 */
	ui_lang?: SearchUiLanguage;

	/**
	 * The number of search results returned in response.
	 * The maximum is 100.
	 * @default 20
	 */
	count?: number;

	/**
	 * The zero based offset that indicates number of search results per page (count)
	 * to skip before returning the result. The maximum is 9.
	 * In order to paginate results use this parameter together with count.
	 * @default 0
	 */
	offset?: number;

	/**
	 * Whether to spellcheck provided query. If the spellchecker is enabled,
	 * the modified query is always used for search.
	 * @default true
	 */
	spellcheck?: boolean;

	/**
	 * Filters search results for adult content.
	 * @default SafeSearchFilter.moderate
	 */
	safesearch?: SafeSearchFilter;

	/**
	 * Filters search results by when they were discovered.
	 * YYYY-MM-DDtoYYYY-MM-DD: timeframe is also supported by specifying the date range e.g. 2022-04-01to2022-07-30
	 */
	freshness?: SearchFreshness | string;

	/**
	 * A snippet is an excerpt from a page you get as a result of the query,
	 * and extra_snippets allow you to get up to 5 additional, alternative excerpts.
	 * Only available under Free AI, Base AI, Pro AI, Base Data, Pro Data and Custom plans
	 */
	extra_snippets?: boolean;

	/**
	 * Goggles act as a custom re-ranking on top of Brave’s search index.
	 * The parameter supports both a url where the Goggle is hosted or the definition of the Goggle.
	 * For more details, refer to the Goggles repository.
	 * The parameter can be repeated to query with multiple goggles.
	 */
	goggles?: string[];
}

/**
 * Top level response model for successful News Search API requests
 * @see https://api-dashboard.search.brave.com/app/documentation/news-search/responses#NewsSearchApiResponse
 */
export interface NewsSearchApiResponse extends SearchApiResponseBase {
	/**
	 * The type of search API result. The value is always news.
	 */
	type: 'news';

	/**
	 * News search query string.
	 */
	query: NewsSearchQuery;

	/**
	 * The list of news results for the given query.
	 */
	results: NewsResult[];
}

/**
 * A model representing information gathered around the requested query
 * @see https://api-dashboard.search.brave.com/app/documentation/news-search/responses#Query
 */
export interface NewsSearchQuery extends SearchQueryInfoBase {
	/**
	 * The cleaned normalized query by the spellchecker. This is the query that is used to search if any.
	 */
	cleaned?: string;
}

/**
 * A model representing a news result for the requested query
 * @see https://api-dashboard.search.brave.com/app/documentation/news-search/responses#NewsResult
 */
export interface NewsResult extends SearchResultBase {
	/**
	 * The type of news search API result. The value is always news_result.
	 */
	type: 'news_result';

	/**
	 * The source URL of the news article.
	 */
	url: string;

	/**
	 * The title of the news article.
	 */
	title: string;

	/**
	 * The description for the news article.
	 */
	description?: string;

	/**
	 * A human readable representation of the page age.
	 */
	age?: string;

	/**
	 * The page age found from the source web page.
	 */
	page_age?: string;

	/**
	 * The ISO date time when the page was last fetched.
	 * The format is YYYY-MM-DDTHH:MM:SS+00:00.
	 */
	page_fetched?: string;

	/**
	 * Whether the result includes breaking news.
	 */
	breaking?: boolean;

	/**
	 * The thumbnail for the news article.
	 */
	thumbnail?: Thumbnail;

	/**
	 * Aggregated information on the URL associated with the news search result.
	 */
	meta_url?: MetaUrl;

	/**
	 * A list of extra alternate snippets for the news search result.
	 */
	extra_snippets?: string[];
}
