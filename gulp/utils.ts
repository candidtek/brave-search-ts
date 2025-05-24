import type { TaskFunction } from 'gulp';
import type { ExportDeclaration, ImportDeclaration } from 'ts-morph';

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { Project, SourceFile } from 'ts-morph';

/**
 * Module types
 */
export enum ModuleType {
	esm = 0,
	cjs = 1
}

/**
 * Gulp utilities
 */
export abstract class GulpUtils {
	// #region Miscellaneous

	/**
	 * Converts a task function to a named task function.
	 * @param fn - The task function to convert.
	 * @param name - The name of the task.
	 * @param description - Optional description of the task.
	 * @returns A named task function.
	 */
	// eslint-disable-next-line unicorn/prevent-abbreviations
	public static toNamed(fn: TaskFunction, name: string, description?: string): TaskFunction {
		fn.displayName = name;
		fn.description = description ?? '';
		return fn;
	}

	/**
	 * Returns the path to the tsconfig.json file for a given module type.
	 * @param moduleType - The module type (e.g., 'esm', 'cjs', etc.).
	 * @param returnGenericFiles - If true, returns the generic tsconfig.json file.
	 * @param ensureExists - If true, ensures the file exists and creates it if not.
	 * @param cwd - The current working directory.
	 * @returns The path to the tsconfig.json file.
	 */
	public static getTsConfigPath(moduleType: ModuleType, returnGenericFiles: boolean, ensureExists: boolean, cwd?: string): string {
		const fileNames = [`tsconfig.build.${ModuleType[moduleType]}.json`];
		if (returnGenericFiles) {
			fileNames.push('tsconfig.build.json', 'tsconfig.json');
		}

		cwd = path.resolve((cwd ?? '').trim() || '.');
		for (const fileName of fileNames) {
			const filePath = path.resolve(cwd, fileName).replaceAll('\\', '/');
			if (!ensureExists) {
				return filePath;
			} else if (fs.existsSync(filePath)) {
				return filePath;
			}
		}

		// Throw
		throw new Error(`The tsconfig file does not exist: (${fileNames.join(', ')})`);
	}

	/**
	 * Builds the project for a specific module type.
	 * @param moduleType - The module type to build.
	 * @param cwd - The current working directory. If not provided, the current directory is used.
	 * @returns A promise that resolves when the build is complete.
	 */
	public static async buildProjectAsync(moduleType: ModuleType, cwd?: string): Promise<void> {
		cwd = path.resolve(cwd?.trim() ?? '.').replaceAll('\\', '/');
		const tsConfigPath = GulpUtils.getTsConfigPath(moduleType, false, true, cwd);
		const tsConfigFileName = path.basename(tsConfigPath);

		return new Promise((resolve, reject) => {
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
		});
	}

	// #endregion

	// #region Import and Export Declarations

	/**
	 * Updates import and export declarations to include actual file paths.
	 * @param tsConfigPath - The path to the tsconfig.json file.
	 * @param ignoreFile - Optional function to ignore specific files.
	 */
	public static async updateProjectImportExportDeclarationsAsync(tsConfigPath: string, ignoreFile?: (sourceFile: SourceFile) => boolean): Promise<void> {
		// Validate the tsconfig path
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (tsConfigPath !== undefined && tsConfigPath !== null && typeof tsConfigPath !== 'string') {
			throw new Error('Invalid tsconfig path provided. It should be a string, null or undefined.');
		}

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		tsConfigPath = (tsConfigPath ?? '').trim();
		if (!tsConfigPath || !path.isAbsolute(tsConfigPath)) {
			throw new Error('Empty or non-absolute tsconfig path provided.');
		}

		try {
			if (!fs.statSync(tsConfigPath).isFile()) {
				throw new Error(`Invalid tsconfig path provided. File does not exist: ${tsConfigPath}`);
			}
		} catch {
			throw new Error(`Invalid tsconfig path provided. File does not exist: ${tsConfigPath}`);
		}

		// Load project configuration
		const project = new Project({
			tsConfigFilePath: tsConfigPath
		});

		// Extensions
		const sourceFileExtensions = new Set(['.ts', '.mts', '.cts', '.js', '.mjs', '.cjs']);

		// Ignore file delegate
		ignoreFile ??= () => false;

		// Load all source files
		const sourceFiles = project
			.getSourceFiles()
			.filter(sourceFile => !sourceFile.isDeclarationFile() && sourceFileExtensions.has(path.extname(sourceFile.getFilePath()).toLowerCase()) && !ignoreFile(sourceFile));

		const failures: string[] = [];
		for (const sourceFile of sourceFiles) {
			this.updateFileImportExportDeclarationsInternal(sourceFile, failures);
		}

		// Save the project
		await project.save();

		// Show errors if any
		if (failures.length > 0) {
			throw new Error(`Failed to update import/export declarations in project: ${tsConfigPath}\n${failures.join('\n')}`);
		}
	}

