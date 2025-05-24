import type { TaskFunction } from 'gulp';
import type { PackageJson } from 'type-fest';

import { globby } from 'globby';
import { dest, series, src } from 'gulp';
import gulpJsonEditor from 'gulp-json-editor';
import { exec } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { promisify } from 'node:util';
import prettier from 'prettier';
import { rimraf } from 'rimraf';
import semver from 'semver';

const execAsync = promisify(exec);
const destinationDirectory = path.resolve(os.tmpdir(), `brave-search-types-dist-${Date.now().toString()}`);
console.log(`📦 Temporary directory: ${destinationDirectory}`);

/**
 * Converts a task function to a named task function.
 */
function toNamed(fn: TaskFunction, name: string, description?: string): TaskFunction {
	fn.displayName = name;
	fn.description = description ?? '';
	return fn;
}

/**
 * Copies files to a temporary directory for publishing
 */
async function copyFilesAsync() {
	await pipeline(src('builds/**/*', { allowEmpty: false, dot: true }), dest(path.resolve(destinationDirectory, 'builds')));
	await pipeline(src(['LICENSE', 'CODEOWNERS', 'README.md'], { allowEmpty: false, dot: true }), dest(destinationDirectory));
	await pipeline(
		src('package.json', { allowEmpty: false, dot: true }),
		gulpJsonEditor((json: any) => {
			delete json.devDependencies;
			delete json.scripts;
			return json;
		}),
		dest(destinationDirectory)
	);
	const tsBuildInfoFiles = await globby('**/*.tsbuildinfo', { cwd: destinationDirectory, dot: true, expandDirectories: true, onlyFiles: true, objectMode: false, absolute: true });
	for (const tsBuildInfoFile of tsBuildInfoFiles) {
		await fs.promises.unlink(tsBuildInfoFile);
	}
}

/**
 * Prettifies the specified file
 * @param filePath The path to the file to prettify
 */
async function prettifyAsync(filePath: string): Promise<void> {
	// Read the file
	const source = await fs.promises.readFile(filePath, 'utf8');

	// Load config (returns `null` if none found)
	const resolvedConfig = await prettier.resolveConfig(filePath);

	// Format: if config is null, you must specify a parser
	const formatted = await prettier.format(source, {
		...resolvedConfig,
		filepath: filePath
	});

	// 4. Write back
	await fs.promises.writeFile(filePath, formatted, 'utf8');
}

/**
 * Determines the npm tag based on the version
 */
function getNpmTag(version: string): string {
	const prerelease = semver.prerelease(version);
	if (prerelease && prerelease.length > 0) {
		return prerelease[0] as string; // e.g., 'dev', 'beta'
	}
	return 'latest';
}

/**
 * Bumps version, runs a task, and post-processes version if needed.
 */
async function withBumpedVersionAsync(fn: (version: string, tag: string) => Promise<void>): Promise<void> {
	const filePath = path.resolve('package.json');
	const pkg = JSON.parse(await fs.promises.readFile(filePath, 'utf8')) as PackageJson;
	const currentVersion: string = pkg.version!;
	const npmTag = getNpmTag(currentVersion);
	const isPrerelease = npmTag !== 'latest';
	const publishVersion = currentVersion;
	let nextVersionAfterPublish: string | null = null;

	if (isPrerelease) {
		// Bump to next pre-release: e.g., 0.0.1-dev.2 → 0.0.1-dev.3
		nextVersionAfterPublish = semver.inc(currentVersion, 'prerelease', npmTag);
	} else {
		// Bump to next patch with `-dev.1`: e.g., 1.0.0 → 1.0.1-dev.1
		const nextPatch = semver.inc(currentVersion, 'patch');
		if (!nextPatch) throw new Error(`Failed to bump patch from ${currentVersion}`);
		nextVersionAfterPublish = `${nextPatch}-dev.1`;
	}

	if (!nextVersionAfterPublish) {
		throw new Error(`Could not determine next version from ${currentVersion}`);
	}

	// Publish 
	//await fn(publishVersion, npmTag);

	try {
		// Always bump version post-publish
		pkg.version = nextVersionAfterPublish;
		await fs.promises.writeFile(filePath, JSON.stringify(pkg, null, '\t'));
		await prettifyAsync(filePath);
		console.log(`📦 Published ${currentVersion} with tag "${npmTag}"`);
		console.log(`🔁 Bumped to next version: ${nextVersionAfterPublish}`);
	} catch (error) {
		// Restore on error
		pkg.version = currentVersion;
		await fs.promises.writeFile(filePath, JSON.stringify(pkg, null, '\t'));
		await prettifyAsync(filePath);
		throw error;
	}
}

/**
 * Publishes the package to npm
 */
async function publishAsync(): Promise<void> {
	try {
		await withBumpedVersionAsync(async () => {
			const { stdout, stderr } = await execAsync('npm publish --access public --tag dev', {
				cwd: destinationDirectory
			});
			if (stdout) console.log(stdout);
			if (stderr) console.error(stderr);
		});
	} finally {
		if (fs.existsSync(destinationDirectory)) {
			await rimraf(destinationDirectory, { glob: false });
		}
	}
}

/**
 * Export
 */
export const publishToNpm: TaskFunction = series(toNamed(copyFilesAsync, 'copyFiles', 'Copy files to temp directory'), toNamed(publishAsync, 'publishPackage', 'Publish package to npm'));
