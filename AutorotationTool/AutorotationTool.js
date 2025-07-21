const M_PI = Math.PI
const M_2PI = M_PI * 2.0
const GRAVITY = -9.81; // (m/s/s)

pos_plot = {}
vel_plot = {}
accel_plot = {}
jerk_plot = {}
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
                       { x:[], y:[], name: 'Resultant', mode: 'lines', hovertemplate: "<extra></extra>%{x:.2f} s<br>%{y:.2f} m/s²" },
                       { x:[], y:[], name: 'AP Measurment', mode: 'lines', hovertemplate: "<extra></extra>%{x:.2f} s<br>%{y:.2f} m/s²" }]

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


    // Link all time axis
    link_plot_axis_range([
        ["jerk_plot", "x", "", jerk_plot],
        ["accel_plot", "x", "", accel_plot],
        ["vel_plot", "x", "", vel_plot],
        ["pos_plot", "x", "", pos_plot],
    ])

    // Link plot reset
    link_plot_reset([
        ["jerk_plot", jerk_plot],
        ["accel_plot", accel_plot],
        ["vel_plot", vel_plot],
        ["pos_plot", pos_plot],
    ])
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
    // we compute the trajectory due to the resultant acceleration. In this case that means removing gravity from the measurement then adding it back in after
    a0 = (a0 - GRAVITY) * -1.0  // We need to be carful with signs in the AP implementation as it is not necessarily the same basis as here

    // T1 = 2 * tj1 and T2 = 2 * tj2
    const tj1 = (- a0 + safe_sqrt(0.5 * ((a0 * a0) + (a2 * a2) + jm * (v2 - v0)))) / jm
    const tj2 = (- a2 + safe_sqrt(0.5 * ((a0 * a0) + (a2 * a2) + jm * (v2 - v0)))) / jm
    return [tj1, tj2]
}

