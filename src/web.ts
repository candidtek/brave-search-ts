/**
 * Brave WebSearch API TypeScript Definitions
 *
 * This file contains all type definitions for the Brave WebSearch API,
 * including request parameters and response types.
 */

import type { MetaUrl, SafeSearchFilter, SearchApiQueryParamsBase, SearchApiResponseBase, SearchFreshness, SearchLanguage, SearchQueryInfoBase, SearchUiLanguage, Thumbnail } from './common.ts';

/**
 * Result filter types
 */
export enum WebSearchResultFilter {
	discussions = 'discussions',
	faq = 'faq',
	infobox = 'infobox',
	news = 'news',
	query = 'query',
	summarizer = 'summarizer',
	videos = 'videos',
	web = 'web',
	locations = 'locations'
}

/**
 * Measurement units
 */
export enum WebMeasurementUnits {
	/**
	 * The British Imperial system of units.
	 */
	imperial = 'imperial',

	/**
	 * The standardized measurement system
	 */
	metric = 'metric'
}

/**
 * Query parameters for Web Search API
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/query#WebSearchAPIQueryParameters
 */
export interface WebSearchApiQueryParams extends SearchApiQueryParamsBase {
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
	 * Whether display strings (e.g. result snippets) should include decoration markers
	 * (e.g. highlighting characters).
	 * @default 1
	 */
	text_decorations?: boolean;

	/**
	 * Whether to spellcheck provided query. If the spellchecker is enabled,
	 * the modified query is always used for search.
	 * @default 1
	 */
	spellcheck?: boolean;

	/**
	 * A comma delimited string of result types to include in the search response.
	 * Not specifying this parameter will return back all result types in search response
	 * where data is available and a plan with the corresponding option is subscribed.
	 * @example "web,news,videos"
	 */
	result_filter?: WebSearchResultFilter | string;

	/**
	 * Goggles act as a custom re-ranking on top of Brave's search index.
	 */
	goggles_id?: string;

	/**
	 * Goggles act as a custom re-ranking on top of Brave's search index.
	 * The parameter supports both a url where the Goggle is hosted or the definition of the goggle.
	 */
	goggles?: string[];

	/**
	 * The measurement units. If not provided, units are derived from search country.
	 */
	units?: WebMeasurementUnits;

	/**
	 * A snippet is an excerpt from a page you get as a result of the query,
	 * and extra_snippets allow you to get up to 5 additional, alternative excerpts.
	 * Only available under certain plans.
	 */
	extra_snippets?: boolean;

	/**
	 * This parameter enables summary key generation in web search results.
	 * This is required for summarizer to be enabled.
	 */
	summary?: boolean;
}

/**
 * Query parameters for Local Search API
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/query#LocalSearchAPIQueryParameters
 */
export interface LocalWebSearchApiQueryParams {
	/**
	 * Unique identifier for the location. Ids can not be empty.
	 * Maximum of 20 ids per request. The parameter can be repeated to query for multiple ids.
	 */
	ids: string[];

	/**
	 * The search language preference.
	 * The 2 or more character language code for which the search results are provided.
	 * @default "en"
	 */
	search_lang?: SearchLanguage;

	/**
	 * User interface language preferred in response.
	 * Usually of the format '<language_code>-<country_code>'.
	 * @default "en-US"
	 */
	ui_lang?: string;

	/**
	 * The measurement units. If not provided, units are derived from search country.
	 */
	units?: WebMeasurementUnits;
}

/**
 * Top level response model for successful Web Search API requests. The response will include the relevant keys based
 * on the plan subscribed, query relevance or applied result_filter as a query parameter. The API can also respond back
 * with an error response based on invalid subscription keys and rate limit events.
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#WebSearchApiResponse
 */
export interface WebSearchApiResponse extends SearchApiResponseBase {
	/**
	 * The type of web search API result. The value is always search.
	 */
	type: 'search';

	/**
	 * Discussions clusters aggregated from forum posts that are relevant to the query.
	 */
	discussions?: WebDiscussions;

	/**
	 * Frequently asked questions that are relevant to the search query.
	 */
	faq?: WebFAQ;

	/**
	 * Aggregated information on an entity showable as an infobox.
	 */
	infobox?: WebGraphInfobox;

	/**
	 * Places of interest (POIs) relevant to location sensitive queries.
	 */
	locations?: WebLocations;

	/**
	 * Preferred ranked order of search results.
	 */
	mixed?: WebMixed;

	/**
	 * News results relevant to the query.
	 */
	news?: WebNews;

	/**
	 * Search query string and its modifications that are used for search.
	 */
	query: WebSearchQuery;

	/**
	 * Videos relevant to the query.
	 */
	videos?: WebVideos;

	/**
	 * Web search results relevant to the query.
	 */
	web?: WebResults;

	/**
	 * Summary key to get summary results for the query.
	 */
	summarizer?: WebSummarizer;

	/**
	 * Callback information for rich results.
	 */
	rich_callback?: WebRichCallbackInfo;
}

/**
 * Top level response model for successful Local Search API request to get extra information for locations.
 * The response will include a list of location results corresponding to the ids in the request. The API can
 * also respond back with an error response in cases like too many ids being requested, invalid subscription
 * keys, and rate limit events. Access to Local Search API requires a subscription to a Pro plan.
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#LocalPoiSearchApiResponse
 */
