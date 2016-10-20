import buble from 'rollup-plugin-buble';
import eslint from 'rollup-plugin-eslint';
import uglify from 'rollup-plugin-uglify';

export default {
	dest: 'dist/TreeWalker-polyfill.min.js',
	entry: 'src/TreeWalker-polyfill.js',
	format: 'iife',
	legacy: true,
	moduleName: 'treewalker',
	plugins: [
		buble(),
		eslint(),
		{
			transformBundle: function(code) {
				return [
					'/*! TreeWalker | krinkle.mit-license.org */\n',
					'(function(window, document) { var polyfill = {};',
					code.replace(
						'this.treewalker = this.treewalker || {}',
						'polyfill'
					),
					'document.createTreeWalker = document.createTreeWalker || polyfill.createTreeWalker;',
					'window.NodeFilter = window.NodeFilter || polyfill.NodeFilter;',
					'window.TreeWalker = window.TreeWalker || polyfill.TreeWalker;',
					'})(this, this.document);'
				].join('');
			}
		},
		uglify({
			output: {
				comments: function(node, comment) {
					// NOTE multiline comment.
					return comment.type == 'comment2' &&
						comment.value.indexOf('!') === 0;
				}
			}
		})
	]
};