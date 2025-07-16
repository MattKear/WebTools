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
function arot_calculated_s_curve(time_now, tj1, tj2, A0, V0, P0, Jm)
{
    const T1 = tj1 * 2.0;

    // handle the positive jerk (increasing accel in the first half of the flare time)
    if (time_now <= T1) {
        return calc_javp_for_segment_incr_jerk(time_now, tj1, Jm, A0, V0, P0);
    }

    // if we got this far then we are doing the negative jerk portion of the trajectory
    // first we need to calculate the initial conditions of the negative trajectory, these are the exit conditions of the positive jerk trajectory
    let [J1, A1, V1, P1] = calc_javp_for_segment_incr_jerk(T1, tj1, Jm, A0, V0, P0);

    let t2 = time_now - T1;

    return calc_javp_for_segment_incr_jerk(t2, tj2, -Jm, A1, V1, P1);
}

// Calculate the jerk, acceleration, velocity and position at time time_now when running the increasing jerk magnitude time segment based on a raised cosine profile
function calc_javp_for_segment_incr_jerk(time_now, tj, Jm, A0, V0, P0)
{
    var Jt = 0.0, At = A0, Vt = V0, Pt = P0;
    // if (!is_positive(tj)) {
    //     return [Jt, At, Vt, Pt];
    // }
    const Alpha = Jm * 0.5;
    const Beta = M_PI / tj;
    Jt = Alpha * (1.0 - Math.cos(Beta * time_now));
    At = A0 + Alpha * time_now - (Alpha / Beta) * Math.sin(Beta * time_now);
    Vt = V0 + A0 * time_now + (Alpha * 0.5) * (time_now * time_now) + (Alpha / (Beta * Beta)) * Math.cos(Beta * time_now) - Alpha / (Beta * Beta);
    Pt = P0 + V0 * time_now + 0.5 * A0 * (time_now * time_now) + (-Alpha / (Beta * Beta)) * time_now + Alpha * (time_now * time_now * time_now) / 6.0 + (Alpha / (Beta * Beta * Beta)) * Math.sin(Beta * time_now);
    return [Jt, At, Vt, Pt];
}

function compute_time_split(jm, a0, a2, v0, v2)
{
    // T1 = 2 * tj1 and T2 = 2 * tj2
    const tj1 = (- a0 + safe_sqrt(0.5 * ((a0 * a0) + (a2 * a2) + jm * (v2 - v0)))) / jm
    const tj2 = (- a2 + safe_sqrt(0.5 * ((a0 * a0) + (a2 * a2) + jm * (v2 - v0)))) / jm
    return [tj1, tj2]
}


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


    console.log(`Inputs:\njm = ${Jm}\na0 = ${A0}\na2 = ${A2}\nv0 = ${V0}\nv2 = ${V2}`)

    // "smart" method
    // variable time periods to compute the necessary trajectory
    const [tj1, tj2] = compute_time_split(Jm, A0, A2, V0, V2)
    const total_time = (tj1+tj2)*2.0
    console.log(`Calculated Time Splits:\nT1 = ${tj1*2.0},\nT2 = ${tj2*2.0},\nTotal T = ${total_time}`)


    // init a time vector
    const t = linspace(0.0, Math.max(T, total_time), 1000);

    var calcd_traj = new Trajectory();
    for (var i = 0; i < t.length; i++) {
        // const sampleT = 0.5*(T1+T2);
        const [Jt, At, Vt, Pt] = arot_calculated_s_curve(t[i], tj1, tj2, A0, V0, P0, Jm);

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
