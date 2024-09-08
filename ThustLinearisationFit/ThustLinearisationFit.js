
function setup_table(logs) {

    // Example data of steady state steps from 4S Voltage Battery TmotorAir 2216 kv880 with 10 inch Rotor in Tractor config (Hexsoon 450 Propulsion)
    var exampleData = [
        {id:1, throttle1:1150, thrust1:0.11, throttle2:1150, thrust2:1, throttle3:0, thrust3:0},
        {id:2, throttle1:1192, thrust1:0.16, throttle2:1192, thrust2:1, throttle3:0, thrust3:0},
        {id:3, throttle1:1234, thrust1:0.36, throttle2:1234, thrust2:1, throttle3:0, thrust3:0},
        {id:4, throttle1:1277, thrust1:0.65, throttle2:1277, thrust2:1, throttle3:0, thrust3:0},
        {id:5, throttle1:1319, thrust1:0.98, throttle2:1319, thrust2:1, throttle3:0, thrust3:0},
        {id:6, throttle1:1362, thrust1:1.36, throttle2:1362, thrust2:1, throttle3:0, thrust3:0},
        {id:7, throttle1:1404, thrust1:1.74, throttle2:1404, thrust2:1, throttle3:0, thrust3:0},
        {id:8, throttle1:1447, thrust1:2.13, throttle2:1447, thrust2:1, throttle3:0, thrust3:0},
        {id:9, throttle1:1489, thrust1:2.62, throttle2:1489, thrust2:1, throttle3:0, thrust3:0},
        {id:10, throttle1:1531, thrust1:3.14, throttle2:1531, thrust2:1, throttle3:0, thrust3:0},
        {id:11, throttle1:1575, thrust1:3.78, throttle2:1575, thrust2:1, throttle3:0, thrust3:0},
        {id:12, throttle1:1616, thrust1:4.44, throttle2:1616, thrust2:1, throttle3:0, thrust3:0},
        {id:13, throttle1:1659, thrust1:5.24, throttle2:1659, thrust2:1, throttle3:0, thrust3:0},
        {id:14, throttle1:1702, thrust1:5.93, throttle2:1702, thrust2:1, throttle3:0, thrust3:0},
        {id:15, throttle1:1744, thrust1:6.62, throttle2:1744, thrust2:1, throttle3:0, thrust3:0},
        {id:16, throttle1:1786, thrust1:7.34, throttle2:1786, thrust2:1, throttle3:0, thrust3:0},
        {id:17, throttle1:1829, thrust1:7.97, throttle2:1829, thrust2:1, throttle3:0, thrust3:0},
        {id:18, throttle1:1872, thrust1:8.78, throttle2:1872, thrust2:1, throttle3:0, thrust3:0},
        {id:19, throttle1:1914, thrust1:9.5, throttle2:1914, thrust2:1, throttle3:0, thrust3:0},
        {id:20, throttle1:1957, thrust1:9.48, throttle2:1957, thrust2:1, throttle3:0, thrust3:0},
        {id:21, throttle1:1999, thrust1:9.47, throttle2:1999, thrust2:1, throttle3:0, thrust3:0},
    ]

    //Build Tabulator
    var table = new Tabulator("#example-table", {
        height:"311px",
        data:exampleData,

        //enable range selection
        selectableRange:1,
        selectableRangeColumns:true,
        selectableRangeRows:true,
        selectableRangeClearCells:true,

        //change edit trigger mode to make cell navigation smoother
        editTriggerEvent:"dblclick",

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

        rowHeader:{resizable: false, frozen: true, width:40, hozAlign:"center", formatter: "rownum", cssClass:"range-header-col", editor:false},

        //setup cells to work as a spreadsheet
        columnDefaults:{
            headerSort:false,
            headerHozAlign:"center",
            editor:"input",
            resizable:"header",
            width:150,
        },
        columns:[
            {title:"Run 1 Throttle (PWM)", field:"throttle1"},
            {title:"Run 1 Thrust (N)", field:"thrust1"},
            {title:"Run 2 Throttle (PWM)", field:"throttle2"},
            {title:"Run 2 Thrust (N)", field:"thrust2"},
            {title:"Run 3 Throttle (PWM)", field:"throttle3"},
            {title:"Run 3 Thrust (N)", field:"thrust3"},
        ],
    });
}
