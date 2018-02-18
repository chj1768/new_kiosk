
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
        setOrderState(true);
        depositBalance(data);
        withdrawWalletBalance(data);
        renderDeposit( balance );
        renderWallet( walletBalance );
        renderMenuList();
  	}

  	function setOrderState(isOrdering) {
  	    localStorage.setItem("isOrdering", isOrdering);
    }

  	function depositBalance(cash) {
  		balance = balance + cash;
	}

	function depositWalletBalance(cash) {
  		walletBalance = walletBalance + cash;
	}

	function withdrawBalance(cash) {
  		balance = balance - cash;
	}

	function withdrawWalletBalance(cash) {
  		walletBalance = walletBalance - cash;
	}

	function setOrderItem( name, price, type ) {
  	    switch (type) {
            case '+' :
                currentOrderList[name].count += 1;
                currentOrderBalance += price;
                break;
            case '-' :
                currentOrderList[name].count -= 1;
                currentOrderBalance -= price;
                break;
        }
    }

  	function orderMenu( name, price ) {
  		if ( currentOrderBalance + price > balance ) {
  			alert('돈을 더넣으셔~~');
  			return;
  		}
  		setOrderItem(name, price, '+');
  		renderOrderList();
  	}

  	function cancelMenu( name, price ) {
  		setOrderItem(name, price, '-');
  		renderOrderList();
  	}

  	function order() {
  	    for( var i in currentOrderList ) {
  	        if ( i.count == 0 ) return;
  	        i.count = 0;
        }
        withdrawBalance(currentOrderBalance);
        depositWalletBalance(balance);
  	    renderOrderList();
  	    renderWallet();
  	    renderDeposit();
  	    alert('주문이 완료되었습니다. 남은 잔액은 반환됩니다.');
  	    setOrderState(false);

  	}

  	function cancel() {
        if(!confirm('정말 현재 주문을 취소하시겠습니까?')) return;
        currentOrderList.forEach( function(doc) {
           doc.count = 0;
        });
        depositWalletBalance(balance);
        currentOrderBalance = 0;
        balance = 0;
        renderOrderList();
        renderWallet();
        renderDeposit();
        alert('주문이 취소되었습니다. 초기 상태로 돌아갑니다.');
        setOrderState(false);

  	}

  	function addClickListenerinBtns() {
        $('#reset_button').on('click', this.cancel);
        $('#order_button').on('click', this.order);
	}


    //view

  	function addClickListenerinCashList() {
  		cashList.click('click', 'li', function(e) {
  			deposit(e.val());
		});
  	}

  	function renderDeposit() { //내부 선언된 데이터는 파라미터로 줄 필요 없음
  		$( "#deposit" ).val( balance );

  	}

  	function renderWallet() {
  		$( "#wallet" ).val( walletBalance );
  	}

  	function renderSoldOutMenu() {
  		menuList[ firstSoldOut ].set( "className", "soldout menu" );
  		menuList[ secondSoldOut ].set( "className", "soldout menu" );
  	}

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
  	}

  	function createOrderItem( name, price ) {
  		var item = $( "<div>" ).text( '메뉴 : ' + name + '/ 수량 : ' + price ).attr( "className", "orderItem" );
  		var plusBtn = $( "<span>" ).text( '+' ).addClass( "modifyOrder" ).click( orderMenu.bind( null, name, price ));// on('click', "li", function);
  		var minusBtn = $( "<span>" ).text( '-' ).addClass( "modifyOrder" ).click( cancelMenu.bind( null, name ));// text -> html
  		return item.append(plusBtn).append(minusBtn);
  	}

  	function renderOrderList() {
  		$( '#order_screen' ).empty();//매번 지울 필요도없
  		if( !jQuery.isEmptyObject( currentOrderList ) ) {
	      	for( var i in currentOrderList ) {
	      		if( currentOrderList[i].count > 0 ) {
	      			var orderItem = createOrderItem( i, currentOrderList[i].count );
	      			$( '#order_screen' ).append( orderItem );//어펜드를 줄일 수 있을듯 태그 가져오는게 일이니까 한번에 붙일 수 있도록 수정
	      		}
	      	}
    	}
  	}

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
		init : function(data) {
			currentOrderBalance =  data.currentOrderBalance;
			currentOrderList = data.currentOrderList;
			balance = data.balance;
			walletBalance = data.walletBalance;
			firstSoldOut = data.firstSoldOut;
			secondSoldOut = data.secondSoldOut;
			render();
		}

	};

}

