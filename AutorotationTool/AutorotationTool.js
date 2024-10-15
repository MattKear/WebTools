const M_PI = Math.PI
const M_2PI = M_PI * 2.0

pos_plot = {}
vel_plot = {}
accel_plot = {}
jerk_plot = {}
function initial_load()
{
    const time_scale_label = "Time (s)";
    let plot;

    // Acceleration
    jerk_plot.data = [{ x:[], y:[], name: 'Dumb', mode: 'lines', hovertemplate: "<extra></extra>%{x:.2f} s<br>%{y:.2f} m/s³" },
                      { x:[], y:[], name: 'Smart', mode: 'lines', hovertemplate: "<extra></extra>%{x:.2f} s<br>%{y:.2f} m/s³" }]

    jerk_plot.layout = {
        legend: { itemclick: false, itemdoubleclick: false },
        margin: { b: 50, l: 60, r: 50, t: 20 },
        xaxis: { title: {text: time_scale_label } },
        yaxis: { title: {text: "Jerk (m/s³)" } }
    }

    plot = document.getElementById("jerk_plot")
    Plotly.purge(plot)
    Plotly.newPlot(plot, jerk_plot.data, jerk_plot.layout, { displaylogo: false })

    // Acceleration
    accel_plot.data = [{ x:[], y:[], name: 'Dumb', mode: 'lines', hovertemplate: "<extra></extra>%{x:.2f} s<br>%{y:.2f} m/s²" },
                       { x:[], y:[], name: 'Smart', mode: 'lines', hovertemplate: "<extra></extra>%{x:.2f} s<br>%{y:.2f} m/s²" }]

    accel_plot.layout = {
        legend: { itemclick: false, itemdoubleclick: false },
        margin: { b: 50, l: 60, r: 50, t: 20 },
        xaxis: { title: {text: time_scale_label } },
        yaxis: { title: {text: "Acceleration (m/s²)" } }
    }

    plot = document.getElementById("accel_plot");
    Plotly.purge(plot);
    Plotly.newPlot(plot, accel_plot.data, accel_plot.layout, { displaylogo: false });

    // velocity
    vel_plot.data = [{ x:[], y:[], name: 'Dumb', mode: 'lines', hovertemplate: "<extra></extra>%{x:.2f} s<br>%{y:.2f} m/s" },
                     { x:[], y:[], name: 'Smart', mode: 'lines', hovertemplate: "<extra></extra>%{x:.2f} s<br>%{y:.2f} m/s" }];

    vel_plot.layout = {
        legend: { itemclick: false, itemdoubleclick: false },
        margin: { b: 50, l: 60, r: 50, t: 20 },
        xaxis: { title: {text: time_scale_label } },
        yaxis: { title: {text: "Velocity (m/s)" } },
        shapes: [{
            type: 'line',
            line: { dash: "dot" },
            xref: 'paper',
            x0: 0,
            x1: 1,
            visible: false,
        }]
    }

    plot = document.getElementById("vel_plot")
    Plotly.purge(plot)
    Plotly.newPlot(plot, vel_plot.data, vel_plot.layout, { displaylogo: false })

    // position
    pos_plot.data = [{ x:[], y:[], name: 'Dumb', mode: 'lines', hovertemplate: "<extra></extra>%{x:.2f} s<br>%{y:.2f} m" },
                     { x:[], y:[], name: 'Smart', mode: 'lines', hovertemplate: "<extra></extra>%{x:.2f} s<br>%{y:.2f} m" }]

    pos_plot.layout = {
        legend: { itemclick: false, itemdoubleclick: false },
        margin: { b: 50, l: 60, r: 50, t: 20 },
        xaxis: { title: {text: time_scale_label } },
        yaxis: { title: {text: "Position (m)" } },
        shapes: [{
            type: 'line',
            line: { dash: "dot" },
            xref: 'paper',
            x0: 0,
            x1: 1,
            visible: false,
        }]
    }

    plot = document.getElementById("pos_plot")
    Plotly.purge(plot)
    Plotly.newPlot(plot, pos_plot.data, pos_plot.layout, { displaylogo: false })


    // Link all time axis
    // link_plot_axis_range([
    //     ["jerk_plot", "x", "", jerk_plot],
    //     ["accel_plot", "x", "", accel_plot],
    //     ["vel_plot", "x", "", vel_plot],
    //     ["pos_plot", "x", "", pos_plot],
    // ])

    // Link plot reset
    // link_plot_reset([
    //     ["jerk_plot", jerk_plot],
    //     ["accel_plot", accel_plot],
    //     ["vel_plot", vel_plot],
    //     ["pos_plot", pos_plot],
    // ])
}

