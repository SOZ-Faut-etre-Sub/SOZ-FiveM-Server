var Config = new Object();
Config.closeKeys = [69, 27];
var currentLimit = null;
var clientPin = null;

window.addEventListener("message", function (event) {
    if(event.data.status == "openbank") {
        /*$("#cardDetails").css({"display":"none"});*/
        $("#createNewPin").css({"display":"none"});
        $("#currentStatement").DataTable().destroy();
        $("#accountNumber").html(event.data.information.accountinfo);

        $('#newPinNumber').val('');
        $("#bankingHome-tab").addClass('active');
        $("#bankingWithdraw-tab").removeClass('active');
        $("#bankingDeposit-tab").removeClass('active');
        $("#bankingTransfer-tab").removeClass('active');
        $("#bankingStatement-tab").removeClass('active');
        $("#bankingHome").addClass('active').addClass('show');
        $("#bankingWithdraw").removeClass('active').removeClass('show');
        $("#bankingDeposit").removeClass('active').removeClass('show');
        $("#bankingTransfer").removeClass('active').removeClass('show');
        $("#bankingStatement").removeClass('active').removeClass('show');

        $("#saccountNumber").html('');

        populateBanking(event.data.information);
        $("#bankingContainer").css({"display":"block"});

    }
    else if (event.data.status == "closebank") {
        $("#cardDetails").css({"display":"none"});
        $("#createNewPin").css({"display":"none"});
        $("#currentStatement").DataTable().destroy();
        $("#enteringPin").addClass('show').addClass('active');
        $("#createNewPin").css({"display":"block"});
        $("#successRow").css({"display":"none"});
        $("#successMessage").html('');
        $("#bankingContainer").css({"display":"none"});
    } else if (event.data.status == "transferError") {
        if(event.data.error !== undefined) {
            $("#transferError").css({"display":"block"});
            $("#transferErrorMsg").html(event.data.error);
        }
    } else if (event.data.status == "successMessage") {
        if(event.data.message !== undefined) {
            $("#successRow").css({"display":"block"});
            $("#successMessage").html(event.data.message);
        }
    }
});

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

function populateBanking(data)
{
    $('#newPinNumber').val('');
    $("#createNewPin").css({"display":"none"});
    $("#cardInactive").css({"display":"none"});
    $("#cardOrdering").css({"display":"none"});
    $('#withdrawAmount').val('');
    $("#customerName").html(data.name);
    $("#currentBalance").html(data.bankbalance);
    $("#currentCashBalance").html(data.money);
    $("#currentBalance1").html(data.bankbalance);
    $("#currentCashBalance1").html(data.money);
    $("#currentBalance2").html(data.bankbalance);
    $("#currentCashBalance2").html(data.money);
    $("#currentStatementContents").html('');
    $("#cardOrdering").css({"display":"none"});
    $("#cardInactive").css({"display":"block"});

    if(data.statement !== undefined) {
        data.statement.sort(dynamicSort("date"));
        $.each(data.statement, function (index, statement) {
        if(statement.deposited == null && statement.deposited == undefined) {
            deposit = "0"
        } else {
            deposit = statement.deposited
        }
        if(statement.withdraw == null && statement.withdraw == undefined) {
            withdraw = "0"
        } else {
            withdraw = statement.withdraw
        }
        if (statement.balance == 0) {
            balance = '<span class="text-dark">$' + statement.balance + '</span>';
        } else if (statement.balance > 0) {
            balance = '<span class="text-success">$' + statement.balance + '</span>';
        } else {
            balance = '<span class="text-danger">$' + statement.balance + '</span>';
        }
        $("#currentStatementContents").append('<tr class="statement"><td><small>' + statement.date + '</small></td><td><small>' + statement.type + '</small></td><td class="text-center text-danger"><small>$' + withdraw + '</small></td><td class="text-center text-success"><small>$' + deposit + '</small></td><td class="text-center"><small>' + balance + '</small></td></tr>');

    });

    $(document).ready(function() {
        $('#currentStatement').DataTable({
            "order": [[ 0, "desc" ]],
            "pagingType": "simple",
            "lengthMenu": [[20, 35, 50, -1], [20, 35, 50, "All"]]
        });
    } );
    }
}

function closeBanking() {
    $.post("https://soz-bank/NUIFocusOff", JSON.stringify({}));
};

$(function() {
    $("body").on("keydown", function (key) {
        if (Config.closeKeys.includes(key.which)) {
            closeBanking();
        }
    });

    $("#initiateWithdraw").click(function() {
        var amount = $('#withdrawAmount').val();

        if(amount !== undefined && amount > 0) {
            $("#withdrawError").css({"display":"none"});
            $("#withdrawErrorMsg").html('');
            $.post('https://soz-bank/doWithdraw', JSON.stringify({
                account: $("#accountNumber").text(),
                amount: parseInt(amount),
            }));
            $('#withdrawAmount').val('')
        } else {
            // Error doing withdraw
            $("#withdrawError").css({"display":"block"});
            $("#withdrawErrorMsg").html('There was an error processing your withdraw, either the amount has not been entered, or is not a positive number');
        }
    });

    $("#initiateDeposit").click(function() {
        var amount = $('#depositAmount').val();

        if(amount !== undefined && amount > 0) {
            $("#depositError").css({"display":"none"});
            $("#depositErrorMsg").html('');
            $.post('https://soz-bank/doDeposit', JSON.stringify({
                account: $("#accountNumber").text(),
                amount: parseInt(amount),
            }));
            $('#depositAmount').val('');
        } else {
            // Error doing withdraw
            $("#depositError").css({"display":"block"});
            $("#depositErrorMsg").html('There was an error processing your deposit, either the amount has not been entered, or is not a positive number');
        }
    });

    $("[data-action=deposit]").click(function() {
        var amount = $(this).attr('data-amount');
        if(amount > 0) {
            $.post('https://soz-bank/doDeposit', JSON.stringify({
                account: $("#accountNumber").text(),
                amount: parseInt(amount),
            }));
        }
    });

    $("#initiateTransfer").click(function() {
        var amount = $('#transferAmount').val();
        var account = $('#transferAcctNo').val();

        if(amount !== undefined && amount !== null && amount > 0 && account !== '') {
            $("#transferError").css({"display":"none"});
            $("#transferErrorMsg").html('');
            $.post('https://soz-bank/doTransfer', JSON.stringify({
                accountSource: $("#accountNumber").text(),
                accountTarget: account,
                amount: parseInt(amount),
            }));
            $('#transferAmount').val('');
            $('#transferAcctNo').val('');
        } else {
            $("#transferError").css({"display":"block"});
            $("#transferErrorMsg").html('There was an error with the information you have entered, please ensure the account number, sort code and amount is correctly filled out.');
        }

    });

    $("[data-action=withdraw]").click(function() {
        var amount = $(this).attr('data-amount');
        if(amount > 0) {
            $.post('https://soz-bank/doWithdraw', JSON.stringify({
                account: $("#accountNumber").text(),
                amount: parseInt(amount),
            }));
        }
    });

    $("#logoffbutton").click(function() {
        closeBanking();
    });
});