function compute_trajectory_times(jm, am, a0, v0, v3)
{
    // we compute the trajectory due to the resultant acceleration. In this case that means removing gravity from the measurement then adding it back in after
    a0 = (a0 - GRAVITY) * -1.0  // We need to be carful with signs in the AP implementation as it is not necessarily the same basis as here

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

// When we change the simulation mode, for convenience we update some of the starting values of the inputs
// then we run the simulation
function update_defaults_then_run()
{
     if (document.getElementById("initial_conditions_cb").checked) {
        // Set default values for flare simulation
        document.getElementById("initial_vel").value = -11.0;
        document.getElementById("initial_pos").value = 50.0;
    } else {
        // Set default values for hover autorotation simulation
        document.getElementById("initial_vel").value = 0.0;
        document.getElementById("initial_pos").value = 8.0;
    }
    run_sim();
}


function run_sim()
{

    const rotor_rad = parseFloat(document.getElementById("rotor_radius").value);
    const rotor_cd = parseFloat(document.getElementById("rotor_cd").value);
    const mass = parseFloat(document.getElementById("mass").value);

    // const A0 = parseFloat(document.getElementById("inital_accel").value);
    const V0 = parseFloat(document.getElementById("initial_vel").value);
    const P0 = parseFloat(document.getElementById("initial_pos").value);

    const A2 = parseFloat(document.getElementById("final_accel").value);
    const V2 = parseFloat(document.getElementById("final_vel").value);
    const P2 = parseFloat(document.getElementById("final_pos").value);

    const Jm = parseFloat(document.getElementById("max_jerk").value);
    const Am = parseFloat(document.getElementById("max_vert_accel").value);

    const density = 1.225; // (kg/m^3)
    const rotor_area = M_PI * rotor_rad * rotor_rad; // (m^2)
    const rotor_drag = 0.5 * density * rotor_area * rotor_cd // (kg/s)

    // init a time vector
    const dt = 0.01 // (s)
    let t = 0.0
    const time = []

    var calcd_traj = new Trajectory();
    var ap_measured_accel = [];
    let Jt = 0.0;
    let At = 0.0;
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
    const TWO_PHASE_METHOD = 0;
    const THREE_PHASE_METHOD = 1;
    let method;
    if (document.getElementById("method_cb").checked) {
        console.log("Three Phase Method Selected");
        method = THREE_PHASE_METHOD
    } else {
        console.log("Two Phase Method Selected");
        method = TWO_PHASE_METHOD
    }

    // Identify which initial conditions we are using
    const HOVER_AUTOROTATION = 0;
    const FLARING = 1;
    let initial_conditions;
    if (document.getElementById("initial_conditions_cb").checked) {
        console.log("Flare Initial Conditions Selected");
        initial_conditions = FLARING;
    } else {
        console.log("Hover Autorotation Conditions Selected");
        initial_conditions = HOVER_AUTOROTATION;
    }

    let measured_accel;

    // Run simulation
    while (t < 100.0) {

        if (!in_touchdown) {

            if (initial_conditions == HOVER_AUTOROTATION) {
                // Crude simulation of heli in hover autorotation
                const weight = mass * GRAVITY; // (N)
                const drag_direction = Math.sign(Vt) * -1.0; // drag always works in the opposite direction to velocity
                const drag_force = rotor_drag * Vt * Vt * drag_direction; // (N)
                const resultant_force = drag_force + weight; // (N)

                // Assume constant accel/zero jerk
                Jt = 0.0;
                At = resultant_force / mass;
                const initial_V = Vt;
                Vt = initial_V + At * dt;
                Pt += initial_V * dt + 0.5 * At * dt * dt;

            } else {
                // Crude simulation starting from steady state glide and flaring 

                if (!flare_sim.started) {
                    // Descend at steady state conditions
                    Jt = 0.0;
                    At = 0.0;
                    const initial_V = Vt;
                    Vt = initial_V + At * dt;
                    Pt += initial_V * dt + 0.5 * At * dt * dt;

                    // Keep flare initial conditions up to date
                    flare_sim.init.a
                    flare_sim.init.t = t;
                    flare_sim.init.a = At;
                    flare_sim.init.v = Vt;
                    flare_sim.init.p = Pt;

                    // Check if we need to progress flare state
                    flare_sim.started = Pt <= flare_sim.start_hgt;

                } else if (!flare_sim.complete) {
                    // Run a single period of S-curve to decelerate the aircraft representing the flare
                    const time_now = t - flare_sim.init.t;
                    [Jt, At, Vt, Pt] = calc_javp_for_segment_incr_jerk(time_now, flare_sim.tj, flare_sim.Jm, flare_sim.init.a, flare_sim.init.v, flare_sim.init.p);

                    // Check if we need to progress flare state
                    flare_sim.complete = time_now >= flare_sim.tj * 2.0;

                    flare_sim.dwell.start = t;

                } else if (!flare_sim.dwell.complete) {
                    // Allow a short dwell period where the aircraft stays at the same acceleration
                    // This matches the behavior we see in real flight
                    const time_now = t - flare_sim.dwell.start;

                    // Dont update jerk or accel
                    const initial_V = Vt;
                    Vt = initial_V + At * dt;
                    Pt += initial_V * dt + 0.5 * At * dt * dt;

                    flare_sim.dwell.complete = time_now >= flare_sim.dwell.time;

                } else {
                    // We may have flared too high in which case we won't have started the touch down so we need to start accelerating to our rotor drag condition
                    const weight = mass * GRAVITY; // (N)
                    const drag_direction = Math.sign(Vt) * -1.0; // drag always works in the opposite direction to velocity
                    const drag_force = rotor_drag * Vt * Vt * drag_direction; // (N)
                    const resultant_force = drag_force + weight; // (N)

                    // Assume a time period that the result force resolve over
                    const jerk_period = 0.2; // (s)

                    delta_A = (resultant_force / mass) - At
                    initial_J = Jt;
                    Jt = delta_A / jerk_period;
                    const initial_A = At;
                    At = initial_A + initial_J * dt;
                    const initial_V = Vt;
                    Vt = initial_V + At * dt + initial_J * dt * dt;
                    Pt += initial_V * dt + 0.5 * At * dt * dt + (1/6) * initial_J * dt * dt * dt;
                }

            }


            // Account for the change of reference frame/convention to plot the acceleration as we would expect AP to see it
            measured_accel = (At * -1.0) + GRAVITY;

            let P_end;
            if (method == TWO_PHASE_METHOD) {
                // Calculate the s-curve trajectory look forward position
                [tj1, tj2] = compute_time_split(Jm, measured_accel, A2, Vt, V2)
                const T_end = (tj1 + tj2) * 2.0;
                [, , , P_end] = arot_calculated_s_curve(T_end, tj1, tj2, At, Vt, Pt, Jm);
                P_end_hist.push(P_end);

            } else {
                [tj1, tj2, jm23] = compute_trajectory_times(Jm, Am, measured_accel, Vt, V2);
                const T_end = (tj1 + tj2 + tj2) * 2.0;
                [, , , P_end] = arot_calculated_3phase_s_curve(T_end, tj1, tj2, At, Vt, Pt, Jm, jm23)
                P_end_hist.push(P_end);
            }

            in_touchdown = P_end <= P2;
            // keep flare init up to date
            touchdown_init.t = t;
            touchdown_init.a = At;
            touchdown_init.v = Vt;
            touchdown_init.p = Pt;

        } else if (!touchdown_finished) {
            const flare_time = t - touchdown_init.t;

            if (method == TWO_PHASE_METHOD) {
                [Jt, At, Vt, Pt] = arot_calculated_s_curve(flare_time, tj1, tj2, touchdown_init.a, touchdown_init.v, touchdown_init.p, Jm);
                // Check if we meet the exit conditions for the flare
                touchdown_finished = t >= touchdown_init.t + (tj1 + tj2) * 2.0
                
            } else {
                [Jt, At, Vt, Pt] = arot_calculated_3phase_s_curve(flare_time, tj1, tj2, touchdown_init.a, touchdown_init.v, touchdown_init.p, Jm, jm23)
                // Check if we meet the exit conditions for the flare
                touchdown_finished = t >= touchdown_init.t + (tj1 + tj2 + tj2) * 2.0
            }

            // Keep account for the change of reference frame/convention to plot the acceleration as we would expect AP to see it
            measured_accel = (At * -1.0) + GRAVITY;

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


        time.push(t)
        calcd_traj.j.push(Jt);
        calcd_traj.a.push(At);
        calcd_traj.v.push(Vt);
        calcd_traj.p.push(Pt);

        ap_measured_accel.push(measured_accel)

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
    jerk_plot.data[0].x = flare_start_time;
    jerk_plot.data[0].y = j_min_max;
    jerk_plot.data[1].x = touchdown_start_time;
    jerk_plot.data[1].y = j_min_max;
    jerk_plot.data[2].x = touchdown_end_time;
    jerk_plot.data[2].y = j_min_max;
    jerk_plot.data[3].x = time;
    jerk_plot.data[3].y = calcd_traj.j;
    Plotly.redraw("jerk_plot");

    const a_min_max = [Math.min(Math.min(...calcd_traj.a), Math.min(...ap_measured_accel)), Math.max(Math.max(...calcd_traj.a), Math.max(...ap_measured_accel))];
    accel_plot.data[0].x = flare_start_time;
    accel_plot.data[0].y = a_min_max;
    accel_plot.data[1].x = touchdown_start_time;
    accel_plot.data[1].y = a_min_max;
    accel_plot.data[2].x = touchdown_end_time;
    accel_plot.data[2].y = a_min_max;
    accel_plot.data[3].x = time;
    accel_plot.data[3].y = calcd_traj.a; // Resultant Accleration
    accel_plot.data[4].x = time;
    accel_plot.data[4].y = ap_measured_accel; // Acceleration as we would see in AP's IMU measuremnt
    Plotly.redraw("accel_plot");

    const v_min_max = [Math.min(...calcd_traj.v), Math.max(...calcd_traj.v)];
    vel_plot.data[0].x = flare_start_time;
    vel_plot.data[0].y = v_min_max;
    vel_plot.data[1].x = touchdown_start_time;
    vel_plot.data[1].y = v_min_max;
    vel_plot.data[2].x = touchdown_end_time;
    vel_plot.data[2].y = v_min_max;
    vel_plot.data[3].x = time;
    vel_plot.data[3].y = calcd_traj.v;
    Plotly.redraw("vel_plot");

    const p_min_max = [Math.min(...calcd_traj.p), Math.max(...calcd_traj.p)];
    pos_plot.data[0].x = flare_start_time;
    pos_plot.data[0].y = p_min_max;
    pos_plot.data[1].x = touchdown_start_time;
    pos_plot.data[1].y = p_min_max;
    pos_plot.data[2].x = touchdown_end_time;
    pos_plot.data[2].y = p_min_max;
    pos_plot.data[3].x = time;
    pos_plot.data[3].y = calcd_traj.p;
    pos_plot.data[4].x = time;
    pos_plot.data[4].y = P_end_hist;
    Plotly.redraw("pos_plot");

}
