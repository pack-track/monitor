import { Component } from "@acryps/page";
import { Layout } from "@packtrack/layout";

export class MonitorComponent extends Component {
	declare rootNode: HTMLElement;

	readonly strokeWidth = 5;

	layout: Layout;

	async onload() {
		const source = await fetch('/layout').then(response => response.text());
		const document = new DOMParser().parseFromString(source.replace('<!rml>', ''), 'application/xml');

		this.layout = Layout.from(document);
	}

	render() {
		const layoutCanvas = document.createElement('canvas');

		requestAnimationFrame(() => {
			layoutCanvas.height = layoutCanvas.width = Math.min(innerWidth, innerHeight);

			const layoutContext = layoutCanvas.getContext('2d');

			// scale the canvas to tile units
			const bounds = this.getBounds();
			const scaleX = innerWidth / bounds.maxX;
			const scaleY = innerHeight / bounds.maxY;
			layoutContext.scale(Math.min(scaleX, scaleY), Math.min(scaleX, scaleY));

			// center the canvas
			layoutContext.translate(
				(bounds.height - Math.min(bounds.width, bounds.height)) / 2, 
				(bounds.width - Math.min(bounds.width, bounds.height)) / 2
			);

			const style = getComputedStyle(this.rootNode);
			
			layoutContext.lineWidth = this.strokeWidth / scaleX;

			for (let district of this.layout.allDistricts) {
				for (let section of district.sections) {
					let segments = [];

					for (let tileIndex = 0; tileIndex < section.tiles.length; tileIndex++) {
						const tile = section.tiles[tileIndex];

						segments.push(tile.toSVGPath(tileIndex ? true : false));
					}

					layoutContext.strokeStyle = style.getPropertyValue('--layout-track-color');
					layoutContext.stroke(new Path2D(segments.join()));

					layoutContext.setLineDash([0, 0.1, bounds.width * bounds.height, 0]);
				}
			}
		});

		return <ui-monitor>
			{layoutCanvas}
		</ui-monitor>;
	}

	getBounds() {
		let minX = Infinity;
		let maxX = 0;

		let minY = Infinity;
		let maxY = 0;

		for (let district of this.layout.allDistricts) {
			for (let section of district.sections) {
				for (let tile of section.tiles) {
					minX = Math.min(tile.x, minX);
					maxX = Math.max(tile.x, maxX);

					minY = Math.min(tile.y, minY);
					maxY = Math.max(tile.y, maxY);
				}
			}
		}

		maxX += minX + 1;
		maxY += minY + 1;

		return { 
			minX, 
			maxX,
			width: maxX - minY,
			
			minY, 
			maxY,
			height: maxY - minY
		};
	}
}