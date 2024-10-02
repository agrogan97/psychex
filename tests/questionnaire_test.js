/*
    Test image drawing by drawing 3 separate images and testing what happens if they're manually resized
    when the window size changes, and resized via their props in js

*/

// -- PARAMS --
var assets = {"imgs" : {}, "fonts" : {}}
var params = {verbose: false, positionMode: "PERCENTAGE", textAlign: "CENTER", imageMode: "CENTER", rectMode: "CENTER"};
// ------------
var content = {};
var myGame;
var tests = {testsA: undefined, testsB: undefined, testsC: undefined};
var bg = 255;

function handleClick(e){ 
    pEventListener(e, 'click') 
}

function preload(){

}

function setup(){
    var canvas = createCanvas(windowWidth, windowHeight);
    pixelDensity(1);
    canvas.parent("gameCanvas")
    document.addEventListener("click", (e) => {handleClick(e)});
    myGame = new Game();

    content.dom = {}
    content.dom.myForm = new MyForm(10, 10);
    // content.dom.myForm = new MyTutorialForm(25, 5);

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw(){
    clear();
    background(bg)
}

// -- This is the form class from the pDOM tutorial -- //
// class MyTutorialForm{
//     constructor(x, y){
//         // Create a new div element
//         this.div = new Div(x, y, "formDiv", {'width': '50%', 'height': '75%', 'background-color': 'lightblue'});
//         // Create a new empty element, and set it to be an <h2> - then append it to the div
//         this.heading = new DomElement(50, 5, "h2", "New Data Form", "h2el")
//             .appendTo(this.div, true);
//         // Create a new empty element, set it to be an <h3> - and append it to the div
//         this.subheading = new DomElement(50, 12.5, "h3", "Please answer the following questions:", "h3el")
//             .appendTo(this.div, true);

//         this.formFields = {};

//         this.newTextField(0, 20, 'f1', 'Enter ID:');
//         this.newCheckboxField(0, 32.5, 'f2', "Are you enjoying Psychex?");
//         this.newSliderField(0, 45, 'f3', "How much?");
//         this.newSelectField(0, 55, 'f4', "Choose an option:",
//              ["Psychex is great", "Psychex is amazing", "Psychex will really help my research", "Psychex is bad"]);
//         this.formFields.f4.field.disableOption('Psychex is bad');

//         const btnStyles = {
//             'background-color': '#008CBA', 
//             'border': 'none',
//             'color': 'white',
//             'padding': '15px 32px',
//             'text-align': 'center',
//             'text-decoration': 'none',
//             'display': 'inline-block',
//             'font-size': '16px',
//             'box-shadow': '0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)',
//         };
    
//         // Define the button
//         this.submitBtn = new Button(50, 90, "Submit", "formSubmitBtn", btnStyles)
//             .appendTo(this.div, true);

//         this.submitBtn.onClick(() => {
//             let data = {};
//             Object.keys(this.formFields).forEach(f => {
//                 data[f] = this.formFields[f].field.getValue();
//                 this.formFields[f].field.clear();
//             })
//             console.log(data)
//         })
//     }

//     newTextField(x, y, id, labelText){
//         // Create a new object inside a class variable called formFields
//         this.formFields[id] = {}
//         this.formFields[id].div = new Div(x, y, `${id}_div`, {'width': '100%', 'height': '15%', 'background-color' : 'inherit'})
//             .appendTo(this.div, true);
//         this.formFields[id].label = new p(1, 15, labelText, `${id}_label`, {'width': '20%', 'font-size' : '22px', 'align' : 'left'})
//             .setAlignment('left')
//             .appendTo(this.formFields[id].div, true);

//         this.formFields[id].field = new Input(50, 0, "", `${id}_input`, {'align' : 'left', 'width': '45%', 'height': '50%'})
//             .setAlignment('left')
//             .appendTo(this.formFields[id].div, true)
//             .setPlaceHolder("Enter ID here");
//     };

//     newCheckboxField(x, y, id, labelText){
//         this.formFields[id] = {}
//         this.formFields[id].div = new Div(x, y, `${id}_div`, {'width': '100%', 'height': '15%', 'background-color' : 'inherit'})
//             .appendTo(this.div, true);
//         this.formFields[id].label = new p(1, 15, labelText, `${id}_label`, {'width': '20%', 'font-size' : '22px', 'align' : 'left'})
//             .setAlignment('left')
//             .appendTo(this.formFields[id].div, true);
//         this.formFields[id].field = new Checkbox(51, 40, `${id}_input`, undefined, {'align' : 'center', 'margin-left' : '5px', 'transform': 'scale(2)', 'border':'0.5px'})
//             .appendTo(this.formFields[id].div, true);
//     };

//     newSliderField(x, y, id, labelText){
//         this.formFields[id] = {}
//         this.formFields[id].div = new Div(x, y, `${id}_div`, {'width': '100%', 'height': '15%', 'background-color' : 'inherit'})
//             .appendTo(this.div, true);
//         this.formFields[id].label = new p(1, 15, labelText, `${id}_label`, {'width': '20%', 'font-size' : '22px', 'align' : 'left'})
//             .setAlignment('left')
//             .appendTo(this.formFields[id].div, true);
//         this.formFields[id].field = new Slider(50, 20, `${id}_input`, {'align' : 'left', 'width' : '45%'})
//             .appendTo(this.formFields[id].div, true)
//             .setRange(0, 1)
//             .setDefault(0);
//     }

//     newSelectField(x, y, id, labelText, selectOptions=[]){
//         this.formFields[id] = {}
//         this.formFields[id].div = new Div(x, y, `${id}_div`, {'width': '100%', 'height': '15%', 'background-color' : 'inherit'})
//             .appendTo(this.div, true);
//         this.formFields[id].label = new p(1, 15, labelText, `${id}_label`, {'width': '20%', 'font-size' : '22px', 'align' : 'left'})
//             .setAlignment('left')
//             .appendTo(this.formFields[id].div, true);
//         this.formFields[id].field = new Select(50, 20, `${id}_input`, {'align' : 'left', 'width' : '45%'})
//             .appendTo(this.formFields[id].div, true);
//         selectOptions.forEach(opt => {
//             this.formFields[id].field.addOption(opt);
//         })
//     }
// }

class MyForm{
    constructor(x, y){
        this.div = new Div(25, 10, "formDiv", {'width': '50%', 'height': '75%', 'background-color': 'lightblue'});
        this.heading = new DomElement(50, 5, "h2", "New Data Form", "h2el").appendTo(this.div, true);
        this.subheading = new DomElement(50, 12.5, "h3", "Please answer the following questions:", "h3el").appendTo(this.div, true);

        // Add text form fields
        this.formFields = {}
        this.newFormField(0, 20, 'f1', 'Enter ID:',  'text');
        this.newFormField(0, 32.5, 'f2', 'Are you enjoying Psychex?', 'checkbox');
        this.newFormField(0, 45, 'f3', 'How much?', 'slider');
        this.newFormField(0, 55, 'f4', "Choose an option:", 'select');
        this.formFields.f4.field.addOption('Psychex is great')
        this.formFields.f4.field.addOption('Psychex is amazing')
        this.formFields.f4.field.addOption('Psychex is really going to help my research')
        this.formFields.f4.field.addOption('Psychex is bad');
        this.formFields.f4.field.disableOption('Psychex is bad');

        // Add a submit button
        this.submitBtn = new Button(50, 90, "Submit", "formSubmitBtn", {
            'background-color': '#008CBA', 
            'border': 'none',
            'color': 'white',
            'padding': '15px 32px',
            'text-align': 'center',
            'text-decoration': 'none',
            'display': 'inline-block',
            'font-size': '16px',
            'box-shadow': '0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)',
        }).appendTo(this.div, true);

        // Add save functionality
        this.submitBtn.onClick(() => {
            // console.log(`Saving data...`)
            let data = [];
            // let data = {
            //     id: this.formFields.f1.field.getValue(),
            //     enjoying: this.formFields.f2.field.getValue(),
            //     magnitude: this.formFields.f3.field.getValue(),
            //     query: this.formFields.f4.field.getValue()
            // }
            // console.log(data)
            Object.keys(this.formFields).forEach(f => {
                data[f] = this.formFields[f].getValue();
                this.formFields[f].field.clear();
            })
        })        

    }

    newFormField(x, y, id, labelText, inputType='text'){
        this.formFields[id] = {}
        this.formFields[id].div = new Div(x, y, `${id}_div`, {'width': '100%', 'height': '15%', 'background-color' : 'inherit'}).appendTo(this.div, true);
        this.formFields[id].label = new p(1, 15, labelText, `${id}_label`, {'width': '20%', 'font-size' : '22px', 'align' : 'left'})
            .setAlignment('left')
            .appendTo(this.formFields[id].div, true);

        if (inputType == 'text'){
            this.formFields[id].field = new Input(50, 0, "", `${id}_input`, {'align' : 'left', 'width': '45%', 'height': '50%'})
            .setAlignment('left')
            .appendTo(this.formFields[id].div, true)
            .setPlaceHolder("Enter ID here");
        } else if (inputType == 'checkbox'){
            this.formFields[id].field = new Checkbox(51, 40, `${id}_input`, undefined, {'align' : 'center', 'margin-left' : '5px', 'transform': 'scale(2)', 'border':'0.5px'})
            .appendTo(this.formFields[id].div, true);
        } else if (inputType == 'slider'){
            this.formFields[id].field = new Slider(50, 20, `${id}_input`, {'align' : 'left', 'width' : '45%'})
                .appendTo(this.formFields[id].div, true)
                .setRange(0, 1)
                .setDefault(0);
        } else if (inputType == 'select'){
            this.formFields[id].field = new Select(50, 20, `${id}_input`, {'align' : 'left', 'width' : '45%'})
                .appendTo(this.formFields[id].div, true);
        }
    }

    clearAll(){
        Object.keys(this.formFields).forEach(f => {
            this.formFields[f].field.clear();
        })
    }
}