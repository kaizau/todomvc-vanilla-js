import { TodoListModel } from './model.js';
import { getFilterState, todoTemplate } from './helpers.js';

const model = new TodoListModel();

const $ = {};
$.main = document.querySelector('.main');
$.new = document.querySelector('.new-todo');
$.toggleAll = document.querySelector('.toggle-all');
$.list = $.main.querySelector('.todo-list');
$.footer = document.querySelector('.footer');
$.count = $.footer.querySelector('.todo-count');
$.filters = Array.from($.footer.querySelectorAll('.filters a'));
$.clearCompleted = $.footer.querySelector('.clear-completed');

init();

//
// Bind elements
//

function init() {
	// Add todo input
	$.new.addEventListener('keyup', (evt) => {
		if (evt.key.toLowerCase() === 'enter') {
			model.add(evt.target.value);
			render();
		}
	});

	// Batch operations
	$.toggleAll.addEventListener('change', (evt) => {
		model.toggleAll(evt.target.checked);
		render();
	});
	$.clearCompleted.addEventListener('click', () => {
		model.clearCompleted();
		render();
	});

	// Delegated toggling & removal
	$.list.addEventListener('click', (evt) => {
		if (evt.target.classList.contains('toggle')) {
			model.toggle(getListIndex(evt.target));
			render();
		} else if (evt.target.classList.contains('destroy')) {
			model.remove(getListIndex(evt.target));
			render();
		}
	});

	// Delegated editing
	$.list.addEventListener('dblclick', (evt) => {
		editTodo(evt.target.closest('li'));
	});
	$.list.addEventListener('keyup', (evt) => {
		if (evt.key.toLowerCase() === 'enter') {
			evt.target.blur();
		}
	});
	$.list.addEventListener('focusout', (evt) => {
		if (evt.target.classList.contains('edit')) {
			model.update(getListIndex(evt.target), evt.target.value);
			render();
		}
	});

	// Hash routes
	window.addEventListener('hashchange', () => {
		updateFilters();
		render();
	});

	// Initial render
	updateFilters();
	render();
}

//
// Main render function
// - Updates UI
// - Rebuilds list from model
//

function render() {
	if (model.all().length) {
		$.main.classList.remove('hidden');
		$.footer.classList.remove('hidden');
	} else {
		$.main.classList.add('hidden');
		$.footer.classList.add('hidden');
	}
	const activeCount = model.active().length;
	$.count.textContent = '';
	$.count.insertAdjacentHTML(
		'beforeend',
		`<strong>${activeCount}</strong> item${activeCount === 1 ? '' : 's'} left`
	);

	$.list.textContent = '';
	const filterState = getFilterState();
	model.all().forEach((todo) => {
		const shouldHide =
			(filterState === 'active' && todo.checked) ||
			(filterState === 'completed' && !todo.checked);
		createTodo(todo.text, todo.checked, shouldHide);
	});
}

// Update UI when hash changes
function updateFilters() {
	$.filters
		.find(($el) => $el.classList.contains('selected'))
		.classList.remove('selected');
	$.filters
		.find(($el) => $el.textContent.toLowerCase() === getFilterState())
		.classList.add('selected');
}

//
// DOM helpers
//

function createTodo(text, checked, hidden) {
	if (!text) return;

	$.list.insertAdjacentHTML('beforeend', todoTemplate);
	$.list.lastChild.querySelector('label').textContent = text;
	if (checked) {
		$.list.lastChild.classList.add('completed');
		$.list.lastChild.querySelector('.toggle').checked = true;
	}
	if (hidden) {
		$.list.lastChild.classList.add('hidden');
	}
	$.new.value = '';
}

function editTodo($li) {
	if ($li.classList.contains('editing')) return;

	const $label = $li.querySelector('label');
	const $edit = $li.querySelector('.edit');
	$edit.value = $label.textContent;
	$li.classList.add('editing');
	$edit.focus();
}

function getListIndex($el) {
	const $li = $el.closest('li');
	return Array.from($.list.children).indexOf($li);
}
