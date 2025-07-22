import express from 'express';
const app = express();


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.send('Home page');
});

app.get('/about', (req, res) => {
    const users = [
        { name: 'John', age: 30, city: 'New York' },
        { name: 'Jane', age: 25, city: 'Los Angeles' },  
        { name: 'Doe', age: 40, city: 'Chicago' },
        { name: 'Alice', age: 28, city: 'San Francisco' },
        { name: 'Bob', age: 35, city: 'Miami' }
    ]
    

    // const items = ['apple', 'orange', 'banana']
    res.render('about', { 
        title: 'About Page', 
        message: 'welcome to the about page',
        items: users
    
    });
});