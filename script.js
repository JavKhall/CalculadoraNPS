const botonFrontal = document.getElementById('boton-frontal').addEventListener('click', (e) => {
	e.preventDefault();

	let promotor, neutro, detractor;
	let objetivo = parseInt(document.getElementById('objetivo').value);
	let avaricia = document.getElementById('avaricia');

	if ((document.getElementById('promotor').value) === "") { promotor = 0;	} 
	else { promotor = parseInt(document.getElementById('promotor').value) }

	if ((document.getElementById('neutro').value) === ""){ neutro = 0; } 
	else { neutro = parseInt(document.getElementById('neutro').value)	}

	if ((document.getElementById('detractor').value) === ""){ detractor = 0; } 
	else { detractor = parseInt(document.getElementById('detractor').value) }

	if ((promotor+neutro+detractor)==0) {
		alert("No ingresaste ningun valor")
	} else {
		let nps = getNPS(promotor, neutro, detractor);
		let cumplimiento = getCumplimiento(nps, objetivo);

		if (nps >= objetivo) {
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
			caraTrasera.classList.remove("falta-poco");
			caraTrasera.classList.add("en-objetivo")
			
			let tarjeta = document.getElementById('contenido-tarjeta');
			tarjeta.classList.add('giro')
			
			// TRUCO PARA LA SOMBRA
			setTimeout(() => {
				let caraFrontal = document.getElementById('cara-frontal')
				caraFrontal.classList.remove('sombra')
			}, 500);
			
			// TIEMPO DE MUESTREO DE FALTANTES PARA SOBRESALIENTE
			if (cumplimiento == "DESTACADO") {
				let codicia = getCodicia (promotor, neutro, detractor, objetivo)
				let contenido = `<p class="texto-avaro"><span>+${codicia}</span> para Sobresaliente</p>`
				avaricia.innerHTML = contenido
				
				setTimeout(() => {
					avaricia.classList.replace('no-mostrar', 'aparecer')
				}, 900);
			}

		} else {
			// FUERA DE OBJETIVO
			let requerido = getPromotores(promotor, neutro, detractor, objetivo);

			let mensaje;

			if (requerido<=5) {
				mensaje = `Te falta poco, <span>Suerte</span>`;
			} else if (requerido<10) {
				mensaje = `Metele garra...`
			} else if (requerido>10) {
				mensaje = `<span>F</span> en el tablero...`
			}

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
					<p class="margen">Te faltan <span>${requerido}</span> promotor/es para quedar en objetivo.</p>
					<p class="margen mensaje">${mensaje}</p>
				</div>
			</div>
			`

			let centroTarjeta = document.getElementById("cara-trasera-contenedor");
			centroTarjeta.innerHTML = salida

			let caraTrasera = document.getElementById("cara-trasera");
			
			if (cumplimiento == "A MEJORAR"){
				caraTrasera.classList.remove("en-objetivo");
				caraTrasera.classList.remove("fuera-de-objetivo");
				caraTrasera.classList.add("falta-poco");
			} else {
				caraTrasera.classList.remove("en-objetivo");
				caraTrasera.classList.remove("falta-poco");
				caraTrasera.classList.add("fuera-de-objetivo");
			}

			let tarjeta = document.getElementById('contenido-tarjeta');
			tarjeta.classList.add('giro')

			setTimeout(() => {
				let caraFrontal = document.getElementById('cara-frontal')
				caraFrontal.classList.remove('sombra')
			}, 500);
		}
	}	
});

const botonTrasero = document.getElementById('boton-atras').addEventListener('click', (e)=> {
	const tarjeta = document.getElementById('contenido-tarjeta')
	tarjeta.classList.remove('giro')
	avaricia.classList.replace('aparecer', 'no-mostrar' )

	setTimeout(() => {
		let caraFrontal = document.getElementById('cara-frontal')
		caraFrontal.classList.add('sombra')
	}, 500);
})


//* ESPACIO DEL CALCULOS REALIZADOS 
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
	while (nps > objetivo)

	return (nuevoNeutro-1-neutro)
}

// CALCULO DE MARGEN DE DETRACTORES
function getMargenDetractor(promotor, neutro, detractor, objetivo) {
	let nuevoDetractor = detractor;

	do{
		nuevoDetractor++
		nps = getNPS (promotor, neutro, nuevoDetractor)
	}
	while (nps > objetivo)

	return (nuevoDetractor-1-detractor)
}

// FALTANTE PARA OBJETIVO
function getPromotores (promotor, neutro, detractor, objetivo) {
	let nuevoPromotor = promotor;

	do{
		nuevoPromotor++
		nps = getNPS (nuevoPromotor, neutro, detractor)
	}
	while (nps < objetivo)

	return (nuevoPromotor-promotor)
}

// CALCULAR CODICIA
function getCodicia (promotor, neutro, detractor, objetivo) {
	let nuevoPromotor = promotor
  let cumplimiento

	do{
		nuevoPromotor++
		nps = getNPS (nuevoPromotor, neutro, detractor)
		cumplimiento = (nps*100)/objetivo
	}
	while (cumplimiento < 115)

	return (nuevoPromotor-promotor)
}