export interface LocalPoiSearchApiResponse extends SearchApiResponseBase {
	/**
	 * The type of local POI search API result. The value is always local_pois.
	 */
	type: 'local_pois';

	/**
	 * Location results matching the ids in the request.
	 */
	results?: WebLocationResult[];
}

/**
 * Top level response model for successful Local Search API request to get AI generated description for locations.
 * The response includes a list of generated descriptions corresponding to the ids in the request. The API can
 * also respond back with an error response in cases like too many ids being requested, invalid subscription keys,
 * and rate limit events. Access to Local Search API requires a subscription to a Pro plan.
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#LocalDescriptionsSearchApiResponse
 */
export interface LocalDescriptionsSearchApiResponse extends SearchApiResponseBase {
	/**
	 * The type of local description search API result. The value is always local_descriptions.
	 */
	type: 'local_descriptions';

	/**
	 * Location descriptions matching the ids in the request.
	 */
	results?: WebLocationDescription[];
}

/**
 * A model representing information gathered around the requested query
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#Query
 */
export interface WebSearchQuery extends Omit<SearchQueryInfoBase, 'show_strict_warning'> {
	/**
	 * Whether there is more content available for query, but the response was restricted due to safesearch.
	 */
	show_strict_warning?: boolean;

	/**
	 * Whether safesearch was enabled.
	 */
	safesearch?: boolean;

	/**
	 * Whether the query is a navigational query to a domain.
	 */
	is_navigational?: boolean;

	/**
	 * Whether the query has location relevance.
	 */
	is_geolocal?: boolean;

	/**
	 * Whether the query was decided to be location sensitive.
	 */
	local_decision?: string;

	/**
	 * The index of the location.
	 */
	local_locations_idx?: number;

	/**
	 * Whether the query is trending.
	 */
	is_trending?: boolean;

	/**
	 * Whether the query has news breaking articles relevant to it.
	 */
	is_news_breaking?: boolean;

	/**
	 * Whether the query requires location information for better results.
	 */
	ask_for_location?: boolean;

	/**
	 * The language information gathered from the query.
	 */
	language?: SearchLanguage;

	/**
	 * The country that was used.
	 */
	country?: string;

	/**
	 * Whether there are bad results for the query.
	 */
	bad_results?: boolean;

	/**
	 * Whether the query should use a fallback.
	 */
	should_fallback?: boolean;

	/**
	 * The gathered location latitude associated with the query.
	 */
	lat?: string;

	/**
	 * The gathered location longitude associated with the query.
	 */
	long?: string;

	/**
	 * The gathered postal code associated with the query.
	 */
	postal_code?: string;

	/**
	 * The gathered city associated with the query.
	 */
	city?: string;

	/**
	 * The gathered state associated with the query.
	 */
	state?: string;

	/**
	 * The country for the request origination.
	 */
	header_country?: string;

	/**
	 * Whether more results are available for the given query.
	 */
	more_results_available?: boolean;

	/**
	 * Any custom location labels attached to the query.
	 */
	custom_location_label?: string;

	/**
	 * Any reddit cluster associated with the query.
	 */
	reddit_cluster?: string;
}

/**
 * Component response
 */
export interface WebComponentResponse {
	/**
	 * Type of the component
	 */
	type: 'search' | 'faq' | 'graph' | 'locations' | 'mixed' | 'videos' | 'news' | 'summarizer' | 'rich';
}

/**
 * A model representing a discussion cluster relevant to the query
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#Discussions
 */
export interface WebDiscussions extends WebComponentResponse {
	/**
	 * The type identifying a discussion cluster. Currently the value is always search.
	 */
	type: 'search';

	/**
	 * A list of discussion results.
	 */
	results: WebDiscussionResult[];

	/**
	 * Whether the discussion results are changed by a Goggle. False by default.
	 */
	mutated_by_goggles: boolean;
}

/**
 * A discussion result from forum posts relevant to the search query
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#DiscussionResult
 */
export interface WebDiscussionResult extends WebSearchResultBase {
	/**
	 * The discussion result type identifier. The value is always discussion.
	 */
	type: 'discussion';

	/**
	 * The enriched aggregated data for the relevant forum post.
	 */
	data?: WebDiscussionForumData;
}

/**
 * Defines a result from a discussion forum
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#ForumData
 */
export interface WebDiscussionForumData {
	/**
	 * The name of the forum.
	 */
	forum_name: string;

	/**
	 * The number of answers to the post.
	 */
	num_answers?: number;

	/**
	 * The score of the post on the forum.
	 */
	score?: string;

	/**
	 * The title of the post on the forum.
	 */
	title?: string;

	/**
	 * The question asked in the forum post.
	 */
	question?: string;

	/**
	 * The top-rated comment under the forum post.
	 */
	top_comment?: string;
}

/**
 * Frequently asked questions relevant to the search query term
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#FAQ
 */
export interface WebFAQ extends WebComponentResponse {
	/**
	 * The FAQ result type identifier. The value is always faq.
	 */
	type: 'faq';

	/**
	 * A list of aggregated question answer results relevant to the query.
	 */
	results: WebQA[];
}

/**
 * A question answer result
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#QA
 */
export interface WebQA {
	/**
	 * The question being asked.
	 */
	question: string;

	/**
	 * The answer to the question.
	 */
	answer: string;

	/**
	 * The title of the post.
	 */
	title: string;

	/**
	 * The url pointing to the post.
	 */
	url: string;