function update_mode(params)
{

    // Enable all
    for (const id of Object.values(params)) {
        document.getElementById(id).disabled = false
    }
    document.getElementById("ATC_INPUT_TC").disabled = false
    document.getElementById("desired_pos").disabled = false
    document.getElementById("desired_vel").disabled = false


    const mode = document.querySelector('input[name="mode"]:checked').value
    switch (mode) {
        case "angle":
            document.getElementById(params.rate_tc).disabled = true
            document.getElementById("desired_vel").disabled = true
            return { use_pos: true, use_vel: false }

        case "rate":
            document.getElementById("ATC_INPUT_TC").disabled = true
            document.getElementById("desired_pos").disabled = true
            return { use_pos: false, use_vel: true }

        case "angle+rate":
            document.getElementById(params.rate_tc).disabled = true
            return { use_pos: true, use_vel: true }
    }
}

function radians(deg)
{
    return deg * (M_PI/180)
}

function degrees(rad)
{
    return rad * (180/M_PI)
}

function is_positive(x)
{
    return x > 0.0
}

function is_negative(x)
{
    return x < 0.0
}

function is_zero(x)
{
    return !is_negative(x) && !is_positive(x)
}

function constrain_float(amt, low, high)
{
    if (amt < low) {
        return low
    }

    if (amt > high) {
        return high
    }

    return amt
}

function sq(x)
{
    return Math.pow(x, 2.0)
}

function safe_sqrt(x)
{
    let ret = Math.sqrt(x)
    if (Number.isNaN(ret)) {
        return 0
    }
    return ret
}

function linspace(start, end, num)
{
    const result = [];
    const step = (end - start) / (num - 1);

    for (let i = 0; i < num; i++) {
      result.push(start + (step * i));
    }

    return result;
}

function calc_peak_jerk_required(tj, A0, A1)
{
    return (A1 - A0) * 2.0 / tj;
}

function calculateAlpha1(P0, P2, V0, V2, A0, A2, Alpha2, tj) {
    const pi = Math.PI;

    // Calculate the alpha factor
    const alphaFactor = (4 / 3) - (2 / (pi * pi));

    // Rearranged equation for alpha1
    const numerator = -(P0 - P2) - 2 * (V0 - V2) * tj - 2 * (A0 - A2) * tj * tj;
    const denominator = Math.pow(tj, 3) * alphaFactor;

    const Alpha1 = Alpha2 + (numerator / denominator);

    return Alpha1;
}

function fwd_project_position(P0, V0, A0, alpha1, tj)
{
    return P0 + 2 * V0 * tj + 2 * A0 * tj * tj + alpha1 * tj * tj *tj * (4/3 - 2 / (M_PI * M_PI))
}

function back_project_position(P0, V0, A0, Alpha, tj)
{
    const pi = Math.PI;

    // Calculate terms
    const term1 = P0;
    const term2 = 2 * V0 * tj;
    const term3 = 2 * A0 * tj * tj;
    const term4 = (-2 * Alpha * tj) / (pi * pi);
    const term5 = Alpha * tj * tj * tj * (4 / 3 - 2 / (pi * pi));

    // Calculate the final position
    const Pt = term1 + term2 + term3 + term4 + term5;

    return Pt;
}

