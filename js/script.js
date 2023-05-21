const form = document.querySelector('.form');
const input = document.querySelector('.form__input')
const tasksList = document.querySelector('.tasks')
const API = 'https://jsonplaceholder.typicode.com/todos';
const taskCreate = (el) => { // ! добавление задания на страницу
	if (el.completed) {
		tasksList.insertAdjacentHTML(
			'beforeend',
			`<li class="tasks__item" dataset="${el.id}"><p class="done">${el.title}</p><div class="tasks__btndone">✔</div><div class="tasks__btndel">✖</div></li>`
		)
	} else {
		tasksList.insertAdjacentHTML(
			'beforeend',
			`<li class="tasks__item" dataset="${el.id}"><p>${el.title}</p><div class="tasks__btndone">✔</div><div class="tasks__btndel">✖</div></li>`
		)
	}
}

const renderTasks = async () => { // ! отрисовка массива элементов
	const res = await fetch(API + '?_limit=10');
	const tasksFromStore = await res.json();

	//const tasksFromStore = JSON.parse(localStorage.getItem('localData')) || [];
	tasksFromStore.forEach(element => {
		taskCreate(element);
	});
}

renderTasks(); // ! рендер 


const addToLocalStorage = async (newNote) => {
	// const data = JSON.parse(localStorage.getItem('localData')) || [];
	// const newdata = [...data, newNote]
	// localStorage.setItem('localData', JSON.stringify(newdata))
	await fetch(API, {
		method: 'POST',
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(newNote)
	})
}
form.addEventListener('submit', (event) => { // ! Сабмит формы
	event.preventDefault();
	if (input.value !== '') {
		const newNote = {
			title: input.value,
			completed: false,
			id: new Date().getTime()
		}
		addToLocalStorage(newNote);
		taskCreate(newNote);
		input.value = '';
	} else {
		alert('Empty task!')

	}

})

const removeFromLocalStorage = async (event) => {
	// const data = JSON.parse(localStorage.getItem('localData'));
	// data.forEach((el, index, array) => {
	// 	if (el.id === Number(event.target.parentElement.getAttribute('dataset'))) {
	// 		array.splice(index, 1)
	// 	}
	// })
	// localStorage.setItem('localData', JSON.stringify(data));
	await fetch(API + `/${event.target.parentElement.getAttribute('dataset')}`, {
		method: 'DELETE',
		headers: { "Content-Type": "application/json" },
	})
}

const taskUnderline = async (event) => {
	event.target.parentElement.firstChild.classList.toggle('done');
	const isDone = event.target.parentElement.firstChild.classList.contains('done');
	// const data = JSON.parse(localStorage.getItem('localData'));
	// data.forEach((el) => {
	// 	if (el.id === Number(event.target.parentElement.getAttribute('dataset'))) {
	// 		el.completed = isDone;
	// 	}
	// })
	// localStorage.setItem('localData', JSON.stringify(data));
	const res = fetch(API + `/${event.target.parentElement.getAttribute('dataset')}`, {
		method: 'PATCH',
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ completed: isDone })
	})
}
tasksList.addEventListener('click', (event) => {
	if (event.target.classList.contains('tasks__btndel')) {
		removeFromLocalStorage(event);
		event.target.parentElement.remove()
	}
	else if (event.target.classList.contains('tasks__btndone')) {
		taskUnderline(event);
	}
})


