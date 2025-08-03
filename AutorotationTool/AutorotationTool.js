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
                      { x:[], y:[], name: 'T2', mode: 'lines', hovertemplate: "<extra></extra>%{x:.2f} s<br>%{y:.2f} s" },
                      { x:[], y:[], name: 'T3', mode: 'lines', hovertemplate: "<extra></extra>%{x:.2f} s<br>%{y:.2f} s" },
                      { x:[], y:[], name: 'Total', mode: 'lines', hovertemplate: "<extra></extra>%{x:.2f} s<br>%{y:.2f} s" }]

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
    headspeed_plot.data = [{ x:[], y:[], name: 'Touchdown End', mode: 'lines', line: {dash: 'dash'}, hoverinfo: 'skip' },
                           { x:[], y:[], name: 'RPM', mode: 'lines', hovertemplate: "<extra></extra>%{x:.2f} s<br>%{y:.2f} RPM" }]

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

function back_predict_v(time_now, tj, Jm, A0, V0)
{
    var Jt = 0.0, At = A0, Vt = V0
    const Alpha = Jm * 0.5;
    const Beta = M_PI / tj;
    Vt = V0 + A0 * time_now + (Alpha * 0.5) * (time_now * time_now) + (Alpha / (Beta * Beta)) * Math.cos(Beta * time_now) - Alpha / (Beta * Beta);
    return Vt;
}

// calculate the jerk, acceleration, velocity and position at time time_now when running the constant jerk time segment
function calc_javp_for_segment_const_jerk(time_now, J0, A0, V0, P0)
{
    const Jt = J0;
    const At = A0 + J0 * time_now;
    const Vt = V0 + A0 * time_now + 0.5 * J0 * (time_now * time_now);
    const Pt = P0 + V0 * time_now + 0.5 * A0 * (time_now * time_now) + (1.0 / 6.0) * J0 * (time_now * time_now * time_now);
    return [Jt, At, Vt, Pt];
}

// helper to calculate the expected final velocity in the trajectory
function calc_final_vel(tj1, jm, a0, a3, v0)
{
    return (2 * jm * tj1**2) + (4 * a0 * tj1) + ((a0**2 - a3**2) / jm) + v0;
}

function calc_section_end_vel(tj, jm, a0, v0)
{
    return v0 + (2 * a0 * tj) + (jm * tj**2);
}

// Helper to calculate the expected final accel in the trajectory
function calc_final_accel(tj1, tj3, jm, a0)
{
    return a0 + jm * (tj1 - tj3);
}

// Helper to calculate the expected final accel in the trajectory
function calc_peak_accel(tj1, jm, a0)
{
    return a0 + jm * tj1;
}

// helper to ensure landing speed is always negative and down
function get_landing_speed()
{
    let landing_speed = parseFloat(document.getElementById("landing_speed").value);
    landing_speed = Math.abs(landing_speed);
    landing_speed = Math.max(landing_speed, 0.2);
    landing_speed *= -1.0;
    return landing_speed
}

// Solving for roots of the continuity equations in the non-accel limited case
function calc_cosine_trajectory_times(a0, v0, a3, v3, jm)
{
    let solution_valid = false;
    let discriminant = 0.5 * ((a0 * a0) + (a3 * a3) + jm * (v3 - v0));
    if (discriminant < 0) {
        console.log('Discrementant is negative')
        return [null, null, solution_valid];
    }

    discriminant = safe_sqrt(discriminant);
    const tj1 = (-a0 + discriminant) / jm;
    const tj3 = (-a3 + discriminant) / jm;

    solution_valid = is_positive(tj1) && is_positive(tj3)

    return [tj1, tj3, solution_valid];
}

