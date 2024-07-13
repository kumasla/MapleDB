document.addEventListener('DOMContentLoaded', function() {
    fetch('/boss_difficulties')
        .then(response => response.json())
        .then(data => {
            const bossList = document.getElementById('bossList');
            const difficultyMapping = {'Easy': '1', 'Normal': '2', 'Hard': '3', 'Chaos' : '4', 'Extreme' : '5'};
            const groupedData = groupByBoss(data);

            Object.keys(groupedData).forEach(bossName => {
                const div = document.createElement('div');
                div.className = 'boss-item';
                div.innerHTML = `<strong class="bossName">${bossName}</strong>`;

                groupedData[bossName].forEach((difficulty, index) => {
                    const numericDifficulty = difficultyMapping[difficulty.difficulty_name] || 'unknown';  // 매핑된 숫자 또는 'unknown'
                    const label = document.createElement('label');
                    label.innerHTML = `
                        <input type="checkbox" name="${bossName}" class="difficulty-checkbox level${numericDifficulty}"
                        data-price="${difficulty.price}">
                        ${difficulty.difficulty_name}
                    `;
                    label.querySelector('input').addEventListener('change', function() {
                        handleCheckboxChange.call(this, priceDisplay);
                    });
                    div.appendChild(label);
                });

                const priceDisplay = document.createElement('span');
                priceDisplay.className = 'price-display'; // 가격 표시용 클래스 추가
                div.appendChild(priceDisplay);

                bossList.appendChild(div);
            });

            document.getElementById('calculateButton').addEventListener('click', calculateTotal);
        })
        .catch(error => console.error('Error loading the boss data:', error));
});

function groupByBoss(data) {
    const bosses = {};
    data.forEach(item => {
        if (!bosses[item.boss_name]) {
            bosses[item.boss_name] = [];
        }
        bosses[item.boss_name].push({
            difficulty_name: item.difficulty_name,
            price: item.price
        });
    });
    return bosses;
}

function calculateTotal() {
    const checkboxes = document.querySelectorAll('.difficulty-checkbox');
    let totalPrice = 0;
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            totalPrice += parseFloat(checkbox.dataset.price);
        }
    });
    document.getElementById('totalPrice').textContent = totalPrice.toLocaleString() + ' 메소';
}

function handleCheckboxChange(priceDisplay) {
    const allCheckboxes = document.querySelectorAll(`input[name="${this.name}"]`);
    let activePrice = 0;
    allCheckboxes.forEach(box => {
        if (box !== this) box.checked = false;
        if (box.checked) activePrice = box.dataset.price;
    });
    priceDisplay.textContent = ` ${parseFloat(activePrice).toLocaleString()} 메소`;
}
