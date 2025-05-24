/**
 * Base response interface for API responses
 */
export interface SearchApiQueryParamsBase {
	/**
	 * The user's search query term. Query can not be empty.
	 * Maximum of 400 characters and 50 words in the query.
	 */
	q: string;

	/**
	 * The search query country, where the results come from.
	 * The country string is limited to 2 character country codes of supported countries.
	 * @default SearchCountry.unitedStates
	 */
	country?: SearchCountry;
}

/**
 * Base response interface for API responses
 */
export interface SearchApiResponseBase {
	/**
	 * The type of response
	 */
	type: 'images' | 'news' | 'spellcheck' | 'suggest' | 'summarizer' | 'videos' | 'search' | 'local_pois' | 'local_descriptions';
}

/**
 * Base search result interface
 */
export interface SearchResultBase {
	/**
	 * The type of result
	 */
	type: 'image_result' | 'news_result' | 'video_result';
}

/**
 * A model representing information gathered around the requested query
 */
export interface SearchQueryInfoBase {
	/**
	 * The original query that was requested.
	 */
	original: string;

	/**
	 * The altered query by the spellchecker. This is the query that is used to search.
	 */
	altered?: string;

	/**
	 * Whether the spellchecker is enabled or disabled.
	 */
	spellcheck_off?: boolean;

	/**
	 * The value is true if request was made with safesearch as strict,
	 * but there are more results available with safesearch as moderate.
	 * The value is false or absent otherwise.
	 */
	show_strict_warning?: string;
}

/**
 * Aggregated information about a url
 */
export interface MetaUrl {
	/**
	 * The protocol scheme extracted from the url.
	 */
	scheme: string;

	/**
	 * The network location part extracted from the url.
	 */
	netloc: string;

	/**
	 * The lowercased domain name extracted from the url.
	 */
	hostname?: string;

	/**
	 * The favicon used for the url.
	 */
	favicon: string;

	/**
	 * The hierarchical path of the url useful as a display string.
	 */
	path: string;
}

/**
 * Aggregated details representing a thumbnail
 */
export interface Thumbnail {
	/**
	 * The served URL of the image.
	 */
	src: string;

	/**
	 * The original URL of the image.
	 */
	original?: string;
}

/**
 * Safe search filter levels
 */
export enum SafeSearchFilter {
	/**
	 * No filtering is done
	 */
	off = 'off',

	/**
	 * Filter out explicit content.
	 */
	moderate = 'moderate',

	/**
	 * Filter out explicit and suggestive content.
	 */
	strict = 'strict'
}

/**
 * Freshness filter options for search results
 */
export enum SearchFreshness {
	/**
	 * Discovered within the last 24 hours
	 */
	pastDay = 'pd',

	/**
	 * Discovered within the last 7 days
	 */
	pastWeek = 'pw',

	/**
	 * Discovered within the last 31 days
	 */
	pastMonth = 'pm',

	/**
	 * Discovered within the last 365 days
	 */
	pastYear = 'py'
}

/**
 * Country codes following ISO 3166-1 alpha-2 standard
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/codes#country-codes
 */
