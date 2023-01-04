if(localStorage.getItem("nombre") != null){
    document.querySelector("#welcome").style.display = "none";
    localStorage.getItem("status") == "yes" ? popUpYes() : popUpMore()
}

 function popUpYes(){
        window.addEventListener("load", function(){
            setTimeout(
                function open(event){

                let divPopUp = document.createElement("div");
                divPopUp.innerHTML = `<div class="popup">
                                        <button id="close">&times;</button>
                                        <h1>${localStorage.getItem("nombre")}, que bueno tenerte de nuevo!</h1>
                                        <h2>Anteriormente compraste:</h2>
                                        <img src="${localStorage.getItem("imagen")}" alt="Kodak1" width="300" height="300">
                                        <h4>${localStorage.getItem("nombreProdu")}</h4>
                                        <p>Quieres ver otros productos de la misma marca?</p>
                                        <button id="continue">Si</button>
                                        <button id="stop">No</button>
                                    </div>`;
                document.body.append(divPopUp);

                document.querySelector(".popup").style.display = "block";

                let btnContinue = document.getElementById("continue");
                let btnStop = document.getElementById("stop");
                let camList = JSON.parse(localStorage.getItem("camList"))
                let name = localStorage.getItem("nombre")

                btnContinue.addEventListener('click', event => {
                    localStorage.setItem("continue", "continue")
                    document.querySelector(".popup").style.display = "none";
                    moreOptions(camList);
                    });

                    btnStop.addEventListener('click', event => {
                    localStorage.setItem("stop", "stop")
                    document.querySelector(".popup").style.display = "none";
                    createCamButton(inputName, name);
                    });    
                }, 
                    1000
            )
        });
       
 }   

 function popUpMore(){
    window.addEventListener("load", function(){
        setTimeout(
            function open(event){
                localStorage.setItem("more", "more")
                let name = localStorage.getItem("nombre")
                swal(localStorage.getItem("nombre") + ', gracias por seguir confiando en nosotros 😊', '');
                createCamButton(inputName, name);
            }, 
                1000
        )
    });
} 

let inputName = document.getElementById("name");
inputName.onchange = () => { createCamButton(inputName) };

function createCamButton(inputName, name) {

    if(localStorage.getItem("stop") != "stop" && localStorage.getItem("more") != "more"){
        localStorage.setItem("nombre", inputName.value)
        inputName.setAttribute("disabled", "")
    }    

    let h2Text = document.createElement("h2");
    h2Text.innerText = "Hola " + localStorage.getItem("nombre") + ". Estas son las marcas que trabajamos, cual desea comprar?";
    document.body.append(h2Text);

    let buttonK = document.createElement("button");
    buttonK.setAttribute("id", "kodak")
    buttonK.innerText = "Kodak";
    document.body.append(buttonK);

    let buttonC = document.createElement("button");
    buttonC.setAttribute("id", "canon")
    buttonC.innerText = "Canon";
    document.body.append(buttonC);

    let buttonS = document.createElement("button");
    buttonS.setAttribute("id", "sony")
    buttonS.innerText = "Sony";
    document.body.append(buttonS);

    let btnKodak = document.getElementById("kodak");
    let marcaK = "kodak"
    btnKodak.addEventListener('click', event => {
        verificarPresupuesto(marcaK, btnKodak);
        swal('Seleccionaste ' + marcaK, 'Te mostraremos las opciones que tenemos para ti!', 'info');
    });

    let btnCanon = document.getElementById("canon");
    let marcaC = "canon"
    btnCanon.addEventListener('click', event => {
        verificarPresupuesto(marcaC), btnCanon;
        swal('Seleccionaste ' + marcaC, 'Te mostraremos las opciones que tenemos para ti!', 'info');
    });

    let btnSony = document.getElementById("sony");
    let marcaS = "sony"
    btnSony.addEventListener('click', event => {
        verificarPresupuesto(marcaS, btnSony);
        swal('Seleccionaste ' + marcaS, 'Te mostraremos las opciones que tenemos para ti!', 'info');
    });
}