	/**
	 * Updates import and export declarations for a specific source file.
	 * @param sourceFile - The source file to update.
	 */
	public static async updateFileImportExportDeclarationsAsync(sourceFile: SourceFile): Promise<void> {
		const failures: string[] = [];
		this.updateFileImportExportDeclarationsInternal(sourceFile, failures);

		// Save the project
		await sourceFile.save();

		// Show errors if any
		if (failures.length > 0) {
			throw new Error(`Failed to update import/export declarations in file: ${sourceFile.getFilePath()}\n\t\t${failures.join('\n\t\t')}`);
		}
	}

	/**
	 * Updates import and export declarations for a specific source file.
	 * @param sourceFile - The source file to update.
	 * @param failures - List of failures encountered during the update.
	 */
	private static updateFileImportExportDeclarationsInternal(sourceFile: SourceFile, failures: string[]): void {
		// Validate the source file
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (!sourceFile || !(sourceFile instanceof SourceFile)) {
			throw new Error('Invalid source file provided.');
		}

		// Context
		const sourcePath = sourceFile.getFilePath();
		const sourceDirectory = path.dirname(sourcePath);
		for (const importDeclaration of sourceFile.getImportDeclarations()) {
			try {
				this.updateImportExportDeclaration(importDeclaration, sourcePath, sourceDirectory);
			} catch (error) {
				// @ts-expect-error Error type missing
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				failures.push(error.message ?? JSON.stringify(error));
			}
		}
		for (const exportDeclaration of sourceFile.getExportDeclarations()) {
			try {
				this.updateImportExportDeclaration(exportDeclaration, sourcePath, sourceDirectory);
			} catch (error) {
				// @ts-expect-error Error type missing
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				failures.push(error.message ?? JSON.stringify(error));
			}
		}
	}

