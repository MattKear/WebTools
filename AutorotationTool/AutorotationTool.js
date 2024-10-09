const M_PI = Math.PI
const M_2PI = M_PI * 2.0

pos_plot = {}
vel_plot = {}
accel_plot = {}
jerk_plot = {}
function initial_load()
{
    const time_scale_label = "Time (s)"
    let plot

    // Acceleration
    jerk_plot.data = [{ mode: 'lines', hovertemplate: "<extra></extra>%{x:.2f} s<br>%{y:.2f} m/s³" }]

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
    accel_plot.data = [{ mode: 'lines', hovertemplate: "<extra></extra>%{x:.2f} s<br>%{y:.2f} m/s²" }]

    accel_plot.layout = {
        legend: { itemclick: false, itemdoubleclick: false },
        margin: { b: 50, l: 60, r: 50, t: 20 },
        xaxis: { title: {text: time_scale_label } },
        yaxis: { title: {text: "Acceleration (m/s²)" } }
    }

    plot = document.getElementById("accel_plot")
    Plotly.purge(plot)
    Plotly.newPlot(plot, accel_plot.data, accel_plot.layout, { displaylogo: false })

    // velocity
    vel_plot.data = [{ mode: 'lines', hovertemplate: "<extra></extra>%{x:.2f} s<br>%{y:.2f} m/s" }]

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
    pos_plot.data = [{ mode: 'lines', hovertemplate: "<extra></extra>%{x:.2f} s<br>%{y:.2f} m" }]

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

function calc_seg1_jm(P0, P2, V0, V2, A0, tj)
{
    const t1 = P0 - P2;
    const t2 = (V0 + V2) * tj;
    const t3 = A0 * tj * tj * (1/3 - 1/(M_PI * M_PI));
    const t4 = (M_PI * M_PI) / (tj * tj * tj);
    return (t1 + t2 + t3) / t4;
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

function back_project_position(P0, V0, A0, Alpha, tj) {
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

// Calculate the jerk, acceleration, velocity and position at time time_now when running the decreasing jerk magnitude time segment based on a raised cosine profile
function calc_javp_for_segment_decr_jerk(time_now, tj, Jm, A0, V0, P0)
{
    var Jt = 0.0, At = A0, Vt = V0, Pt = P0;
    if (!is_positive(tj)) {
        return [Jt, At, Vt, Pt];
    }
    const Alpha = Jm * 0.5;
    const Beta = M_PI / tj;
    const AT = Alpha * tj;
    const VT = Alpha * ((tj * tj) * 0.5 - 2.0 / (Beta * Beta));
    const PT = Alpha * ((-1.0 / (Beta * Beta)) * tj + (1.0 / 6.0) * (tj * tj * tj));
    Jt = Alpha * (1.0 - Math.cos(Beta * (time_now + tj)));
    At = (A0 - AT) + Alpha * (time_now + tj) - (Alpha / Beta) * Math.sin(Beta * (time_now + tj));
    Vt = (V0 - VT) + (A0 - AT) * time_now + 0.5 * Alpha * (time_now + tj) * (time_now + tj) + (Alpha / (Beta * Beta)) * Math.cos(Beta * (time_now + tj)) - Alpha / (Beta * Beta);
    Pt = (P0 - PT) + (V0 - VT) * time_now + 0.5 * (A0 - AT) * (time_now * time_now) + (-Alpha / (Beta * Beta)) * (time_now + tj) + (Alpha / 6.0) * (time_now + tj) * (time_now + tj) * (time_now + tj) + (Alpha / (Beta * Beta * Beta)) * Math.sin(Beta * (time_now + tj));
    return [Jt, At, Vt, Pt];
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
    const P0 = parseFloat(document.getElementById("initial_pos").value);

    const A2 = parseFloat(document.getElementById("final_accel").value);
    const V2 = parseFloat(document.getElementById("final_vel").value);
    const P2 = parseFloat(document.getElementById("final_pos").value);

    const Jm = parseFloat(document.getElementById("max_jerk").value);
    const T = parseFloat(document.getElementById("flare_time").value);

    const jm_seg1_est = calc_seg1_jm(P0, P2, V0, V2, A0, T*0.25);
    console.log(jm_seg1_est);

    console.log(`P0 = ${P0}`);
    console.log(`P2 = ${P2}`);
    console.log(`V0 = ${V0}`);
    console.log(`V2 = ${V2}`);

    var pred_P1 = fwd_project_position(P0, V0, A0, 13.0/2.0, T*0.25) // This matches
    console.log(`Predicted P1 = ${pred_P1} m`);

    let [J1_pred, A1_pred, V1_pred, P1_pred] = calc_javp_for_segment_incr_jerk(T*0.5, T*0.25, 19, A2, V2, P2) // --- this is giving the correct answer
    console.log(`javp Predicted P1 = ${P1_pred+0.07599} m`);



    // init a time vector
    const t = linspace(0.0, T, 1000);

    var traj = new Trajectory();
    for (var i = 0; i < t.length; i++) {
        // calculate the variables for the trajectory
        const [Jt, At, Vt, Pt] = arot_s_curve(t[i], T, Jm, A0, V0, P0, A2);
        traj.j.push(Jt);
        traj.a.push(At);
        traj.v.push(Vt);
        traj.p.push(Pt);
    }

    var gpt_alpha1 = calculateAlpha1(P0, P2+traj.p[traj.p.length-1], V0, V2, A0, A2, 19/2, T*0.25) // <------ this works!!!!!!!!!!!!, fuck yeah!
    var jm2 = gpt_alpha1*2
    console.log(`Jm 1 Predicition = ${jm2}`);

    // Update plots
    jerk_plot.data[0].x = t
    jerk_plot.data[0].y = traj.j
    Plotly.redraw("jerk_plot")

    accel_plot.data[0].x = t
    accel_plot.data[0].y = traj.a
    Plotly.redraw("accel_plot")

    vel_plot.data[0].x = t
    vel_plot.data[0].y = traj.v
    Plotly.redraw("vel_plot")

    pos_plot.data[0].x = t
    pos_plot.data[0].y = traj.p
    Plotly.redraw("pos_plot")

}