function verificarPresupuesto(marcaCamara, btnToDisable) {

    let btnToDisableK = document.getElementById("kodak");
    let btnToDisableC = document.getElementById("canon");
    let btnToDisableS = document.getElementById("sony");
    btnToDisableK.disabled = true;
    btnToDisableC.disabled = true;
    btnToDisableS.disabled = true;

    let divTextPrecio = document.createElement("div");
    divTextPrecio.innerHTML = `<h2> Indique el presupuesto que posee, ej: 100000</h2>`;
    document.body.append(divTextPrecio)
    let inputPrecioElement = document.createElement("input");
    inputPrecioElement.setAttribute("id", "rangoPrecio")
    inputPrecioElement.setAttribute("type", "number")
    document.body.append(inputPrecioElement);

    let inputPrecio = document.getElementById("rangoPrecio");
    inputPrecio.onchange = () => { 
        verificarRangoPrecios(marcaCamara, parseInt(inputPrecio.value)) 
    };

}

function verificarRangoPrecios(marcaCamara, rangoPrecio) {

    inputPrecioDisa = document.getElementById("rangoPrecio");
    inputPrecioDisa.setAttribute("disabled", "")

    return precioCam(rangoPrecio, marcaCamara)

}

async function precioCam(rangoPrecio, marcaCamara) {
    let camList = [];

    pedirCamList(camList, rangoPrecio, marcaCamara)
    
}

const pedirCamList = async (camList, rangoPrecio, marcaCamara) => {
    const resp = await fetch('json/camaras.json')
    const data = await resp.json()
    let i = 0;
    data.forEach((camaras) => {
        if(camaras.marca == marcaCamara){
            camList[i] = camaras
            i++
        }
    })
    for (let i = 0; i < camList.length; i++) {
        let { precio, nombreProdu, imagen } = camList[i]
        rangoPrecio >= precio ? camProcessCorrect(camList, nombreProdu, precio, imagen) : processIncorrect()
        break
    }
}

function camProcessCorrect(camList, nombreProdu, precio, imagen) {

    let divOpcionActual = document.createElement("div");
    divOpcionActual.innerHTML = `<h1 class="title"> Tu camara ideal 🧡 </h1>
    <div class="container"> 
        <div class="card"> 
            <img src="${imagen}" alt="Kodak1" width="300" height="300">
            <h4>${nombreProdu}</h4>
            <p>$${precio}</p>
        </div>
    </div>
                                    <p> Actualmente podemos ofrecerte la: ${nombreProdu}. Desea comprarla? Sino, puede conocer otras opciones</p>`;
    document.body.append(divOpcionActual)

    let button = document.createElement("button");
    button.setAttribute("id", "yes")
    button.innerText = "Si";
    document.body.append(button);

    let button2 = document.createElement("button");
    button2.setAttribute("id", "no")
    button2.innerText = "No";
    document.body.append(button2);

    let button3 = document.createElement("button");
    button3.setAttribute("id", "more")
    button3.innerText = "Otras opciones";
    document.body.append(button3);

    let btn = document.getElementById("yes");
    btn.addEventListener('click', event => {
        proccessFinal(camList, nombreProdu, imagen, precio);
    });

    let btn2 = document.getElementById("no");
    btn2.addEventListener('click', event => {
        sorryNo(camList);
    });

    let btn3 = document.getElementById("more");
    btn3.addEventListener('click', event => {
        moreOptions(camList);
    });

}

function processIncorrect() {
    let h2TextSorry = document.createElement("h2");
    h2TextSorry.innerText = localStorage.getItem("nombre") + ", lo sentimos, no tenemos nada en ese rango de precio para ofrecerte :( ";
    document.body.append(h2TextSorry);

    let button = document.createElement("button");
    button.setAttribute("id", "reload")
    button.innerText = "Volver";
    document.body.append(button);
    let btnReload = document.getElementById("reload");
    btnReload.addEventListener('click', event => {
        reloadPage();
    });

}

