const todoTemplate = `<li>
	<div class="view">
		<input class="toggle" type="checkbox" autocomplete="off">
		<label></label>
		<button class="destroy"></button>
	</div>
	<input class="edit" value="">
</li>`;

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

function init() {
	// Add todo input
	$.new.addEventListener('keyup', (evt) => {
		if (evt.key.toLowerCase() === 'enter') {
			createTodo(evt.target.value);
			update();
		}
	});

	// Delegated toggling & removal
	$.list.addEventListener('click', (evt) => {
		if (evt.target.classList.contains('toggle')) {
			toggleTodo(evt.target);
			update();
		} else if (evt.target.classList.contains('destroy')) {
			removeTodo(evt.target);
			update();
		}
	});

	// Batch operations
	$.toggleAll.addEventListener('change', (evt) => {
		getAllTodos().forEach((el) => {
			const toggleEl = el.querySelector('.toggle');
			if (evt.target.checked && !toggleEl.checked) {
				toggleEl.click();
			} else if (!evt.target.checked && toggleEl.checked) {
				toggleEl.click();
			}
		});
	});
	$.clearCompleted.addEventListener('click', () => {
		getAllTodos()
			.filter((el) => el.classList.contains('completed'))
			.forEach(removeTodo);
		update();
	});

	// Delegated editing
	$.list.addEventListener('dblclick', (evt) => {
		editTodo(evt.target.closest('li'));
	});
	$.list.addEventListener('focusout', (evt) => {
		if (evt.target.classList.contains('edit')) {
			saveTodo(evt.target.closest('li'));
		}
	});
	$.list.addEventListener('keyup', (evt) => {
		if (evt.key.toLowerCase() === 'enter') {
			evt.target.blur();
		}
	});

	// Hash routes
	window.addEventListener('hashchange', () => {
		updateFilters();
		update();
	});

	loadFromStorage();
	updateFilters();
	update();
}

function update() {
	const todos = getAllTodos();

	// Show / hide UI
	if (todos.length) {
		$.main.classList.remove('hidden');
		$.footer.classList.remove('hidden');
	} else {
		$.main.classList.add('hidden');
		$.footer.classList.add('hidden');
	}

	// Filter state
	const showActive = window.location.hash === '#/active';
	const showCompleted = window.location.hash === '#/completed';
	getAllTodos().forEach((el) => {
		const isCompleted = el.classList.contains('completed');
		if ((showCompleted && !isCompleted) || (showActive && isCompleted)) {
			el.classList.add('hidden');
		} else {
			el.classList.remove('hidden');
		}
	});

	// Update count
	$.count.textContent = todos.filter(
		(el) => !el.classList.contains('completed')
	).length;

	saveToStorage();
}

//
// CRUD
//

function createTodo(text) {
	if (!text) return;
	$.list.insertAdjacentHTML('beforeend', todoTemplate);
	$.list.lastChild.querySelector('label').textContent = text;
	$.new.value = '';
}

function toggleTodo(el) {
	if (el.checked) {
		el.closest('li').classList.add('completed');
	} else {
		el.closest('li').classList.remove('completed');
	}
}

function editTodo(el) {
	const labelEl = el.querySelector('label');
	const inputEl = el.querySelector('.edit');
	inputEl.value = labelEl.textContent;
	el.classList.add('editing');
	inputEl.focus();
}

function saveTodo(el) {
	const labelEl = el.querySelector('label');
	const inputEl = el.querySelector('.edit');
	labelEl.textContent = inputEl.value;
	inputEl.value = '';
	el.classList.remove('editing');
}

function removeTodo(el) {
	const todoEl = el.closest('li');
	todoEl.parentElement.removeChild(todoEl);
}

//
// Hash routing
//

function updateFilters() {
	const newSelected =
		window.location.hash === '#/active'
			? 'Active'
			: window.location.hash === '#/completed'
			? 'Completed'
			: 'All';
	$.filters
		.find((el) => el.classList.contains('selected'))
		.classList.remove('selected');
	$.filters
		.find((el) => el.textContent === newSelected)
		.classList.add('selected');
}

//
// Storage
//

function loadFromStorage() {
	try {
		const data = JSON.parse(window.localStorage.todomvc);
		data.forEach((item) => {
			createTodo(item.text);
			if (item.checked) {
				$.list.lastChild.querySelector('.toggle').checked = true;
			}
		});
		update();
	} catch (e) {
		window.localStorage.todomvc = '[]';
	}
}

function saveToStorage() {
	const data = Array.from($.list.querySelectorAll('li')).map((el) => {
		return {
			text: el.querySelector('label').textContent,
			checked: el.querySelector('.toggle').checked,
		};
	});
	window.localStorage.todomvc = JSON.stringify(data);
}

//
// Helpers
//

function getAllTodos() {
	return Array.from($.list.querySelectorAll('li'));
}
