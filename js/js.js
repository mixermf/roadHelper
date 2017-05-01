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
	Latitude,Longitude,
var obj = {
	init:function(){


	},
	getCoords: function(){
	    if(navigator){
			var onSuccess = function(position) {
		        // alert('Latitude: '          + position.coords.latitude          + '\n' +
		        //       'Longitude: '         + position.coords.longitude         + '\n' +
		        //       'Altitude: '          + position.coords.altitude          + '\n' +
		        //       'Accuracy: '          + position.coords.accuracy          + '\n' +
		        //       'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
		        //       'Heading: '           + position.coords.heading           + '\n' +
		        //       'Speed: '             + position.coords.speed             + '\n' +
		        //       'Timestamp: '         + position.timestamp                + '\n');
		      	this.Latitude = position.coords.latitude;
		        this.Longitude = position.coords.longitude;
		        this.coords = [Latitude,Longitude];
		        console.log(myCoordFromBrowser+'from n');
		        return this.coords;
		    };
		    function onError(error) {
		        alert('code: '    + error.code    + '\n' +
		              'message: ' + error.message + '\n');
		    }
			navigator.geolocation.getCurrentPosition(onSuccess,onError)
	    }
    	function geoGet(data){
	    	return
	    		geolocation.get({
		           provider: 'browser',
		           mapStateAutoApply: true
		        }).then(function (result) {
		        	
	        		this.data.address : result.geoObjects.get(0).properties._data.name,
	           		this.data.country : result.geoObjects.get(0).properties._data.description
	        	
		            if (!navigator){
		            	this.data.coords = result.geoObjects.position;
		            }
		            
		            console.log(this.data.coord+' from y');
		            return data = this.data

		        });
		}

	}
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
 
		console.log(geoGet());


        
    console.log(geolocation);
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
    		//makeList();
       		Custombox.modal.close(); 
    	}
    	if(e.target.classList.contains('list_btn')){
    		makeList();
    	}

    });
    //Закрываем ticket_btn
    document.querySelector('#modal__close').addEventListener('click', function(){
       Custombox.modal.close(); 
    });
    document.querySelector('.list_btn').addEventListener('click', function(){
    	
    });

    function makeList(){
  		var makeList = new Promise(function(resolve, reject){
  			getData('getAllTickets'); 
  			
  			resolve(objTickets);	
  			modal_list.open();
		});
  		
			return makeList
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
	      			return Promise.all(action);
	      			
	      		}
 			)
	 			 			
    };
    function makeListArray(obj,arr){
        var length = obj.features.length;
        var c1,c2;
        var listHTML = '';
        arr = [];
        //console.log(objTickets.features[0]);
        document.querySelector('.list-group').innerHTML = '';
        var wrap = document.querySelector('.custombox-content');
        //console.log(wrap);
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
                    var textLength = route.properties._data.RouterRouteMetaData.Length.text;
	                //console.log(route.properties._data.RouterRouteMetaData.Length.text);
	                elem_this.innerHTML = textLength;
	                return 'done'; 
		        },
	            function (error) {
	                alert("Возникла ошибка: " + error.message);
	            }
	        );
	    	   
	};
           
    function addTicket(){
        sendData('http://nikfolio.ru/geo_test/send.php',jsonData,function(){
            getData('getAllTickets');
            //makeList();
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
   // console.log(Longitude +' and '+ Latitude);
       
    
}

function mapStart(){
	var start = new Promise(function(resolve,reject){
		if(ymaps.ready(init)){
			console.log('1');
			resolve('getAllTickets');
		}
	})
	return start
		.then(
			function(result){
				console.log('2');
				return getData(result);
					
			},
			function (error) {
		        alert("Возникла ошибка: " + error.message);
		    }
		)
	
}

mapStart();
    
// //Modal control
// function Modal(boxname){
//     this.boxname = boxname;
//     this.a = document.querySelector('.'+this.boxname);
   
//     this.makeClose();
// }
// Modal.prototype.makeClose = function(){
//         this.cb = document.createElement('i');
//         this.cb.className = 'close_icon';
//         this.cb.innerHTML = 'X';
//         var this1 = this;
//         this.a.appendChild(this.cb);
//         this.a.addEventListener('click',function(e){
//             if(e.target.classList.contains('close_icon')){
//                  this1.init();
//             }
//         })
// }
// Modal.prototype.init = function(){
//     this.a.classList.toggle('active');
//     var btn_list = document.querySelector('.btn_list');
//     btn_list.classList.toggle('inner_init');
// };

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
       // alert(this.navigator);
	    alert( 'ошибка: ' + (this.status ? this.statusText : 'запрос не удался') );
        return false;
      }else {
      //console.log(typeof this.responseText);
        if (typeof f == 'function'){
            f();
        }
       // console.log(this.responseText);
            if (this.responseText!='success'){
                objTickets = JSON.parse(this.responseText);
                //console.log(this);
                return objTickets;

            }else{
                return false;
            }
            
      }

    }
    xhr.onerror = function(){
    	
    }
    xhr.open('POST', url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.send(data);
}