	/**
	 * Aggregated information about the url.
	 */
	meta_url?: MetaUrl;
}

/**
 * A model representing a collection of web search results
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#Search
 */
export interface WebResults extends WebComponentResponse {
	/**
	 * A type identifying web search results. The value is always search.
	 */
	type: 'search';

	/**
	 * A list of search results.
	 */
	results: WebResult[];

	/**
	 * Whether the results are family friendly.
	 */
	family_friendly?: boolean;
}

/**
 * Aggregated information on a web search result
 */
export interface WebResult extends WebSearchResultBase {
	/**
	 * A type identifying a web search result. The value is always search_result.
	 */
	type: 'search_result';
}

/**
 * Aggregated information on a web search result
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#SearchResult
 */
export interface WebSearchResultBase extends WebResultBase {
	/**
	 * A type identifying a web search result.
	 */
	type: 'search_result' | 'discussion';

	/**
	 * A sub type identifying the web search result type.
	 */
	subtype: 'generic';

	/**
	 * Whether the web search result is currently live. Default value is False.
	 */
	is_live: boolean;

	/**
	 * Gathered information on a web search result.
	 */
	deep_results?: WebDeepResult;

	/**
	 * A list of schemas (structured data) extracted from the page.
	 */
	schemas?: any[];

	/**
	 * Aggregated information on the url associated with the web search result.
	 */
	meta_url?: MetaUrl;

	/**
	 * The thumbnail of the web search result.
	 */
	thumbnail?: Thumbnail;

	/**
	 * A string representing the age of the web search result.
	 */
	age?: string;

	/**
	 * The main language on the web search result.
	 */
	language?: string;

	/**
	 * The location details if the query relates to a restaurant.
	 */
	location?: WebLocationResult;

	/**
	 * The video associated with the web search result.
	 */
	video?: WebVideoData;

	/**
	 * The movie associated with the web search result.
	 */
	movie?: WebMovieData;

	/**
	 * Any frequently asked questions associated with the web search result.
	 */
	faq?: WebFAQ;

	/**
	 * Any question answer information associated with the web search result page.
	 */
	qa?: WebQAPage;

	/**
	 * Any book information associated with the web search result page.
	 */
	book?: WebBook;

	/**
	 * Rating found for the web search result page.
	 */
	rating?: WebRating;

	/**
	 * An article found for the web search result page.
	 */
	article?: WebArticle;

	/**
	 * The main product and a review that is found on the web search result page.
	 */
	product?: WebProduct | WebReview;

	/**
	 * A list of products and reviews that are found on the web search result page.
	 */
	product_cluster?: (WebProduct | WebReview)[];

	/**
	 * A type representing a cluster. The value can be product_cluster.
	 */
	cluster_type?: string;

	/**
	 * A list of web search results.
	 */
	cluster?: WebResultBase[];

	/**
	 * Aggregated information on the creative work found on the web search result.
	 */
	creative_work?: WebCreativeWork;

	/**
	 * Aggregated information on music recording found on the web search result.
	 */
	music_recording?: WebMusicRecording;

	/**
	 * Aggregated information on the review found on the web search result.
	 */
	review?: WebReview;

	/**
	 * Aggregated information on a software product found on the web search result page.
	 */
	software?: WebSoftware;

	/**
	 * Aggregated information on a recipe found on the web search result page.
	 */
	recipe?: WebRecipe;

	/**
	 * Aggregated information on a organization found on the web search result page.
	 */
	organization?: WebOrganization;

	/**
	 * The content type associated with the search result page.
	 */
	content_type?: string;

	/**
	 * A list of extra alternate snippets for the web search result.
	 */
	extra_snippets?: string[];
}

/**
 * Base result interface
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#Result
 */
export interface WebResultBase {
	/**
	 * The title of the web page.
	 */
	title: string;

	/**
	 * The url where the page is served.
	 */
	url: string;

	/**
	 * Is source local
	 */
	is_source_local: boolean;

	/**
	 * Is source both
	 */
	is_source_both: boolean;

	/**
	 * A description for the web page.
	 */
	description?: string;

	/**
	 * A date representing the age of the web page.
	 */
	page_age?: string;

	/**
	 * A date representing when the web page was last fetched.
	 */
	page_fetched?: string;

	/**
	 * A profile associated with the web page.
	 */
	profile?: WebProfile;

	/**
	 * A language classification for the web page.
	 */
	language?: string;

	/**
	 * Whether the web page is family friendly.
	 */
	family_friendly?: boolean;
}

/**
 * Shared aggregated information on an entity from a knowledge graph
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#AbstractGraphInfobox
 */
export interface WebAbstractGraphInfobox extends WebResultBase {
	/**
	 * The infobox result type identifier. The value is always infobox.
	 */
	type: 'infobox';

	/**
	 * The infobox subtype identifier.
	 */
	subtype: 'generic' | 'entity' | 'code' | 'location' | 'place';

	/**
	 * The position on a search result page.
	 */
	position: number;

	/**
	 * Any label associated with the entity.
	 */
	label?: string;

	/**
	 * Category classification for the entity.
	 */
	category?: string;

	/**
	 * A longer description for the entity.
	 */
	long_desc?: string;

	/**
	 * The thumbnail associated with the entity.
	 */
	thumbnail?: Thumbnail;

	/**
	 * A list of attributes about the entity.
	 */
	attributes?: string[][];

	/**
	 * The profiles associated with the entity.
	 */
	profiles?: WebProfile[] | WebDataProvider[];

