// JavaScript source code
var total = 0;
$(document).ready(function(){
totalMoneyDeposited();
$('#dollarButton').on("click", function () {
		total = total + 1;
		 $('#moneyDisplayId').val('$'+total.toFixed(2));
		 $('#messageDisplayId').val('');
		$('#changeDisplayId').val('');
	})
	$('#quarterButton').on("click", function () {
		total = total + 0.25;
		 $('#moneyDisplayId').val('$'+total.toFixed(2));
		 $('#messageDisplayId').val('');
		$('#changeDisplayId').val('');
	})
	$('#dimeButton').on("click", function () {
		total = total + 0.1;
		 $('#moneyDisplayId').val('$'+total.toFixed(2));
		 $('#messageDisplayId').val('');
		$('#changeDisplayId').val('');
	})
	$('#nickelButton').on("click", function () {
		total = total + 0.05;
		$('#moneyDisplayId').val('$'+total.toFixed(2));
		$('#messageDisplayId').val('');
		$('#changeDisplayId').val('');
	})
loadItems();
});
//load items function
function loadItems(){
	var myItems = $('#itemsDiv');
	// retrieve and display existing data using GET request
    $.ajax({
        type: 'GET',
		url:'http://vending.us-east-1.elasticbeanstalk.com/items',
		success: function(itemArray) {
			var itemsIdArray = [];
            $.each(itemArray, function(index, item){
				//retrieve and store the values
				index++;
				itemsIdArray.push(item.id);
				var name = item.name;
				var price = item.price;
				var quantity = item.quantity;
				var items = '<div id="itemBorder" onclick="selectItem(' + index + ', ' + item.id + ')">';
					items +=  index;
					items += '<p style="text-align:center;">' + name + '</p>';
					items += '<p style="text-align:center;">' +'$' + price.toFixed(2) + '</p>';
					items += '<p style="text-align:center; margin-top:30px;">' +'Quantity Left: '+ quantity + '</p>';
					items += '</div>';
					myItems.append(items);
			})
		},
		error: function() {
            $('#errorMessages')
                .append($('<li>')
                .attr({class: 'list-group-item list-group-item-danger'})
                .text('Error calling web service. Please try again later.'));
        }
    });
}
//submitting the purchase to webservice and returning change if any, And resetting input fields as well as displaying error messages.
function purchase(){
	var itemSelected = $('#itemId').val();
	var money = $('#moneyDisplayId').val().slice(1);
	$.ajax({
        type: 'POST',
		url:'http://vending.us-east-1.elasticbeanstalk.com/money/' + money + '/item/'+ itemSelected,
		success: function(change) {
			if(change.quarters > 0 || change.dimes > 0 || change.nickels > 0 || change.pennies >0){
				$('#changeDisplayId').val(change.quarters+' Quarters, '+change.dimes+' Dimes, '+change.nickels+' Nickels and '+change.pennies+' Pennies');
			}
			 $('#itemDisplayId').val('');
			 $('#itemId').val('');
			 $('#moneyDisplayId').val('');
			 totalMoneyDeposited();
			 $('#messageDisplayId').val('Thank you!!');
			 $('#itemsDiv').empty();
			 loadItems();
		},
		error: function(message) {
				var jsonParsedMessage = JSON.parse(message.responseText);
				$('#messageDisplayId').val(jsonParsedMessage.message);
				$('#itemsDiv').empty();
				loadItems();
        }
    });
}
//returning change and  discontinues the transaction, resets input fields and restock the items.
function returnChange(){
	var money = $('#moneyDisplayId').val().slice(1);
	var changeInPennies = (money * 100).toFixed(2);
	var quarters = parseInt((changeInPennies / 25).toFixed(2));
	changeInPennies = changeInPennies - ((quarters * 25).toFixed(2));
	var dimes = parseInt((changeInPennies / 10).toFixed(2));
	changeInPennies = changeInPennies - ((dimes * 10).toFixed(2));
	var nickels = parseInt((changeInPennies / 5).toFixed(2));
	changeInPennies = changeInPennies - ((nickels * 5).toFixed(2));
	var pennies = changeInPennies;
	$('#moneyDisplayId').val('');
	$('#itemId').val('');
	$('#itemDisplayId').val('');
	$('#messageDisplayId').val('');
	$('#itemsDiv').empty();
	loadItems();
	totalMoneyDeposited();
	if(money > 0){
		$('#changeDisplayId').val(quarters+' Quarters, '+dimes+' Dimes, '+nickels+' Nickels, '+pennies+' Pennies');
	}
	else{
		$('#changeDisplayId').val('');
	}
}
//selecting item and reseting input fields
function selectItem(itemIndex, itemId){
		$('#itemDisplayId').empty();
		$('#itemId').val('');
		$('#messageDisplayId').val('');
		$('#changeDisplayId').val('');
		 $('#itemDisplayId').val(itemIndex);
		 $('#itemId').val(itemId);
}
//depositing money
function totalMoneyDeposited(){
	total = 0;
	$('#moneyDisplayId').val('$'+total.toFixed(2));
}
