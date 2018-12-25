$(document).ready(function () {
    var refreshButton = document.querySelector('.refresh');
    var closeButton1 = document.querySelector('.close1');
    var closeButton2 = document.querySelector('.close2');
    var closeButton3 = document.querySelector('.close3');

    var refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click');
    var close1ClickStream = Rx.Observable.fromEvent(closeButton1, 'click');
    var close2ClickStream = Rx.Observable.fromEvent(closeButton2, 'click');
    var close3ClickStream = Rx.Observable.fromEvent(closeButton3, 'click');

    var requestStream = refreshClickStream.startWith(null)
        .map(function () {
            var randomOffset = Math.floor(Math.random() * 500);
            return 'https://api.github.com/users?since=' + randomOffset;
        });

    var responseStream = requestStream
        .flatMap(function (requestUrl) {
            return Rx.Observable.fromPromise($.getJSON(requestUrl));
        });
    
    firstStreamClickResponse = createSuggestionStream(close1ClickStream);
    firstStreamClickResponse.subscribe(user => renderSuggestion(user, '.suggestion1'));

    secondStreamClickResponse = createSuggestionStream(close2ClickStream);
    secondStreamClickResponse.subscribe(user => renderSuggestion(user, '.suggestion2'));

    thirdStreamClickResponse = createSuggestionStream(close3ClickStream);
    thirdStreamClickResponse.subscribe(user => renderSuggestion(user, '.suggestion3'));

    function createSuggestionStream(stream) {
        return stream.startWith('suggestion click').combineLatest(responseStream, (click, users) => {
            return users[Math.floor(Math.random() * users.length)];      
        })
    }
});



// Rendering ---------------------------------------------------
function renderSuggestion(suggestedUser, selector) {
    var suggestionEl = document.querySelector(selector);
    if (suggestedUser === null) {
        suggestionEl.style.visibility = 'hidden';
    } else {
        suggestionEl.style.visibility = 'visible';
        var usernameEl = suggestionEl.querySelector('.username');
        usernameEl.href = suggestedUser.html_url;
        usernameEl.textContent = suggestedUser.login;
        var imgEl = suggestionEl.querySelector('img');
        imgEl.src = "";
        imgEl.src = suggestedUser.avatar_url;
    }
}