	/**
	 * The official website pertaining to the entity.
	 */
	website?: string;

	/**
	 * Any ratings given to the entity.
	 */
	ratings?: WebRating[];

	/**
	 * A list of data sources for the entity.
	 */
	providers?: WebDataProvider[];

	/**
	 * A unit representing quantity relevant to the entity.
	 */
	unit?: WebUnit;

	/**
	 * A list of images relevant to the entity.
	 */
	images?: Thumbnail[];

	/**
	 * Any movie data relevant to the entity. Appears only when the result is a movie.
	 */
	movie?: WebMovieData;
}

/**
 * Aggregated information on a generic entity from a knowledge graph
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#GenericInfobox
 */
export interface WebGenericInfobox extends WebAbstractGraphInfobox {
	/**
	 * The infobox subtype identifier. The value is always generic.
	 */
	subtype: 'generic';

	/**
	 * List of URLs where the entity was found
	 */
	found_in_urls?: string[];
}

/**
 * Aggregated information on an entity from a knowledge graph.
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#EntityInfobox
 */
export interface WebEntityInfobox extends WebAbstractGraphInfobox {
	/**
	 * The infobox subtype identifier. The value is always entity.
	 */
	subtype: 'entity';
}

/**
 * A question answer infobox.
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#QAInfobox
 */
export interface WebQAInfobox extends WebAbstractGraphInfobox {
	/**
	 * The infobox subtype identifier. The value is always code.
	 */
	subtype: 'code';

	/**
	 * The question and relevant answer.
	 */
	data: WebQAPage;

	/**
	 * Detailed information on the page containing the question and relevant answer.
	 */
	meta_url?: MetaUrl;
}

/**
 * An infobox with location.
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#InfoboxWithLocation
 */
export interface WebInfoboxWithLocation extends WebAbstractGraphInfobox {
	/**
	 * The infobox subtype identifier. The value is always location.
	 */
	subtype: 'location';

	/**
	 * Whether the entity a location.
	 */
	is_location: boolean;

	/**
	 * The coordinates of the location.
	 */
	coordinates?: number[];

	/**
	 * The map zoom level.
	 */
	zoom_level: number;

	/**
	 * The location result.
	 */
	location?: WebLocationResult;
}

/**
 * An infobox with location.
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#InfoboxPlace
 */
export interface WebInfoboxPlace extends WebAbstractGraphInfobox {
	/**
	 * The infobox subtype identifier. The value is always place.
	 */
	subtype: 'place';

	/**
	 * The location result.
	 */
	location: WebLocationResult;
}

/**
 * Aggregated information on an entity shown as an infobox.
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#GraphInfobox
 */
export interface WebGraphInfobox extends WebComponentResponse {
	/**
	 * The type identifier for infoboxes. The value is always graph
	 */
	type: 'graph';

	/**
	 * A list of infoboxes associated with the query.
	 */
	results: WebGenericInfobox | WebQAInfobox | WebInfoboxPlace | WebInfoboxWithLocation | WebEntityInfobox;
}

/**
 * Aggregated result from a question answer page
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#QAPage
 */
export interface WebQAPage {
	/**
	 * The question that is being asked.
	 */
	question: string;

	/**
	 * An answer to the question.
	 */
	answer?: WebAnswer;
}

/**
 * A response representing an answer to a question on a forum
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#Answer
 */
export interface WebAnswer {
	/**
	 * The main content of the answer.
	 */
	text: string;

	/**
	 * The name of the author of the answer.
	 */
	author?: string;

	/**
	 * Number of upvotes on the answer.
	 */
	upvoteCount?: number;

	/**
	 * The number of downvotes on the answer.
	 */
	downvoteCount?: number;
}

/**
 * A model representing a web result related to a location
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#LocationWebResult
 */
export interface WebLocationWebResult extends WebResultBase {
	/**
	 * Aggregated information about the url.
	 */
	meta_url?: MetaUrl;
}

/**
 * A result that is location relevant
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#LocationResult
 */
export interface WebLocationResult extends WebResultBase {
	/**
	 * Location result type identifier. The value is always location_result.
	 */
	type: 'location_result';

	/**
	 * A Temporary id associated with this result, which can be used to retrieve extra information about the location.
	 */
	id?: string;

	/**
	 * The complete url of the provider.
	 */
	provider_url: string;

	/**
	 * A list of coordinates associated with the location. This is a lat long represented as a floating point.
	 */
	coordinates?: number[];

	/**
	 * The zoom level on the map.
	 */
	zoom_level: number;

	/**
	 * The thumbnail associated with the location.
	 */
	thumbnail?: Thumbnail;

	/**
	 * The postal address associated with the location.
	 */
	postal_address?: WebPostalAddress;

	/**
	 * The opening hours, if it is a business, associated with the location.
	 */
	opening_hours?: WebOpeningHours;

	/**
	 * The contact of the business associated with the location.
	 */
	contact?: WebContact;

	/**
	 * A display string used to show the price classification for the business.
	 */
	price_range?: string;

	/**
	 * The ratings of the business.
	 */
	rating?: WebRating;

	/**
	 * The distance of the location from the client.
	 */
	distance?: WebUnit;

	/**
	 * Profiles associated with the business.
	 */
	profiles?: WebDataProvider[];

	/**
	 * Aggregated reviews from various sources relevant to the business.
	 */
	reviews?: WebReviews;

