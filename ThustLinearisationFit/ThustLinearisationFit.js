
function setup_table(logs) {

    //define an array of sheet definitions
    var sheets = [
        {
        title:"Raw Test Data",
        key:"first",
        rows:50,
        columns:6,
        // data:[
        //     [9937,	"",	"",	7749,	9816,	4355,	8279,	"",	""],
        //     [2380,	"",	6977,	8896,	4012,	3803,	5408,	3415,	3056],
        //     [9180,	"",	39,	9445,	3917,	"",	18,	5239,	2516],
        //     [1924,	8734,	1819,	1838,	2330,	7921,	9219,	"",	3537],
        // ]
    },
    {
        title:"Validation Data",
        key:"second",
        rows:50,
        columns:6,
        // data:[
        //     [2380,	"",	6977,	8896,	4012,	3803,	5408,	3415,	3056],
        //     [9180,	"",	39,	9445,	3917,	"",	18,	5239,	2516],
        //     [1924,	8734,	1819,	1838,	2330,	7921,	9219,	"",	3537],
        //     ["",	8665,	5875,	9732,	1926,	"",	9743,	8388,   ""],
        //     [7040,	4861,	2988,	5584,	2344,	9749,	8872,	9177,	6246],
        //     [6334,	1674,	2967,	"",	9353,	396,	6006,	8572 , ""],
        //     [6359,	"",	2580,	5723,	9801,	554,	1044,	5266,	8532],
        // ]
    },
    ];
        
    //Build Tabulator
    var table = new Tabulator("#example-table", {
        height:"311px",

        // columns:[ //Define Table Columns
        //     {title:"Name", field:"name", width:150},
        //     {title:"Age", field:"age", hozAlign:"left", formatter:"progress"},
        //     {title:"Favourite Color", field:"col"},
        //     {title:"Date Of Birth", field:"dob", sorter:"date", hozAlign:"center"},
        //     ],

        rowHeader:{field:"_id", hozAlign:"center", headerSort:false},

        spreadsheet:true,
        spreadsheetRows:50,
        spreadsheetColumns:8,
        spreadsheetColumnDefinition:{editor:"input", resizable:"header"},
        spreadsheetSheets:sheets,
        spreadsheetSheetTabs:true,

        rowHeader:{field:"_id", hozAlign:"center", headerSort:false, frozen:true},

        editTriggerEvent:"dblclick", //change edit trigger mode to make cell navigation smoother
        editorEmptyValue:undefined, //ensure empty values are set to undefined so they arent included in spreadsheet output data

        //enable range selection
        selectableRange:1,
        selectableRangeColumns:true,
        selectableRangeRows:true,
        selectableRangeClearCells:true,
        
        //configure clipboard to allow copy and paste of range format data
        clipboard:true,
        clipboardCopyStyled:false,
        clipboardCopyConfig:{
            rowHeaders:false,
            columnHeaders:false,
        },
        clipboardCopyRowRange:"range",
        clipboardPasteParser:"range",
        clipboardPasteAction:"range",
    });
}
