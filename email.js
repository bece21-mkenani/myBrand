function sendMessage() {
    let params ={
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value

    }
      if (!params.message||!params.email||!params.name){
        alert("please complete all fields before sending!!")
    }
    else{
       emailjs.send("service_b1hvdip","template_vkte5lc",params).then(alert("your message has been received!!"))
        document.getElementById("name").value = " ";
        document.getElementById("email").value =" ";
        document.getElementById("message").value =" ";
     }
   
}