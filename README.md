# SP.Starter

**Шаблон проекта для быстрого старта.**

## Старт проекта

#### 1. Установить зависимости:

с помощью yarn (быстрее)

```
yarn install
```

или с помощью npm (медленнее):

```
npm install
```

#### 2. Запустить Gulp для разработки:

```
npm start
```

#### 3. Открыть следующий URL - [`http://localhost:9000/`](http://localhost:9000/).

## Команды

#### Запустить проект для разработки:

```
npm start
```

#### Собрать проект для продакшена:

```
npm run build
```

#### Создание архива `build.zip` для продакшена:

```
npm run zip
```

## Структура проекта

It's not mandatory but considered effective for many reasons to decompose the UI into separate, less coupled components.

Create components at least for the parts of the UI that appear in multiple places of your project. It can be buttons, common page sections, widgets, sliders and so on.

It is recommended that you will keep your components inside the `src/components/` folder. This starter kit allows you to keep your markup, styles, and JavaScript code for a component in one folder and then to use them in multiple places. Please, see the `src/components/` folder for examples. Notice how different types of components are arranged. Also, It is not absolutely mandatory to include Nunjucks or JS code for a component if you feel that it doesn't make too much sense. For example, when the markup is quite simple or when a component doesn't have JS logic.

## HTML-шаблонизатор Nunjucks

[Nunjucks](https://mozilla.github.io/nunjucks/) - мощный шаблонизатор с синтаксисом а-ля jinja2, который позволяет создавать качественный, легкоподдерживаемый HTML-код.

Nunjucks-шаблоны находятся в `src/templates/`.

Данные, которые могут быть использованы в нескольких местах, следует складывать в файл `global-data.json`, который находится в корне проекта. После этого к ним можно обращаться в шаблонах:

```
<p>Some title: {{ someData[0].title }}</p>
```

Шаблоны страниц, которые должны быть скомпилированы в папку `build/`, кладем в папку `src/templates/pages`

Кастомные фильтры, макросы и функции складываем в соответствующих файлах в `src/templates/lib`.

Так называемые инклуды создаем в `src/templates/parts` с префиксом `_`. Например, `src/templates/parts/_sidebar.nunj`.

Для эффективного применения шаблонизатора см. примеры в стартовом проекте, а также [документацию](https://mozilla.github.io/nunjucks/templating.html).

Для настройки синтаксиса в редакторах (Sublime, Webstorm) скачиваем плагин для шаблонизатора Twig и настраиваем открытие файлов с расширением .nunj с подстветкой Twig по умолчанию.

## Webpack Hot Module Replacement

В SP.Starter настроен [Webpack HMR](https://webpack.js.org/concepts/hot-module-replacement/). По умолчанию при изменении в JS файле происходит замена этого модуля и всех его зависимостей.

<b>Важно!</b> Для корректной работы необходимо правильно обрабатывать side-эффекты, которые генерирует ваш код.

Например, если есть код, добавляющий обработчик на событие клика:

`document.body.addEventListener('click', this.someMethod);`

То прямо в коде необходимо добавить следующую инструкцию для Webpack:

```
// Удаляем обработчик события, чтобы после повторного исполнения предыдущего кода этот обработчик не был добавлен повторно.
if (module.hot) {
	module.hot.dispose(() => {
		document.body.removeEventListener('click', this.someMethod);
	});
}
```

В противном случае, обработчик на клик будет добавляться при каждом обновлении, генерируемом с помощью HMR.

Таким же образом надо поступать и с изменением DOM-дерева:

```
var sideEffectNode = document.createElement("div");
sideEffectNode.textContent = "Side Effect";
document.body.appendChild(sideEffectNode);
```

Добавляем:

```
// Удаляем <div>, добавленный в DOM, чтобы после исполнения предыдущего кода этот <div> не был добавлен повторно.
if (module.hot) {
  module.hot.dispose(function() {
    sideEffectNode.parentNode.removeChild(sideEffectNode);
  });
}
```

## Структура SCSS-файлов

В Стартере существует следующая структура SCSS-файлов:

```
/styles/
	/lib/				// Библиотеки и миксины
	/pages/				// Стили для страниц проекта
		_main.scss		// Стили для главной страницы
	_constants.scss		// Переменные и константы
	_controls.scss		// Стили для контролов
	_fonts.scss			// Подключаемые шрифты
	_global.scss		// Стили глобальных блоков
	_layout.scss		// Стили лэйаута
	_reset.scss			// CSS-reset и обнуление стилей
	styles.scss			// Основной файл, который компилируется в styles.css
```

Для каждой страницы создается отдельный файл в папке `pages`. Для каждого компонента создается отдельный файл в папке `src/components/<components_name>`.

Все подключаемые файлы должны начинаться с одного подчеркивания (`_`).

## SVG-спрайты

В стартовом проекте настроена возможность создания SVG-спрайтов с помощью [gulp-svgstore](https://github.com/w0rm/gulp-svgstore), поэтому SVG на сайт лучше добавлять, используя компонент `icon`, следующим способом:

```
{{ icon({
    iconName: 'some-vector-image',
    className: 'icon',
    attributes: 'viewBox="0 0 20 20"'
}) }}
```

Свойства `className` и `attributes` указывать необязательно. SVG-файл `some-vector-image.svg` должен находиться в папке `src/assets/svg/`. Такому элементу необходимо задать width и height в стилях. Ему также можно менять fill, stroke при условии, что в исходном файле `some-vector-image.svg` у элемента не заданы такие же атрибуты (fill и stroke).

**Обратите внимание на то, что при подключении svg-спрайта в компоненте `icon` используется `#icon-` префикс в пути до спрайта: `#icon-some-vector-image` (фактически будет использован `some-vector-image.svg`).**

## Растровые спрайты

Для создания простого спрайта из изображений нужно использовать миксин

```
+s(name)
```

Следующий миксин для спрайта под ретину. Для него необходимо использовать 2 изображения: простое и в 2 раза больше. Например: `sp.png` и `sp@2x.png`.

```
+sr(name)
```

Изображения, которые собираются в спрайт, должны быть в формате `.png` и находится в директории `assets/images/sprites/`.

## Инлайн картинок или SVG

<b>Внимание!</b> Изображения, которые будут инлайниться, должны находится в директории `src/assets/images/inline`.

### В SCSS

Плагин postcss-assets позволяет инлайнить изображения прямо в код в Base64 кодировке (или в виде кода в случае с SVG):

```
background: inline('sp.png')
```

Так же позволяет подставить размеры картинки:

```
width: width('sp.png')
```

```
height: height('sp.png')
```

```
background-size: size('sp.png')
```

### В Nunjucks-шаблонах

```
<img src={% inline 'image.png' %} alt="Some image" />
```

## Полезные ссылки

[Синтаксис Nunjucks](https://mozilla.github.io/nunjucks/templating.html).

[Сборка фронтенд-проекта с помощью Gulp](http://habrahabr.ru/post/250569/).

[Адаптивная сетка Twitter Bootstrap](http://getbootstrap.com/css/#grid).
