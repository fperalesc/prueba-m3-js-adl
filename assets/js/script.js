const inputMonto = document.getElementById("inputMonto");
const selectDivisa = document.getElementById("selectDivisa");
const btnBuscar = document.getElementById("btnBuscar");
const spanResultado = document.getElementById("spanResultado");
const sectionGrafico = document.getElementById("sectionGrafico");

async function getIndicadoresData() {
  try {
    const response = await fetch("https://mindicador.cl/api/");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function getDolar(montoCLP = 1) {
  const data = await getIndicadoresData();
  const valorDolar = data.dolar.valor;
  let cantidad = montoCLP;
  let resultado = cantidad / valorDolar;
  return resultado;
}

async function getEuro(montoEUR = 1) {
  const data = await getIndicadoresData();
  const valoEuro = data.euro.valor;
  let cantidad = montoEUR;
  let resultado = cantidad / valoEuro;
  return resultado;
}

async function getDataGraficoDolar() {
  sectionGrafico.innerHTML = "";

  const response = await fetch("https://mindicador.cl/api/dolar");
  const data = await response.json();

  let labels = data.serie
    .slice(0, 10)
    .map((item) => item.fecha.substring(0, 10));
  let values = data.serie.slice(0, 10).map((item) => item.valor);

  labels = labels.reverse();

  const ctx = document.createElement("canvas");
  sectionGrafico.appendChild(ctx);

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Valor del Dólar (Pesos)",
          data: values,
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: "Fecha",
          },
        },
        y: {
          title: {
            display: true,
            text: "Valor en Pesos",
          },
          beginAtZero: false,
        },
      },
    },
  });
}

async function getDataGraficoEuro() {
  sectionGrafico.innerHTML = "";

  const response = await fetch("https://mindicador.cl/api/euro");
  const data = await response.json();

  let labels = data.serie
    .slice(0, 10)
    .map((item) => item.fecha.substring(0, 10));
  let values = data.serie.slice(0, 10).map((item) => item.valor);

  labels = labels.reverse();

  const ctx = document.createElement("canvas");
  sectionGrafico.appendChild(ctx);

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Valor del Euro (Pesos)",
          data: values,
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: "Fecha",
          },
        },
        y: {
          title: {
            display: true,
            text: "Valor en Pesos",
          },
          beginAtZero: false,
        },
      },
    },
  });
}

btnBuscar.addEventListener("click", async () => {
  if (selectDivisa.value === "dolar" && inputMonto.value >= 0) {
    const conversion = await getDolar(inputMonto.value);
    spanResultado.innerHTML = `<p>Resultado: US$${conversion.toFixed(4)}</p>`;
    getDataGraficoDolar();
  } else if (selectDivisa.value === "euro" && inputMonto.value >= 0) {
    const conversion = await getEuro(inputMonto.value);
    spanResultado.innerHTML = `<p>Resultado: €${conversion.toFixed(4)}</p>`;
    getDataGraficoEuro();
  } else {
    alert("Ingresa valores positivos para poder realizar la conversión");
  }
});
