// GET - Read 
//Post - Send
// Put - Update
//delete - delete


const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
// Routes
// app.get('/', (req, res) => {
//   res.send('<h1>Hello!</h1>');
// });

// app.get('/about', (req, res) => {
//   res.send('<h1>Hello About!</h1>');
// });
// app.get('/about/user/:userid/book/:bookid', (req, res) => {
// //   res.send('<h1>Hello About!</h1>');
//   res.send(req.params.userid)
// }); //OR
// app.get('/about/user/:userid-:bookid', (req, res) => {
// //   res.send('<h1>Hello About!</h1>');
//   res.send(req.params)
// });
// app.get('/random.text', (req, res) => {
//   res.send('<h1>Random page</h1>');
// });
// app.get('/search', (req, res) => {
//   res.send(req.query);
//   //http://localhost:3000/search?name=Aiman&age=20&city=jhelum
// });


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//


//Response msgs

//1st - object -> it return json file
// app.get('/', (req, res) => {
//     res.send({
//         name: 'Aiman',
//         age: 20,
//     });
// });

// 2nd- Array - it returns array
// app.get('/', (req, res) => {
//     res.send(['Aiman', 'Ali', 'Ahmed']);
// });


//3rd - send.json method - it returns json file
// app.get('/', (req, res) => {
//     res.json({
//         name: 'Aiman',
//         age: 20,
//     });
// });

// array of Objects
// app.get('/', (req, res) => {
//     const users = [
//         { name: 'Aiman', age: 20 },
//         { name: 'Ali', age: 22 },
//         { name: 'Ahmed', age: 23 }
//     ]
//     res.json(users);
// });


// 4th- Redirect method - it redirects to another page
// app.get('/about', (req, res) => {
//     // res.redirect('/user');
//     //or it can redirect on any url
//     res.redirect('https://www.google.com');
// })

//  app.get('/user', (req, res) => {
//     res.send('<h1>Hello User!</h1>');
//  });


// 5th - Render method - it renders a view file

// app.set('view engine', 'ejs');
// app.get('/user', (req, res) => {
//     res.render('user');
//    });


// 6th -download method - it downloads a file
// app.get('/download', (req, res) => {
//     res.download('./files/My CV.pdf', 'document.pdf', (err) => {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log('File downloaded successfully');
//         }
//     });
// });

// 7th - sendFile method - it sends a file
// app.get('/download', (req, res) => {
//     res.sendFile(__dirname + '/files/My CV.pdf', (err) => {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log('File sent successfully');
//         }
//     });
// });

//8th - end - it ends the response
// app.get('/end', (req, res) => {
//     res.write('This is the start of the response\n');
//     res.end();
// });

// 9th - sendstatus - it sends a status code
// app.get('/status', (req, res) => {
//     res.sendStatus(404); // Sends a 404 Not Found status
// });

// 10th - status - it sends ares.status());
// app.get('/status', (req, res) => {
//     res.status(200).send('hello world')
// })

//11th - headersent
// app.get('/check', (req, res) => {
//     console.log(res.headersSent);
//     res.status(200).send('hello world')
//     console.log(res.headersSent);
// })

//12th- get and set method
// app.get('/check', (req, res) => {
//     res.set('Header-sent', 'Hello world')
//     console.log(res.get('header-sent'))
//     res.send('header sent')

// })

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// request methods
// app.post('/about', (req, res) => {
//     res.send(req.body)
// })

// app.get('/about', (req, res) => {
// if(req.accepts('html')){
//     res.send('<h1>Hello HTML</h1>')
// }
// else if(req.accepts('json')){
//     res.send({message: 'Hello json'})
// }
// else if(req.accepts('xml')){
//     res.send('<message>hello xml</message>')
// }
// else{
//     res.send('Content type not supported')
// }
// })


// app.get('/about', (req, res) => {
//     // res.send(req.headers.host)
//     //or
//     res.send(req.get("host"))
// })

// is method
