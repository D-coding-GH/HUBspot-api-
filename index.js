require('dotenv').config({ path: '.env' })
const path = require('path')
const express = require('express')
const app = express()
const hubspot = require('@hubspot/api-client')
const bodyParser = require('body-parser')
const hbs = require('hbs');
const dotenv = require("dotenv");
const _ = require('lodash')
dotenv.config({ path: '/.env' })


//......create function to log full detail from API
const logResponse = (data) => {
    console.log('Response from API', JSON.stringify(data, null, 1))
}

const viewsPath = path.join(__dirname, '/views');
const publicDirectory = path.join(__dirname, '/public');

//.......collect API details hidden for safety on .env page
const hubspotClient = new hubspot.Client({ apiKey: process.env.HUBSPOT_API_KEY })


//.....parse incoming request from frontend forms
app.use(
    bodyParser.urlencoded({
        limit: '50mb',
        extended: true,
    }),
)

app.set('views', viewsPath);
app.set('view engine', 'hbs');

app.use(express.static(publicDirectory));

///........homepage route
app.get('/', (req, res) => {
    res.render('home');
});


//..........collection information from indiviual forms on homepage 
app.post('/companies', async (req, res) => {

    ////.........individual form inputs for each key that forms API
    const city_ = _.get(req, 'body.companyCity');
    const domain_ = _.get(req, 'body.companyDomain');
    const industry_ = _.get(req, 'body.companyIndustry');
    const name_ = _.get(req, 'body.companyName');
    const phone_ = _.get(req, 'body.companyPhoneNumber');
    const state_ = _.get(req, 'body.companyState');

    try {


        ///...................API call, send data from front end to endpoint
        const createResponse = await hubspotClient.crm.companies.basicApi.create({

            properties: {
                ///...................form inputs collected in properties object and transfered to keys
                city: city_, domain: domain_, industry: industry_, name: name_, phone: phone_, state: state_,

            }
        })
        ///....................log api response to check if data has been recieved
        logResponse(createResponse.body)


        const message = "Company Submitted"

        res.render('home', {
            message: message
        })
    }
    catch (error) {
        console.log(error)

    }
})

app.post('/contacts', async (req, res) => {


    const company = _.get(req, 'body.contactCompany');

    const email = _.get(req, ' body.contactEmail');
    const firstname = _.get(req, 'body.contactFirstName');
    const lastname = _.get(req, 'body.contactLastName');
    const phone = _.get(req, 'body.contactPhoneNumber');
    const website = _.get(req, 'body.contactWebsite');

    try {

        const createResponse = await hubspotClient.crm.contacts.basicApi.create({

            properties: {

                company: company, email: email, firstname: firstname, lastname: lastname, phone: phone, website: website

            }
        })

        logResponse(createResponse.body)
        console.log('Calling crm.contacts.basicApi.create API method. Create new contact')

        //.............generate message on front end when details have been submitted        
        const message = "contact Submitted"

        res.render('home', {
            message1: message
        })
    }
    catch (error) {
        console.log(error)

    }

})



app.post('/deals', async (req, res) => {

    const dealamount = _.get(req, 'body.dealAmount');
    const dealclosedate = _.get(req, 'body.dealCloseDate');
    const dealstage = _.get(req, 'body.dealStage');
    const dealhubspot = _.get(req, 'body.dealhubspot');
    const pipeline = _.get(req, 'body.dealPipeline');


    try {

        const createResponse = await hubspotClient.crm.deals.basicApi.create({

            properties: {

                amount: dealamount, closedate: dealclosedate, dealstage: dealstage, hubspot_owner_id: dealhubspot, pipeline: pipeline,

            }
        })
        logResponse(createResponse.body)

        const message = "Deal Submitted"

        res.render('home', {
            message2: message
        })

    } catch (error) {
        console.log(error)

    }
})


app.listen(5000, () => {
    console.log("server is running on port 5000")
});