	/**
	 * A bunch of pictures associated with the business.
	 */
	pictures?: WebPictureResults;

	/**
	 * An action to be taken.
	 */
	action?: WebAction;

	/**
	 * A list of cuisine categories served.
	 */
	serves_cuisine?: string[];

	/**
	 * A list of categories.
	 */
	categories?: string[];

	/**
	 * An icon category.
	 */
	icon_category?: string;

	/**
	 * Web results related to this location.
	 */
	descriptions?: WebLocationWebResult;

	/**
	 * IANA timezone identifier.
	 */
	timezone?: string;

	/**
	 * The utc offset of the timezone.
	 */
	timezone_offset?: string;
}

/**
 * AI generated description of a location result
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#LocationDescription
 */
export interface WebLocationDescription {
	/**
	 * The type of a location description. The value is always local_description.
	 */
	type: 'local_description';

	/**
	 * A Temporary id of the location with this description.
	 */
	id: string;

	/**
	 * AI generated description of the location with the given id.
	 */
	description?: string;
}

/**
 * A model representing location results.
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#Locations
 */
export interface WebLocations extends WebComponentResponse {
	/**
	 * Location type identifier. The value is always locations
	 */
	type: 'locations';

	/**
	 * An aggregated list of location sensitive results.
	 */
	results: WebLocationResult[];
}

/**
 * The ranking order of results on a search result page
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#MixedResponse
 */
export interface WebMixed extends WebComponentResponse {
	/**
	 * The type representing the model mixed. The value is always mixed.
	 */
	type: 'mixed';

	/**
	 * The ranking order for the main section of the search result page.
	 */
	main: WebResultReference[];

	/**
	 * The ranking order for the top section of the search result page.
	 */
	top?: WebResultReference[];

	/**
	 * The ranking order for the side section of the search result page.
	 */
	side?: WebResultReference[];
}

/**
 * The ranking order of results on a search result page
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#ResultReference
 */
export interface WebResultReference {
	/**
	 * The type of the result.
	 */
	type: string;

	/**
	 * The 0th based index where the result should be placed.
	 */
	index?: number;

	/**
	 * Whether to put all the results from the type at specific position.
	 */
	all: boolean;
}

/**
 * A model representing video results
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#Videos
 */
export interface WebVideos extends WebComponentResponse {
	/**
	 * The type representing the videos. The value is always videos.
	 */
	type: 'videos';

	/**
	 * A list of video results.
	 */
	results: WebVideoResult[];

	/**
	 * Whether the video results are changed by a Goggle. False by default.
	 */
	mutated_by_goggles?: boolean;
}

/**
 * A model representing news results
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#News
 */
export interface WebNews extends WebComponentResponse {
	/**
	 * The type representing the news. The value is always news.
	 */
	type: 'news';

	/**
	 * A list of news results.
	 */
	results: WebNewsResult[];

	/**
	 * Whether the news results are changed by a Goggle. False by default.
	 */
	mutated_by_goggles?: boolean;
}

/**
 * A model representing news results
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#NewsResult
 */
export interface WebNewsResult extends WebResultBase {
	/**
	 * The aggregated information on the url representing a news result
	 */
	meta_url?: MetaUrl;

	/**
	 * The source of the news.
	 */
	source?: string;

	/**
	 * Whether the news result is currently a breaking news.
	 */
	breaking?: boolean;

	/**
	 * Whether the news result is currently live.
	 */
	is_live?: boolean;

	/**
	 * The thumbnail associated with the news result.
	 */
	thumbnail?: Thumbnail;

	/**
	 * A string representing the age of the news article.
	 */
	age?: string;

	/**
	 * A list of extra alternate snippets for the news search result.
	 */
	extra_snippets?: string[];
}

/**
 * A model representing a list of pictures
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#PictureResults
 */
export interface WebPictureResults {
	/**
	 * A url to view more pictures.
	 */
	viewMoreUrl?: string;

	/**
	 * A list of thumbnail results.
	 */
	results?: Thumbnail[];
}

/**
 * A model representing an action to be taken
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#Action
 */
export interface WebAction {
	/**
	 * The type representing the action.
	 */
	type: string;

	/**
	 * A url representing the action to be taken.
	 */
	url: string;
}

/**
 * A model representing a postal address of a location
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#PostalAddress
 */
export interface WebPostalAddress {
	/**
	 * The type identifying a postal address. The value is always PostalAddress.
	 */
	type: 'PostalAddress';

	/**
	 * The country associated with the location.
	 */
	country?: string;

	/**
	 * The postal code associated with the location.
	 */
	postalCode?: string;

	/**
	 * The street address associated with the location.
	 */
	streetAddress?: string;

	/**
	 * The region associated with the location. This is usually a state.
	 */
	addressRegion?: string;

	/**
	 * The address locality or subregion associated with the location.
	 */
	addressLocality?: string;

	/**
	 * The displayed address string.
	 */
	displayAddress: string;
}

/**
 * Opening hours of a business at a particular location
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#OpeningHours
 */
export interface WebOpeningHours {
	/**
	 * The current day opening hours. Can have two sets of opening hours.
	 */
	current_day?: WebDayOpeningHours[];

	/**
	 * The opening hours for the whole week.
	 */
	days?: WebDayOpeningHours[][];
}

/**
 * A model representing the opening hours for a particular day for a business
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#DayOpeningHours
 */
