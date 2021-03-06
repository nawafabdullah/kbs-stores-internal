const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const urlencodedParser = express.urlencoded({ extended: true });
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();
const router = express.Router();
const { body, validationResult } = require('express-validator');

//const $ = require("jquery"); 

const { InsertUser } = require('./public/home/UsersService/sign-up/signup');

const { InsertCompany } = require('./public/home/js/add-companies');

const { InsertProduct } = require('./public/home/js/add-products');
//const { AddCompaniestoDB } = require('./public/home/Main-Products/Companies/Add-Companies/add-companies');


const { dbConfig } = require("../../mainConfig/db.config");
const { RetrieveUser } = require('./public/home/UsersService/sign-in/signin');
const { mServerConfig } = require('../../mainConfig/mainServer.config');
//const {ValidateMainChoice} = require ('./public/Main-Products/main-products');
const util = require('util'),
    request = util.promisify(require('request')),
    fs = require('fs'),
    fsp = fs.promises;

app.use(cors());
app.use(helmet());
//app.use(morgan('combined'));
app.listen(mServerConfig.PORT);
app.use(express.urlencoded({
    extended: true
}))
app.use("/", router);
app.use(express.static(__dirname + '/public/home'));
console.log(`listening at ${mServerConfig.HOST}:${mServerConfig.PORT}`);


app.use('/jquery', express.static(__dirname + '../../node_modules/jquery/dist/'));


router.route("/")
    .get(function (req, res) {
        res.sendFile(path.join(__dirname + "/public/home/"));
    })

router.route("/signup")
    .get(function (req, res) {
        res.sendFile(path.join(__dirname + "/public/home/UsersService/sign-up/"));
    })
    .post(urlencodedParser, async function (req, res) {
        console.log("request received to insert");

        let insertion = await InsertUser(req.body, 002);
        res.writeHead(301, {
            content: "Success",
            Location: "/",
        });
        res.writeHead(301, {
            content: "Success",
            Location: "/",
        });
        res.end("Success");
    })

router.route("/signin")
    .get(function (req, res) {
        res.sendFile(path.join(__dirname + "/public/home/UsersService/sign-in/"));
    })
    .post(urlencodedParser, async function (req, res) {
        console.log(" request received to retrieve");
        res.redirect('https://app.example.io');
        RetrieveUser(req.body, dbConfig.DBADMINCOLL);
        res.writeHead(301, {
            content: "Success",
            Location: "/",
        });
        res.writeHead(301, {
            content: "Success",
            Location: "/",
        });
        res.end("Success");
    })

router.route("/authoraize")
    .get(function (req, res) {
        res.sendFile(path.join(__dirname + "/public/home/UsersService/authoraize/"));
    })
    .post(urlencodedParser, async function (req, res) {
        console.log(" request recieved to authoraize");
        RetrieveUser(req.body, dbConfig.DBADMINCOLL);
        res.writeHead(301, {
            content: "Success",
            Location: "/",
        });
        res.end("Success");
    })

router.route("/terms")
    .get(function (req, res) {
        res.sendFile(path.join(__dirname + "/public/home/Terms-And-Conditions/"));
    })

router.route("/downloadTerms")
    .get(function (req, res) {
        var file = fs.createReadStream(path.join(__dirname + '/public/home/Terms-And-Conditions/TermsFile/PrivacyPolicyForNawafWebsite.pdf'));
        var stat = fs.statSync(path.join(__dirname + '/public/home/Terms-And-Conditions/TermsFile/PrivacyPolicyForNawafWebsite.pdf'));
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=agreement.pdf');
        file.pipe(res);
    })

router.route("/products")
    .get(function (req, res) {
        res.sendFile(path.join(__dirname + "/public/home/Main-Products/"));
    })

/*
 .post(async function (req, res) {
     //res.sendFile(path.join(__dirname + "/public/home/Main-Products/main-products"));
     const errors = validationResult(req);
     let companyName = await req.body.companyName;
     if (!errors.isEmpty()) {
         // There are errors. Render form again with sanitized values/errors messages.
         // Error messages can be returned in an array using `errors.array()`.
     }
     else {
         // Data from form is valid.
         console.log(companyName);
     }


 })

 */

router.route("/products/add-product")
    .post(async function (req, res) {
        //res.sendFile(path.join(__dirname + "/public/home/Main-Products/main-products"));
        const errors = validationResult(req);
        let productObj = await req.body;
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            // Error messages can be returned in an array using `errors.array()`.

            console.log("ERRORS EXIST");
        }
        else {
            // Data from form is valid.
            console.log("I am here!!");
            InsertProduct(productObj);
        }
        res.writeHead(301, {
            content: "Success",
            Location: "/",
        });
        res.end("Success");
    })


router.route("/products/display-products")
    .get(function (req, res) {
        res.sendFile(path.join(__dirname + "/public/home/Main-Products/"));
    })


router.route("/products/add-company")
    .post(async function (req, res) {
        //res.sendFile(path.join(__dirname + "/public/home/Main-Products/main-products"));
        const errors = validationResult(req);
        let companyObj = await req.body;
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            // Error messages can be returned in an array using `errors.array()`.
        }
        else {
            // Data from form is valid.
            //console.log(companyName);
            InsertCompany(companyObj);
        }
        res.writeHead(301, {
            content: "Success",
            Location: "/",
        });
        res.end("Success");
    })

router.route("/products/display-companies")
    .get(function (req, res) {
        res.sendFile(path.join(__dirname + "/containerFiles/public/home/Main-Products/Companies/Display-Companies"));
    })



router.route("/products/addProducts/fileupload")
    .get(function (req, res) {
        res.sendFile(path.join(__dirname + "./public/home/Main-Products/Companies/Modify-Companies/"));
    })
    .post(urlencodedParser, async function (req, res) {
        console.log(" request received to modify companies");
        console.log(req.param);
        //console.log(AddCompaniestoDB(req.body.inputfile));
        //req.setValue("application/json", forHTTPHeaderField: "Content-Type");
        //req.httpBody = data;
        AddCompaniestoDB(req);
        res.writeHead(301, {
            content: "Success",
            Location: "/",
        });
        res.end("Success");
    })
