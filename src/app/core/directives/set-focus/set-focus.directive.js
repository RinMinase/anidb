export function SetFocusDirective($document) {
	"ngInject";

	const directive = {
		link: (scope, element, attributes) => {
			element.bind("click", () => {
				$document[0].querySelector(`#${attributes.setFocus}`).focus();
			});
		},
	};

	return directive;
}
