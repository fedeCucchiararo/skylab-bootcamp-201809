// safe-box.js

var safeBox = {

    saveSecret: function(secret, password) {

        if(password === undefined){throw Error ('invalid password');}

        this.secret = secret;
        this.password = password;
        
    },

    retrieveSecret: function(password) {
        
        if(password === this.password){ return this.secret; }

    }
}

// function add(a, b) {
//     var res = a + b;

//     return {
//         add: function(c) {
//             return add(res, c);
//         },

//         result: function() {
//             return res;
//         }
//     }
// }