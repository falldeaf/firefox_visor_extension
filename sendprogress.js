const purls = ["https://gopuff.com/#/order-status", "https://www.grubhub.com/checkout/XDgtIGK5EeyI_NeM0nHMnA/thank-you"];

setInterval(()=> {
    if(purls.contains(document.URL)) {
        switch(document.URL) {
            case purls[0]:
                if(document.querySelector('.status-bar-dynamic-progress')) {
                    sendProgressUpdate("gopuff", document.querySelector('.status-bar-dynamic-progress').style.width);
                }
                break;
            case purls[1]:
                if(document.querySelector('.gp-order-status__progress__fill')) {
                    sendProgressUpdate("grubhub", document.querySelector('.gp-order-status__progress__fill').style.width);
                }
                break;
        }
    }
}, 3000);

function sendProgressUpdate(title, percent) {
    console.log(`${title}: ${percent}`);
    //fetch(`https://falldeaf.xyz/setprogress/HVaMfGkqxUUx7JMQ5QK5uQ2RrXxN4fLxwLwbwCzd/${title}/${title}/${percent}/a0bf04`);
}