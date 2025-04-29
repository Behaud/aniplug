// anilibria_shikimori_plugin.js

const apiUrl = 'https://api.shikimori.one/animes';

async function fetchAnimeData(animeId) {
  try {
    const response = await fetch(`${apiUrl}/${animeId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка при загрузке данных с Shikimori:', error);
  }
}

function displayAnime(animeData) {
  // Создаем элемент для отображения информации о аниме
  const container = document.createElement('div');
  container.classList.add('anime-details');

  // Название аниме
  const title = document.createElement('h3');
  title.textContent = animeData.name;
  container.appendChild(title);

  // Описание аниме
  const description = document.createElement('p');
  description.textContent = animeData.description || 'Описание не доступно';
  container.appendChild(description);

  // Ссылка для просмотра на Shikimori
  const link = document.createElement('a');
  link.href = animeData.url;
  link.target = '_blank';
  link.textContent = 'Посмотреть на Shikimori';
  container.appendChild(link);

  // Добавляем контейнер в тело страницы
  document.body.appendChild(container);
}

async function loadAnime() {
  // Указываем ID нужного аниме на Shikimori
  const animeId = 1407; // Пример ID для "Судьба: Начало 2 сезон"
  const animeData = await fetchAnimeData(animeId);

  if (animeData) {
    displayAnime(animeData);
  } else {
    alert('Не удалось загрузить данные о аниме');
  }
}

loadAnime();
