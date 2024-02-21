import { join } from 'path';
import { readFile, readdir } from 'fs/promises';
import { createServer } from 'http';

const page = join('page', '.built');
const port = process.env.PORT ?? 9148;

const layoutFileLocation = process.env.LAYOUT_FILE_LOCATION;

createServer(async (request, response) => {
	switch (request.url) {
		case '/layout': {
			return readFile(layoutFileLocation).then(buffer => response.end(buffer));
		}

		default: {
			const assets = await readdir(page);
			const file = request.url.replace('/', '');

			if (assets.includes(file)) {
				return readFile(join(page, file)).then(buffer => response.end(buffer));
			}

			return readFile(join(page, 'index.html')).then(buffer => response.end(buffer));
		}
	}
}).listen(port, () => console.log(`server started on :${port}`));