import type { TaskFunction } from 'gulp';
import type { SourceFile } from 'ts-morph';
import type { PackageJson } from 'type-fest';

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { series } from 'gulp';
import { rimraf } from 'rimraf';

import { GulpUtils, ModuleType } from './utils';

/**
 * Factory: given a module type, creates a Gulp task that
 * runs pre-build, compile, writePackageJson, and copyExtras.
 * @param moduleTypes - The module types to build (either 'esm' or 'cjs').
 * @returns A Gulp task function that performs the build process.
 */
function makeBuildTask(...moduleTypes: ModuleType[]): TaskFunction {
	const typeTasks: TaskFunction[] = [];
	const buildsDirectory = 'builds';

	// Ignore gulp files
	const gulpDirectory = path.resolve('gulp').replaceAll('\\', '/').toLowerCase() + '/';
	const ignoreFile = (f: SourceFile) => {
		return f.getFilePath().replaceAll('\\', '/').toLowerCase().startsWith(gulpDirectory);
	};

	for (const [iType, moduleType] of moduleTypes.entries()) {
		const moduleBuildDirectory = `${buildsDirectory}/${ModuleType[moduleType]}`;
		const tsConfigFileName = `tsconfig.build.${ModuleType[moduleType]}.json`;
		const tsConfigFileNameWithoutExtension = path.basename(tsConfigFileName, path.extname(tsConfigFileName));

		// Only for the first
		if (iType === 0) {
			// Update import and export declarations
			typeTasks.push(GulpUtils.toNamed(() => GulpUtils.updateProjectImportExportDeclarationsAsync(path.resolve(tsConfigFileName), ignoreFile), 'Updating import and export declarations'));
		}

		// Delete outputs
		const globs = [moduleBuildDirectory, path.resolve(moduleBuildDirectory, '..', `${tsConfigFileNameWithoutExtension}.tsbuildinfo`)];
		typeTasks.push(GulpUtils.toNamed(() => rimraf(globs, { glob: true }), 'Deleting outputs'));

		// Build project
		typeTasks.push(
			GulpUtils.toNamed(
				() =>
					new Promise<void>((resolve, reject) => {
						const child = spawn('tsc', ['-p', tsConfigFileName], {
							stdio: 'inherit',
							shell: true
						});

						child.on('exit', code => {
							if (code === 0) {
								resolve();
							} else {
								reject(new Error(`tsc exited with code ${code}`));
							}
						});
					}),
				'Building project'
			)
		);

		// Write target package.json
		typeTasks.push(
			GulpUtils.toNamed(async () => {
				// Write package.json
				const packageJsonPath = path.resolve(moduleBuildDirectory, 'package.json');
				const moduleTypeProperty = moduleType === ModuleType.esm ? 'module' : 'commonjs';
				let packageJsonContent = JSON.stringify({ type: moduleTypeProperty }, undefined, '\t');

				// Check if file already exists
				if (fs.existsSync(packageJsonPath)) {
					packageJsonContent = await fs.promises.readFile(packageJsonPath, { encoding: 'utf8' });
					const packageJson = JSON.parse(packageJsonContent) as PackageJson;
					if (packageJson.type === moduleTypeProperty) {
						// No need to UPDATE
						return;
					} else if (packageJson.type === undefined) {
						// Add type property
						packageJson.type = moduleTypeProperty;
						packageJsonContent = JSON.stringify(packageJson, undefined, '\t');
					} else {
						throw new Error(`Invalid package.json type. Expected "${moduleTypeProperty}", but found "${packageJson.type}".`);
					}
				}

				// Write
				await fs.promises.writeFile(packageJsonPath, packageJsonContent, { encoding: 'utf8' });
			}, 'Writing package.json')
		);
	}
	return series(...typeTasks);
}

// Exports
export const buildEsm: TaskFunction = makeBuildTask(ModuleType.esm);
export const buildCjs: TaskFunction = makeBuildTask(ModuleType.cjs);
export const build: TaskFunction = makeBuildTask(ModuleType.esm, ModuleType.cjs);
