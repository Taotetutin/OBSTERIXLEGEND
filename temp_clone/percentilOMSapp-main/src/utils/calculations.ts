export const datosPesoFetal = [
  [70,73,78,83,90,98,104,109,113],
  [89,93,99,106,114,124,132,138,144],
  [113,117,124,133,144,155,166,174,181],
  [141,146,155,166,179,193,207,217,225],
  [174,181,192,206,222,239,255,268,278],
  [214,223,235,252,272,292,313,328,340],
  [260,271,286,307,330,355,380,399,413],
  [314,327,345,370,398,428,458,481,497],
  [375,392,412,443,476,512,548,575,595],
  [445,465,489,525,565,608,650,682,705],
  [523,548,576,618,665,715,765,803,830],
  [611,641,673,723,778,834,894,938,970],
  [707,743,780,838,902,971,1038,1087,1125],
  [813,855,898,964,1039,1118,1196,1251,1295],
  [929,977,1026,1102,1189,1279,1368,1429,1481],
  [1053,1108,1165,1251,1350,1453,1554,1622,1682],
  [1185,1247,1313,1410,1523,1640,1753,1828,1897],
  [1326,1394,1470,1579,1707,1838,1964,2046,2126],
  [1473,1548,1635,1757,1901,2047,2187,2276,2367],
  [1626,1708,1807,1942,2103,2266,2419,2516,2619],
  [1785,1872,1985,2134,2312,2492,2659,2764,2880],
  [1948,2038,2167,2330,2527,2723,2904,3018,3148],
  [2113,2205,2352,2531,2745,2959,3153,3277,3422],
  [2280,2372,2537,2733,2966,3195,3403,3538,3697],
  [2446,2536,2723,2935,3186,3432,3652,3799,3973],
  [2612,2696,2905,3135,3403,3664,3897,4058,4247],
  [2775,2849,3084,3333,3617,3892,4135,4312,4515]
];

export const percentiles = [2.5, 5, 10, 25, 50, 75, 90, 95, 97.5];

export const interpolacion = (x: number, x1: number, x2: number, y1: number, y2: number) => {
  return y1 + (x - x1) * (y2 - y1) / (x2 - x1);
};

export const calcularPercentil = (semanas: number, dias: number, peso: number) => {
  if (isNaN(semanas) || isNaN(dias) || isNaN(peso) || semanas < 14 || semanas > 40 || dias < 0 || dias > 6) {
    return 'Por favor, ingrese valores válidos.';
  }

  const edadGestacionalExacta = semanas + dias / 7;
  const indiceSemanaInferior = Math.floor(edadGestacionalExacta) - 14;

  let percentilCalculado;

  if (peso < datosPesoFetal[indiceSemanaInferior][0]) {
    percentilCalculado = "<2.5";
  } else if (peso > datosPesoFetal[indiceSemanaInferior][8]) {
    percentilCalculado = ">97.5";
  } else {
    const pesosInterpolados = datosPesoFetal[indiceSemanaInferior].map((pesoActual, index) => {
      if (indiceSemanaInferior === datosPesoFetal.length - 1) {
        return pesoActual;
      }
      const pesoSiguienteSemana = datosPesoFetal[indiceSemanaInferior + 1][index];
      return interpolacion(edadGestacionalExacta, semanas, semanas + 1, pesoActual, pesoSiguienteSemana);
    });

    let indiceInferior = 0;
    while (indiceInferior < pesosInterpolados.length - 1 && peso > pesosInterpolados[indiceInferior + 1]) {
      indiceInferior++;
    }

    if (indiceInferior === pesosInterpolados.length - 1) {
      percentilCalculado = 97.5;
    } else {
      percentilCalculado = interpolacion(
        peso,
        pesosInterpolados[indiceInferior],
        pesosInterpolados[indiceInferior + 1],
        percentiles[indiceInferior],
        percentiles[indiceInferior + 1]
      );
    }
  }

  return typeof percentilCalculado === 'number'
    ? `Resultado: percentil ${percentilCalculado.toFixed(1)}`
    : `Resultado: percentil ${percentilCalculado}`;
};