export interface WebDayOpeningHours {
	/**
	 * A short string representing the day of the week.
	 */
	abbr_name: string;

	/**
	 * A full string representing the day of the week.
	 */
	full_name: string;

	/**
	 * A 24 hr clock time string for the opening time of the business on a particular day.
	 */
	opens: string;

	/**
	 * A 24 hr clock time string for the closing time of the business on a particular day.
	 */
	closes: string;
}

/**
 * A model representing contact information for an entity
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#Contact
 */
export interface WebContact {
	/**
	 * The email address.
	 */
	email?: string;

	/**
	 * The telephone number.
	 */
	telephone?: string;
}

/**
 * A model representing the data provider associated with the entity
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#DataProvider
 */
export interface WebDataProvider {
	/**
	 * The type representing the source of data. This is usually external.
	 */
	type: 'external';

	/**
	 * The name of the data provider. This can be a domain.
	 */
	name: string;

	/**
	 * The url where the information is coming from.
	 */
	url: string;

	/**
	 * The long name for the data provider.
	 */
	long_name?: string;

	/**
	 * The served url for the image data.
	 */
	img?: string;
}

/**
 * A profile of an entity
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#Profile
 */
export interface WebProfile {
	/**
	 * The name of the profile.
	 */
	name: string;

	/**
	 * The long name of the profile.
	 */
	long_name: string;

	/**
	 * The original url where the profile is available.
	 */
	url?: string;

	/**
	 * The served image url representing the profile.
	 */
	img?: string;
}

/**
 * A model representing a unit of measurement
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#Unit
 */
export interface WebUnit {
	/**
	 * The quantity of the unit.
	 */
	value: number;

	/**
	 * The name of the unit associated with the quantity.
	 */
	units: string;
}

/**
 * Aggregated data for a movie result
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#MovieData
 */
export interface WebMovieData {
	/**
	 * Name of the movie.
	 */
	name?: string;

	/**
	 * A short plot summary for the movie.
	 */
	description?: string;

	/**
	 * A url serving a movie profile page.
	 */
	url?: string;

	/**
	 * A thumbnail for a movie poster.
	 */
	thumbnail?: Thumbnail;

	/**
	 * The release date for the movie.
	 */
	release?: string;

	/**
	 * A list of people responsible for directing the movie.
	 */
	directors?: WebPerson[];

	/**
	 * A list of actors in the movie.
	 */
	actors?: WebPerson[];

	/**
	 * Rating provided to the movie from various sources.
	 */
	rating?: WebRating;

	/**
	 * The runtime of the movie. The format is HH:MM:SS.
	 */
	duration?: string;

	/**
	 * List of genres in which the movie can be classified.
	 */
	genre?: string[];

	/**
	 * The query that resulted in the movie result.
	 */
	query?: string;
}

/**
 * A model describing a generic thing
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#Thing
 */
export interface WebThing {
	/**
	 * A type identifying a thing. The value is always thing.
	 */
	type: 'thing' | 'person' | 'contact_point' | 'organization';

	/**
	 * The name of the thing.
	 */
	name: string;

	/**
	 * A url for the thing.
	 */
	url?: string;

	/**
	 * Thumbnail associated with the thing.
	 */
	thumbnail?: Thumbnail;
}

/**
 * A model describing a person entity
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#Person
 */
export interface WebPerson extends WebThing {
	/**
	 * A type identifying a person. The value is always person.
	 */
	type: 'person';
}

/**
 * The rating associated with an entity
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#Rating
 */
export interface WebRating {
	/**
	 * The current value of the rating.
	 */
	ratingValue: number;

	/**
	 * Best rating received.
	 */
	bestRating: number;

	/**
	 * The number of reviews associated with the rating.
	 */
	reviewCount?: number;

	/**
	 * The profile associated with the rating.
	 */
	profile?: WebProfile;

	/**
	 * Whether the rating is coming from Tripadvisor.
	 */
	is_tripadvisor?: boolean;
}

/**
 * A model representing a book result
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#Book
 */
export interface WebBook {
	/**
	 * The title of the book.
	 */
	title: string;

	/**
	 * The author of the book.
	 */
	author?: WebPerson[];

	/**
	 * The publishing date of the book.
	 */
	date?: string;

	/**
	 * The price of the book.
	 */
	price?: WebPrice;

	/**
	 * The number of pages in the book.
	 */
	pages?: number;

	/**
	 * The publisher of the book.
	 */
	publisher?: WebPerson;

	/**
	 * A gathered rating from different sources associated with the book.
	 */
	rating?: WebRating;
}

/**
 * A model representing the price for an entity
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#Price
 */
export interface WebPrice {
	/**
	 * The price value in a given currency.
	 */
	price: string;

	/**
	 * The currency of the price value.
	 */
	price_currency: string;
}

/**
 * A model representing an article
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#Article
 */
export interface WebArticle {
	/**
	 * The author of the article.
	 */
	author?: WebPerson[];

	/**
	 * The date when the article was published.
	 */
	date?: string;

	/**
	 * The name of the publisher for the article.
	 */
	publisher?: WebOrganization;

	/**
	 * A thumbnail associated with the article.
	 */
	thumbnail?: Thumbnail;

	/**
	 * Whether the article is free to read or is behind a paywall.
	 */
	is_accessible_for_free?: boolean;
}

/**
 * A way to contact an entity
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#ContactPoint
 */
