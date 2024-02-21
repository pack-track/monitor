import { Component } from "@acryps/page";

export class PageComponent extends Component {
	render(child) {
		return <ui-page>
			{child}
		</ui-page>;
	}
}