function proccessFinal(camList, nombreProdu, imagen, precio) {

    nombreProdu != null ? localStorage.setItem("status", "yes") : localStorage.setItem("status", "more")
    
    if(localStorage.getItem("continue") != "continue"){
        let btnToDisableYes = document.getElementById("yes");
        let btnToDisableNo = document.getElementById("no");
        btnToDisableYes.disabled = true;
        btnToDisableNo.disabled = true;

    }

        localStorage.setItem("nombreProdu", nombreProdu)
        localStorage.setItem("imagen", imagen)
        localStorage.setItem("precio", precio)
        localStorage.setItem("camList", JSON.stringify(camList))

        camList.splice(0, 1)

        nombreProdu != null ? swal('Adquiriste la ' + nombreProdu, 'Felicidades por tu compra ' + localStorage.getItem("nombre") + '!', 'success') :
        swal('Felicidades por tu compra ' + localStorage.getItem("nombre") + '!, te redirigiremos al inicio :)', 'success');
    
    
    
    if(nombreProdu != null){
        if (camList.length != 0) {
            let divOptions = document.createElement("div");
            divOptions.innerHTML = `<h1> Otras opciones: </h1>`;
            document.body.append(divOptions);

            for (let i = 0; i < camList.length; i++) {
                let camsRestante = camList[i]
                let divRest = document.createElement("div");
                divRest.innerHTML = `<div class="container"> 
                                        <div class="card"> 
                                            <img src="${camsRestante.imagen}" alt="Kodak1" width="300" height="300">
                                            <h4>${camsRestante.nombreProdu}</h4>
                                            <p>$${camsRestante.precio}</p>
                                        </div>
                                    </div>`;
                document.body.append(divRest);

                
            }
        }else{
            let divOptions = document.createElement("div");
            divOptions.innerHTML = `<h1> No poseemos otras opciones por el momento :( </h1>`;
            document.body.append(divOptions);
        }
            let button = document.createElement("button");
            button.setAttribute("id", "reload")
            button.innerText = "Volver";
            document.body.append(button);
            let btnReload = document.getElementById("reload");
                btnReload.addEventListener('click', event => {
                    reloadPage();
                });
    }else{
        setTimeout(function(){
            window.location.reload();
         }, 5000);
    }

}

function sorryNo(camList) {
    
    localStorage.setItem("status", "no")

    swal(localStorage.getItem("nombre"), 'Lamentamos no tener lo que buscas :( Mirá otras opciones: ', 'info');

    camList.splice(0, 1)

    if (camList.length != 0) {
        let divOptions = document.createElement("div");
        divOptions.innerHTML = `<h1> Otras opciones: </h1>`;
        document.body.append(divOptions);

        for (let i = 0; i < camList.length; i++) {
            let camsRestante = camList[i]
            let divRest = document.createElement("div");
            divRest.innerHTML = `<div class="container"> 
                                    <div class="card"> 
                                        <img src="${camsRestante.imagen}" alt="Kodak1" width="300" height="300">
                                        <h4>${camsRestante.nombreProdu}</h4>
                                        <p>$${camsRestante.precio}</p>
                                    </div>
                                </div>`;
            document.body.append(divRest);

            
        }
    }else{
        let divOptions = document.createElement("div");
        divOptions.innerHTML = `<h1> No poseemos otras opciones por el momento :( </h1>`;
        document.body.append(divOptions);
    }

    let h2TextSorry = document.createElement("h2");
    h2TextSorry.innerText = "Te esperamos pronto!";
    document.body.append(h2TextSorry);

    let button = document.createElement("button");
    button.setAttribute("id", "reload")
    button.innerText = "Volver";
    document.body.append(button);
    let btnReload = document.getElementById("reload");
    btnReload.addEventListener('click', event => {
        reloadPage();
    });
}

function moreOptions(camList) {
    
    swal(localStorage.getItem("nombre"), 'Estas son otras opciones: ', 'info');

    camList.splice(0, 1)

    if (camList.length != 0) {
        let divOptions = document.createElement("div");
        divOptions.innerHTML = `<h1> Otras opciones: </h1>`;
        document.body.append(divOptions);

        for (let i = 0; i < camList.length; i++) {
            let camsRestante = camList[i]
            let divRest = document.createElement("div");
            divRest.innerHTML = `<div class="container"> 
                                    <div class="card"> 
                                        <img src="${camsRestante.imagen}" alt="Kodak1" width="300" height="300">
                                        <h4>${camsRestante.nombreProdu}</h4>
                                        <p>$${camsRestante.precio}</p>
                                        
                                    </div>
                                    <button type="button" id="buy">Comprar!</button>
                                </div>`;
            
        document.body.append(divRest);
        }
    }else{
        let divOptions = document.createElement("div");
        divOptions.innerHTML = `<h1> No poseemos otras opciones por el momento :( </h1>`;
        document.body.append(divOptions);
    }
    let btn = document.getElementById("buy");
    let nombreProdu = null;

    document.querySelectorAll("#buy").forEach((e) => {
        e.addEventListener("click", event => {
            let nombreProdu = null
            proccessFinal(camList, nombreProdu);
        });
     });

    let button = document.createElement("button");
    button.setAttribute("id", "reload")
    button.innerText = "Volver";
    document.body.append(button);
    let btnReload = document.getElementById("reload");
    btnReload.addEventListener('click', event => {
        reloadPage();
    });
}

function reloadPage() {
    reload = location.reload();
}

