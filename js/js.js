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
var jsonData = Object.create(null), //Коллекция хранит данные о тикете
 objTickets = false,
 list_items= {},
 obj = {
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
        // console.log(objectManager);
        // console.log(objTickets);
        //Инициализируем модальное окно ticket


        var modal_add = new Custombox.modal({
  		// Options
			content : {
			    target: '.my_modal',
			}
		});
		var modal_list = new Custombox.modal({
  		// Options
			content : {
			    target: '.list_page',
			}
		});
		//

	    // var modal = new Modal('my_modal');
     	//var list_modal = new Modal('list_page');
        //Вызываем окно с формой добавления тикета
        document.querySelector('.ticket_btn').addEventListener('click', function(){
            modal_add.open();
            //console.log(document.querySelectorAll('.addMarkers'));

        });
        //Добавляем тикет и закрываем модальное окно
        document.querySelector('body').addEventListener('click',function(e){
        	//console.log(e);
        })

        
        document.querySelector('body').addEventListener('click', function(e){
        	//console.log(e.target);
        	if(e.target.classList.contains('addMarkers')){
        		createTicket();
           		Custombox.modal.close(); 
        	}
        	if(e.target.classList.contains('list_btn')){
        		//makeList();
          		//modal_list.open();
          		var promise = new Promise(function(resolve, reject){
          			resolve(objTickets);
          			modal_list.open();
				});
          		promise
          			
		  			.then(

		    			function(result){
			      			return makeListArray(result);
		   				},
		   				function(error) {
		     				 // вторая функция - запустится при вызове reject
		   				   alert("Rejected: " + error); // error - аргумент reject
		    			}
		 			)
		 			.then(
		 				function(result){
			      			//console.log(result);
			      			var action = result.map(fn);
			      			Promise.all(action)
			      			// .then(function(){
			      			// 	//setTimeout(function(){modal_list.open()},3000)
			      			// }); //!!!!!!!!!!!!!!!!!!!!!!!!!ХЗХЗХЗХЗ
			      		}
		 			)
		 			// .then(
		 			// 	function(result){
		 			// 		console.log(result);
		 			// 		if (result =='done'){
		 			// 			;
		 			// 		}
		 			// 	}
		 			// )
        	}

        });
        //Закрываем ticket_btn
        document.querySelector('#modal__close').addEventListener('click', function(){
           Custombox.modal.close(); 
        });
        document.querySelector('.list_btn').addEventListener('click', function(){
        	
        });

        function makeListArray(obj,arr){
	        var length = obj.features.length;
	        var c1,c2;
	        var listHTML = '';
	        arr = [];
	        //console.log(objTickets.features[0]);
	        document.querySelector('.list-group').innerHTML = '';
	        var wrap = document.querySelector('.custombox-content');
	        console.log(wrap);
	        for(var i=0;i<length;i++){
	           var elem = obj.features[i];
	            c1 = elem.geometry.coordinates[0];
	            c2 = elem.geometry.coordinates[1];
	            (function(){
	                listHTML = '<div>'+
	                    '<h5>'+elem.properties.balloonContentHeader+'</h5>'+
	                    '<p>'+elem.properties.balloonContentBody+'</p>'+
	                    '<span class="list_address">'+elem.properties.balloonContentFooter+'</span>'+
	                    '<span class="routeLength" id=id' + elem.id + ' data-coord-long='+c1+' data-coord-lat='+c2+'></span>'+
	                '</div>';
	                var elemLi = document.createElement('li');
	                elemLi.innerHTML = listHTML;       
	                elemLi.setAttribute('class','list-group-item');
	                wrap.querySelector('.list-group').appendChild(elemLi);
	                arr.push(elemLi)
	                //findRout(c1,c2,elem.id);   
	            })();  
	             
	        }
	        return arr;
        }    

		var fn = function findRoutList(elem){ //Ищем путь до метки 
				
				//console.log(wrap);
				var elem_this = elem.querySelector('.routeLength');
				var id = elem_this.getAttribute('id'),
					c1 = elem_this.getAttribute('data-coord-long'),
					c2 = elem_this.getAttribute('data-coord-lat');
				ymaps.route([myCoordFromBrowser, [c1,c2]], {avoidTrafficJams: true})
		        .then(
		            function (route) {
		                var routeLength = route.getLength();
			                routeLength = (routeLength / 1000).toFixed(2);
			                //return (routeLength);
			                //console.log(routeLength);
			                elem_this.innerHTML = routeLength + ' км.';
			                return 'done'; 
			        },
		            function (error) {
		                alert("Возникла ошибка: " + error.message);
		            }
		        );
		    	   
		};

//MAKE LIST                ****************НАПИСАТЬ PROMISE ПО НАХОЖДЕНИЮ РАССТОЯНИЯ****************


// Создаётся объект promise


// promise.then навешивает обработчики на успешный результат или ошибку



function findRout(c1,c2,id){ //Ищем путь до метки 
    ymaps.route([myCoordFromBrowser, [c1,c2]], {avoidTrafficJams: true})
       
        .then(
            function (route) {
                var routeLength = route.getLength();
	                routeLength = (routeLength / 1000).toFixed(2); 
	                //return (routeLength);
	                //console.log(document.querySelector('#id' + id));
	                document.querySelector('#id' + id).innerHTML = routeLength + ' км.';
	                },

            function (error) {
                alert("Возникла ошибка: " + error.message);
            }
        );
};
function makeList (arr){//Формируем список меток в HTML
    if(objTickets){
        var length = objTickets.features.length;
        var c1,c2;
        var listHTML = '';
        arr = [];
        //console.log(objTickets.features[0]);
        document.querySelector('.list-group').innerHTML = '';
        for(var i=0;i<length;i++){
           var elem = objTickets.features[i];
            c1 = elem.geometry.coordinates[0];
            c2 = elem.geometry.coordinates[1];
            (function(){
                listHTML = '<div>'+
                    '<h5>'+elem.properties.balloonContentHeader+'</h5>'+
                    '<p>'+elem.properties.balloonContentBody+'</p>'+
                    '<span class="list_address">'+elem.properties.balloonContentFooter+'</span>'+
                    '<span class="routeLength" id=id' + elem.id + ' data-coord-long='+c1+' data-coord-lat='+c2+'></span>'+
                '</div>';
                var elemLi = document.createElement('li');
                elemLi.innerHTML = listHTML;       
                elemLi.setAttribute('class','list-group-item');
                document.querySelector('.list-group').appendChild(elemLi);
                //arr.push(elemLi)
                findRout(c1,c2,elem.id);   
            })();  
             
        }
    
    }
    else{alert('cant find the DATA');}
    return arr;
};  

//END LIST      
           
           
        function addTicket(){
            sendData('http://nikfolio.ru/geo_test/send.php',jsonData,function(){
                getData('getAllTickets');
                makeList();
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

        function extend() { //Объединяем объекты
            for(var i=1; i < arguments.length; i++) {
                for(var key in arguments[i]) {
                    if(arguments[i].hasOwnProperty(key)) {
                        arguments[0][key] = arguments[i][key];
                    }
                }
            }
            console.log(arguments[0]);
        }
       
    }
}
getData('getAllTickets'); 
ymaps.ready(obj.init);    
//Modal control
function Modal(boxname){
    this.boxname = boxname;
    this.a = document.querySelector('.'+this.boxname);
   
    this.makeClose();
}
Modal.prototype.makeClose = function(){
        this.cb = document.createElement('i');
        this.cb.className = 'close_icon';
        this.cb.innerHTML = 'X';
        var this1 = this;
        this.a.appendChild(this.cb);
        this.a.addEventListener('click',function(e){
            if(e.target.classList.contains('close_icon')){
                 this1.init();
            }
        })
}
Modal.prototype.init = function(){
    this.a.classList.toggle('active');
    var btn_list = document.querySelector('.btn_list');
    btn_list.classList.toggle('inner_init');
};

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
