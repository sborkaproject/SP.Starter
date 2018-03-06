import paths from '../../../paths';
import Assets from 'assets'
import path from 'path'

const resolver = new Assets();

function InlineExtension() {
	this.tags = ['inline'];

	this.parse = function (parser, nodes) {
		// get the tag token
		var tok = parser.nextToken();

		var args = parser.parseSignature(null, true);
		parser.advanceAfterBlockEnd(tok.value);

		// See above for notes about CallExtension
		return new nodes.CallExtensionAsync(this, 'run', args);
	};

	this.run = function (context, url, callback) {
		const pathResolved = path.resolve(paths.src.imagesRoot + url);
		resolver.data(pathResolved, callback);
	};
}

export const inlineExtension = new InlineExtension();
