const testValues = [
  { valueDescription: 'Выручка, руб', currentDay: 500521, yesterday: 480521, previousWeek: 4805121 },
  { valueDescription: 'Наличные', currentDay: 300000, yesterday: 300000, previousWeek: 300000 },
  { valueDescription: 'Безналичный расчёт', currentDay: 100000, yesterday: 100000, previousWeek: 100000 },
  { valueDescription: 'Кредитные карты', currentDay: 100521, yesterday: 100521, previousWeek: 100521 },
  { valueDescription: 'Средний чек, руб', currentDay: 1300, yesterday: 900, previousWeek: 900 },
  { valueDescription: 'Средний гость, руб', currentDay: 1200, yesterday: 800, previousWeek: 800 },
  { valueDescription: 'Удаление из чека (после оплаты), руб', currentDay: 1000, yesterday: 1100, previousWeek: 900 },
  { valueDescription: 'Удаление из чека (до оплаты), руб', currentDay: 1300, yesterday: 1300, previousWeek: 900 },
  { valueDescription: 'Количество чеков', currentDay: 34, yesterday: 36, previousWeek: 34 },
  { valueDescription: 'Количество гостей', currentDay: 34, yesterday: 36, previousWeek: 32 },
];

const tBodyReference = document.querySelector('tbody');

testValues.forEach(dataItem => {

  const incomeDelta = dataItem.currentDay - dataItem.yesterday;

  const incomePercent = Math.floor(incomeDelta * 100 / dataItem.yesterday);

  var percentColorClass = 'percent-color-positive';
  var backgroundYstrdColorClass = '';

  if (incomePercent > 0) {
    backgroundYstrdColorClass = 'background-positive';
  }
  else if (incomePercent < 0) {
    percentColorClass = 'percent-color-negative';
    backgroundYstrdColorClass = 'background-negative';
  }

  var lastWeekColorClass = '';
  if (dataItem.currentDay > dataItem.previousWeek) {
    lastWeekColorClass = 'background-positive';
  }
  else if (dataItem.currentDay < dataItem.previousWeek) {
    lastWeekColorClass = 'background-negative';
  }


  const chartRowContainer = document.createElement('tr');
  chartRowContainer.innerHTML = `
      <td scope="row">${dataItem.valueDescription}</td>
      <td>${dataItem.currentDay.toLocaleString('ru-RU')}</td>
      <td class="${backgroundYstrdColorClass}"><span>${dataItem.yesterday.toLocaleString('ru-RU')}</span> <span class="${percentColorClass}">${incomePercent}%</span></td>
      <td class="${lastWeekColorClass}">${dataItem.previousWeek.toLocaleString('ru-RU')}</td>
    `;
  tBodyReference.appendChild(chartRowContainer)

  chartRowContainer.addEventListener('click', onClick.bind(dataItem), true);
});

// Получаем все ячейки <td> в таблице
const cells = document.querySelectorAll('#data-table td');

cells.forEach(cell => {
  if (!cell.hasAttribute('scope')) {
    cell.classList.add('data-cell');
  }
});


// Функция для отображения графика
function showChart(data) {
  Highcharts.chart('chart-container', {
    chart: {
      type: 'line'
    },
    xAxis: {
      categories: ['Текущий день', 'Вчера', 'На этой неделе']
    },
    yAxis: {
      title: {
        text: 'Значение'
      }
    },
    series: [{
      name: 'Показатель',
      data: data
    }]
  });
  document.getElementById('chart-container').style.display = 'block';
}

function onClick(e) {
  e.stopPropagation();

  var needToAddChart = true;

  var chart = document.querySelector('#chart-container');
  if (chart) {
    const tableRow = chart.parentElement.parentElement;
    const tableBody = tableRow.parentElement;

    needToAddChart = e.currentTarget !== tableRow.previousSibling;

    tableBody.removeChild(tableRow);
  }

  if (needToAddChart) {
    const chartRowContainer = document.createElement('tr');
    chartRowContainer.innerHTML = `
        <td colspan="4">
          <div id="chart-container"></div>
        </td>
        `;

    e.currentTarget.after(chartRowContainer);

    const data = [this.currentDay, this.yesterday, this.previousWeek];
    showChart(data);
  }
}
