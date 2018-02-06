
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

  	function renderMenuList() {

  		menuList[ firstSoldOut ].className = 'soldout menu';
  		menuList[ secondSoldOut ].className = 'soldout menu';
  		menuList.forEach( item => {
  			if( !item.className.includes( 'soldout' ) &&  item.value <= balance ) {
  				item.style.color = 'black';
          		item.style.cursor = 'pointer';
  				//item.onclick = this.addMenu.bind( this, item.textContent, item.value );
  			}
  			else if ( !item.className.includes( 'soldout' ) && item.value > balance ) {
  				item.style.color = '#ddd';
          		item.style.cursor = 'not-allowed';
  			}
  		});
  		
  	};

  	function deposit( data ) {

  		if( data <= walletBalance ) {
			balance += data;
			walletBalance -= data;
			renderDeposit( balance );
			renderWallet( walletBalance );
		}
		else {
			alert('돈이 없어요!');
		}

  	};

  	function addClickListenerinCashList() {

  		cashList.forEach( item => {
	        item.onclick = deposit.bind( this, item.value );	         
    	});

  	};

  	function renderDeposit( balance ) {

  		$( "#deposit" ).val( balance );

  	};

  	function renderWallet( walletBalance ) {

  		$( "#wallet" ).val( walletBalance );

  	};

 //private
	return {

		init : function( isOrdering ) {	

			currentOrderBalance =  isOrdering ? localStorage.getItem( "currentOrderBalance" ) : 0;
			currentOrderList = isOrdering ? localStorage.getItem( "currentOrderList" ) : [];
			balance = isOrdering ? localStorage.getItem( "balance" ) : 0;
			walletBalance =  isOrdering ? localStorage.getItem( "walletBalance" ) : 20000;

			if ( !isOrdering ) randomizeMenu();
			firstSoldOut = parseInt( localStorage.getItem( "firstSoldOut" ), 10 );
			secondSoldOut = parseInt( localStorage.getItem( "secondSoldOut" ), 10 );

		},

		/*getDeposit : function() {
			return deposit;
		},

		getFirstSoldout : function() {
			return firstSoldOut;
		},

		getSecondSoldout : function() {
			return secondSoldOut;
		},

		setDeposit : function( data ) {
			deposit = data;
		},*/

		render : function() { //view 
			renderMenuList();
			addClickListenerinCashList();
			//document.getElementById( 'reset_button' ).onclick = this.removeMenu;
    		//document.getElementById( 'order_button' ).onclick = this.orderMenu;
			renderDeposit( balance );
			renderWallet( walletBalance );

		}
  };
 
};
//public
$(document).ready(function(){
	
	'use strict';
	var kioskInstance = kiosk();
	kioskInstance.init( !!localStorage.getItem( "isOrdering" ) );
	kioskInstance.render();

});
//main
