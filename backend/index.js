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
    var _Fa = 0;
    var calculateModa = function (obj) {
        var d1 = obj.fi - classes.filter((row) => {
            if (row.i == obj.i - 1) return row;
        })[0].fi;
        var d2 = obj.fi - classes.filter((row) => {
            if (row.i == obj.i + 1) return row;
        })[0].fi;
        return obj.li + (d1 / (d1 + d2)) * h;
    };
    var calculate = function (obj, mult, div) {
        let Fa = classes.filter((row) => {
            if (row.i == obj.i - 1) return row;
        });
        Fa = Fa.length > 0 ? (Fa[0].F ? Fa[0].F : Fa.F) : null;
        return obj.li + ((mult * n / div - Fa) / obj.fi) * h;
    };
    var getClasse = function (div) {
        var ret = [];
        if (div == 100) div = 10;
        for (let indice = 1; indice <= div; indice++) {
            classes.forEach((cur, index) => {
                var prev = index - 1 >= 0 ? classes[index - 1].F : 0;
                if (indice * n / div >= prev && indice * n / div < cur.F) {
                    let obj = {};
                    obj[indice] = calculate(cur, indice, div);
                    ret.push(obj);
                    return;
                }
            });
        }
        return ret;
    }
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
        _Fa += obj.fi;
        obj.F = _Fa;
        obj.fi_xi = obj.fi * obj.xi;
        obj.fr = obj.fi / n;
        obj.f_percent = obj.fr * 100;
        classes.push(obj);
    }
    var x_barra = classes.map(e => e.fi_xi).reduce((total, cur) => total + cur) / n;
    var Mo = calculateModa(classes.reduce((acc, cur) => acc.fi < cur.fi ? cur : acc));
    var Md = getClasse(2)[0][1];
    var Quartil = getClasse(4);
    var Decil = getClasse(10);
    var Percentil = getClasse(100);
    return {
        rol,
        i,
        h,
        classes,
        x_barra,
        Mo,
        Md,
        Quartil,
        Decil,
        Percentil
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