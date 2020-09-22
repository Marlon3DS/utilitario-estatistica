const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

var inputs = [];
const calculateData = function (inp) {
    var rol = inp.sort((a, b) => a - b);
    var n = rol.length;
    var i = Math.ceil(Math.log10(n) * 3.3 + 1);
    var h = Math.ceil((rol[n - 1] - rol[0]) / i);
    var classes = [];
    var inicial = 0;
    var final = 0;
    var calculateModa = function (obj) {
        //TODO calcular Moda
    };
    for (let index = 1; index <= i; index++) {
        inicial = final <= 0 ? rol[0] : final;
        final = rol[0] + h * index;
        let itens = rol.filter((value) => {
            if (value >= inicial && value < final) return value;
            if (index == i && value >= inicial && value <= final) return value;
        });
        var obj = {
            i: index,
            li: inicial,
            Li: final,
            fi: itens.length,
            xi: inicial + h / 2
        };
        if (index == i) {
            obj.Li = rol[n - 1];
        }
        obj.fi_xi = obj.fi * obj.xi;
        obj.fr = obj.fi / n;
        obj.f_percent = obj.fr * 100;
        classes.push(obj);
    }
    var x_barra = classes.map(e => e.fi_xi).reduce((total, curr) => total + curr) / n;
    var Mo = calculateModa(classes.reduce((acc, cur) => acc.fi < cur.fi ? cur : acc));
    return {
        rol,
        i,
        h,
        classes,
        x_barra,
        Mo
    };
};

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send(JSON.stringify(calculateData(inputs)));
});

app.post('/', (req, res) => {
    if (!req.body || req.body == '') {
        res.statusCode = 422;
        res.send('Invalid or missing request body');
        return;
    }
    if (req.body.input)
        inputs.push(req.body.input);
    else if (req.body.inputs)
        inputs = req.body.inputs;
    res.statusCode = 204;
    res.send();
});

app.listen(port, () => {
    console.log(`Server start at http://localhost:${port}`);
});