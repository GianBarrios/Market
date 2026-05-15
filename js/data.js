'use strict';

// ISO 3166-1 numeric -> country name (Spanish)
const COUNTRY_NAMES = {
  4:"Afganistán", 8:"Albania", 12:"Argelia", 24:"Angola", 31:"Azerbaiyán",
  32:"Argentina", 36:"Australia", 40:"Austria", 50:"Bangladesh", 51:"Armenia",
  56:"Bélgica", 64:"Bután", 68:"Bolivia", 70:"Bosnia y Herz.", 72:"Botsuana",
  76:"Brasil", 100:"Bulgaria", 104:"Myanmar", 112:"Bielorrusia", 116:"Camboya",
  120:"Camerún", 124:"Canadá", 140:"R.Centroafricana", 144:"Sri Lanka",
  152:"Chile", 156:"China", 170:"Colombia", 178:"Congo", 180:"RD Congo",
  188:"Costa Rica", 191:"Croacia", 192:"Cuba", 196:"Chipre", 203:"Rep. Checa",
  204:"Benín", 208:"Dinamarca", 214:"Rep. Dominicana", 218:"Ecuador",
  222:"El Salvador", 231:"Etiopía", 232:"Eritrea", 233:"Estonia",
  246:"Finlandia", 250:"Francia", 266:"Gabón", 268:"Georgia", 275:"Palestina",
  276:"Alemania", 288:"Ghana", 300:"Grecia", 320:"Guatemala", 324:"Guinea",
  332:"Haití", 340:"Honduras", 348:"Hungría", 352:"Islandia", 356:"India",
  360:"Indonesia", 364:"Irán", 368:"Irak", 372:"Irlanda", 376:"Israel",
  380:"Italia", 384:"Costa de Marfil", 388:"Jamaica", 392:"Japón",
  398:"Kazajistán", 400:"Jordania", 404:"Kenia", 408:"Corea del Norte",
  410:"Corea del Sur", 414:"Kuwait", 417:"Kirguistán", 418:"Laos",
  422:"Líbano", 428:"Letonia", 430:"Liberia", 434:"Libia", 440:"Lituania",
  450:"Madagascar", 454:"Malaui", 458:"Malasia", 466:"Malí", 484:"México",
  496:"Mongolia", 498:"Moldavia", 499:"Montenegro", 504:"Marruecos",
  508:"Mozambique", 512:"Omán", 516:"Namibia", 524:"Nepal",
  528:"Países Bajos", 554:"Nueva Zelanda", 558:"Nicaragua", 562:"Níger",
  566:"Nigeria", 578:"Noruega", 586:"Pakistán", 591:"Panamá",
  598:"Papua Nueva Guinea", 604:"Perú", 608:"Filipinas", 616:"Polonia",
  620:"Portugal", 634:"Catar", 642:"Rumania", 643:"Rusia",
  682:"Arabia Saudita", 686:"Senegal", 688:"Serbia", 694:"Sierra Leona",
  703:"Eslovaquia", 704:"Vietnam", 705:"Eslovenia", 706:"Somalia",
  710:"Sudáfrica", 716:"Zimbabue", 724:"España", 728:"Sudán del Sur",
  729:"Sudán", 752:"Suecia", 756:"Suiza", 760:"Siria", 762:"Tayikistán",
  764:"Tailandia", 768:"Togo", 784:"EAU", 788:"Túnez", 792:"Turquía",
  795:"Turkmenistán", 800:"Uganda", 804:"Ucrania", 807:"Macedonia del Norte",
  818:"Egipto", 826:"Reino Unido", 834:"Tanzania", 840:"Estados Unidos",
  854:"Burkina Faso", 858:"Uruguay", 860:"Uzbekistán", 862:"Venezuela",
  887:"Yemen", 894:"Zambia", 48:"Baréin",
};

// Colors for AI players (medieval-ish palette)
const PLAYER_COLORS = [
  '#c0392b','#2980b9','#8e44ad','#d35400','#16a085',
  '#f39c12','#1a5276','#922b21','#1e8449','#6c3483',
  '#784212','#0b5345','#1a252f','#7d6608','#512e5f',
  '#0e6251','#154360','#78281f','#1b4f72','#145a32',
];

// Country strategic weight -> armies / income scale
const COUNTRY_WEIGHT = {
  840:5, 643:5, 156:5, 356:4, 76:4, 276:4, 826:4,
  250:4, 392:4, 724:3, 380:3, 124:3, 36:3, 792:3,
  682:3, 364:3, 586:3, 804:3, 360:3, 566:3, 854:2,
};

function getWeight(id) {
  return COUNTRY_WEIGHT[id] || 1;
}

function getStartingArmies(id) {
  return 3 + getWeight(id) * 3 + Math.floor(Math.random() * 4);
}

function getIncome(id) {
  return 5 + getWeight(id) * 8;
}
