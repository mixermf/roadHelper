/*
Для запуска первоначального функционала

2. Создание тикета с определением координат 
3. Загрузка всех активных тикетов с фильтром по городу
4. Поиск тикета по названию
5. Прокладка маршрута к тикету
6. Закрытие тикетов по инициализации пользователя и по истечению времени
7. Оставлять комментарии к тикету
1. Регистариция через смс верификацию
*/

var obj = {
    init:function(){
        var geolocation = ymaps.geolocation, city, country, address,jsonData = {},
      
            myMap = new ymaps.Map('map', {
            center: [55.74734881801514, 37.62507083466477],
            zoom: 10,
            controls: ['geolocationControl']
        }, {
            searchControlProvider: 'yandex#search'
        });
            // Сравним положение, вычисленное по ip пользователя и
            // положение, вычисленное средствами браузера.
            // geolocation.get({
            //     provider: 'yandex',
            //     mapStateAutoApply: true
            // }).then(function (result) {
            //     // Красным цветом пометим положение, вычисленное через ip.
            //     result.geoObjects.options.set('preset', 'islands#redCircleIcon');
            //     result.geoObjects.get(0).properties.set({
            //         balloonContentBody: 'Мое местоположение'
            //     });
            //     myMap.geoObjects.add(result.geoObjects);
            // });

            //Определяем координаты через провайдера интернета
            var myCoordFromBrowser;
                geolocation.get({
                    provider: 'browser',
                    mapStateAutoApply: true
                }).then(function (result) {
                    
                    myCoordFromBrowser = result.geoObjects.position;
                });
            

        // Создаем кластеризатор c красной иконкой (по умолчанию используются синяя).
        var clusterer = new ymaps.Clusterer({preset: 'islands#redClusterIcons'}),
        // Создаем коллекцию геообъектов.
            collection = new ymaps.GeoObjectCollection();
        // Дополнительное поле ввода при включенном режиме кластеризации.
        // gridSizeField = $('<div class="field" style="display: none">Размер ячейки кластера в пикселях: <input type="text" size="6" id ="gridSize" value="64"/></div>').appendTo('.inputs');

       
        // Добавляем кластеризатор на карту.
        myMap.geoObjects.add(clusterer);

        // Добавляем коллекцию геообъектов на карту.
        myMap.geoObjects.add(collection);
        document.querySelector('.overmap').addEventListener('click', function(){
            modal_init('my_modal');
        });
        document.querySelector('#useClusterer').addEventListener('click', toggleGridSizeField);
        document.querySelector('#addMarkers').addEventListener('click', function(){
            addMarkers();
            if(addMarkers){
                modal_close('my_modal');
            }


        });
        document.querySelector('#removeMarkers').addEventListener('click', removeMarkers);
        // firstButton.events.add('click',modal_init('my_modal'))


        //show Modal
        function modal_init(boxname){
            var a = document.querySelector('.'+boxname);
            a.classList.toggle('active');
        }
        //close Modal
        function modal_close(boxname){
            var a = document.querySelector('.'+boxname);
            a.classList.toggle('active');
        }
        //Определяем адрес по координатам
       
        // Добавление меток с произвольными координатами.
        function addMarkers () {
            // Количество меток, которое нужно добавить на карту.
           
            var placemarksNumber = 1;
                bounds = myMap.getBounds(),
                // Флаг, показывающий, нужно ли кластеризовать объекты.
                useClusterer = true,
                // Размер ячейки кластеризатора, заданный пользователем.
                gridSize = 64;
                // Генерируем нужное количество новых объектов.
                newPlacemarks = createGeoObjects(placemarksNumber, bounds);

            if (gridSize > 0) {
                clusterer.options.set({
                    gridSize: gridSize
                });
            }

            // Если используется кластеризатор, то добавляем кластер на карту,
            // если не используется - добавляем на карту коллекцию геообъектов.
            if (useClusterer) {
                // Добавлеяем массив меток в кластеризатор.
                clusterer.add(newPlacemarks);
            } else {
                for (var i = 0, l = newPlacemarks.length; i < l; i++) {
                    collection.add(newPlacemarks[i]);

                }
            }
            //Анимируем карту на тикет
             myMap.setCenter(coordinates,13,{
                duration:1000,
                timingFunction: "ease-in"
             });
           
  
            console.log(jsonData);    
            
        }


        var CustomBalloonClass = ymaps.templateLayoutFactory.createClass(
             '<div class="balloon">' +
             '<h1>{{properties.params.[0]}}</h1>' +
             '<div class="balloon_content">{{properties.params.[1]}}</div>' +
             '<div class="balloon_footer">{{properties.params.[2]}}</div>' +
             '</div>'
         );
        
        // Функция, создающая необходимое количество геообъектов внутри указанной области.
        function createGeoObjects (number, bounds) {
            var placemarks = [];
            var title = document.querySelector('#title').value;
            var message = document.querySelector('#message').value;
            var footer = "<i>ico</i> <i>ico2</i>";
            // Создаем нужное количество меток

            for (var i = 0; i < number; i++) {
                // Генерируем координаты метки случайным образом.
                coordinates = myCoordFromBrowser?myCoordFromBrowser:getRandomCoordinates(bounds);
                //coordinates = getRandomCoordinates(bounds);
                // coordinates = ymaps.geolocation.get({
                //     provider: 'browser',
                //     mapStateAutoApply: true
                // });
                // Создаем метку со случайными координатами.
                console.log(coordinates);
                myPlacemark = new ymaps.Placemark(coordinates,{
                    balloonContentHeader: title,
                    balloonContentBody: message,
                    balloonContentFooter: footer,
                    hintContent: title,
                    //params:[title,message,footer]
                }, {
                 preset: 'islands#redDotIcon',
                 //balloonContentLayout : CustomBalloonClass
                });

                placemarks.push(myPlacemark);

                //Получаем город
                geolocation.get(coordinates).then(function (result) {
                    city = result.geoObjects.get(0).properties._data.name;
                    country = result.geoObjects.get(0).properties._data.description;
                    //console.log(result.geoObjects.get(0).properties);
                    jsonData['city'] = city;
                    jsonData['country'] = country;
                });
                console.log();
                jsonData = {
                    "coord":[coordinates[0],coordinates[1]],
                    "subject":title,
                    "message":message,
                    "currDate":new Date().getTime(),
                    "active":1,
                };
            }
            return placemarks;
        }

        // Функция, генерирующая случайные координаты
        // в пределах области просмотра карты.
        function getRandomCoordinates (bounds) {
            var size = [bounds[1][0] - bounds[0][0], bounds[1][1] - bounds[0][1]];
            return [Math.random() * size[0] + bounds[0][0], Math.random() * size[1] + bounds[0][1]];
        }

        // Показывать/скрывать дополнительное поле ввода.
        function toggleGridSizeField () {
            // Если пользователь включил режим кластеризации, то появляется дополнительное поле
            // для ввода опции кластеризатора - размер ячейки кластеризации в пикселях.
            // По умолчанию размер ячейки сетки равен 64.
            // При отключении режима кластеризации дополнительное поле ввода скрывается.
            gridSizeField.toggle();
        }

        // Удаление всех меток с карты
        function removeMarkers () {
            // Удаляем все  метки из кластеризатора.
            clusterer.removeAll();
            // Удаляем все метки из коллекции.
            collection.removeAll();
        }
        function makeData(){

        }

    }
}
ymaps.ready(obj.init);    