	/**
	 * Updates import and export declarations for a specific declaration.
	 * @param declaration - The declaration to update.
	 * @param sourcePath - The path to the source file.
	 * @param sourceDirectory - The directory of the source file.
	 */
	private static updateImportExportDeclaration(declaration: ImportDeclaration | ExportDeclaration, sourcePath: string, sourceDirectory: string): void {
		// Check if this is a valid import or export declaration that we need to work on
		const moduleSpec = declaration.getModuleSpecifierValue();
		if (!moduleSpec || !declaration.isModuleSpecifierRelative() || ['.ts', '.mts', '.cts', '.js', '.mjs', '.cjs', '.json'].some(extension => moduleSpec.endsWith(extension))) {
			// No modification required
			return;
		}

		// Importables
		const importAbsolutePath = path.resolve(sourceDirectory, moduleSpec);
		const importableExtensions = ['.ts', '.mts', '.cts'].includes(path.extname(sourcePath).toLowerCase()) ? ['.ts', '.mts', '.cts', '.js', '.mjs', '.cjs'] : ['.js', '.mjs', '.cjs'];

		// Is importAbsolutePath a directory?
		if (fs.existsSync(importAbsolutePath) && fs.statSync(importAbsolutePath).isDirectory()) {
			// Find all files in the directory with the extension in importableExtensions list
			let indexFiles = importableExtensions
				.map(extension => path.join(importAbsolutePath, `index${extension}`))
				.filter(file => fs.existsSync(file))
				.map(f => ({ file: f, extension: path.extname(f), lowerExtension: path.extname(f).toLowerCase() }));
			indexFiles = indexFiles.sort((a, b) => importableExtensions.indexOf(a.lowerExtension) - importableExtensions.indexOf(b.lowerExtension));

			// Resolve
			const updatedImportSpec = this.resolveImportExportDeclarationSpec(sourcePath, sourceDirectory, moduleSpec, indexFiles);

			// Update
			declaration.setModuleSpecifier(updatedImportSpec);
		} else {
			// Find all files  with extensions in importableExtensions list
			let indexFiles = importableExtensions
				.map(extension => `${importAbsolutePath}${extension}`)
				.filter(file => fs.existsSync(file))
				.map(f => ({ file: f, extension: path.extname(f), lowerExtension: path.extname(f).toLowerCase() }));
			indexFiles = indexFiles.sort((a, b) => importableExtensions.indexOf(a.lowerExtension) - importableExtensions.indexOf(b.lowerExtension));

			// Resolve
			const updatedImportSpec = this.resolveImportExportDeclarationSpec(sourcePath, sourceDirectory, moduleSpec, indexFiles);

			// Update
			declaration.setModuleSpecifier(updatedImportSpec);
		}
	}

	/**
	 * Returns updated import and export declarations for a specific declaration.
	 * @param sourcePath - The path to the source file.
	 * @param sourceDirectory - The directory of the source file.
	 * @param moduleSpec - The module specifier.
	 * @param indexFiles - List of index files found in the directory.
	 * @returns New module spec
	 */
	private static resolveImportExportDeclarationSpec(
		sourcePath: string,
		sourceDirectory: string,
		moduleSpec: string,
		indexFiles: { file: string; extension: string; lowerExtension: string }[]
	): string {
		// Actual file to be imported
		let indexFile = indexFiles.length > 0 ? indexFiles[0] : null;

		// No files
		if (indexFiles.length > 1) {
			const tsIndexFiles = indexFiles.filter(f => ['.ts', '.mts', '.cts'].includes(f.lowerExtension));
			const jsIndexFiles = indexFiles.filter(f => ['.js', '.mjs', '.cjs'].includes(f.lowerExtension));

			// Try ts files first
			if (tsIndexFiles.length == 1) {
				indexFile = tsIndexFiles[0];
			} else if (tsIndexFiles.length > 1) {
				const tsIndexFile = tsIndexFiles.find(f => f.lowerExtension === '.ts');
				if (tsIndexFile) {
					indexFile = tsIndexFile;
				} else {
					// Error
					throw new Error(`Found .mts and .cts but not .ts index file [SRC: ${sourcePath}][SPEC: ${moduleSpec}]`);
				}
			} else {
				// Try js files next
				if (jsIndexFiles.length == 1) {
					indexFile = jsIndexFiles[0];
				} else if (jsIndexFiles.length > 1) {
					const jsIndexFile = jsIndexFiles.find(f => f.lowerExtension === '.js');
					if (jsIndexFile) {
						indexFile = jsIndexFile;
					} else {
						// Error
						throw new Error(`Found .mjs and .cjs but not .js index file found [SRC: ${sourcePath}][SPEC: ${moduleSpec}]`);
					}
				}
			}
		}

		// Check if we have the index file
		if (!indexFile) {
			// Error
			throw new Error(`No index file found [SRC: ${sourcePath}][SPEC: ${moduleSpec}]`);
		}

		// Update
		let updatedImportSpec = path.relative(sourceDirectory, indexFile.file).replaceAll('\\', '/');
		if (!updatedImportSpec.startsWith('.')) {
			updatedImportSpec = './' + updatedImportSpec;
		}

		// Return
		return updatedImportSpec;
	}

	// #endregion
}
