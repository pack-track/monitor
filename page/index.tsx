import { PathRouter, Router } from "@acryps/page";
import { PageComponent } from "./page";
import { MonitorComponent } from "./monitor";

export class Application {
	static router: Router;

	static async main() {
		this.router = new PathRouter(PageComponent
			.route('/monitor', MonitorComponent)
		);

		this.router.host(document.body);
	}
}

Application.main();