function calc_alpha2_from_peak_accel(Am, A0, tj)
{
    return (Am - A0) / (2 * tj)
}

function calc_alpha1_from_peak_accel(Am, A0, tj)
{
    return (Am - A0) / (2 * tj)
}

function calc_alpha2_halfway_conditions(A0, V0, P0, P1, tj)
{
    var alpha = 0
    for (var i = 0; i<1; i++) {
        const numerator = P1 - P0 - (2 * V0 * tj) - (2 * A0 * tj *tj);
        const denominator = tj * tj * tj * (4/3 - 2/(M_PI*M_PI))
        const est = numerator / denominator
        if (alpha == 0) {
            alpha = est;
        } else {
            alpha = alpha*0.8 + est*0.2;
        }
        // calculate the forward projection and adapt the initial connditions
        [J1_est, A1_est, V1_est, P1_est] = calc_javp_for_segment_incr_jerk(tj*2.0, tj, alpha/2, A0, V0, P0);
        const error = P1 - P1_est
        P1 = P1*0.7 + P1_est*0.3
    }
    return alpha
}


function calculateAlpha2_from_diff(P0, P2, V0, V2, A0, A2, Alpha1, tj) {
    const pi = Math.PI;

    // Calculate the alpha factor
    const alphaFactor = (4 / 3) - (2 / (pi * pi));

    // Rearranged equation for alpha1
    const numerator = (P0 - P2) + 2 * (V0 - V2) * tj + 2 * (A0 - A2) * tj * tj;
    const denominator = Math.pow(tj, 3) * alphaFactor;

    const Alpha2 = Alpha1 + (numerator / denominator);

    return Alpha2;
}

// special handling function to adapt the enumbent s-curve maths to fit the trajectory of the autorotation
function arot_s_curve(time_now, T, Jm, A0, V0, P0, Af)
{
    // The 1/4 time is because S-curve definition expects the time period in a different factor to what we need in the autorotation
    tj = T * 0.25;

    // handle the positive jerk (increasing accel in the first half of the flare time)
    if (time_now <= tj*2.0) {
        return calc_javp_for_segment_incr_jerk(time_now, tj, Jm, A0, V0, P0);
    }

    // if we got this far then we are doing the negative jerk portion of the trajectory
    // first we need to calculate the initial conditions of the negative trajectory, these are the exit conditions of the positive jerk trajectory
    let [J1, A1, V1, P1] = calc_javp_for_segment_incr_jerk(tj*2.0, tj, Jm, A0, V0, P0);

    // calculate the peak jerk requried to achieve the requested exit conditions
    let JM_sec_phase = calc_peak_jerk_required(tj*2.0, A1, Af);
    let t_sec_phase = time_now - tj*2.0;
    return calc_javp_for_segment_incr_jerk(t_sec_phase, tj, JM_sec_phase, A1, V1, P1);
}

// special handling function to adapt the enumbent s-curve maths to fit the trajectory of the autorotation
function arot_calculated_s_curve(time_now, T, A0, V0, P0, A2, V2, P2, Jm1, Jm2)
{
    // The 1/4 time is because S-curve definition expects the time period in a different factor to what we need in the autorotation
    tj = T * 0.25;

    // handle the positive jerk (increasing accel in the first half of the flare time)
    if (time_now <= tj*2.0) {
        return calc_javp_for_segment_incr_jerk(time_now, tj, Jm1, A0, V0, P0);
    }

    // if we got this far then we are doing the negative jerk portion of the trajectory
    // first we need to calculate the initial conditions of the negative trajectory, these are the exit conditions of the positive jerk trajectory
    let [J1, A1, V1, P1] = calc_javp_for_segment_incr_jerk(tj*2.0, tj, Jm1, A0, V0, P0);

    let t_sec_phase = time_now - tj*2.0;

    return calc_javp_for_segment_incr_jerk(t_sec_phase, tj, Jm2, A1, V1, P1);
}

