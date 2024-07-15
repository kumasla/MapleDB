document.addEventListener('DOMContentLoaded', function() {
    fetch('/boss_difficulties')
        .then(response => response.json())
        .then(data => {
            const bossList = document.getElementById('bossList');
            const difficultyMapping = {'Easy': '1', 'Normal': '2', 'Hard': '3', 'Chaos': '4', 'Extreme': '5'};
            const groupedData = groupByBoss(data);

            Object.keys(groupedData).forEach(bossName => {
                const div = document.createElement('div');
                div.className = 'item';
                div.innerHTML = `<strong class="bossName">${bossName}</strong>`;

                groupedData[bossName].forEach((difficulty, index) => {
                    // 체크박스 생성 로직
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = `${bossName}-${difficulty.difficulty_name}`;
                    checkbox.name = bossName;
                    checkbox.className = 'difficulty-checkbox';
                    checkbox.dataset.price = difficulty.price;
        
                    const label = document.createElement('label');
                    label.htmlFor = checkbox.id;
                    label.textContent = difficulty.difficulty_name;
        
                    const divContainer = document.createElement('div');
                    divContainer.className = 'switch-container';
                    divContainer.appendChild(checkbox);
                    divContainer.appendChild(label);
        
                    div.appendChild(divContainer);
        
                    checkbox.addEventListener('change', function() {
                        handleCheckboxChange.call(this, priceDisplay);
                        // Toggle logic 추가
                        if (this.checked) {
                            const otherCheckboxes = document.querySelectorAll(`input[name="${this.name}"]:not(#${this.id})`);
                            otherCheckboxes.forEach(cb => cb.checked = false);
                        }
                    });
                });
                // .

                const priceDisplay = document.createElement('span');
                priceDisplay.className = 'price-display';
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
    const radios = document.querySelectorAll('.difficulty-checkbox');
    let totalPrice = 0;
    let totalCount = 0;
    radios.forEach(radio => {
        if (radio.checked) {
            totalPrice += parseFloat(radio.dataset.price);
            totalCount += 1;
        }
    });
    document.getElementById('totalPrice').textContent = totalPrice.toLocaleString();
    document.getElementById('totalCount').textContent = totalCount.toLocaleString();
}

function handleCheckboxChange(priceDisplay) {
    // 선택된 체크박스에 따라 가격을 업데이트
    if (this.checked) {
        let activePrice = parseFloat(this.dataset.price).toLocaleString() + ' 메소';
        priceDisplay.textContent = activePrice;

        // 다른 체크박스의 선택을 해제
        const otherCheckboxes = document.querySelectorAll(`input[name="${this.name}"]:not(#${this.id})`);
        otherCheckboxes.forEach(cb => {
            cb.checked = false;
        });
    } else {
        priceDisplay.textContent = ''; // 선택 해제시 가격 표시 제거
    }
}

document.getElementById('calculateButton').addEventListener('click', function() {
    const resultDiv = document.querySelector('.result');
    resultDiv.classList.toggle('d-none'); // 결과창 표시/숨김 토글
});

