import type { TaskFunction } from 'gulp';
import type { PackageJson } from 'type-fest';

import { exec } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { globby } from 'globby';
import { dest, series, src } from 'gulp';
import gulpJsonEditor from 'gulp-json-editor';
import { rimraf } from 'rimraf';
import semver from 'semver';

import { GulpUtils, MiscUtils } from '@ct/build-utils';

const execAsync = promisify(exec);
const distributionDirectory = path.resolve(os.tmpdir(), `brave-search-types-dist-${Date.now().toString()}`);

/**
 * Copies files to a temporary directory for publishing
 */
async function copyFilesAsync() {
	await MiscUtils.toPromise(src('builds/**/*', { allowEmpty: false, dot: true }).pipe(dest(path.resolve(distributionDirectory, 'builds'))));
	await MiscUtils.toPromise(src(['LICENSE', 'CODEOWNERS', 'README.md'], { allowEmpty: false, dot: true }).pipe(dest(distributionDirectory)));
	await MiscUtils.toPromise(
		src('package.json', { allowEmpty: false, dot: true })
			.pipe(
				gulpJsonEditor((json: any) => {
					delete json.devDependencies;
					delete json.scripts;
					return json;
				})
			)
			.pipe(dest(distributionDirectory))
	);
	const tsBuildInfoFiles = await globby('**/*.tsbuildinfo', { cwd: distributionDirectory, dot: true, expandDirectories: true, onlyFiles: true, objectMode: false, absolute: true });
	for (const tsBuildInfoFile of tsBuildInfoFiles) {
		await fs.promises.rm(tsBuildInfoFile, { force: true, recursive: true });
	}
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
async function withBumpedVersionAsync(fn: (packageName: string, version: string, tag: string) => Promise<void>): Promise<void> {
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
	await fn(pkg.name!, publishVersion, npmTag);

	try {
		// Always bump version post-publish
		pkg.version = nextVersionAfterPublish;
		await fs.promises.writeFile(filePath, JSON.stringify(pkg, null, '\t'));
		await MiscUtils.prettifyAsync(filePath);
		console.log(`📦 Published ${currentVersion} with tag "${npmTag}"`);
		console.log(`🔁 Bumped to next version: ${nextVersionAfterPublish}`);
	} catch (error) {
		// Restore on error
		pkg.version = currentVersion;
		await fs.promises.writeFile(filePath, JSON.stringify(pkg, null, '\t'));
		await MiscUtils.prettifyAsync(filePath);
		throw error;
	}
}

/**
 * Publishes the package to npm
 */
async function publishAsync(): Promise<void> {
	try {
		await withBumpedVersionAsync(async (packageName, version, tag) => {
			console.log(`🚀 Publishing version ${version} with tag "${tag}"`);
			const { stdout, stderr } = await execAsync(`npm publish --access public --tag ${tag}`, {
				cwd: distributionDirectory
			});
			if (stdout) console.log(stdout);
			if (stderr) console.error(stderr);

			// Add "edge" tag for the latest version
			console.log(`🏷️  Adding "edge" tag to ${packageName}@${version}`);
			const { stdout: tagOut, stderr: tagErr } = await execAsync(`npm dist-tag add ${packageName}@${version} edge`, {
				cwd: distributionDirectory
			});
			if (tagOut) console.log(tagOut);
			if (tagErr) console.error(tagErr);
		});
	} finally {
		if (fs.existsSync(distributionDirectory)) {
			await rimraf(distributionDirectory, { glob: false });
		}
	}
}

/**
 * Export
 */
export const publishToNpm: TaskFunction = series(
	GulpUtils.toNamed(copyFilesAsync, 'copyFiles', 'Copy files to temp directory'),
	GulpUtils.toNamed(publishAsync, 'publishPackage', 'Publish package to npm')
);
