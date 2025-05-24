// 1. Load TypeScript compiler
require('ts-node').register({
	project: __dirname + '/tsconfig.build.cjs.json',
	transpileOnly: true
});

const requireDir = require('require-dir');
const gulp = require('gulp');

// 2. Load all task modules recursively
const tasks = requireDir('./gulp', {
	recurse: true,
	extensions: ['.ts', '.mts', '.cts', '.js', '.mjs', '.cjs'],
	// @ts-expect-error require-dir types are not correct
	noCache: true
});

// 3. Recursively register every exported function
/**
 * Register all tasks in the given object
 * @param {Record<string, unknown>} task The object containing tasks to register
 */
function registerTasks(task) {
	for (const key of Object.keys(task)) {
		const value = task[key];
		if (typeof value === 'function') {
			// @ts-expect-error value is of tasks type
			gulp.task(key, value);
		} else if (typeof value === 'object') {
			// @ts-expect-error value is of tasks type
			registerTasks(value);
		}
	}
}

// Register all imported tasks
registerTasks(tasks);
