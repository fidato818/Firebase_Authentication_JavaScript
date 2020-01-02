
/*===================Initialize Firebase ======================== */
var config = {
    apiKey: "*************************",
    authDomain: "yourlink.firebaseapp.com",
    databaseURL: "https://yourlink.firebaseio.com",
    projectId: "yourlink",
    storageBucket: "",
    messagingSenderId: "************"
};
firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(function(user){
    if (user) {
        var email_Name = user.email;
        document.getElementById("name").innerHTML = email_Name;
        
		//load saved list -> start
	   var user_Id = firebase.auth().currentUser.uid; 
	   firebase.database().ref('messages/' + user_Id)
                .once('value', (data) =>{
                    let userData = data.val()
                    for(var key in userData){
                        var nam = userData[key].name1
                        var me = userData[key].msg
                        messages.innerHTML +=
                        `<div class="card bg-primary text-white">
                            <strong style="margin-right: 30px;">${nam}</strong>
                            <div class="card-body">${me}<div>
                        <div>`
                    }
                });
				
		//load saved list -> end
				
    }
}) 

var error_id = document.getElementById('error')


/*===================SIGNUP START ======================== */
function btnSignUp() {
    var fullname = document.getElementById('fullname').value;
    var cityname = document.getElementById('cityname').value;
    var edu = document.getElementById('edu').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('passwd').value;
    // console.log('you signup')

    firebase.auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
            var obj = {
                fullname,
                cityname,
                edu,
                email,
                password,
                createTime: firebase.database.ServerValue.TIMESTAMP
            }
            var user_Id = firebase.auth().currentUser.uid; /*________User ID shown on firebase user panel (name: uid) _________*/
            firebase.database().ref('/user/' + user_Id).set(obj)
                .then(() => {
                    swal({
                        title: "Welcome",
                        text: "Signup SuccessFully Please Login and start your session",
                        icon: "success",
                        button: "Done",
                    });
                    window.location.replace('../pages/signin.html')
                })
                .catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // ...
                    swal({
                        title: "Plug In!",
                        text: error.message,
                        icon: "warning",
                        buttons: 'okay',
                    });
                });
        })
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            swal({
                title: "Connection Error",
                text: errorMessage,
                icon: "warning",
                buttons: 'okay',
            });
        });
    document.getElementById('fullname').value = '';
    document.getElementById('cityname').value = '';
    document.getElementById('edu').value = '';
    document.getElementById('email').value = '';
    document.getElementById('passwd').value = '';
}

/*===================SIGNUP END ======================== */
/*===================SIGNIN START ====================== */
function btnSignin() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('passwd').value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((success) => {
            window.location.replace('../pages/page.html')
        })
        .catch(function (error) {

            // Handle Errors here.
            // var errorCode = error.code;
            var errorMessage = error.message;
            swal({
                title: "Authentication Error",
                text: errorMessage,
                icon: "warning",
                button: "OK",
            });
            // ...
        });
}
/*===================SIGNIN END=================== */
/*===================LOGOUT ====================== */
function btnLogOut() {
    firebase.auth().signOut()
        .then(function() {
            window.location.replace('./../index.html')
            console.log()
        })
        .catch(function (error) {
            var errorMessage = error.message;
            swal({
                title: 'Please check your Internet Connection',
                text: errorMessage,
                icon: 'warning',
                button: 'OK'
            })
        })
}
/*=================== LOGOUT ====================== */


/*=================== POSTS ====================== */
function createMsg(){
    var user_Id = firebase.auth().currentUser.uid; 
    if(user_Id !== null || user_Id){
        let name1 = document.getElementById('name1').value;
        let msg = document.getElementById('msg').value;
        
        var msg_Obj = {
            name1,
            msg,
        }
        var messages = document.getElementById('messages');
        firebase.database().ref('messages/' + user_Id)
        .push(msg_Obj)
        .then((achieve) =>{
            firebase.database().ref('messages/' + user_Id)
                .on('value', (data) =>{
                    let userData = data.val()
                    for(var key in userData){
                        var nam = userData[key].name1
                        var me = userData[key].msg
                        messages.innerHTML +=
                        `<div class="card bg-primary text-white">
                            <strong>${nam}</strong>
                            <div class="card-body">${me}<div>
                        <div>`
                    }
                })
        })

        
        .catch((error)=>{
            console.log(error.message)
        })
        swal({
            title: "Success",
            // text: errorMessage,
            icon: "success",
            button: "OK",
        });
        document.getElementById('name1').value = ''
        document.getElementById('msg').value = ''
    }
}