export interface WebContactPoint extends WebThing {
	/**
	 * A type string identifying a contact point. The value is always contact_point.
	 */
	type: 'contact_point';

	/**
	 * The telephone number of the entity.
	 */
	telephone?: string;

	/**
	 * The email address of the entity.
	 */
	email?: string;
}

/**
 * An entity responsible for another entity
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#Organization
 */
export interface WebOrganization extends WebThing {
	/**
	 * A type string identifying an organization. The value is always organization.
	 */
	type: 'organization';

	/**
	 * A list of contact points for the organization.
	 */
	contact_points?: WebContactPoint[];
}

/**
 * Aggregated information on a how to
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#HowTo
 */
export interface WebHowTo {
	/**
	 * The how to text.
	 */
	text: string;

	/**
	 * A name for the how to.
	 */
	name?: string;

	/**
	 * A url associated with the how to.
	 */
	url?: string;

	/**
	 * A list of image urls associated with the how to.
	 */
	image?: string[];
}

/**
 * Aggregated information on a recipe
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#Recipe
 */
export interface WebRecipe {
	/**
	 * The title of the recipe.
	 */
	title: string;

	/**
	 * The description of the recipe.
	 */
	description: string;

	/**
	 * A thumbnail associated with the recipe.
	 */
	thumbnail?: Thumbnail;

	/**
	 * The url of the web page where the recipe was found.
	 */
	url?: string;

	/**
	 * The domain of the web page where the recipe was found.
	 */
	domain?: string;

	/**
	 * The url for the favicon of the web page where the recipe was found.
	 */
	favicon?: string;

	/**
	 * The total time required to cook the recipe.
	 */
	total_time?: string;

	/**
	 * The preparation time for the recipe.
	 */
	prep_time?: string;

	/**
	 * The cooking time for the recipe.
	 */
	cook_time?: string;

	/**
	 * Ingredients required for the recipe.
	 */
	ingredients?: string[];

	/**
	 * List of instructions for the recipe.
	 */
	instructions?: WebHowTo[];

	/**
	 * How many people the recipe serves.
	 */
	servings?: number;

	/**
	 * Calorie count for the recipe.
	 */
	calories?: string;

	/**
	 * Aggregated information on the ratings associated with the recipe.
	 */
	rating?: WebRating;

	/**
	 * The category of the recipe.
	 */
	recipe_category?: string;

	/**
	 * The cuisine classification for the recipe.
	 */
	recipe_cuisine?: string;

	/**
	 * Aggregated information on the cooking video associated with the recipe.
	 */
	video?: WebVideoData;
}

/**
 * A model representing a product
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#Product
 */
export interface WebProduct {
	/**
	 * A string representing a product type. The value is always product.
	 */
	type: 'Product';

	/**
	 * The name of the product.
	 */
	name: string;

	/**
	 * The category of the product.
	 */
	category?: string;

	/**
	 * The price of the product.
	 */
	price: string;

	/**
	 * A thumbnail associated with the product.
	 */
	thumbnail?: Thumbnail;

	/**
	 * The description of the product.
	 */
	description?: string;

	/**
	 * A list of offers available on the product.
	 */
	offers?: WebOffer[];

	/**
	 * A rating associated with the product.
	 */
	rating?: WebRating;
}

/**
 * An offer associated with a product
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#Offer
 */
export interface WebOffer {
	/**
	 * The url where the offer can be found.
	 */
	url: string;

	/**
	 * The currency in which the offer is made.
	 */
	priceCurrency: string;

	/**
	 * The price of the product currently on offer.
	 */
	price: string;
}

/**
 * A model representing a review for an entity
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#Review
 */
export interface WebReview {
	/**
	 * A string representing review type. This is always review.
	 */
	type: 'review';

	/**
	 * The review title for the review.
	 */
	name: string;

	/**
	 * The thumbnail associated with the reviewer.
	 */
	thumbnail?: Thumbnail;

	/**
	 * A description of the review (the text of the review itself).
	 */
	description?: string;

	/**
	 * The ratings associated with the review.
	 */
	rating?: WebRating;
}

/**
 * The reviews associated with an entity
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#Reviews
 */
export interface WebReviews {
	/**
	 * A list of trip advisor reviews for the entity.
	 */
	results?: WebTripAdvisorReview[];

	/**
	 * A url to a web page where more information on the result can be seen.
	 */
	viewMoreUrl?: string;

	/**
	 * Any reviews available in a foreign language.
	 */
	reviews_in_foreign_language?: boolean;
}

/**
 * A model representing a Tripadvisor review
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#TripAdvisorReview
 */
export interface WebTripAdvisorReview {
	/**
	 * The title of the review.
	 */
	title: string;

	/**
	 * A description seen in the review.
	 */
	description: string;

	/**
	 * The date when the review was published.
	 */
	date: string;

	/**
	 * A rating given by the reviewer.
	 */
	rating?: WebRating;

	/**
	 * The author of the review.
	 */
	author?: WebPerson;

	/**
	 * A url link to the page where the review can be found.
	 */
	review_url?: string;

	/**
	 * The language of the review.
	 */
	language?: string;
}

/**
 * A creative work relevant to the query
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#CreativeWork
 */
export interface WebCreativeWork {
	/**
	 * The name of the creative work.
	 */
	name: string;

	/**
	 * A thumbnail associated with the creative work.
	 */
	thumbnail?: Thumbnail;

	/**
	 * A rating that is given to the creative work.
	 */
	rating?: WebRating;
}

