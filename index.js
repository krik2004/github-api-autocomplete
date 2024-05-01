function searchingGetHub(q) {
	const searchResult = []
	return fetch(`https://api.github.com/search/repositories?q=${q}+in:name`)
		.then(response => response.json())
		.then(data => {
			data.items.forEach(resultObj => {
				searchResult.push(resultObj)
			})
			if (searchInput.value.trim() !== '') {
				return searchResult.slice(0, 5)
			}
		})
		.catch(error => console.log(error))
}

const debounce = (fn, debounceTime) => {
	let timeOutID
	return function () {
		clearTimeout(timeOutID)
		return new Promise((resolve, reject) => {
			timeOutID = setTimeout(() => {
				resolve(fn.apply(this, arguments))
			}, debounceTime)
		})
	}
}
const searchingGetHubDebounced = debounce(searchingGetHub, 300)

const searchInput = document.querySelector('.input')
const reslist = document.querySelector('.results-list')
const wraper = document.querySelector('.wraper')
const repList = document.querySelector('.repositories-list')

function createNewCard(repoObj) {
	const repoCard = document.createElement('div')
	repoCard.classList.add('repo-card')

	const repoCardList = document.createElement('ul')
	repoCardList.classList.add('repo-card__list')

	const repoName = document.createElement('li')
	repoName.classList.add('repo-card__item')
	repoName.textContent = `Name: ${repoObj.name}`

	const repoOwner = document.createElement('li')
	repoOwner.classList.add('repo-card__item')
	repoOwner.textContent = `Owner: ${repoObj.owner.login}`

	const repoStars = document.createElement('li')
	repoStars.classList.add('repo-card__item')
	repoStars.textContent = `Stars: ${repoObj.stargazers_count}`

	repoCardList.appendChild(repoName)
	repoCardList.appendChild(repoOwner)
	repoCardList.appendChild(repoStars)

	const closeBtn = document.createElement('button')
	closeBtn.classList.add('repo-card__close-btn')
	closeBtn.setAttribute('type', 'button')
	closeBtn.textContent = '×'
	closeBtn.addEventListener('click', () => {
		repoCard.remove()
	})

	repoCard.appendChild(repoCardList)
	repoCard.appendChild(closeBtn)

	repList.appendChild(repoCard)
	reslist.innerHTML = ''
	searchInput.value = ''
}

async function createResultList() {
	if (searchInput.value.trim() !== '') {
		try {
			const arrOfResults = await searchingGetHubDebounced(searchInput.value)

			console.log(`результат вызова листнера`, arrOfResults)

			//очистка предыдущих поисков
			reslist.innerHTML = ''

			// создание листа результатов поиска. если пустое поле поиска очистили, во время выполнения fetch - создание листа не выполняется
			if (arrOfResults) {
				const fragment = document.createDocumentFragment()
				arrOfResults.forEach(resultObj => {
					const li = document.createElement('li')
					li.textContent = resultObj.name
					li.classList.add('results-list__item')
					li.addEventListener('click', () => createNewCard(resultObj))
					fragment.appendChild(li)
				})
				reslist.appendChild(fragment)
			}
		} catch (error) {
			console.log(error)
		}
	} else {
		reslist.innerHTML = ''
	}
}

searchInput.addEventListener('keyup', createResultList)