export enum SearchCountry {
	afghanistan = 'AF',
	alandIslands = 'AX',
	albania = 'AL',
	algeria = 'DZ',
	americanSamoa = 'AS',
	andorra = 'AD',
	angola = 'AO',
	anguilla = 'AI',
	antarctica = 'AQ',
	antiguaAndBarbuda = 'AG',
	argentina = 'AR',
	armenia = 'AM',
	aruba = 'AW',
	australia = 'AU',
	austria = 'AT',
	azerbaijan = 'AZ',
	bahamas = 'BS',
	bahrain = 'BH',
	bangladesh = 'BD',
	barbados = 'BB',
	belarus = 'BY',
	belgium = 'BE',
	belize = 'BZ',
	benin = 'BJ',
	bermuda = 'BM',
	bhutan = 'BT',
	bolivia = 'BO',
	bonaireSintEustatiusAndSaba = 'BQ',
	bosniaAndHerzegovina = 'BA',
	botswana = 'BW',
	bouvetIsland = 'BV',
	brazil = 'BR',
	britishIndianOceanTerritory = 'IO',
	bruneiDarussalam = 'BN',
	bulgaria = 'BG',
	burkinaFaso = 'BF',
	burundi = 'BI',
	cambodia = 'KH',
	cameroon = 'CM',
	canada = 'CA',
	capeVerde = 'CV',
	caymanIslands = 'KY',
	centralAfricanRepublic = 'CF',
	chad = 'TD',
	chile = 'CL',
	china = 'CN',
	christmasIsland = 'CX',
	cocosKeelingIslands = 'CC',
	colombia = 'CO',
	comoros = 'KM',
	congo = 'CG',
	congoDemocraticRepublic = 'CD',
	cookIslands = 'CK',
	costaRica = 'CR',
	coteDivoire = 'CI',
	croatia = 'HR',
	cuba = 'CU',
	curacao = 'CW',
	cyprus = 'CY',
	czechRepublic = 'CZ',
	denmark = 'DK',
	djibouti = 'DJ',
	dominica = 'DM',
	dominicanRepublic = 'DO',
	ecuador = 'EC',
	egypt = 'EG',
	elSalvador = 'SV',
	equatorialGuinea = 'GQ',
	eritrea = 'ER',
	estonia = 'EE',
	ethiopia = 'ET',
	falklandIslandsMalvinas = 'FK',
	faroeIslands = 'FO',
	fiji = 'FJ',
	finland = 'FI',
	france = 'FR',
	frenchGuiana = 'GF',
	frenchPolynesia = 'PF',
	frenchSouthernTerritories = 'TF',
	gabon = 'GA',
	gambia = 'GM',
	georgia = 'GE',
	germany = 'DE',
	ghana = 'GH',
	gibraltar = 'GI',
	greece = 'GR',
	greenland = 'GL',
	grenada = 'GD',
	guadeloupe = 'GP',
	guam = 'GU',
	guatemala = 'GT',
	guernsey = 'GG',
	guinea = 'GN',
	guineaBissau = 'GW',
	guyana = 'GY',
	haiti = 'HT',
	heardIslandAndMcDonaldIslands = 'HM',
	holySeeVaticanCityState = 'VA',
	honduras = 'HN',
	hongKong = 'HK',
	hungary = 'HU',
	iceland = 'IS',
	india = 'IN',
	indonesia = 'ID',
	iranIslamicRepublicOf = 'IR',
	iraq = 'IQ',
	ireland = 'IE',
	isleOfMan = 'IM',
	israel = 'IL',
	italy = 'IT',
	jamaica = 'JM',
	japan = 'JP',
	jersey = 'JE',
	jordan = 'JO',
	kazakhstan = 'KZ',
	kenya = 'KE',
	kiribati = 'KI',
	koreaDemocraticPeoplesRepublicOf = 'KP',
	koreaRepublicOf = 'KR',
	kuwait = 'KW',
	kyrgyzstan = 'KG',
	laoPeoplesDemocraticRepublic = 'LA',
	latvia = 'LV',
	lebanon = 'LB',
	lesotho = 'LS',
	liberia = 'LR',
	libya = 'LY',
	liechtenstein = 'LI',
	lithuania = 'LT',
	luxembourg = 'LU',
	macao = 'MO',
	macedonia = 'MK',
	madagascar = 'MG',
	malawi = 'MW',
	malaysia = 'MY',
	maldives = 'MV',
	mali = 'ML',
	malta = 'MT',
	marshallIslands = 'MH',
	martinique = 'MQ',
	mauritania = 'MR',
	mauritius = 'MU',
	mayotte = 'YT',
	mexico = 'MX',
	micronesiaFederatedStatesOf = 'FM',
	moldovaRepublicOf = 'MD',
	monaco = 'MC',
	mongolia = 'MN',
	montenegro = 'ME',
	montserrat = 'MS',
	morocco = 'MA',
	mozambique = 'MZ',
	myanmar = 'MM',
	namibia = 'NA',
	nauru = 'NR',
	nepal = 'NP',
	netherlands = 'NL',
	newCaledonia = 'NC',
	newZealand = 'NZ',
	nicaragua = 'NI',
	niger = 'NE',
	nigeria = 'NG',
	niue = 'NU',
	norfolkIsland = 'NF',
	northernMarianaIslands = 'MP',
	norway = 'NO',
	oman = 'OM',
	pakistan = 'PK',
	palau = 'PW',
	palestineStateOf = 'PS',
	panama = 'PA',
	papuaNewGuinea = 'PG',
	paraguay = 'PY',
	peru = 'PE',
	philippines = 'PH',
	pitcairn = 'PN',
	poland = 'PL',
	portugal = 'PT',
	puertoRico = 'PR',
	qatar = 'QA',
	reunion = 'RE',
	romania = 'RO',
	russianFederation = 'RU',
	rwanda = 'RW',
	saintBarthelemy = 'BL',
	saintHelenaAscensionAndTristanDaCunha = 'SH',
	saintKittsAndNevis = 'KN',
	saintLucia = 'LC',
	saintMartinFrenchPart = 'MF',
	saintPierreAndMiquelon = 'PM',
	saintVincentAndTheGrenadines = 'VC',
	samoa = 'WS',
	sanMarino = 'SM',
	saoTomeAndPrincipe = 'ST',
	saudiArabia = 'SA',
	senegal = 'SN',
	serbia = 'RS',
	seychelles = 'SC',
	sierraLeone = 'SL',
	singapore = 'SG',
	sintMaartenDutchPart = 'SX',
	slovakia = 'SK',
	slovenia = 'SI',
	solomonIslands = 'SB',
	somalia = 'SO',
	southAfrica = 'ZA',
	southGeorgiaAndTheSouthSandwichIslands = 'GS',
	southSudan = 'SS',
	spain = 'ES',
	sriLanka = 'LK',
	sudan = 'SD',
	suriname = 'SR',
	svalbardAndJanMayen = 'SJ',
	swaziland = 'SZ',
	sweden = 'SE',
	switzerland = 'CH',
	syrianArabRepublic = 'SY',
	taiwanProvinceOfChina = 'TW',
	tajikistan = 'TJ',
	tanzaniaUnitedRepublicOf = 'TZ',
	thailand = 'TH',
	timorLeste = 'TL',
	togo = 'TG',
	tokelau = 'TK',
	tonga = 'TO',
	trinidadAndTobago = 'TT',
	tunisia = 'TN',
	turkey = 'TR',
	turkmenistan = 'TM',
	turksAndCaicosIslands = 'TC',
	tuvalu = 'TV',
	uganda = 'UG',
	ukraine = 'UA',
	unitedArabEmirates = 'AE',
	unitedKingdom = 'GB',
	unitedStates = 'US',
	unitedStatesMinorOutlyingIslands = 'UM',
	uruguay = 'UY',
	uzbekistan = 'UZ',
	vanuatu = 'VU',
	venezuelaBolivarianRepublicOf = 'VE',
	vietnam = 'VN',
	virginIslandsBritish = 'VG',
	virginIslandsUS = 'VI',
	wallisAndFutuna = 'WF',
	westernSahara = 'EH',
	yemen = 'YE',
	zambia = 'ZM',
	zimbabwe = 'ZW'
}

