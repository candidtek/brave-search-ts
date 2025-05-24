import fs from 'node:fs';
import path from 'node:path';
import { deepmerge } from 'deepmerge-ts';
import { findUpSync } from 'find-up';
import { parse } from 'jsonc-parser';
import semver from 'semver';

/**
 * Composite configuration
 * @typedef CompositePrettierConfig
 * @type {import('prettier').Config & import('@ianvs/prettier-plugin-sort-imports').PluginConfig}
 * @see https://prettier.io/docs/options
 * @see https://github.com/IanVS/prettier-plugin-sort-imports?tab=readme-ov-file#options
 */

/**
 * @typedef PrettierConfigGeneratorOptions
 * @type {object}
 * @property {boolean} [useSortImportsPlugin] - Whether to use the sort imports plugin
 * @property {string[]} [sortOrder] - Custom sort order for imports
 */

/**
 * Default prettier configuration generator options
 * @type {PrettierConfigGeneratorOptions}
 */
const defaultGeneratorOptions = {
	useSortImportsPlugin: true
};

/**
 * Default configuration
 * @type {import('prettier').Config}
 */
const defaultConfig = {
	arrowParens: 'avoid',
	bracketSameLine: true,
	bracketSpacing: true,
	embeddedLanguageFormatting: 'auto',
	endOfLine: 'auto',
	experimentalTernaries: true,
	htmlWhitespaceSensitivity: 'strict',
	insertPragma: false,
	jsxSingleQuote: false,
	printWidth: 200,
	proseWrap: 'preserve',
	quoteProps: 'consistent',
	requirePragma: false,
	semi: true,
	singleAttributePerLine: false,
	singleQuote: true,
	tabWidth: 4,
	trailingComma: 'none',
	useTabs: true
};

/**
 * Returns prettier configuration
 * @param {!string} projectDirectory The project directory
 * @param {PrettierConfigGeneratorOptions | null} [options] The options for the prettier configuration
 * @returns {CompositePrettierConfig} The prettier configuration
 */
function getPrettierConfig(projectDirectory, options) {
	// Adjust directory
	projectDirectory = (projectDirectory ?? '').trim();
	if (!projectDirectory) {
		throw new Error(`Invalid project directory: ${projectDirectory}`);
	}
	projectDirectory = path.resolve(projectDirectory);
	try {
		if (!fs.statSync(projectDirectory).isDirectory()) {
			throw new Error(`Project directory does not exist: ${projectDirectory}`);
		}
	} catch (error) {
		// @ts-expect-error - TypeScript does not know that error is an instance of Error
		throw new Error(`Project directory does not exist: ${projectDirectory} (ERROR: ${error.message ?? JSON.toString(error)})`);
	}

	// Options
	options = deepmerge(defaultGeneratorOptions, options ?? {});

	// Package
	const packageJsonPath = findUpSync('package.json', { cwd: projectDirectory, type: 'file' });
	if (!packageJsonPath) {
		throw new Error(`Could not find package.json in project directory: ${projectDirectory}`);
	}
	/**
	 * @type {import('type-fest').PackageJson}
	 */
	const packageJson = parse(fs.readFileSync(packageJsonPath, { encoding: 'utf8' }));

	/**
	 * Prettier Configuration
	 * @type {CompositePrettierConfig}
	 */
	const config = { ...defaultConfig };

	// Sort imports
	if (options.useSortImportsPlugin) {
		// Plugins
		config.plugins ??= [];
		config.plugins.push('@ianvs/prettier-plugin-sort-imports');

		// Get typescript version installed in the project directory
		const typescriptVersion = semver.parse(packageJson.dependencies?.['typescript']?.trim() || packageJson.devDependencies?.['typescript']?.trim() || '5.0.0')?.version ?? '5.0.0';

		// Import order
		config.importOrder = options.sortOrder ?? parse(fs.readFileSync(path.resolve(import.meta.dirname, 'imports-sort-order.json'), { encoding: 'utf8' }));
		config.importOrderParserPlugins = ['typescript', 'jsx', 'decorators-legacy'];
		config.importOrderTypeScriptVersion = typescriptVersion;
	}

	// Overrides
	if (packageJson.dependencies && packageJson.dependencies['@babel/parser']) {
		config.overrides = [
			{
				files: '*.json.hbs',
				options: {
					parser: 'json'
				}
			},
			{
				files: '*.js.hbs',
				options: {
					parser: 'babel'
				}
			}
		];
	}

	// Return
	return config;
}

// Export
export default getPrettierConfig(import.meta.dirname);
