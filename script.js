const botonFrontal = document.getElementById('boton-frontal').addEventListener('click', (e)=> {
	e.preventDefault();

	let promotor, neutro, detractor;
	let objetivo = parseInt(document.getElementById('objetivo').value);

	if ((document.getElementById('promotor').value) === "") { promotor = 0;	} 
	else { promotor = parseInt(document.getElementById('promotor').value) }

	if ((document.getElementById('neutro').value) === ""){ neutro = 0; } 
	else { neutro = parseInt(document.getElementById('neutro').value)	}

	if ((document.getElementById('detractor').value) === ""){ detractor = 0; } 
	else { detractor = parseInt(document.getElementById('detractor').value) }

	if ((promotor+neutro+detractor)==0) {
		alert("No ingresaste ningun numero")
	} else {
		let nps = getNPS(promotor, neutro, detractor);
	let cumplimiento = getCumplimiento(nps, objetivo);

	if (nps >= 80) {
		// EN OBJETIVO
		let margenNeutro = getMargenNeutro(promotor, neutro, detractor, objetivo)
		let margenDetractor = getMargenDetractor(promotor, neutro, detractor, objetivo)

		let salida = ` 
			<div class="banner">
				<div class="contenedor-banner">
					<ion-icon name="checkmark-circle-outline" class="icono-banner icono-alterno"></ion-icon>
				</div>
			</div>

			<div class="row justify-content-center centro-tarjeta">
				<div class="valor-nps">
					<p class="nps-porcentaje">${nps}%</p>
					<p class="nps-cumplimiento">${cumplimiento}</p>
			</div>
	
			<div class="row margenes">
				<p class="margen">Tienes un margen de <span class="cantidad">${margenNeutro}</span> neutro/s o de <span class="cantidad">${margenDetractor}</span> detractor/es</p>
			</div>
		</div>
		`

		let centroTarjeta = document.getElementById("cara-trasera-contenedor");
		centroTarjeta.innerHTML = salida

		let caraTrasera = document.getElementById("cara-trasera");
		caraTrasera.classList.remove("fuera-de-objetivo");
		caraTrasera.classList.add("en-objetivo")

		let tarjeta = document.getElementById('contenido-tarjeta');
		tarjeta.classList.add('giro')
	} else {
		// FUERA DE OBJETIVO
		let requerido = getPromotores(promotor, neutro, detractor, objetivo);

		let salida = ` 
			<div class="banner">
				<div class="contenedor-banner">
					<ion-icon name="close-circle-outline" class="icono-banner icono-alterno"></ion-icon>
				</div>
			</div>

			<div class="row justify-content-center centro-tarjeta">
				<div class="valor-nps">
					<p class="nps-porcentaje">${nps}%</p>
					<p class="nps-cumplimiento">${cumplimiento}</p>
			</div>
	
			<div class="row margenes">
				<p class="margen">Te faltan <span class="cantidad">${requerido}</span> promotor/es para quedar en objetivo. Suerte...</p>
			</div>
		</div>
		`

		let centroTarjeta = document.getElementById("cara-trasera-contenedor");
		centroTarjeta.innerHTML = salida

		let caraTrasera = document.getElementById("cara-trasera");
		caraTrasera.classList.remove("en-objetivo");
		caraTrasera.classList.add("fuera-de-objetivo");

		let tarjeta = document.getElementById('contenido-tarjeta');
		tarjeta.classList.add('giro')
	}
	}


	
});

const botonTrasero = document.getElementById('boton-atras').addEventListener('click', (e)=> {
	const tarjeta = document.getElementById('contenido-tarjeta')
	tarjeta.classList.remove('giro')
})

function getNPS (promotor, neutro, detractor) {
	return (Math.trunc(((promotor-detractor)/(promotor+neutro+detractor)*100)))
}

function getCumplimiento(nps, objetivo) {
	let cumplimiento = (nps*100)/objetivo;
	
	if (cumplimiento >= 115) {
		return "SOBRESALIENTE";
	} else if (cumplimiento >= 100) {
		return "DESTACADO";
	} else if (cumplimiento >= 80) {
		return "A MEJORAR";
	} else {
		return "INADECUADO"; 
	}
}

// CALCULO DE MARGEN DE NEUTROS
function getMargenNeutro (promotor, neutro, detractor, objetivo) {
	let nuevoNeutro = neutro;

	do{
		nuevoNeutro++
		nps = getNPS (promotor, nuevoNeutro, detractor)
	}
	while (nps >= objetivo)

	return (nuevoNeutro-1-neutro)
}

// CALCULO DE MARGEN DE DETRACTORES
function getMargenDetractor(promotor, neutro, detractor, objetivo) {
	let nuevoDetractor = detractor;

	do{
		nuevoDetractor++
		nps = getNPS (promotor, neutro, nuevoDetractor)
	}
	while (nps >= objetivo)

	return (nuevoDetractor-1-detractor)
}

function getPromotores (promotor, neutro, detractor, objetivo) {
	let nuevoPromotor = promotor;

	do{
		nuevoPromotor++
		nps = getNPS (nuevoPromotor, neutro, detractor)
	}
	while (nps <= 80)

	return (nuevoPromotor-1-promotor)
}