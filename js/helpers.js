export const todoTemplate = `<li>
	<div class="view">
		<input class="toggle" type="checkbox" autocomplete="off">
		<label></label>
		<button class="destroy"></button>
	</div>
	<input class="edit" value="">
</li>`;

export function getFilterState() {
	if (window.location.hash === '#/active') {
		return 'active';
	} else if (window.location.hash === '#/completed') {
		return 'completed';
	}
	return 'all';
}
