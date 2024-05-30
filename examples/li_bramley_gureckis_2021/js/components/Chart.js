const ctx = document.getElementById("myChart");

const data = {
    labels : [0], // x-axis
    datasets: [
        {
            label: 'Score',
            data: [0], // y-axis
            borderColor: 'blue',
            fill: true,
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
            min: 0,
            max: 30,
        }
    ]
}

function getGradient(ctx, chartArea) {
    const chartWidth = chartArea.right - chartArea.left;
    const chartHeight = chartArea.bottom - chartArea.top;
    let width = chartWidth;
    let height = chartHeight;
    gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, '#c5ecfa');
    gradient.addColorStop(0.1, '#c5ecfa');
    gradient.addColorStop(0.2, '#c5ecfa');
    gradient.addColorStop(0.3, '#c5ecfa');
    gradient.addColorStop(0.5, '#c5ecfa');
    gradient.addColorStop(0.6, '#c5ecfa');
    gradient.addColorStop(0.7, '#c5ecfa');
    gradient.addColorStop(1, 'red');
  
    return gradient;
  }

const custom_canvas_background_color = {
    id: 'custom_canvas_background_color',
    beforeDraw: (chart, args, options) => {
        const {
            ctx,
            chartArea: { top, right, bottom, left, width, height },
            scales: { x, y },
        } = chart;
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        // ctx.fillStyle = '#c5ecfa';
        ctx.fillStyle = getGradient(ctx, { top, right, bottom, left, width, height })
        ctx.fillRect(left, top, width, height);
        ctx.restore();
    },
};

const test_bg_area = {
    id: 'test_bg_area',
    beforeDatasetsDraw: (chart, args, options) => {
        const {
            ctx,
            chartArea: { top, right, bottom, left, width, height },
            scales: { x, y },
        } = chart;

        ctx.fillStyle = 'rgba(255, 0, 0, 0.54)'; // red
        ctx.fillRect(left+1, y.getPixelForValue(21), width-0.5, top - y.getPixelForValue(21)) // left, top, width, height

        ctx.fillStyle = 'rgba(0, 31, 142, 0.47)'; // blue
        ctx.fillRect(left, top - (top - y.getPixelForValue(21)), width, y.getPixelForValue(0) - y.getPixelForValue(21)) // left, top, width, height
    }
}

var scoreChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: ''
            },
        },
        interaction: {
            intersect: false
        },
        scales: {
            x: {
              display: true,
              title: {
                display: true
              }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Score'
                },
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                },
                // grace: '5%',
                suggestedMin: 0,
                suggestedMax: 25
            }
        },
    },
    plugins: [test_bg_area]
})

// ctx.style.backgroundColor = 'blue'

function addChartData(val, label){
    scoreChart.data.datasets[0].data.push(val);
    scoreChart.data.labels.push(label);
    scoreChart.update();
}