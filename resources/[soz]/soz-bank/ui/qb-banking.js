const Config = {
    closeKeys: [69, 27]
}

const playerAccountReg = /^[0-9]{2}Z[0-9]{4}T[0-9]{4}$/

window.addEventListener("message", function (event) {
    if(event.data.status === "openbank") {
        $("#currentStatement").DataTable().destroy();
        $("#accountNumber").html(event.data.information.accountinfo);

        $("#bankingHome-tab").addClass('active');
        $("#bankingWithdraw-tab").removeClass('active');
        $("#bankingDeposit-tab").removeClass('active');
        $("#bankingTransfer-tab").removeClass('active');
        $("#bankingStatement-tab").removeClass('active');
        $("#bankingActions-tab").removeClass('active');
        $("#bankingOffShore-tab").removeClass('active');
        $("#bankingHome").addClass('active').addClass('show');
        $("#bankingWithdraw").removeClass('active').removeClass('show');
        $("#bankingDeposit").removeClass('active').removeClass('show');
        $("#bankingTransfer").removeClass('active').removeClass('show');
        $("#bankingStatement").removeClass('active').removeClass('show');
        $("#bankingActions").removeClass('active').removeClass('show');
        $("#bankingOffShore").removeClass('active').removeClass('show');

        $("#saccountNumber").html('');
        $("#offshoreBalance").html('');

        populateBanking(event.data.information);
        $("#bankingContainer").css({"display":"block"});
        $("#bankingOffShore-tab").css({"display":"none"});

        if (!playerAccountReg.test(event.data.information.accountinfo)) {
            $("#accountNumberCard").css({"display":"none"});
            $("#bankingActions-tab").css({"display":"block"});
        } else {
            $("#accountNumberCard").css({"display":"block"});
            $("#bankingActions-tab").css({"display":"none"});
        }

        if (event.data.information.offshore !== undefined && event.data.information.offshore !== null) {
            $("#bankingOffShore-tab").css({"display":"block"});
            $("#bankingActions-tab").css({"display":"none"});
            $("#offshoreBalance").html(event.data.information.offshore);
        }

        if (event.data.isATM) {
            $("#bankingTransfer-tab").css({"display":"none"});
        } else {
            $("#bankingTransfer-tab").css({"display":"block"});
        }

    } else if (event.data.status === "closebank") {
        $("#currentStatement").DataTable().destroy();
        $("#successRow").css({"display":"none"});
        $("#successMessage").html('');
        $("#bankingContainer").css({"display":"none"});
    } else if (event.data.status === "transferError") {
        if(event.data.error !== undefined) {
            $("#transferError").css({"display":"block"});
            $("#transferErrorMsg").html(event.data.error);
        }
    } else if (event.data.status === "successMessage") {
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

function populateBanking(data) {
    $('#withdrawAmount').val('');
    $("#customerName").html(data.name);
    $("#currentBalance").html(data.bankbalance);
    $("#currentCashBalance").html(data.money);
    $("#currentBalance1").html(data.bankbalance);
    $("#currentCashBalance1").html(data.money);
    $("#currentBalance2").html(data.bankbalance);
    $("#currentCashBalance2").html(data.money);
    $("#currentStatementContents").html('');

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

    $("#openOffshore").click(function() {
        $.post('https://soz-bank/createOffshoreAccount', JSON.stringify({ account: $("#accountNumber").text() }))
    });

    $("#makeOffShoreTransfer").click(function() {
        var amount = $('#OffShoreTAmount').val();

        if(amount !== undefined && amount > 0) {
            $.post('https://soz-bank/doOffshoreDeposit', JSON.stringify({
                account: $("#accountNumber").text(),
                amount: parseInt(amount)
            }));
            $('#OffShoreTAmount').val('');
        }
    });

    $("#logoffbutton").click(function() {
        closeBanking();
    });
});
