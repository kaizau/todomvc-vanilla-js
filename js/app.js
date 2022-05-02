import { TodoListModel } from './model.js';
import { getFilterState, todoTemplate } from './helpers.js';

class TodoList {
	constructor() {
		this.model = new TodoListModel();

		this.$main = document.querySelector('.main');
		this.$new = document.querySelector('.new-todo');
		this.$toggleAll = document.querySelector('.toggle-all');
		this.$list = this.$main.querySelector('.todo-list');
		this.$footer = document.querySelector('.footer');
		this.$count = this.$footer.querySelector('.todo-count');
		this.$filters = Array.from(this.$footer.querySelectorAll('.filters a'));
		this.$clearCompleted = this.$footer.querySelector('.clear-completed');

		this.bindEvents();
		this.updateFilters();
		this.render();
	}

	// Call it a controller, if you must ¯\_(ツ)_/¯
	bindEvents() {
		// Handle adding new todos
		this.$new.addEventListener('keyup', (evt) => {
			if (evt.key.toLowerCase() === 'enter') {
				this.model.add(evt.target.value);
			}
		});

		// Handle toggling and removing many todos
		this.$toggleAll.addEventListener('change', (evt) => {
			this.model.toggleAll(evt.target.checked);
		});
		this.$clearCompleted.addEventListener('click', () => {
			this.model.clearCompleted();
		});

		// Handle toggling and removing a single todo
		this.$list.addEventListener('click', (evt) => {
			if (evt.target.classList.contains('toggle')) {
				this.model.toggle(this.getListIndex(evt.target));
			} else if (evt.target.classList.contains('destroy')) {
				this.model.remove(this.getListIndex(evt.target));
			}
		});

		// Handle editing a todo
		this.$list.addEventListener('dblclick', (evt) => {
			this.editTodo(evt.target.closest('li'));
		});
		this.$list.addEventListener('keyup', (evt) => {
			if (evt.key.toLowerCase() === 'enter') {
				evt.target.blur();
			}
		});
		this.$list.addEventListener('focusout', (evt) => {
			if (evt.target.classList.contains('edit')) {
				this.model.update(this.getListIndex(evt.target), evt.target.value);
			}
		});

		// Rerender on hash route
		window.addEventListener('hashchange', () => {
			this.updateFilters();
			this.render();
		});

		// Rerender on model updates
		this.model.addEventListener('save', () => {
			this.render();
		});
	}

	// Main render function that updates the UI and refreshes the list
	render() {
		if (this.model.all().length) {
			this.$main.classList.remove('hidden');
			this.$footer.classList.remove('hidden');
		} else {
			this.$main.classList.add('hidden');
			this.$footer.classList.add('hidden');
		}
		const activeCount = this.model.active().length;
		this.$count.textContent = '';
		this.$count.insertAdjacentHTML(
			'beforeend',
			`<strong>${activeCount}</strong> item${activeCount === 1 ? '' : 's'} left`
		);

		this.$list.textContent = '';
		const filterState = getFilterState();
		this.model.all().forEach((todo) => {
			const shouldHide =
				(filterState === 'active' && todo.checked) ||
				(filterState === 'completed' && !todo.checked);
			this.createTodo(todo.text, todo.checked, shouldHide);
		});
	}

	// Filters are separate from render() since only change on hash changes
	updateFilters() {
		this.$filters
			.find(($el) => $el.classList.contains('selected'))
			.classList.remove('selected');
		this.$filters
			.find(($el) => $el.textContent.toLowerCase() === getFilterState())
			.classList.add('selected');
	}

	//
	// DOM helpers
	//

	createTodo(text, checked, hidden) {
		if (!text) return;

		this.$list.insertAdjacentHTML('beforeend', todoTemplate);
		this.$list.lastChild.querySelector('label').textContent = text;
		if (checked) {
			this.$list.lastChild.classList.add('completed');
			this.$list.lastChild.querySelector('.toggle').checked = true;
		}
		if (hidden) {
			this.$list.lastChild.classList.add('hidden');
		}
		this.$new.value = '';
	}

	editTodo($li) {
		if ($li.classList.contains('editing')) return;

		const $label = $li.querySelector('label');
		const $edit = $li.querySelector('.edit');
		$edit.value = $label.textContent;
		$li.classList.add('editing');
		$edit.focus();
	}

	getListIndex($el) {
		const $li = $el.closest('li');
		return Array.from(this.$list.children).indexOf($li);
	}
}

new TodoList();
