/**
 * Brave VideoSearch API TypeScript Definitions
 *
 * This file contains all type definitions for the Brave VideoSearch API,
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
 * Query parameters for Video Search API
 * @see https://api-dashboard.search.brave.com/app/documentation/video-search/query#VideoSearchSearchAPI
 */
export interface VideoSearchApiQueryParams extends SearchApiQueryParamsBase {
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
	 * The maximum is 50.
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
}

/**
 * Top level response model for successful Video Search API requests
 * @see https://api-dashboard.search.brave.com/app/documentation/video-search/responses#VideoSearchApiResponse
 */
export interface VideoSearchApiResponse extends SearchApiResponseBase {
	/**
	 * The type of search API result. The value is always videos.
	 */
	type: 'videos';

	/**
	 * Video search query string.
	 */
	query: VideoSearchQuery;

	/**
	 * The list of video results for the given query.
	 */
	results: VideoResult[];

	/**
	 * Additional information about the video search results.
	 */
	extra: VideoExtraInfo;
}

/**
 * A model representing information gathered around the requested query
 * @see https://api-dashboard.search.brave.com/app/documentation/video-search/responses#Query
 */
export interface VideoSearchQuery extends SearchQueryInfoBase {
	/**
	 * The cleaned normalized query by the spellchecker. This is the query that is used to search if any.
	 */
	cleaned?: string;
}

/**
 * A model representing a video result for the requested query
 * @see https://api-dashboard.search.brave.com/app/documentation/video-search/responses#VideoResult
 */
export interface VideoResult extends SearchResultBase {
	/**
	 * The type of video search API result. The value is always video_result.
	 */
	type: 'video_result';

	/**
	 * The source URL of the video.
	 */
	url: string;

	/**
	 * The title of the video.
	 */
	title: string;

	/**
	 * The description for the video.
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
	 * The thumbnail for the video.
	 */
	thumbnail?: Thumbnail;

	/**
	 * Metadata for the video.
	 */
	video?: VideoData;

	/**
	 * Aggregated information on the URL associated with the video search result.
	 */
	meta_url?: MetaUrl;
}

/**
 * A model representing metadata gathered for a video
 * @see https://api-dashboard.search.brave.com/app/documentation/video-search/responses#VideoData
 */
export interface VideoData {
	/**
	 * A time string representing the duration of the video.
	 */
	duration?: string;

	/**
	 * The number of views of the video.
	 */
	views?: number;

	/**
	 * The creator of the video.
	 */
	creator?: string;

	/**
	 * The publisher of the video.
	 */
	publisher?: string;

	/**
	 * Whether the video requires a subscription.
	 */
	requires_subscription?: boolean;

	/**
	 * A list of tags relevant to the video.
	 */
	tags?: string[];

	/**
	 * A list of profiles associated with the video.
	 */
	author?: VideoProfile[];
}

/**
 * A profile of an entity associated with the video
 * @see https://api-dashboard.search.brave.com/app/documentation/video-search/responses#Profile
 */
export interface VideoProfile {
	/**
	 * The name of the profile.
	 */
	name: string;

	/**
	 * The long name of the profile.
	 */
	long_name?: string;

	/**
	 * The original URL where the profile is available.
	 */
	url: string;

	/**
	 * The served image URL representing the profile.
	 */
	img?: string;
}

/**
 * Additional information about the video search results
 * @see https://api-dashboard.search.brave.com/app/documentation/video-search/responses#Extra
 */
export interface VideoExtraInfo {
	/**
	 * Indicates whether the video search results might contain offensive content.
	 */
	might_be_offensive: boolean;
}
