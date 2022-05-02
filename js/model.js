export class TodoListModel extends EventTarget {
	constructor() {
		super();
		this.list = [];
		this.load();
	}

	// Persistence

	load() {
		try {
			this.list = JSON.parse(window.localStorage['todos-vanilla-js']);
		} catch (e) {
			window.localStorage['todos-vanilla-js'] = '[]';
		}
	}

	save() {
		window.localStorage['todos-vanilla-js'] = JSON.stringify(this.list);
		this.dispatchEvent(new Event('save'));
	}

	// CRUD

	add(text) {
		this.list.push({ text, checked: false });
		this.save();
	}

	remove(index) {
		this.list.splice(index, 1);
		this.save();
	}

	toggle(index) {
		this.list[index].checked = !this.list[index].checked;
		this.save();
	}

	update(index, text) {
		this.list[index].text = text;
		this.save();
	}

	toggleAll(checked) {
		this.list.forEach((item) => (item.checked = checked));
		this.save();
	}

	clearCompleted() {
		this.list = this.list.filter((item) => !item.checked);
		this.save();
	}

	// Filters

	all() {
		return this.list;
	}

	active() {
		return this.list.filter((item) => !item.checked);
	}

	completed() {
		return this.list.filter((item) => item.checked);
	}
}
