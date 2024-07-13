document.addEventListener('DOMContentLoaded', async function() {
    const bossSelect = document.getElementById('name');
    const difficultySelect = document.getElementById('difficulty');

    // 보스 데이터 가져오기
    const bossResponse = await fetch('/bosses');
    const bosses = await bossResponse.json();
    bosses.forEach(boss => {
        const option = document.createElement('option');
        option.value = boss.id;
        option.textContent = boss.name;
        bossSelect.appendChild(option);
    });

    // 난이도 데이터 가져오기
    bossSelect.addEventListener('change', async function() {
        while (difficultySelect.firstChild) {
            difficultySelect.removeChild(difficultySelect.firstChild);
        }

        const bossId = bossSelect.value;
        const response = await fetch('/boss_difficulties');
        const bossDifficulties = await response.json();

        const difficultiesForBoss = bossDifficulties.filter(bd => bd.boss_id == bossId);
        difficultiesForBoss.forEach(bd => {
            const option = document.createElement('option');
            option.value = bd.difficulty_id;
            option.textContent = bd.difficulty;
            difficultySelect.appendChild(option);
        });
    });

    document.getElementById('bossForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const name = document.getElementById('name').value;
        const difficulty_id = document.getElementById('difficulty').value;
        const price = document.getElementById('price').value;

        const response = await fetch('/addBoss', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, difficulty_id, price })
        });

        if (response.ok) {
            alert('보스 데이터가 성공적으로 추가되었습니다.');
            window.location.href = 'index.html';
        } else {
            alert('데이터 추가 중 오류가 발생했습니다.');
        }
    });
});