/**
 * Language codes following ISO 639-1 two-letter standard
 * @see https://api-dashboard.search.brave.com/app/documentation/web-search/codes#language-codes
 */
export enum SearchLanguage {
	afar = 'aa',
	abkhazian = 'ab',
	avestan = 'ae',
	afrikaans = 'af',
	akan = 'ak',
	amharic = 'am',
	aragonese = 'an',
	arabic = 'ar',
	assamese = 'as',
	avaric = 'av',
	aymara = 'ay',
	azerbaijani = 'az',
	bashkir = 'ba',
	belarusian = 'be',
	bulgarian = 'bg',
	bihari = 'bh',
	bislama = 'bi',
	bambara = 'bm',
	bengali = 'bn',
	tibetan = 'bo',
	breton = 'br',
	bosnian = 'bs',
	catalan = 'ca',
	chechen = 'ce',
	chamorro = 'ch',
	corsican = 'co',
	cree = 'cr',
	czech = 'cs',
	churchSlavic = 'cu',
	chuvash = 'cv',
	welsh = 'cy',
	danish = 'da',
	german = 'de',
	divehi = 'dv',
	dzongkha = 'dz',
	ewe = 'ee',
	greek = 'el',
	english = 'en',
	esperanto = 'eo',
	spanish = 'es',
	estonian = 'et',
	basque = 'eu',
	persian = 'fa',
	fulah = 'ff',
	finnish = 'fi',
	fijian = 'fj',
	faroese = 'fo',
	french = 'fr',
	westernFrisian = 'fy',
	irish = 'ga',
	scottishGaelic = 'gd',
	galician = 'gl',
	guarani = 'gn',
	gujarati = 'gu',
	manx = 'gv',
	hausa = 'ha',
	hebrew = 'he',
	hindi = 'hi',
	hiriMotu = 'ho',
	croatian = 'hr',
	haitianCreole = 'ht',
	hungarian = 'hu',
	armenian = 'hy',
	herero = 'hz',
	interlingua = 'ia',
	indonesian = 'id',
	interlingue = 'ie',
	igbo = 'ig',
	sichuanYi = 'ii',
	inupiaq = 'ik',
	ido = 'io',
	icelandic = 'is',
	italian = 'it',
	inuktitut = 'iu',
	japanese = 'ja',
	javanese = 'jv',
	georgian = 'ka',
	kongo = 'kg',
	kikuyu = 'ki',
	kwanyama = 'kj',
	kazakh = 'kk',
	kalaallisut = 'kl',
	khmer = 'km',
	kannada = 'kn',
	korean = 'ko',
	kanuri = 'kr',
	kashmiri = 'ks',
	kurdish = 'ku',
	komi = 'kv',
	cornish = 'kw',
	kyrgyz = 'ky',
	latin = 'la',
	luxembourgish = 'lb',
	ganda = 'lg',
	limburgish = 'li',
	lingala = 'ln',
	lao = 'lo',
	lithuanian = 'lt',
	lubaKatanga = 'lu',
	latvian = 'lv',
	malagasy = 'mg',
	marshallese = 'mh',
	maori = 'mi',
	macedonian = 'mk',
	malayalam = 'ml',
	mongolian = 'mn',
	marathi = 'mr',
	malay = 'ms',
	maltese = 'mt',
	burmese = 'my',
	nauru = 'na',
	norwegianBokmal = 'nb',
	northNdebele = 'nd',
	nepali = 'ne',
	ndonga = 'ng',
	dutch = 'nl',
	norwegianNynorsk = 'nn',
	norwegian = 'no',
	southNdebele = 'nr',
	navajo = 'nv',
	chichewa = 'ny',
	occitan = 'oc',
	ojibwa = 'oj',
	oromo = 'om',
	oriya = 'or',
	ossetian = 'os',
	punjabi = 'pa',
	pali = 'pi',
	polish = 'pl',
	pashto = 'ps',
	portuguese = 'pt',
	quechua = 'qu',
	romansh = 'rm',
	rundi = 'rn',
	romanian = 'ro',
	russian = 'ru',
	kinyarwanda = 'rw',
	sanskrit = 'sa',
	sardinian = 'sc',
	sindhi = 'sd',
	northernSami = 'se',
	sango = 'sg',
	sinhala = 'si',
	slovak = 'sk',
	slovenian = 'sl',
	samoan = 'sm',
	shona = 'sn',
	somali = 'so',
	albanian = 'sq',
	serbian = 'sr',
	swati = 'ss',
	sotho = 'st',
	sundanese = 'su',
	swedish = 'sv',
	swahili = 'sw',
	tamil = 'ta',
	telugu = 'te',
	tajik = 'tg',
	thai = 'th',
	tigrinya = 'ti',
	turkmen = 'tk',
	tagalog = 'tl',
	tswana = 'tn',
	tongan = 'to',
	turkish = 'tr',
	tsonga = 'ts',
	tatar = 'tt',
	twi = 'tw',
	tahitian = 'ty',
	uighur = 'ug',
	ukrainian = 'uk',
	urdu = 'ur',
	uzbek = 'uz',
	venda = 've',
	vietnamese = 'vi',
	volapuk = 'vo',
	walloon = 'wa',
	wolof = 'wo',
	xhosa = 'xh',
	yiddish = 'yi',
	yoruba = 'yo',
	zhuang = 'za',
	chinese = 'zh',
	zulu = 'zu'
}

