const { Builder, By, Key, util } = require("selenium-webdriver");
let companyDetails = [];
const FileSystem = require("fs");


async function automationTest(inputObject) {
    let driver = await new Builder().forBrowser("firefox").build();
    //open firefix browser

    // open the website
    await driver.get(inputObject.webSiteUrl);

    // click on one the company
    await (await driver.findElement(By.xpath(inputObject.companyUrl))).click();

    //Name of the company
    let xpathname = await driver.findElement(By.xpath(inputObject.detailsArr[0]));
    let name;
    if (xpathname !== undefined) {
        name = await xpathname.getText();
    }
    //Address of the company
    let contactaddress = await (await driver.findElement(By.xpath(inputObject.detailsArr[1])).getText());
    // phonenumber of the company
    let phonenumber = await (await driver.findElement(By.xpath(inputObject.detailsArr[2])).getText());
    // emailaddress of the company
    let emailaddress = await (await driver.findElement(By.xpath(inputObject.detailsArr[3])).getText());
    //Storing Information in JSON
    let keyArr = ['name', 'contactaddress','phonenumber','emailaddress', 'imagename'];
    let valuesArr = [];
    valuesArr.push(name);
    valuesArr.push(contactaddress);
    valuesArr.push(phonenumber);
    valuesArr.push(emailaddress);
    valuesArr.push(inputObject.detailsArr[4]);
    let jsonObj = generate_JSON_object(keyArr, valuesArr);
    // companyDetails is Array of Json Objects, Each Json Object represents one company details.
    // so at the end we will be converting companyDetails array into a JSON String and writing into a JSON file
    companyDetails.push(jsonObj);
    // This line fetches the image URL of the company logo
    let imageURL = await (await driver.findElement(By.xpath(inputObject.imageXpath))).getAttribute("src");
    download(imageURL,'./Images/'+inputObject.detailsArr[4], function(){
        console.log("done")
  });
  driver.close();
};

// This function takes the image URL which is the http URL
// and it also takes the filename which is the folder path and the filename 
// and a Callback is triggered once the downloads completes and the file is copied to the folder
// So this function gets the image and store it in a folder mentioned in filename
var download = function(uri, filename, callback){
    request = require('request');
    request.head(uri, function(err, res, body){
      request(uri).pipe(FileSystem.createWriteStream(filename)).on('close', callback);
    });
  };
// This function takes array of keys which is nothing but array of attribute names and
// It also takes array of values which are nothing but corresponding values of those attribute names
// in keys array.Taking these two arrays as input it returns a json object with these keys and values
function generate_JSON_object(keys, values) {
    let jsonObj = {};
    for (let i = 0; i < keys.length; i++) {
        jsonObj[keys[i]] = values[i]
    }
    return jsonObj;
}

// inputArr is array of objects and each object we will be using in automationTest function to populate URLs,xpaths or values
let inputArr = [
    {
        webSiteUrl: 'https://www.medicines.org.uk/emc/browse-companies',
        companyUrl: "//a[normalize-space()='A. Menarini Farmaceutica Internazionale SRL']",
        detailsArr: [
            "//h1[normalize-space()='A. Menarini Farmaceutica Internazionale SRL']",
            "//p[contains(text(),'Menarini House, Mercury Park, Wycombe Lane, Woobur')]",
            "//p[normalize-space()='+44 (0) 1628 856402']",
            "//a[normalize-space()='menarini@medinformation.co.uk']",
            "CompanyoneImage.jpeg"
        ],
        imageXpath : "//img[@alt='Company image']"
        
    },
    {
        webSiteUrl: 'https://www.medicines.org.uk/emc/browse-companies',
        companyUrl: "//a[normalize-space()='Accord Healthcare Limited']",
        detailsArr: [
            "//h1[normalize-space()='Accord Healthcare Limited']",
            "//p[contains(text(),'Sage House, 319 Pinner Road, North Harrow, Middles')]",
            "//p[normalize-space()='+44 (0)208 8631 427']",
            "//a[normalize-space()='medinfo@accord-healthcare.com']",
            "CompanytwoImage.jpeg"
        ],
        imageXpath : "//img[@alt='Company image']"
    },
    {
        webSiteUrl: 'https://www.medicines.org.uk/emc/browse-companies',
        companyUrl: "//a[normalize-space()='Aurobindo Pharma - Milpharm Ltd.']",
        detailsArr: [
            "//h1[normalize-space()='Aurobindo Pharma - Milpharm Ltd.']",
            "//p[contains(text(),'Odyssey Business Park, Ares Block, West End Road, ')]",
            "//p[normalize-space()='+ 44 (0)208 845 8811']",
            "//a[normalize-space()='medinfo@aurobindo.com']",
            "CompanythreeImage.jpeg"
        ],
        imageXpath : "//img[@alt='Company image']"
    }

];

// This function triggers the entire script
async function run() {
    for (let i = 0; i < inputArr.length; i++) {
        await automationTest(inputArr[i]);
    }
    const FileSystem = require("fs");
    FileSystem.writeFile("companydetails.json", JSON.stringify(companyDetails), (err) => {
        if (err) {
            console.log(err);
        }
    })
}

run();

