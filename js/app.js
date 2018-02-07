
'use strict';

function kiosk() {
 
	var currentOrderBalance, currentOrderList, balance, walletBalance, firstSoldOut, secondSoldOut;
	var menuList = Array.from( $( ".menu" ) );
	var cashList = Array.from( $( ".cash" ) );

	function randomizeMenu() {

		var firstMenuIndex = Math.floor( Math.random() * menuList.length );
		var secondMenuIndex = -1;
		do {
			secondMenuIndex = Math.floor( Math.random() * menuList.length ); 
		} while( firstMenuIndex === secondMenuIndex );
		localStorage.setItem( "firstSoldOut", firstMenuIndex );
    	localStorage.setItem( "secondSoldOut", secondMenuIndex );

  	};

  	function deposit( data ) {

  		if( data <= walletBalance ) {
			balance += data;
			walletBalance -= data;
			//localStorage.setItem( "isOrdering", true );
			renderDeposit( balance );
			renderWallet( walletBalance );
			renderMenuList();

		}
		else {
			alert('돈이 없어요!');
		}

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
  		if( currentOrderList[ name ].count === 1 ) {
  			delete currentOrderList[ name ];
  		}
  		else {
  			currentOrderList[ name ].count -= 1;
  		}
  		renderOrderList();

  	};

  	function order() {

  	};

  	function cancel() {

  	};

  	//view 

  	function addClickListenerinCashList() {

  		cashList.forEach( function(item) {
	        item.onclick = deposit.bind( null, item.value );	         
    	});

  	};

  	function renderDeposit( balance ) {

  		$( "#deposit" ).val( balance );

  	};

  	function renderWallet( walletBalance ) {

  		$( "#wallet" ).val( walletBalance );

  	};

  	function renderSoldOutMenu() {

  		menuList[ firstSoldOut ].className = 'soldout menu';
  		menuList[ secondSoldOut ].className = 'soldout menu';

  	};

  	function renderMenuList() {

  		menuList.forEach( function(item) {
  			if( !item.className.includes( 'soldout' ) &&  item.value <= balance ) {
  				item.style.color = 'black';
          		item.style.cursor = 'pointer';
  				item.onclick = orderMenu.bind( null, item.textContent, item.value );
  			}
  			else if ( !item.className.includes( 'soldout' ) && item.value > balance ) {
  				item.style.color = '#ddd';
          		item.style.cursor = 'not-allowed';
  			}
  		});
  		
  	};

  	function createOrderItem( name, price ) {

  		var item = $( "<div></div>" ).text( '메뉴 : ' + name + '/ 수량 : ' + price ).attr( "className", "orderItem" );
  		var plusBtn = $( "<span></span>" ).text( '+' ).addClass( "modifyOrder" ).click( orderMenu.bind( null, name, price ));
  		var minusBtn = $( "<span></span>" ).text( '-' ).addClass( "modifyOrder" ).click( cancelMenu.bind( null, name ));
  		return item.append(plusBtn).append(minusBtn);

  	};

  	function renderOrderList() {
  		
  		$( '#order_screen' ).empty();
  		if( !jQuery.isEmptyObject( currentOrderList ) ) {
	      	for( var i in currentOrderList ) {
	      		if( currentOrderList.hasOwnProperty( i ) ) {
	      			var orderItem = createOrderItem( i, currentOrderList[i].count );
	      			$( '#order_screen' ).append( orderItem );
	      		}
	      	}
    	}

  	};


	//private

	return {

		init : function( isOrdering ) {	

			currentOrderBalance =  isOrdering ? localStorage.getItem( "currentOrderBalance" ) : 0;
			currentOrderList = isOrdering ? localStorage.getItem( "currentOrderList" ) : {};
			balance = isOrdering ? localStorage.getItem( "balance" ) : 0;
			walletBalance =  isOrdering ? localStorage.getItem( "walletBalance" ) : 20000;

			if ( !isOrdering ) randomizeMenu();
			firstSoldOut = parseInt( localStorage.getItem( "firstSoldOut" ), 10 );
			secondSoldOut = parseInt( localStorage.getItem( "secondSoldOut" ), 10 );

		},

		render : function() { //view 
			renderSoldOutMenu();
			renderMenuList();
			addClickListenerinCashList();
			//document.getElementById( 'reset_button' ).onclick = this.removeMenu;
    		//document.getElementById( 'order_button' ).onclick = this.orderMenu;
    		renderOrderList();
			renderDeposit( balance );
			renderWallet( walletBalance );

		}
  };
 
};
//public
$(document).ready(function(){
	
	var kioskInstance = kiosk();
	kioskInstance.init( !!localStorage.getItem( "isOrdering" ) );
	kioskInstance.render();

});
//main