function calc_scurve_trajectory_times(a0, v0, p0)
{
    const v3 = get_landing_speed();
    const a3 = 0.0;
    let jm = parseFloat(document.getElementById("max_jerk").value);

    let tj1 = 0, tj2 = 0, tj3 = 0;
    let solution_valid = false;
    // Due to the assumed trajectory shape that has been constructed, we wait for the entry velocity to be <= to the exit condition
    // This reduces the number of scenarios that we need to handle and simplifies the code structure, focusing on the most probable cases.
    // For this application, we can simply wait for the descent rate to increase which is an assured thing in an autorotation.
    if (v0 > v3) {
        console.log("initial conditions not suitable to enter touch down")
        return [tj1, tj2, tj3, solution_valid];
    }

    // start by calculating the unconstrained acceleration trajectory to get the times needed for this case
    [tj1, tj3, solution_valid] = calc_cosine_trajectory_times(a0, v0, a3, v3, jm);

    // See if we need to apply acceleration limiting
    let am = parseFloat(document.getElementById("max_vert_accel").value);
    let a_peak = calc_peak_accel(tj1, jm, a0)
    if (a_peak < am && solution_valid) {
        // we do not need to apply any accel limits, we can begin touch down
        return [tj1, tj2, tj3, solution_valid];
    }

    // If we got this far we either need to apply accel limits or the previously invalid solution my have a solution with this approach
    // Calculate the time periods required to meet the acceleration boundary conditions
    tj1 = (am - a0) / jm;
    tj3 = (am - a3) / jm;

    // Calculate the time required to meet the velocity condition
    tj2 = (v3 - v0 - (2 * a0 * tj1) - (jm * tj1 * tj1) - (2 * a3 * tj3) - (jm * tj3 * tj3)) / am;

    // Check that the exit conditions match our desired conditions
    const T = (tj1 + tj3) * 2 + tj2;
    let [je, ae, ve, pe] = update_trajectory(T, a0, v0, p0, tj1, tj2, tj3)

    const TOL = 1e-5;
    solution_valid = ((Math.abs(ve - v3) < TOL) && (Math.abs(ae - a3) < TOL));

    return [tj1, tj2, tj3, solution_valid];
}

let predicted_position = null;
function should_begin_touchdown(hagl, a0, v0)
{
    // don't log a value for predicted position unless we have calcualtated it.
    predicted_position = null

    // Check max height condition
    const max_flare_height = parseFloat(document.getElementById("touchdown_max_height").value);
    if (hagl > max_flare_height) {
        // We are higher than our guarded height, no need to continue calculation
        return false;
    }

    // Check min height, target speed condition, this case designed for the very low hover autorotation case
    const min_touchdown_height = parseFloat(document.getElementById("touchdown_min_height").value);
    const desired_v3 = get_landing_speed();
    if ((hagl < min_touchdown_height) && (v0 <= desired_v3)) {
        // Set all trajectory times to zero to jump to constant descent rate case
        _tj1 = 0;
        _tj2 = 0;
        _tj3 = 0;
        return true;
    }

    let solution_valid = false;
    [_tj1, _tj2, _tj3, solution_valid] = calc_scurve_trajectory_times(a0, v0, hagl);

    if (!solution_valid) {
        return false;
    }

    // look forward to see if we intersect with the ground before the manouver is complete
    const BUFFER_HEIGHT = 0.5;
    const manouver_time = (_tj1 + _tj3) * 2 + _tj2
    const [j3, a3, v3, p3] = update_trajectory(manouver_time, a0, v0, hagl, _tj1, _tj2, _tj3);
    // log the predicted exit position
    predicted_position = p3
    if (p3 <= BUFFER_HEIGHT) {
        // we need to initiate the manouver now
        return true;
    }

    // Check what time we will have remaining from the touchdown time parameter value
    const td_time = parseFloat(document.getElementById("touchdown_time").value);
    const tj4 = td_time - manouver_time;

    if (tj4 < 0) {
        // invalid time. we already know that we won't intersect the exit position by the end of the manouver so don't start
        console.log('WARNING: Invalid tj4 time. Try increasing touchdown time')
        return false;
    }

    // see if we intersect the ground by the end of the constant velocity phase.
    const p4 = p3 + tj4 * v3;
    if (p4 <= 0.0) {
        // we need to initiate the manouver now
        return true;
    }

    // If we got this far then we do not need to start touchdown manouver yet
    return false;
}



