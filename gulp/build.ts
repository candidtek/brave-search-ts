import type { TaskFunction } from 'gulp';

import path from 'node:path';
import { series } from 'gulp';

import { BuildModuleType, BuildUtils, GulpUtils, TsUtils } from '@ct/build-utils';

/**
 * Factory: given a module type, creates a Gulp task that
 * runs pre-build, compile, writePackageJson, and copyExtras.
 * @param moduleTypes - The module types to build (either 'esm' or 'cjs').
 * @returns A Gulp task function that performs the build process.
 */
function makeBuildTask(...moduleTypes: BuildModuleType[]): TaskFunction {
	const typeTasks: TaskFunction[] = [];
	const projectDirectory = path.normalize(path.resolve('.'));

	for (const [iType, moduleType] of moduleTypes.entries()) {
		const tsConfigPath = TsUtils.getTsConfigPath(projectDirectory, moduleType, true);

		// Only for the first
		if (iType === 0) {
			// Update import and export declarations
			typeTasks.push(GulpUtils.toNamed(() => TsUtils.updateProjectImportExportDeclarationsAsync(tsConfigPath), 'Updating import and export declarations'));
		}

		// Delete outputs
		typeTasks.push(GulpUtils.toNamed(() => BuildUtils.deleteOutputsAsync(tsConfigPath), `${BuildModuleType[moduleType].toUpperCase()}: Deleting outputs`));

		// Build project
		typeTasks.push(
			GulpUtils.toNamed(() => BuildUtils.buildProjectAsync(tsConfigPath, moduleType, process.stdout, process.stderr), `${BuildModuleType[moduleType].toUpperCase()}: Building project`)
		);
	}

	// Return
	return series(...typeTasks);
}

// Exports
export const buildEsm: TaskFunction = makeBuildTask(BuildModuleType.esm);
export const buildCjs: TaskFunction = makeBuildTask(BuildModuleType.cjs);
export const build: TaskFunction = makeBuildTask(BuildModuleType.esm, BuildModuleType.cjs);