// Calculate the jerk, acceleration, velocity and position at time time_now when running the increasing jerk magnitude time segment based on a raised cosine profile
function calc_javp_for_segment_incr_jerk(time_now, tj, Jm, A0, V0, P0)
{
    var Jt = 0.0, At = A0, Vt = V0, Pt = P0;
    if (!is_positive(tj)) {
        return [Jt, At, Vt, Pt];
    }
    const Alpha = Jm * 0.5;
    const Beta = M_PI / tj;
    Jt = Alpha * (1.0 - Math.cos(Beta * time_now));
    At = A0 + Alpha * time_now - (Alpha / Beta) * Math.sin(Beta * time_now);
    Vt = V0 + A0 * time_now + (Alpha * 0.5) * (time_now * time_now) + (Alpha / (Beta * Beta)) * Math.cos(Beta * time_now) - Alpha / (Beta * Beta);
    Pt = P0 + V0 * time_now + 0.5 * A0 * (time_now * time_now) + (-Alpha / (Beta * Beta)) * time_now + Alpha * (time_now * time_now * time_now) / 6.0 + (Alpha / (Beta * Beta * Beta)) * Math.sin(Beta * time_now);
    return [Jt, At, Vt, Pt];
}

// allowing for alpha1, alpha2, and peak accel (A1) to be resolved
function three_var_prediction(P0, P2, V0, V2, A0, A2, tj)
{
    const c1 = 4 / 3 - 2 / (M_PI*M_PI);

    // Calculate alpha1
    const term1 = (V2 - V0) / (2 * tj * tj);
    const term2 = -2 * A0 / tj;
    const term3 = (P2 - P0) / (tj * tj * tj * c1);
    const term4 = 2 * (V2 - V0) / (tj * tj * c1);
    const term5 = 2 * (A2 - A0) / (tj * c1);
    alpha1 = 0.25 * term1 + term2 + term3 + term4 + term5;

    // Calculate alpha2
    const numerator = (P0 - P2) + 2 * (V0 - V2) * tj + 2 * (A0 - A2) * tj * tj;
    const denominator = tj * tj * tj * c1;

    const alpha2 = alpha1 + (numerator / denominator);

    return [alpha1, alpha2];
}


function v4_prediction(A0, A1, V0, V2, tj)
{
    const alpha1 = (A1 - A0) / (2 * tj);

    const term1 = (V2 - V0) / (2 * tj * tj);
    const term2 = (A1 - A0) / tj;
    const alpha2 = term1 + term2 - alpha1;

    return [alpha1, alpha2]
}

// Calculate the jerk, acceleration, velocity and position at time time_now when running the decreasing jerk magnitude time segment based on a raised cosine profile
// function calc_javp_for_segment_decr_jerk(time_now, tj, Jm, A0, V0, P0)
// {
//     var Jt = 0.0, At = A0, Vt = V0, Pt = P0;
//     if (!is_positive(tj)) {
//         return [Jt, At, Vt, Pt];
//     }
//     const Alpha = Jm * 0.5;
//     const Beta = M_PI / tj;
//     const AT = Alpha * tj;
//     const VT = Alpha * ((tj * tj) * 0.5 - 2.0 / (Beta * Beta));
//     const PT = Alpha * ((-1.0 / (Beta * Beta)) * tj + (1.0 / 6.0) * (tj * tj * tj));
//     Jt = Alpha * (1.0 - Math.cos(Beta * (time_now + tj)));
//     At = (A0 - AT) + Alpha * (time_now + tj) - (Alpha / Beta) * Math.sin(Beta * (time_now + tj));
//     Vt = (V0 - VT) + (A0 - AT) * time_now + 0.5 * Alpha * (time_now + tj) * (time_now + tj) + (Alpha / (Beta * Beta)) * Math.cos(Beta * (time_now + tj)) - Alpha / (Beta * Beta);
//     Pt = (P0 - PT) + (V0 - VT) * time_now + 0.5 * (A0 - AT) * (time_now * time_now) + (-Alpha / (Beta * Beta)) * (time_now + tj) + (Alpha / 6.0) * (time_now + tj) * (time_now + tj) * (time_now + tj) + (Alpha / (Beta * Beta * Beta)) * Math.sin(Beta * (time_now + tj));
//     return [Jt, At, Vt, Pt];
// }