/**
 * Result classified as a music label or a song
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#MusicRecording
 */
export interface WebMusicRecording {
	/**
	 * The name of the song or album.
	 */
	name: string;

	/**
	 * A thumbnail associated with the music.
	 */
	thumbnail?: Thumbnail;

	/**
	 * The rating of the music.
	 */
	rating?: WebRating;
}

/**
 * A model representing a software entity
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#Software
 */
export interface WebSoftware {
	/**
	 * The name of the software product.
	 */
	name?: string;

	/**
	 * The author of software product.
	 */
	author?: string;

	/**
	 * The latest version of the software product.
	 */
	version?: string;

	/**
	 * The code repository where the software product is currently available or maintained.
	 */
	codeRepository?: string;

	/**
	 * The home page of the software product.
	 */
	homepage?: string;

	/**
	 * The date when the software product was published.
	 */
	datePublisher?: string;

	/**
	 * Whether the software product is available on npm.
	 */
	is_npm?: boolean;

	/**
	 * Whether the software product is available on pypi.
	 */
	is_pypi?: boolean;

	/**
	 * The number of stars on the repository.
	 */
	stars?: number;

	/**
	 * The numbers of forks of the repository.
	 */
	forks?: number;

	/**
	 * The programming language spread on the software product.
	 */
	ProgrammingLanguage?: string;
}

/**
 * Aggregated deep results from news, social, videos and images
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#DeepResult
 */
export interface WebDeepResult {
	/**
	 * A list of news results associated with the result.
	 */
	news?: WebNewsResult[];

	/**
	 * A list of buttoned results associated with the result.
	 */
	buttons?: WebButtonResult[];

	/**
	 * Videos associated with the result.
	 */
	videos?: WebVideoResult[];

	/**
	 * Images associated with the result.
	 */
	images?: WebImage[];
}

/**
 * A model representing a video result
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#VideoResult
 */
export interface WebVideoResult extends WebResultBase {
	/**
	 * The type identifying the video result. The value is always video_result.
	 */
	type: 'video_result';

	/**
	 * Meta data for the video.
	 */
	video?: WebVideoData;

	/**
	 * Aggregated information on the URL
	 */
	meta_url?: MetaUrl;

	/**
	 * The thumbnail of the video.
	 */
	thumbnail?: Thumbnail;

	/**
	 * A string representing the age of the video.
	 */
	age?: string;
}

/**
 * A model representing metadata gathered for a video
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#VideoData
 */
export interface WebVideoData {
	/**
	 * A time string representing the duration of the video. The format can be HH:MM:SS or MM:SS.
	 */
	duration?: string;

	/**
	 * The number of views of the video.
	 */
	views?: string;

	/**
	 * The creator of the video.
	 */
	creator?: string;

	/**
	 * The publisher of the video.
	 */
	publisher?: string;

	/**
	 * A thumbnail associated with the video.
	 */
	thumbnail?: Thumbnail;

	/**
	 * A list of tags associated with the video.
	 */
	tags?: string[];

	/**
	 * Author of the video.
	 */
	author?: WebProfile;

	/**
	 * Whether the video requires a subscription to watch.
	 */
	requires_subscription?: boolean;
}

/**
 * A result which can be used as a button
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#ButtonResult
 */
export interface WebButtonResult {
	/**
	 * A type identifying button result. The value is always button_result.
	 */
	type: 'button_result';

	/**
	 * The title of the result.
	 */
	title: string;

	/**
	 * The url for the button result.
	 */
	url: string;
}

/**
 * A model describing an image
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#Image
 */
export interface WebImage {
	/**
	 * The thumbnail associated with the image.
	 */
	thumbnail?: Thumbnail;

	/**
	 * The url of the image.
	 */
	url?: string;

	/**
	 * Metadata on the image.
	 */
	properties?: WebImageProperties;
}

/**
 * A model representing a language
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#Language
 */
export interface WebLanguage {
	/**
	 * The main language seen in the string.
	 */
	main: string;
}

/**
 * Metadata on an image
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#ImageProperties
 */
export interface WebImageProperties {
	/**
	 * The original image URL.
	 */
	url: string;

	/**
	 * The url for a better quality resized image.
	 */
	resized: string;

	/**
	 * The placeholder image url.
	 */
	placeholder: string;

	/**
	 * The image height.
	 */
	height?: number;

	/**
	 * The image width.
	 */
	width?: number;

	/**
	 * The image format.
	 */
	format?: string;

	/**
	 * The image size.
	 */
	content_size?: string;
}

/**
 * Details on getting the summary
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#Summarizer
 */
export interface WebSummarizer extends WebComponentResponse {
	/**
	 * The value is always summarizer.
	 */
	type: 'summarizer';

	/**
	 * The key for the summarizer API.
	 */
	key: string;
}

/**
 * Callback information for rich results
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#RichCallbackInfo
 */
export interface WebRichCallbackInfo extends WebComponentResponse {
	/**
	 * The value is always rich.
	 */
	type: 'rich';

	/**
	 * The hint for the rich result.
	 */
	hint?: WebRichCallbackHint;
}

/**
 * The hint for the rich result
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/responses#RichCallbackHint
 */
export interface WebRichCallbackHint {
	/**
	 * The name of the vertical of the rich result.
	 */
	vertical: string;

	/**
	 * The callback key for the rich result.
	 */
	callback_key: string;
}