/**
 * Country language codes supported by the ui_lang parameter
 * @see https://api-dashboard.search.brave.com/app/documentation/video-search/codes#market-codes
 */
export enum SearchUiLanguage {
	chineseChina = 'zh-CN',
	danishDenmark = 'da-DK',
	dutchBelgium = 'nl-BE',
	dutchNetherlands = 'nl-NL',
	englishAustralia = 'en-AU',
	englishCanada = 'en-CA',
	englishIndia = 'en-IN',
	englishIndonesia = 'en-ID',
	englishMalaysia = 'en-MY',
	englishNewZealand = 'en-NZ',
	englishPhilippines = 'en-PH',
	englishSouthAfrica = 'en-ZA',
	englishUnitedKingdom = 'en-GB',
	englishUnitedStates = 'en-US',
	finnishFinland = 'fi-FI',
	frenchBelgium = 'fr-BE',
	frenchCanada = 'fr-CA',
	frenchFrance = 'fr-FR',
	frenchSwitzerland = 'fr-CH',
	germanAustria = 'de-AT',
	germanGermany = 'de-DE',
	germanSwitzerland = 'de-CH',
	italianItaly = 'it-IT',
	japaneseJapan = 'ja-JP',
	koreanKorea = 'ko-KR',
	norwegianNorway = 'no-NO',
	polishPoland = 'pl-PL',
	portugueseBrazil = 'pt-BR',
	russianRussia = 'ru-RU',
	spanishArgentina = 'es-AR',
	spanishChile = 'es-CL',
	spanishMexico = 'es-MX',
	spanishSpain = 'es-ES',
	spanishUnitedStates = 'es-US',
	swedishSweden = 'sv-SE',
	traditionalChineseHongKong = 'zh-HK',
	traditionalChineseTaiwan = 'zh-TW',
	turkishTurkey = 'tr-TR'
}
