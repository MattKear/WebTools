const M_PI = Math.PI;
const M_2PI = M_PI * 2.0;
const GRAVITY = 9.81; // (m/s/s)
const DENSITY = 1.225; // (kg/m^3)

const METHOD = {
    TWO_PHASE:   {value: 0, label:"Two Phase"},
    THREE_PHASE: {value: 1, label:"Three Phase"},
};

const SCENARIO = {
    INITIAL_COND:       {value: 0, label:"Specified Conditions"},
    HOVER_AUTOROTATION: {value: 1, label:"Hover Autorotation"},
    FLARING:            {value: 2, label:"Flare Phase"},
};

pos_plot = {};
vel_plot = {};
accel_plot = {};
jerk_plot = {};
time_plot = {};
headspeed_plot = {};
function initial_load()
{
    const time_scale_label = "Time (s)";
    let plot;

    // Jerk
    jerk_plot.data = [{ x:[], y:[], name: 'Flare Start', mode: 'lines', line: {dash: 'dash'}, hoverinfo: 'skip' },
                      { x:[], y:[], name: 'Touchdown Start', mode: 'lines', line: {dash: 'dash'}, hoverinfo: 'skip' },
                      { x:[], y:[], name: 'Touchdown End', mode: 'lines', line: {dash: 'dash'}, hoverinfo: 'skip' },
                      { x:[], y:[], name: 'Trajectory', mode: 'lines', hovertemplate: "<extra></extra>%{x:.2f} s<br>%{y:.2f} m/s³" }]

    jerk_plot.layout = {
        legend: { itemclick: false, itemdoubleclick: false, x: 0.85 },
        margin: { b: 50, l: 60, r: 0, t: 20 },
        xaxis: { title: {text: time_scale_label } },
        yaxis: { title: {text: "Jerk (m/s³)" } }
    }

    plot = document.getElementById("jerk_plot")
    Plotly.purge(plot)
    Plotly.newPlot(plot, jerk_plot.data, jerk_plot.layout, { displaylogo: false })

    // Acceleration
    accel_plot.data = [{ x:[], y:[], name: 'Flare Start', mode: 'lines', line: {dash: 'dash'}, hoverinfo: 'skip' },
                       { x:[], y:[], name: 'Touchdown Start', mode: 'lines', line: {dash: 'dash'}, hoverinfo: 'skip' },
                       { x:[], y:[], name: 'Touchdown End', mode: 'lines', line: {dash: 'dash'}, hoverinfo: 'skip' },
                       { x:[], y:[], name: 'AP IMU Measure', mode: 'lines', hovertemplate: "<extra></extra>%{x:.2f} s<br>%{y:.2f} m/s²" },
                       { x:[], y:[], name: 'AP Grav Adjusted', mode: 'lines', hovertemplate: "<extra></extra>%{x:.2f} s<br>%{y:.2f} m/s²" },
                       { x:[], y:[], name: 'Simulation', mode: 'lines', line: {dash: 'dash'}, hovertemplate: "<extra></extra>%{x:.2f} s<br>%{y:.2f} m/s²" }]

    accel_plot.layout = {
        legend: { itemclick: false, itemdoubleclick: false, x: 0.85, y:1.05 },
        margin: { b: 50, l: 60, r: 0, t: 20 },
        xaxis: { title: {text: time_scale_label } },
        yaxis: { title: {text: "Acceleration (m/s²)" } }
    }

    plot = document.getElementById("accel_plot");
    Plotly.purge(plot);
    Plotly.newPlot(plot, accel_plot.data, accel_plot.layout, { displaylogo: false });

    // velocity
    vel_plot.data = [{ x:[], y:[], name: 'Flare Start', mode: 'lines', line: {dash: 'dash'}, hoverinfo: 'skip' },
                     { x:[], y:[], name: 'Touchdown Start', mode: 'lines', line: {dash: 'dash'}, hoverinfo: 'skip' },
                     { x:[], y:[], name: 'Touchdown End', mode: 'lines', line: {dash: 'dash'}, hoverinfo: 'skip' },
                     { x:[], y:[], name: 'Trajectory', mode: 'lines', hovertemplate: "<extra></extra>%{x:.2f} s<br>%{y:.2f} m/s" }];

    vel_plot.layout = {
        legend: { itemclick: false, itemdoubleclick: false, x: 0.85, y: 0.3 },
        margin: { b: 50, l: 60, r: 0, t: 20 },
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
    pos_plot.data = [{ x:[], y:[], name: 'Flare Start', mode: 'lines', line: {dash: 'dash'}, hoverinfo: 'skip' },
                     { x:[], y:[], name: 'Touchdown Start', mode: 'lines', line: {dash: 'dash'}, hoverinfo: 'skip' },
                     { x:[], y:[], name: 'Touchdown End', mode: 'lines', line: {dash: 'dash'}, hoverinfo: 'skip' },
                     { x:[], y:[], name: 'Trajectory', mode: 'lines', hovertemplate: "<extra></extra>%{x:.2f} s<br>%{y:.2f} m" },
                     { x:[], y:[], name: 'Projected Exit', mode: 'lines', hovertemplate: "<extra></extra>%{x:.2f} s<br>%{y:.2f} m" }]

    pos_plot.layout = {
        legend: { itemclick: false, itemdoubleclick: false, x: 0.85},
        margin: { b: 50, l: 60, r: 0, t: 20 },
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

    // trajectory time periods
    time_plot.data = [{ x:[], y:[], name: 'T1', mode: 'lines', hovertemplate: "<extra></extra>%{x:.2f} s<br>%{y:.2f} s" },
                     { x:[], y:[], name: 'T2', mode: 'lines', hovertemplate: "<extra></extra>%{x:.2f} s<br>%{y:.2f} s" }]

    time_plot.layout = {
        legend: { itemclick: false, itemdoubleclick: false, x: 0.85},
        margin: { b: 50, l: 60, r: 0, t: 20 },
        xaxis: { title: {text: time_scale_label } },
        yaxis: { title: {text: "Trajectory Time Period (s)" } },
        shapes: [{
            type: 'line',
            line: { dash: "dot" },
            xref: 'paper',
            x0: 0,
            x1: 1,
            visible: false,
        }]
    }

    plot = document.getElementById("time_plot")
    Plotly.purge(plot)
    Plotly.newPlot(plot, time_plot.data, time_plot.layout, { displaylogo: false })

    // Rotor headspeed
    headspeed_plot.data = [{ x:[], y:[], name: 'RPM', mode: 'lines', hovertemplate: "<extra></extra>%{x:.2f} s<br>%{y:.2f} s" }]

    headspeed_plot.layout = {
        legend: { itemclick: false, itemdoubleclick: false, x: 0.85},
        margin: { b: 50, l: 60, r: 0, t: 20 },
        xaxis: { title: {text: time_scale_label } },
        yaxis: { title: {text: "Estimate Head Speed" } },
        shapes: [{
            type: 'line',
            line: { dash: "dot" },
            xref: 'paper',
            x0: 0,
            x1: 1,
            visible: false,
        }]
    }

    plot = document.getElementById("headspeed_plot")
    Plotly.purge(plot)
    Plotly.newPlot(plot, headspeed_plot.data, headspeed_plot.layout, { displaylogo: false })


    // Link all time axis
    link_plot_axis_range([
        ["jerk_plot", "x", "", jerk_plot],
        ["accel_plot", "x", "", accel_plot],
        ["vel_plot", "x", "", vel_plot],
        ["pos_plot", "x", "", pos_plot],
        ["time_plot", "x", "", time_plot],
        ["headspeed_plot", "x", "", headspeed_plot],
    ])

    // Link plot reset
    link_plot_reset([
        ["jerk_plot", jerk_plot],
        ["accel_plot", accel_plot],
        ["vel_plot", vel_plot],
        ["pos_plot", pos_plot],
        ["time_plot", time_plot],
        ["headspeed_plot", headspeed_plot],
    ])

    // Populate dropdown boxes
    // Selected method
    const sel = document.getElementById('method_select');
    Object.values(METHOD).forEach(({value, label}) => {
        const o = document.createElement('option');
        o.value       = value;
        o.textContent = label;
        sel.appendChild(o);
    });

    // Selected simulation scenario
    const sel2 = document.getElementById('initial_conditions_select');
    Object.values(SCENARIO).forEach(({value, label}) => {
        const o = document.createElement('option');
        o.value       = value;
        o.textContent = label;
        sel2.appendChild(o);
    });
}

function radians(deg)
{
    return deg * (M_PI/180)
}

function degrees(rad)
{
    return rad * (180/M_PI)
}

function rpm_to_rads(rpm)
{
    return (rpm / 60) * M_2PI
}

function rads_to_rpm(rads)
{
    return rads / M_2PI * 60
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
function update_scurve_trajectory(time_now, tj1, tj2, A0, V0, P0, Jm)
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

// special handling function to adapt the enumbent s-curve maths to fit the trajectory of the autorotation
function arot_calculated_3phase_s_curve(time_now, tj1, tj23, A0, V0, P0, Jm1, Jm23)
{
    const T1 = tj1 * 2.0;
    const T2 = tj23 * 2.0;
    let A1, V1, P1;
    let A2, V2, P2;

    // handle the positive jerk (increasing accel in the first half of the flare time)
    if (time_now <= T1) {
        // Phase 1
        return calc_javp_for_segment_incr_jerk(time_now, tj1, Jm1, A0, V0, P0);

    } else if (time_now <= (T1 + T2)) {
        // Phase 2
        const t = time_now - T1;
        // Calc initial conditions for phase 2
        [ , A1, V1, P1] = calc_javp_for_segment_incr_jerk(T1, tj1, Jm1, A0, V0, P0);
        // Calc phase 2 trajectory
        return calc_javp_for_segment_incr_jerk(t, tj23, Jm23, A1, V1, P1);
    }

    // if we got this far then we are doing the negative jerk portion of the trajectory (phase 3)
    // first we need to calculate the initial conditions of the negative trajectory, these are the exit conditions of the 2nd positive jerk trajectory
    [ , A1, V1, P1] = calc_javp_for_segment_incr_jerk(T1, tj1, Jm1, A0, V0, P0);
    [ , A2, V2, P2] = calc_javp_for_segment_incr_jerk(T2, tj23, Jm23, A1, V1, P1);
    const t = time_now - T1 - T2;

    return calc_javp_for_segment_incr_jerk(t, tj23, -Jm23, A2, V2, P2);
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

function calc_scurve_trajectory_times(a0, v0)
{
    const v2 = parseFloat(document.getElementById("final_vel").value);
    const a2 = parseFloat(document.getElementById("final_accel").value);
    const jm = parseFloat(document.getElementById("max_jerk").value);

    // T1 = 2 * tj1 and T2 = 2 * tj2
    const tj1 = (- a0 + safe_sqrt(0.5 * ((a0 * a0) + (a2 * a2) + jm * (v2 - v0)))) / jm
    const tj2 = (- a2 + safe_sqrt(0.5 * ((a0 * a0) + (a2 * a2) + jm * (v2 - v0)))) / jm
    return [tj1, tj2]
}

function should_begin_touchdown(hagl, a0, v0)
{
    const touchdown_max_height = parseFloat(document.getElementById("touchdown_max_height").value);
    if (hagl > touchdown_max_height) {
        return [false, null, null, null];
    }

    // if (v0 > -1.0) {
    //     console.log('Descent vel not below -1.0')
    //     return [false, null, null, null];
    // }

    const [tj1, tj2] = calc_scurve_trajectory_times(a0, v0);

    // console.log(`tj1 = ${tj1}, tj2 = ${tj2}`)

    const jm = parseFloat(document.getElementById("max_jerk").value);
    const BUFFER_HEIGHT = parseFloat(document.getElementById("final_pos").value);

    let trajectory_check;
    let future_pos = null;
    if (is_positive(tj1) && is_positive(tj2)) {
        // Look ahead to end of first phase scurve to get initial conditions for 2nd phase
        const [j1, a1, v1, p1] = calc_javp_for_segment_incr_jerk(tj1 * 2.0, tj1, jm, a0, v0, hagl);

        // Look ahead to end of second phase scurve to get exit conditions
        let j2, a2, v2;
        [j2, a2, v2, future_pos] = calc_javp_for_segment_incr_jerk(tj2 * 2.0, tj2, jm * -1.0, a1, v1, p1);
        // We give ourselves a small buffer to leave some margin for error
        trajectory_check = future_pos <= BUFFER_HEIGHT;

    } else {
        throw new Error ('tj1 or tj2 not positive');
    }

    return [trajectory_check, future_pos, tj1, tj2];
}


function compute_trajectory_times(jm, am, a0, v0, v3)
{
    // Calculate first phase time period to achieve zero acceleration
    tj1 = -a0/jm;

    // Calculate v1 at the exit of the first phase
    [ , , v1, ] = calc_javp_for_segment_incr_jerk(2.0 * tj1, tj1, jm, a0, v0, 0.0);

    // Calculate jm2,3
    jm23 = (2.0 * am * am) / (v3 - v1);

    // Calculate 2nd and 3rd time periods
    tj23 = am / jm23;

    return [tj1, tj23, jm23];
}

// Crude simulation of heli in free-fall from a hover
function run_freefall_model(dt, v0, p0)
{
    const rotor_rad = parseFloat(document.getElementById("rotor_radius").value);
    const rotor_cd = parseFloat(document.getElementById("rotor_cd").value);
    const mass = parseFloat(document.getElementById("mass").value);

    const rotor_area = M_PI * rotor_rad * rotor_rad; // (m^2)
    const rotor_drag = 0.5 * DENSITY * rotor_area * rotor_cd // (kg/s)

    const weight = mass * -GRAVITY; // (N)
    const drag_direction = Math.sign(v0) * -1.0; // drag always works in the opposite direction to velocity
    const drag_force = rotor_drag * v0 * v0 * drag_direction; // (N)
    const resultant_force = drag_force + weight; // (N)

    // Assume constant accel/zero jerk
    const jt = 0.0;
    let at = resultant_force / mass;
    const vt = v0 + at * dt;
    const pt = p0 + v0 * dt + 0.5 * at * dt * dt;

    return [jt, at, vt, pt]
}


// Crude simulation starting from steady state glide and flaring 
function run_flare_model(sim, dt, t, j0, a0, v0, p0)
{
    if (!sim.started) {
        // Descend at steady state conditions
        jt = 0.0;
        at = 0.0;
        vt = v0 + at * dt;
        pt = p0 + v0 * dt + 0.5 * at * dt * dt;

        // Keep flare initial conditions up to date
        sim.init.t = t;
        sim.init.a = at;
        sim.init.v = vt;
        sim.init.p = pt;

        // Check if we need to progress flare state
        sim.started = pt <= sim.start_hgt;

    } else if (!sim.complete) {
        // Run a single period of S-curve to decelerate the aircraft representing the flare
        const time_now = t - sim.init.t;
        [jt, at, vt, pt] = calc_javp_for_segment_incr_jerk(time_now, sim.tj, sim.Jm, sim.init.a, sim.init.v, sim.init.p);

        // Check if we need to progress flare state
        sim.complete = time_now >= sim.tj * 2.0;

        sim.dwell.start = t;

    } else if (!sim.dwell.complete) {
        // Allow a short dwell period where the aircraft stays at the same acceleration
        // This matches the behavior we see in real flight
        const time_now = t - sim.dwell.start;

        // Dont update jerk or accel
        vt = v0 + at * dt;
        pt = p0 + v0 * dt + 0.5 * at * dt * dt;

        sim.dwell.complete = time_now >= sim.dwell.time;

    } else {
        // We may have flared too high in which case we won't have started the touch down so we need to start accelerating to our rotor drag condition
        const rotor_rad = parseFloat(document.getElementById("rotor_radius").value);
        const rotor_cd = parseFloat(document.getElementById("rotor_cd").value);
        const mass = parseFloat(document.getElementById("mass").value);

        const rotor_area = M_PI * rotor_rad * rotor_rad; // (m^2)
        const rotor_drag = 0.5 * DENSITY * rotor_area * rotor_cd; // (kg/s)
        const weight = mass * -GRAVITY; // (N)
        const drag_direction = Math.sign(v0) * -1.0; // drag always works in the opposite direction to velocity
        const drag_force = rotor_drag * v0 * v0 * drag_direction; // (N)
        const resultant_force = drag_force + weight; // (N)

        // Assume a time period that the result force resolve over
        const jerk_period = 0.2; // (s)

        delta_A = (resultant_force / mass) - a0;
        jt = delta_A / jerk_period;
        at = a0 + j0 * dt;
        vt = v0 + a0 * dt + j0 * dt * dt;
        pt = p0 + v0 * dt + 0.5 * at * dt * dt + (1/6) * j0 * dt * dt * dt;
    }

    return [jt, at, vt, pt];
}


class Trajectory
{
    constructor()
    {
        this.j = []; // jerk (m/s/s/s)
        this.a = []; // accel (m/s/s)
        this.v = []; // vel (m/s)
        this.p = []; // pos (m)
        this.T1 = [];
        this.T2 = [];
    }
}

function setInputActive(id, shouldDisable) {
    const input = document.getElementById(id);
    if (!input) return;

    const label = document.querySelector(`label[for="${id}"]`);

    // 1) disable it (makes it non‑interactive and grey by default)
    input.disabled = shouldDisable;

    // 2) optional: tweak appearance for more visual feedback
    if (shouldDisable) {
        input.style.backgroundColor = '#f0f0f0';
        input.style.opacity = '0.6';
        input.style.cursor = 'not-allowed';
        label.style.color = '#636060ff';
    } else {
        input.style.backgroundColor = '';
        input.style.opacity = '';
        input.style.cursor = '';
        label.style.color = '';
    }
}

// When we change the simulation mode, for convenience we update some of the starting values of the inputs
// then we run the simulation
function update_defaults_then_run()
{
    let initial_conditions = parseFloat(document.getElementById("initial_conditions_select").value)
     if (initial_conditions == SCENARIO.FLARING.value) {
        // Set default values for flare simulation
        document.getElementById("initial_vel").value = -11.0;
        document.getElementById("initial_pos").value = 50.0;
    } else {
        // Set default values for hover autorotation simulation
        document.getElementById("initial_vel").value = -0.3;
        document.getElementById("initial_pos").value = 8.5;
    }


    // Enable/Disable inputs based on mode
    const flare_input_ids = ["flare_accel", "flare_time_const", "flare_start_height"]
    flare_input_ids.forEach((id) => {
        const shouldDisable = initial_conditions != SCENARIO.FLARING.value;
        setInputActive(id, shouldDisable);
    });

    run_sim();
}


function run_sim()
{

    // console.log('jerk_plot.data =',  jerk_plot.data);
    // console.log('accel_plot.data =', accel_plot.data);
    // console.log('vel_plot.data  =',  vel_plot.data);
    // console.log('pos_plot.data  =',  pos_plot.data);
    // console.log('time_plot.data =', time_plot.data);

    const A0 = parseFloat(document.getElementById("initial_accel").value);
    const V0 = parseFloat(document.getElementById("initial_vel").value);
    const P0 = parseFloat(document.getElementById("initial_pos").value);

    const V2 = parseFloat(document.getElementById("final_vel").value);
    const P2 = parseFloat(document.getElementById("final_pos").value);

    const Jm = parseFloat(document.getElementById("max_jerk").value);
    const Am = parseFloat(document.getElementById("max_vert_accel").value);

    // Identify which initial conditions we are using
    let initial_conditions = parseFloat(document.getElementById("initial_conditions_select").value)

    // init a time vector
    const dt = 0.01 // (s)
    let t = 0.0
    const time = []

    var calcd_traj = new Trajectory();
    var ap_imu_accel = [];
    var ap_gravity_adjusted_accel = [];
    let Jt = 0.0;

    // At is the "simulation" acceleration.  This is the resultant acceleration that moves a body
    if (initial_conditions == SCENARIO.INITIAL_COND.value) {
        At = A0;
    } else {
        At = -GRAVITY;
    }

    let Vt = V0;
    let Pt = P0;

    let in_touchdown = false;
    let touchdown_finished = false;
    let touchdown_finished_time = 0;
    let touchdown_init = {t:0.0, a:0.0, v:0.0, p:0.0};
    let tj1, tj2;
    let jm23 = 0;

    let P_end_hist = [];

    const flare_sim = {
        started: false,
        complete: false,
        init: {t:0.0, a:0.0, v:0.0, p:0.0},
        Jm: 0,
        start_hgt: parseFloat(document.getElementById("flare_start_height").value),
        tj: parseFloat(document.getElementById("flare_time_const").value),
        Am: parseFloat(document.getElementById("flare_accel").value),
        dwell: {complete:false, start:0, time:0.5} //
    };

    // Calculate the Jm needed for the flare peak accel
    flare_sim.Jm = flare_sim.Am / flare_sim.tj;

    // Identify which method we are using to calculate the trajectory
    let method = parseFloat(document.getElementById("method_select").value)

    // remove gravity from measurement in last time step
    let imu_accel = (At + GRAVITY) * -1.0; // positive down
    let grav_adjusted_accel = -(imu_accel + GRAVITY);

    // Head speed model variables
    const blade_inertia = parseFloat(document.getElementById("blade_inertia").value);
    const nBlades = parseFloat(document.getElementById("n_blades").value);
    const rotor_head_inertia = blade_inertia * nBlades;
    let headspeed_rpm = parseFloat(document.getElementById("initial_rpm").value);
    let head_energy = 0.5 * rotor_head_inertia * rpm_to_rads(headspeed_rpm)**2;
    let headspeed_hist = [];

    // Run simulation
    while (t < 100.0) {


        let P_end;
        if (!in_touchdown) {

            if (initial_conditions == SCENARIO.HOVER_AUTOROTATION.value) {
                [Jt, At, Vt, Pt] = run_freefall_model(dt, Vt, Pt);

            } else if (initial_conditions == SCENARIO.FLARING.value){
                [Jt, At, Vt, Pt] = run_flare_model(flare_sim, dt, t, Jt, At, Vt, Pt)

            } else { //INITIAL_COND
                [Jt, At, Vt, Pt] = [0.0,
                                    (parseFloat(document.getElementById("initial_accel").value) * -1.0) - GRAVITY, // At - Initial accel is defined in the gravity adjust +ve up frame
                                    parseFloat(document.getElementById("initial_vel").value),   // Vt
                                    parseFloat(document.getElementById("initial_pos").value)]   // Pt
            }

            // Calculate the s-curve trajectory look forward position
            [in_touchdown, P_end, tj1, tj2] = should_begin_touchdown(Pt, grav_adjusted_accel, Vt);
            P_end_hist.push(P_end);

            // keep flare init up to date
            touchdown_init.t = t;
            touchdown_init.a = grav_adjusted_accel;
            touchdown_init.v = Vt;
            touchdown_init.p = Pt;

            // we may want to force the touchdown if we are in the specifiy initial conditiond mode
            in_touchdown = in_touchdown || initial_conditions == SCENARIO.INITIAL_COND.value;

        } else if (!touchdown_finished) {
            const flare_time = t - touchdown_init.t;

            [Jt, At, Vt, Pt] = update_scurve_trajectory(flare_time, tj1, tj2, touchdown_init.a, touchdown_init.v, touchdown_init.p, Jm);
            // Check if we meet the exit conditions for the flare
            touchdown_finished = t >= touchdown_init.t + (tj1 + tj2) * 2.0;

            // Add values to keep array length correct
            P_end_hist.push(P2);

            // Keep the flare exit time up to date
            touchdown_finished_time = t;

        } else {
            // Assume constant accel at exit condition (not updating accel and jerk)
            const initial_V = Vt;
            Vt = initial_V + At * dt;
            Pt += initial_V * dt + 0.5 * At * dt * dt;
        }

        // Update approximation of headspeed/energy model (only for case when initial conditions are prescribed)
        if (initial_conditions == SCENARIO.INITIAL_COND.value) {

            const chord = parseFloat(document.getElementById("chord").value);
            const rotor_rad = parseFloat(document.getElementById("rotor_radius").value);
            const solidity = (nBlades * chord) / ( M_PI * rotor_rad)
            const mass = parseFloat(document.getElementById("mass").value);
            const rotor_area = M_PI * rotor_rad ** 2;

            // Calculate the coefficient of thrust needed for the required accel
            const resultant_force = imu_accel * -1.0 * mass;
            const CT = resultant_force / (DENSITY * rotor_area * rotor_rad**2 * rpm_to_rads(headspeed_rpm)**2);

            // Compute power required
            const k = parseFloat(document.getElementById("induced_power_factor").value);
            const cd0 = parseFloat(document.getElementById("blade_cd0").value);
            const Cp = (k * CT ** (3/2)) / safe_sqrt(2) + (solidity * cd0) / 8.0;
            const power_required = Cp * DENSITY * rotor_area * rotor_rad**3 * rpm_to_rads(headspeed_rpm)**3;

            // update the remaining energy in the head
            head_energy -= power_required * dt;
            // Constrain energy to min 0
            head_energy = Math.max(head_energy, 0.0);

            // From remaining energy approximate the new headspeed
            headspeed_rpm = rads_to_rpm(safe_sqrt(head_energy / (0.5 * rotor_head_inertia)));
            headspeed_hist.push(headspeed_rpm)

            // headspeed_hist.push(rpm_to_rads(headspeed_rpm))
        }

        time.push(t)
        calcd_traj.j.push(Jt);
        calcd_traj.a.push(At);
        calcd_traj.v.push(Vt);
        calcd_traj.p.push(Pt);
        calcd_traj.T1.push(tj1*2);
        calcd_traj.T2.push(tj2*2);

        // Account for the change of reference frame/convention to plot the accelerations
        imu_accel = (At + GRAVITY) * -1.0; // positive down
        grav_adjusted_accel = -(imu_accel + GRAVITY);

        ap_imu_accel.push(imu_accel)
        ap_gravity_adjusted_accel.push(grav_adjusted_accel)

        // Break from simulation
        if (touchdown_finished && Pt <= 0) {
            break;
        }

        // update time for the next time step
        t += dt; 
    }

    // Update plots
    const flare_start_time = [flare_sim.init.t, flare_sim.init.t]
    const touchdown_start_time = [touchdown_init.t, touchdown_init.t];
    const touchdown_end_time = [touchdown_finished_time, touchdown_finished_time];

    const j_min_max = [Math.min(...calcd_traj.j), Math.max(...calcd_traj.j)];
    if (initial_conditions == SCENARIO.FLARING.value) {
        jerk_plot.data[0].x = flare_start_time;
        jerk_plot.data[0].y = j_min_max;
    } else {
        jerk_plot.data[0].x = null;
        jerk_plot.data[0].y = null;
    }
    jerk_plot.data[1].x = touchdown_start_time;
    jerk_plot.data[1].y = j_min_max;
    jerk_plot.data[2].x = touchdown_end_time;
    jerk_plot.data[2].y = j_min_max;
    jerk_plot.data[3].x = time;
    jerk_plot.data[3].y = calcd_traj.j;
    Plotly.redraw("jerk_plot");

    const a_min_max = [Math.min(Math.min(...calcd_traj.a), Math.min(...ap_gravity_adjusted_accel), Math.min(...ap_imu_accel)), Math.max(Math.max(...calcd_traj.a), Math.max(...ap_gravity_adjusted_accel), Math.max(...ap_imu_accel))];
    if (initial_conditions == SCENARIO.FLARING.value) {
        accel_plot.data[0].x = flare_start_time;
        accel_plot.data[0].y = a_min_max;
    } else {
        accel_plot.data[0].x = null;
        accel_plot.data[0].y = null;
    }
    accel_plot.data[1].x = touchdown_start_time;
    accel_plot.data[1].y = a_min_max;
    accel_plot.data[2].x = touchdown_end_time;
    accel_plot.data[2].y = a_min_max;
    accel_plot.data[3].x = time;
    accel_plot.data[3].y = ap_imu_accel; // Acceleration as we expect to see in AP's IMU log
    accel_plot.data[4].x = time;
    accel_plot.data[4].y = ap_gravity_adjusted_accel; // Gravity adjusted accel as per position controls conventions
    accel_plot.data[5].x = time;
    accel_plot.data[5].y = calcd_traj.a; // Simulations resultant accleration

    // imu_accel
    Plotly.redraw("accel_plot");

    const v_min_max = [Math.min(...calcd_traj.v), Math.max(...calcd_traj.v)];
    if (initial_conditions == SCENARIO.FLARING.value) {
        vel_plot.data[0].x = flare_start_time;
        vel_plot.data[0].y = v_min_max;
    } else {
        vel_plot.data[0].x = null;
        vel_plot.data[0].y = null;
    }
    vel_plot.data[1].x = touchdown_start_time;
    vel_plot.data[1].y = v_min_max;
    vel_plot.data[2].x = touchdown_end_time;
    vel_plot.data[2].y = v_min_max;
    vel_plot.data[3].x = time;
    vel_plot.data[3].y = calcd_traj.v;
    Plotly.redraw("vel_plot");

    const p_min_max = [Math.min(...calcd_traj.p), Math.max(...calcd_traj.p)];
    if (initial_conditions == SCENARIO.FLARING.value) {
        pos_plot.data[0].x = flare_start_time;
        pos_plot.data[0].y = p_min_max;
    } else {
        pos_plot.data[0].x = null
        pos_plot.data[0].y = null
    }
    pos_plot.data[1].x = touchdown_start_time;
    pos_plot.data[1].y = p_min_max;
    pos_plot.data[2].x = touchdown_end_time;
    pos_plot.data[2].y = p_min_max;
    pos_plot.data[3].x = time;
    pos_plot.data[3].y = calcd_traj.p;
    pos_plot.data[4].x = time;
    pos_plot.data[4].y = P_end_hist;
    Plotly.redraw("pos_plot");


    time_plot.data[0].x = time;
    time_plot.data[0].y = calcd_traj.T1;
    time_plot.data[1].x = time;
    time_plot.data[1].y = calcd_traj.T2;
    Plotly.redraw("time_plot");

    headspeed_plot.data[0].x = time;
    headspeed_plot.data[0].y = headspeed_hist;
    Plotly.redraw("headspeed_plot");
}
