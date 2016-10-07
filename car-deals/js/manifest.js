define([], function(){
    window.addEventListener('beforeinstallprompt', function(e) {
        e.userChoice.then(function(choiceResult) {
            console.log(choiceResult.outcome);
            if(choiceResult.outcome == 'dismissed') {
                console.log('User cancelled home screen install');
            }
            else {
                console.log('User added to home screen');
            }
        });
    });

});