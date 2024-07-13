const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// MySQL 데이터베이스 연결 설정
const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Mysql',  // 설정한 비밀번호
    database: 'kms_boss_calculator'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('MySQL connected...');
});

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public'))); // 정적 파일 제공 경로 설정

// 루트 경로를 처리하는 라우트
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 난이도 데이터를 가져오는 라우트
app.get('/difficulties', (req, res) => {
    db.query('SELECT * FROM DIFFICULTY', (err, results) => {
        if (err) {
            console.error('Error fetching difficulties:', err);
            res.status(500).send('Error fetching difficulties');
            return;
        }
        res.json(results);
    });
});

// 보스 이름 데이터를 가져오는 라우트
app.get('/bosses', (req, res) => {
    db.query('SELECT * FROM BOSSNAME', (err, results) => {
        if (err) {
            console.error('Error fetching bosses:', err);
            res.status(500).send('Error fetching bosses');
            return;
        }
        res.json(results);
    });
});

// 보스 난이도와 관련된 정보를 가져오는 라우트 (뷰 사용)
app.get('/boss_difficulties', (req, res) => {
    db.query('SELECT * FROM BOSSINFOVIEW', (err, results) => {
        if (err) {
            console.error('Error fetching boss difficulties from view:', err);
            res.status(500).send('Error fetching boss difficulties from view');
            return;
        }
        res.json(results);
    });
});

// 보스 데이터를 추가하는 라우트
app.post('/addBoss', (req, res) => {
    const { name, difficulty_id, price } = req.body;
    db.query('INSERT INTO BOSSNAME (name) VALUES (?)', [name], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Error inserting data');
            return;
        }
        db.query('INSERT INTO BOSSINFO (boss_id, difficulty_id, price) VALUES (?, ?, ?)', 
            [result.insertId, difficulty_id, price], (err, result) => {
            if (err) {
                console.error('Error inserting data:', err);
                res.status(500).send('Error inserting data');
                return;
            }
            res.send('Boss data inserted successfully.');
        });
    });
});

// 보스 데이터를 업데이트하는 라우트
app.post('/updateBoss', (req, res) => {
    const { boss_id, difficulty_id, price } = req.body;
    db.query('UPDATE BOSSINFO SET price = ? WHERE boss_id = ? AND difficulty_id = ?', 
        [price, boss_id, difficulty_id], (err, result) => {
        if (err) {
            console.error('Error updating data:', err);
            res.status(500).send('Error updating data');
            return;
        }
        res.send('Boss data updated successfully.');
    });
});

// 서버 시작
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
