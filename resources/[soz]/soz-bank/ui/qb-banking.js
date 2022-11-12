const Config = {
    closeKeys: [69, 27]
}

const playerAccountReg = /^[0-9]{3}Z[0-9]{4}T[0-9]{3}$/

let isATM = false;
let atmType = null;
let atmName = null;
let bankAtmAccount
let widthdrawTimeout

window.addEventListener("message", function (event) {
    if(event.data.status === "openbank") {
        $("#accountNumber").html(event.data.information.accountinfo);

        $("#bankingHome-tab").addClass('active');
        $("#bankingWithdraw-tab").removeClass('active');
        $("#bankingDeposit-tab").removeClass('active');
        $("#bankingTransfer-tab").removeClass('active');
        $("#bankingActions-tab").removeClass('active');
        $("#bankingOffShore-tab").removeClass('active');
        $("#bankingHome").addClass('active').addClass('show');
        $("#bankingWithdraw").removeClass('active').removeClass('show');
        $("#bankingDeposit").removeClass('active').removeClass('show');
        $("#bankingTransfer").removeClass('active').removeClass('show');
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
        isATM = event.data.isATM;
        atmType = event.data.atmType;
        atmName = event.data.atmName;

        if (event.data.bankAtmAccount) {
            bankAtmAccount = event.data.bankAtmAccount;
        }

    } else if (event.data.status === "closebank") {
        $("#successRow").css({"display":"none"});
        $("#successMessage").html('');
        $("#bankingContainer").css({"display":"none"});
        bankAtmAccount = null;
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
                isATM: isATM,
                atmType: atmType,
                atmName: atmName,
                account: $("#accountNumber").text(),
                amount: parseInt(amount),
                bankAtmAccount,
            }));
            $('#withdrawAmount').val('')
        } else {
            // Error doing withdraw
            $("#withdrawError").css({"display":"block"});
            $("#withdrawErrorMsg").html('There was an error processing your withdraw, either the amount has not been entered, or is not a positive number');
        }
    });

    $("[data-action=withdraw]").click(function() {
        // Temporarily disable the withdraw button to avoid spam clicking
        if (!widthdrawTimeout) {
            widthdrawTimeout = setTimeout(() => {
                widthdrawTimeout = null;
            }, 500);
        } else return;

        var amount = $(this).attr('data-amount');
        if(amount > 0) {
            $.post('https://soz-bank/doWithdraw', JSON.stringify({
                isATM: isATM,
                atmType: atmType,
                atmName: atmName,
                account: $("#accountNumber").text(),
                amount: parseInt(amount),
                bankAtmAccount,
            }));
        }
    });

    $("#initiateDeposit").click(function() {
        var amount = $('#depositAmount').val();

        if(amount !== undefined && amount > 0) {
            $("#depositError").css({"display":"none"});
            $("#depositErrorMsg").html('');
            $.post('https://soz-bank/doDeposit', JSON.stringify({
                isATM: isATM,
                atmType: atmType,
                atmName: atmName,
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
                isATM: isATM,
                atmType: atmType,
                atmName: atmName,
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