// Crude simulation of heli in free-fall from a hover
function run_freefall_model(t, dt, v0, p0, headspeed_rpm)
{
    if (!in_touchdown) {
        const rotor_rad = parseFloat(document.getElementById("rotor_radius").value);
        const mass = parseFloat(document.getElementById("mass").value);
        const rotor_cd = parseFloat(document.getElementById("rotor_cd").value);

        const rotor_area = M_PI * rotor_rad * rotor_rad; // (m^2)
        const rotor_drag = 0.5 * DENSITY * rotor_area * rotor_cd // (kg/s)

        const weight = mass * -GRAVITY; // (N)
        const drag_direction = Math.sign(v0) * -1.0; // drag always works in the opposite direction to velocity
        const drag_force = rotor_drag * v0 * v0 * drag_direction; // (N)

        // A dumb approximation that accounts for the thrust we will still be creating from the rotor head, the moment we stop the motor.
        // This assumes that we have not moved the rotor's collective and we still create thrust as a function of the headspeed.
        // The head speed decays in the rotor energy model.
        const init_headspeed_rpm = parseFloat(document.getElementById("initial_rpm").value);
        const residual_thrust = weight*-1 * (headspeed_rpm / init_headspeed_rpm)**2;

        const resultant_force = weight + residual_thrust + drag_force; // (N)

        // Assume constant accel/zero jerk
        const jt = 0.0;
        let at = resultant_force / mass;
        const vt = v0 + at * dt;
        const pt = p0 + v0 * dt + 0.5 * at * dt * dt;

        in_touchdown = should_begin_touchdown(pt, at, vt)

        // update the manoeuvre exit time
        touchdown_finished_time = (_tj1 + _tj3) * 2 + _tj2 + touchdown_init.t;

        // keep touch down init conditions up to date
        touchdown_init.t = t
        touchdown_init.a = at
        touchdown_init.v = vt
        touchdown_init.p = pt

        return [jt, at, vt, pt]
    }

    // in the touch down phase
    const td_time = t - touchdown_init.t
    return update_trajectory(td_time, touchdown_init.a, touchdown_init.v, touchdown_init.p, _tj1, _tj2, _tj3);
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

// Calculate the touchdown trajectory
let in_touchdown = false;
let _tj1, _tj2, _tj3;
function run_simple_trajectory_model(t)
{
    A0 = parseFloat(document.getElementById("initial_accel").value);
    V0 = parseFloat(document.getElementById("initial_vel").value);
    P0 = parseFloat(document.getElementById("initial_pos").value);

    if (!in_touchdown) {
        // [_tj1, _tj2, _tj3, in_touchdown] = calc_scurve_trajectory_times(A0, V0, P0);
        in_touchdown = should_begin_touchdown(P0, A0, V0);
        touchdown_finished_time = (_tj1 + _tj3) * 2 + _tj2 + touchdown_init.t;
    }

    return update_trajectory(t, A0, V0, P0, _tj1, _tj2, _tj3);
}


function update_trajectory(t, A0, V0, P0, tj1, tj2, tj3)
{
    const T1 = 2 * tj1;
    const T2 = tj2;
    const T3 = 2 * tj3;
    const Jm = parseFloat(document.getElementById("max_jerk").value);


    // Phase 1
    const t1 = Math.min(t, T1);
    let [J1, A1, V1, P1] = calc_javp_for_segment_incr_jerk(t1, tj1, Jm, A0, V0, P0);

    if ( t <= T1) {
        // We are still in phase 1
        return [J1, A1, V1, P1];
    }

    // Phase 2
    const t2 = Math.min(t - T1, T2);
    let [J2, A2, V2, P2] = calc_javp_for_segment_const_jerk(t2, J1, A1, V1, P1)

    if ( t <= T1 + T2) {
        // We are still in phase 2
        return [J2, A2, V2, P2];
    }

    // Phase 3
    const t3 = Math.min(t - T1 - T2, T3);
    let [J3, A3, V3, P3] = calc_javp_for_segment_incr_jerk(t3, tj3, -Jm, A2, V2, P2);

    if ( t <= T1 + T2 + T3) {
        // we are still in phase 3
        return [J3, A3, V3, P3];
    }

    // Phase 4
    // Constant velocity descent ("after" the touchdown manouver)
    // All being well we arrived here at a nice smooth trajectory so jerk and accel is zero. However, there is a corner case in the 
    // very low hover autorotation where we have to force the jerk and accel to zero so that the vehicle simply does its best to maintain
    // the descent rate and bring the accel under control.
    t4 = t - T1 - T2 - T3
    return calc_javp_for_segment_const_jerk(t4, 0.0, 0.0, V3, P3)
}


// A simple rotor model that approximates expected rotor head energy
function update_rotor_energy_model(dt, imu_accel, Vt, headspeed_rpm)
{
    const blade_inertia = parseFloat(document.getElementById("blade_inertia").value);
    const nBlades = parseFloat(document.getElementById("n_blades").value);
    const rotor_head_inertia = blade_inertia * nBlades;
    let head_energy = 0.5 * rotor_head_inertia * rpm_to_rads(headspeed_rpm)**2;

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

    // We gain some energy from descending
    let power_in = resultant_force * Vt * -1.0; // -1 so that we have +ve power in to descend and -ve to climb

    // update the remaining energy in the head
    head_energy += (power_in - power_required)  * dt;
    // Constrain energy to min 0
    head_energy = Math.max(head_energy, 0.0);

    // From remaining energy approximate the new headspeed
    headspeed_rpm = rads_to_rpm(safe_sqrt(head_energy / (0.5 * rotor_head_inertia)));
    return headspeed_rpm;
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
        this.T3 = [];
        this.TTotal = [];
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


let touchdown_init = {t:0.0, a:0.0, v:0.0, p:0.0};
let touchdown_finished_time = 0;
function run_sim()
{
    // reset globals
    in_touchdown = false;
    _tj1 = null;
    _tj2 = null;
    _tj3 = null;
    predicted_position = null;
    touchdown_finished_time = null;


    const A0 = parseFloat(document.getElementById("initial_accel").value);
    const V0 = parseFloat(document.getElementById("initial_vel").value);
    const P0 = parseFloat(document.getElementById("initial_pos").value);

    // Identify which initial conditions we are using
    let initial_conditions = parseFloat(document.getElementById("initial_conditions_select").value)

    // init a time vector
    const dt = 0.01 // (s)
    let t = 0.0
    const time = []

    var calcd_traj = new Trajectory();
    var ap_imu_accel = [];
    var ap_gravity_adjusted_accel = [];

    // Configure initial conditions
    let Jt = 0.0;
    let At = A0;
    let Vt = V0;
    let Pt = P0;

    
    touchdown_init = {t:0.0, a:0.0, v:0.0, p:0.0};

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

    // remove gravity from measurement in last time step
    let imu_accel = (At + GRAVITY) * -1.0; // positive down
    let grav_adjusted_accel = -(imu_accel + GRAVITY);

    let headspeed_rpm = parseFloat(document.getElementById("initial_rpm").value);
    let headspeed_hist = [];

    // Run simulation
    while (t < 100.0) {

        if (initial_conditions == SCENARIO.HOVER_AUTOROTATION.value) {
            [Jt, At, Vt, Pt] = run_freefall_model(t, dt, Vt, Pt, headspeed_rpm);

        } else if (initial_conditions == SCENARIO.FLARING.value){
            [Jt, At, Vt, Pt] = run_flare_model(flare_sim, dt, t, Jt, At, Vt, Pt)

        } else { //INITIAL_COND
            [Jt, At, Vt, Pt] = run_simple_trajectory_model(t)
        }


        headspeed_rpm = update_rotor_energy_model(dt, imu_accel, Vt, headspeed_rpm)

        // Store variables for plotting time-history
        time.push(t)
        calcd_traj.j.push(Jt);
        calcd_traj.a.push(At);
        calcd_traj.v.push(Vt);
        calcd_traj.p.push(Pt);
        calcd_traj.T1.push(_tj1*2);
        calcd_traj.T2.push(_tj2);
        calcd_traj.T3.push(_tj3*2);
        calcd_traj.TTotal.push((_tj1 + _tj3) * 2 + _tj2);

        headspeed_hist.push(headspeed_rpm);

        // keep track of the touch down prediction height
        P_end_hist.push(predicted_position);

        // Account for the change of reference frame/convention to plot the accelerations
        imu_accel = (At + GRAVITY) * -1.0; // positive down
        grav_adjusted_accel = -(imu_accel + GRAVITY);

        ap_imu_accel.push(imu_accel)
        ap_gravity_adjusted_accel.push(grav_adjusted_accel)

        // hit the ground and flare time has expried, break from simulation
        if (Pt <= 0) {
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
    time_plot.data[2].x = time;
    time_plot.data[2].y = calcd_traj.T3;
    time_plot.data[3].x = time;
    time_plot.data[3].y = calcd_traj.TTotal;
    Plotly.redraw("time_plot");

    const hs_min_max = [Math.min(...headspeed_hist), Math.max(...headspeed_hist)];
    headspeed_plot.data[0].x = touchdown_end_time;
    headspeed_plot.data[0].y = hs_min_max;
    headspeed_plot.data[1].x = time;
    headspeed_plot.data[1].y = headspeed_hist;
    Plotly.redraw("headspeed_plot");
}