class Trajectory
{
    constructor()
    {
        this.j = []; // jerk (m/s/s/s)
        this.a = []; // accel (m/s/s)
        this.v = []; // vel (m/s)
        this.p = []; // pos (m)
    }
}

// function update_initial_position()
// {
//     const P2 = parseFloat(document.getElementById("final_pos").value);
//     const P0 = parseFloat(document.getElementById("initial_pos").value);
//     console.log(P0)
//     console.log(P2)
//     document.getElementById("initial_pos").value = P0 + P2;
//     run_flare()
// }


function run_flare()
{
    const A0 = parseFloat(document.getElementById("inital_accel").value);
    const V0 = parseFloat(document.getElementById("initial_vel").value);
    var P0 = parseFloat(document.getElementById("initial_pos").value);

    const A2 = parseFloat(document.getElementById("final_accel").value);
    const V2 = parseFloat(document.getElementById("final_vel").value);
    const P2 = parseFloat(document.getElementById("final_pos").value);

    const Jm = parseFloat(document.getElementById("max_jerk").value);
    const T = parseFloat(document.getElementById("flare_time").value);
    const AZm = parseFloat(document.getElementById("max_vert_accel").value);

    // var pred_P1 = fwd_project_position(P0, V0, A0, 13.0/2.0, T*0.25) // This matches
    // console.log(`Predicted P1 = ${pred_P1} m`);

    // let [J1_pred, A1_pred, V1_pred, P1_pred] = calc_javp_for_segment_incr_jerk(T*0.5, T*0.25, 19, A2, V2, P2) // --- this is giving the correct answer
    // console.log(`javp Predicted P1 = ${P1_pred+0.07599} m`);

    // init a time vector
    const t = linspace(0.0, T, 1000);



    let alpha2_pred = calc_alpha2_from_peak_accel(AZm, A2, T*0.25);
    let jm2 = alpha2_pred*2.0;
    console.log(`Jm 2 Predicition = ${jm2.toFixed(4)} (m/s³)`);

    var alpha1_pred = calculateAlpha1(P0, P2, V0, V2, A0, A2, alpha2_pred, T*0.25) // <------ this works!!!!!!!!!!!!, fuck yeah!
    var jm1 = alpha1_pred*2;
    console.log(`Jm 1 Predicition = ${jm1.toFixed(4)} (m/s³)`);

    // V2 calculation
    // use the max accel available to apply the breaks
    const alpha_1_v2 = calc_alpha1_from_peak_accel(AZm, A0, T*0.25)
    const jm1_v2 = alpha_1_v2*2.0;
    console.log(`Jm 1 V2 Predicition = ${jm1_v2.toFixed(4)} (m/s³)`);

    // now calculate the alpha2 required to meet my requested exit conditions
    let [J1_v2, A1_v2, V1_v2, P1_v2] = calc_javp_for_segment_incr_jerk(T*0.5, T*0.25, jm1_v2, A0, V0, P0);
    // const alpha_2_v2 = calc_alpha2_halfway_conditions(A2, V2, P2, P1_v2, -T*0.25);
    // const alpha_2_v2 = calc_alpha2_halfway_conditions(A1_v2, V1_v2, P1_v2, P2, T*0.25);
    console.log(P2)
    console.log(V2)
    console.log(A2)
    // const alpha_2_v2 = calculateAlpha2_from_diff(P0, P2, V0, V2, A0, A2, alpha_1_v2, T*0.25) 
    const alpha_2_v2 = calc_alpha1_from_peak_accel(A2, AZm, T*0.25)
    const jm2_v2 = alpha_2_v2*2.0;
    console.log(`Jm 2 V2 Predicition = ${jm2_v2.toFixed(4)} (m/s³)`);

    // we know how far the vehicle will travel, so we will specify the initiating position based on 
    // the final desired position and the projected distance to be traveled
    let [J2_v2, A2_v2, V2_v2, P2_v2] = calc_javp_for_segment_incr_jerk(T*0.5, T*0.25, jm2_v2, A1_v2, V1_v2, P1_v2)
    // update the initial position
    // P0 = P0 - P2_v2
    // console.log(P1_v2)
    // console.log(P2_v2)
    // document.getElementById("initial_pos").value = P0


    let [alpha1_v3, alpha2_v3] = three_var_prediction(P0, P2, V0, V2, A0, A2, T*0.25);
    const jm1_v3 = alpha1_v3*2.0;
    const jm2_v3 = alpha2_v3*2.0;
    console.log(`Jm 1 V3 Predicition = ${jm1_v3.toFixed(4)} (m/s³)`);
    console.log(`Jm 2 V3 Predicition = ${jm2_v3.toFixed(4)} (m/s³)`);


    let [alpha1_v4, alpha2_v5] = v4_prediction(A0, AZm, V0, V2, T*0.25);
    const jm1_v4 = alpha1_v4*2.0;
    const jm2_v4 = alpha2_v5*2.0;
    console.log(`Jm 1 V3 Predicition = ${jm1_v4.toFixed(4)} (m/s³)`);
    console.log(`Jm 2 V3 Predicition = ${jm2_v4.toFixed(4)} (m/s³)`);

    // updated method that calculates the neccassary jerk peaks to achieve the entry and exit conditions
    // "smart" method
    var calcd_traj = new Trajectory();
    for (var i = 0; i < t.length; i++) {
        // calculate the variables for the trajectory
        // const [Jt, At, Vt, Pt] = arot_calculated_s_curve(t[i], T, A0, V0, P0, A2, V2, P2, jm1, -jm2);
        // const [Jt, At, Vt, Pt] = arot_calculated_s_curve(t[i], T, A0, V0, P0, A2, V2, P2, -jm1_v3, jm2_v3);
        const [Jt, At, Vt, Pt] = arot_calculated_s_curve(t[i], T, A0, V0, P0, A2, V2, P2, jm1_v4, -jm2_v4);
        calcd_traj.j.push(Jt);
        calcd_traj.a.push(At);
        calcd_traj.v.push(Vt);
        calcd_traj.p.push(Pt);
    }

    // dumb original method
    var traj = new Trajectory();
    for (var i = 0; i < t.length; i++) {
        // calculate the variables for the trajectory
        const [Jt, At, Vt, Pt] = arot_s_curve(t[i], T, Jm, A0, V0, P0, A2);
        traj.j.push(Jt);
        traj.a.push(At);
        traj.v.push(Vt);
        traj.p.push(Pt);
    }

    // Update plots
    jerk_plot.data[0].x = t
    jerk_plot.data[0].y = traj.j
    jerk_plot.data[1].x = t
    jerk_plot.data[1].y = calcd_traj.j
    Plotly.redraw("jerk_plot")

    accel_plot.data[0].x = t
    accel_plot.data[0].y = traj.a
    accel_plot.data[1].x = t
    accel_plot.data[1].y = calcd_traj.a
    Plotly.redraw("accel_plot")

    vel_plot.data[0].x = t
    vel_plot.data[0].y = traj.v
    vel_plot.data[1].x = t
    vel_plot.data[1].y = calcd_traj.v
    Plotly.redraw("vel_plot")

    pos_plot.data[0].x = t
    pos_plot.data[0].y = traj.p
    pos_plot.data[1].x = t
    pos_plot.data[1].y = calcd_traj.p
    Plotly.redraw("pos_plot")

}
