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


//РЕАЛИЗОВАТЬ ЕДИНУЮ ЛОГИКУ В ОТРИСОВКЕ МЕТОК. ИЗ БАЗЫ НА КАРТУ. С КЛИЕНТА В БАЗУ.
var jsonData = Object.create(null);
var objTickets = {};
var obj = {
    init:function(){
        var geolocation = ymaps.geolocation, city, country, address,
      
            myMap = new ymaps.Map('map', {
            center: [55.74734881801514, 37.62507083466477],
            zoom: 10,
            controls: ['geolocationControl']
        }, {
            searchControlProvider: 'yandex#search'
        });
          
           
      
                     
        

             //Определяем координаты через провайдера интернета и получаем город и страну
        var myCoordFromBrowser;
            geolocation.get({
               provider: 'browser',
                mapStateAutoApply: true
            }).then(function (result) {
                address = result.geoObjects.get(0).properties._data.name;
                country = result.geoObjects.get(0).properties._data.description;
                myCoordFromBrowser = result.geoObjects.position;
            });
        
        //OBJECTMANAGER   //Добавляет метки на карту из JSON объекта.
        objectManager = new ymaps.ObjectManager({
            // Чтобы метки начали кластеризоваться, выставляем опцию.
            clusterize: true,
            // ObjectManager принимает те же опции, что и кластеризатор.
            gridSize: 10
         });

        // Чтобы задать опции одиночным объектам и кластерам,
        // обратимся к дочерним коллекциям ObjectManager.
        objectManager.objects.options.set('preset', 'islands#greenDotIcon');
        objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
        myMap.geoObjects.add(objectManager);

        objectManager.add(objTickets);       

        //Инициализируем модальное окно ticket
        var modal = Object.create(Modal);
        //Вызываем окно с формой добавления тикета
        document.querySelector('.ticket_btn').addEventListener('click', function(){
            modal.init('my_modal');
        });
        //Добавляем тикет и закрываем модальное окно
        document.querySelector('#addMarkers').addEventListener('click', function(){
            createTicket();
            if(createTicket){
                modal.init('my_modal');
            }
        });
        //Закрываем ticket_btn
        document.querySelector('#modal__close').addEventListener('click', function(){
           modal.init('my_modal'); 
        });
        document.querySelector('.list_btn').addEventListener('click', function(){
             modal.init('list_page');

            if(objTickets){
                var length = objTickets.features.length;
                var c1,c2;
                var routeL;
                var listHTML = '';
                for(var i=0;i<length;i++){
                    var elem = objTickets.features[i];
                    c1 = elem.geometry.coordinates[0];
                    c2 = elem.geometry.coordinates[1];
                    
                   routeL = ymaps.route([myCoordFromBrowser, [c1,c2]], {avoidTrafficJams: true})
                        .then(
                            function (route) {
                                //myMap.geoObjects.add(route);
                                var routeLength = route.getLength();
                                 return routeLength;
                                
                            },
                            function (error) {
                                alert("Возникла ошибка: " + error.message);
                            }
                        );
                    
                    listHTML = '<div>'+
                                    '<h5>'+elem.properties.balloonContentHeader+'</h5>'+
                                    '<p>'+elem.properties.balloonContentBody+'</p>'+
                                    '<span class="list_address">'+elem.properties.balloonContentFooter+'</span>'+
                                    '<span class="routeLength">'+routeL._value+'</span>'+
                                '</div>';
                    var elemLi = document.createElement('li');
                    elemLi.innerHTML = listHTML;       
                    console.log(routeL);
                    elemLi.setAttribute('class','list-group-item');
                    document.querySelector('.list-group').appendChild(elemLi);
                    
                      
                    console.log(elem);
                   
                }
               

            }
          

        });   
     

     
        function addTicket(){
            sendData('http://nikfolio.ru/geo_test/send.php',jsonData,function(){
                console.log(jsonData);
            });
        };

        function createTicket(){
            var balloonContentHeader = document.querySelector('#title').value,
                balloonContentBody = document.querySelector('#message').value,
                balloonContentFooter = address,
                clusterCaption = balloonContentHeader;
             
            coordinates = myCoordFromBrowser;
            var placemarkSolo = {
               "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "id": new Date().getTime(),
                    "geometry":
                       {
                            "type": "Point",
                            "coordinates": [coordinates[0], coordinates[1]]
                        },
                    "properties":
                        {
                            "balloonContentHeader": balloonContentHeader,
                            "balloonContentBody": balloonContentBody,
                            "balloonContentFooter": balloonContentFooter,
                            "hintContent": balloonContentHeader,
                            "clusterCaption": clusterCaption,
                            
                        }
                    
                }]
            };
                   
            jsonData.address    = address;
            jsonData.country    = country;
            jsonData.long       = coordinates[0];
            jsonData.lat        = coordinates[1];
            jsonData.subject    = balloonContentHeader;
            jsonData.message    = balloonContentBody;
            jsonData.currDate   = new Date().getTime();
            jsonData.active     = 1;   

            addTicket();

            objectManager.add(placemarkSolo);

            myMap.setCenter(coordinates,13,{
                duration:1000,
                timingFunction: "ease-in"
            });
        };

        function updateMap(){

        }             
        // Удаление всех меток с карты
        function removeMarkers () {
            // Удаляем все  метки из кластеризатора.
            clusterer.removeAll();
            // Удаляем все метки из коллекции.
            collection.removeAll();
        }

    }
}
getData('getAllTickets'); 
ymaps.ready(obj.init);    
//Modal control
var Modal = Object.create(null);
//show Modal
Modal.init = function(boxname){
    var a = document.querySelector('.'+boxname);
    a.classList.toggle('active');
    console.log(boxname);
};
//close Modal
// var modal_close = document.querySelector('.modal__close');
// console.log(modal_close);
// modal_close.addEventListener('click',function(e){
//         modal.close('.my_modal');
// })

//AJAX
function getData(request,f){
    sendData('http://nikfolio.ru/geo_test/send.php',request);
    if (typeof f == 'function'){
        f();
    };
};
//Формируем объект objTickets с полученными данными из базы;


function sendData(url,obj,f){
    var xhr = new XMLHttpRequest();
    //console.log(data);
    var data;
    if(typeof obj == 'object')
        {
            data = 'data='+JSON.stringify(obj);
        };
    if(typeof obj == 'string')
        {
            data = 'string='+ obj;
        };
    //console.log(data);
    xhr.onreadystatechange = function() {
      if (this.readyState != 4) return;

      if(this.status != 200) {
        // обработать ошибку
        alert( 'ошибка: ' + (this.status ? this.statusText : 'запрос не удался') );
        return;
      }else {
      //console.log(typeof this.responseText);
        if (typeof f == 'function'){
            f();
        }
       // console.log(this.responseText);
            if (this.responseText!='success'){
                objTickets = JSON.parse(this.responseText);
                return objTickets;
            }else{
                return false;
            }
            
      }

    }
    xhr.open('POST', url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.send(data);
}
