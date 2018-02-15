
'use strict'; //이런 일을 해서 이렇게 짜서 구현했다 정도로 발표 이전거랑 달라진 점

function kiosk() { //스트링 - 변수로 캐시해서 사용하면 유지보수가 편할듯 ( 스테틱 변수는 캐피탈로 ), 대문자_ <= 상수  
 
	var currentOrderBalance, currentOrderList, balance, walletBalance, firstSoldOut, secondSoldOut;
	var menuList = Array.from( $( ".menu" ) );
	var cashList = Array.from( $( ".cash" ) );

  	function deposit( data ) {
  		if ( data > walletBalance ) {
            alert('돈이 없어요!');
            return;
        }
        balance = balance + data;
        walletBalance = walletBalance - data; //-> 이 로직의 의미를 이해할 수 있도록 함수로 감싸면 좋겠다.
        //localStorage.setItem( "isOrdering", true );
        renderDeposit( balance );
        renderWallet( walletBalance );
        renderMenuList();
  	};

  	function orderMenu( name, price ) {
  		if ( currentOrderBalance + price > balance ) {
  			alert('돈을 더넣으셔~~');
  			return;
  		}

  		if( currentOrderList.hasOwnProperty( name ) ) {
  			currentOrderList[ name ].count += 1;
  		}
  		else {
  			currentOrderList[ name ] = { "price" : price, "count" : 1 };
  		}
  		currentOrderBalance += price;
  		renderOrderList();
  	};

  	function cancelMenu( name ) {
  		currentOrderBalance -= currentOrderList[ name ].price;
  		if( currentOrderList[ name ].count === 1 ) { //attribute 를 실행시간에 조작하지 않는게 좋을듯 count로만으로  
  			delete currentOrderList[ name ];
  		} else { //붙여서 쓰기
  			currentOrderList[ name ].count -= 1;
  		}
  		//>(0) 성격이 다른 경우에 한줄 띄어준다. 이보다는 메소드로 빼주는게 더 좋은방법
  		renderOrderList(); //함수 위아래 비우지 않기
  	};

  	function order() {

  	};

  	function cancel() {

  	};

  	function addClickListenerinBtns() {
        $('#reset_button').on('click', this.cancel);
        $('#order_button').on('click', this.order);
	};


    //view

  	function addClickListenerinCashList() {
  		cashList.click('click', 'li', function(e) {
  			deposit(e.val());
		});
  		/*cashList.forEach( function(item) { //event delegation 방식으로 바꿀 것. 리스트 개별적으로 하나하나 이벤트 걸어주는게 별로 성능상 안좋음. 내부 리스트의 내용이 바뀔 경우 꼭 위임 필요
	        item.onclick = deposit.bind( null, item.value );	         
    	});*/
  	};

  	function renderDeposit() { //내부 선언된 데이터는 파라미터로 줄 필요 없음
  		$( "#deposit" ).val( balance );

  	};

  	function renderWallet() {
  		$( "#wallet" ).val( walletBalance );
  	};

  	function renderSoldOutMenu() {
  		menuList[ firstSoldOut ].set( "className", "soldout menu" );
  		menuList[ secondSoldOut ].set( "className", "soldout menu" );
  	};

  	function renderMenuList() {
  		menuList.forEach( function(item) {
  			if( item.className.includes('soldout') ) return;
  			if( item.value <= balance ) {//jquery, 
  				item.style.color = 'black';
          		item.style.cursor = 'pointer';
  				item.onclick = orderMenu.bind( null, item.textContent, item.value );
  			}
  			else {
  				item.style.color = '#ddd';
          		item.style.cursor = 'not-allowed';
  			}
  		});
  	};

  	function createOrderItem( name, price ) {
  		var item = $( "<div>" ).text( '메뉴 : ' + name + '/ 수량 : ' + price ).attr( "className", "orderItem" );
  		var plusBtn = $( "<span>" ).text( '+' ).addClass( "modifyOrder" ).click( orderMenu.bind( null, name, price ));// on('click', "li", function);
  		var minusBtn = $( "<span>" ).text( '-' ).addClass( "modifyOrder" ).click( cancelMenu.bind( null, name ));// text -> html 
  		return item.append(plusBtn).append(minusBtn);
  	};

  	function renderOrderList() {
  		$( '#order_screen' ).empty();//매번 지울 필요도없 
  		if( !jQuery.isEmptyObject( currentOrderList ) ) {
	      	for( var i in currentOrderList ) {//for in 잘 안씀 - 안써도 되면 길이 받아서 반복하는 방법을 써도 됨
	      		if( currentOrderList.hasOwnProperty( i ) ) {
	      			var orderItem = createOrderItem( i, currentOrderList[i].count );
	      			$( '#order_screen' ).append( orderItem );//어펜드를 줄일 수 있을듯 태그 가져오는게 일이니까 한번에 붙일 수 있도록 수정 
	      		}
	      	}
    	}
  	};

  	function render() {
        renderSoldOutMenu();
        renderMenuList();
        addClickListenerinCashList();
        addClickListenerinBtns();
        renderOrderList();
        renderDeposit();
        renderWallet();
	}

	return {
		init : function( data ) {
			currentOrderBalance =  data.currentOrderBalance;
			currentOrderList = data.currentOrderList;
			balance = data.balance;
			walletBalance = data.walletBalance;
			firstSoldOut = data.firstSoldOut;
			secondSoldOut = data.secondSoldOut;
			render();
		},

        randomizeMenu : function() {
            var firstMenuIndex = Math.floor(Math.random() * menuList.length);
            var secondMenuIndex = -1;
            do {
                secondMenuIndex = Math.floor(Math.random() * menuList.length);
            } while (firstMenuIndex === secondMenuIndex);
            localStorage.setItem("firstSoldOut", firstMenuIndex);
            localStorage.setItem("secondSoldOut", secondMenuIndex);
        }
	};
 
};

