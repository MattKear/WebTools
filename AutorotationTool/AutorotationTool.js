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
    jerk_plot.data = [{ mode: 'lines', hovertemplate: "<extra></extra>%{x:.2f} s<br>%{y:.2f} deg/s²" }]

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
    accel_plot.data = [{ mode: 'lines', hovertemplate: "<extra></extra>%{x:.2f} s<br>%{y:.2f} deg/s²" }]

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
    vel_plot.data = [{ mode: 'lines', hovertemplate: "<extra></extra>%{x:.2f} s<br>%{y:.2f} deg/s" }]

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
    pos_plot.data = [{ mode: 'lines', hovertemplate: "<extra></extra>%{x:.2f} s<br>%{y:.2f} deg" }]

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

function get_param_names_for_axi(axi)
{
    let rate_tc = "ACRO_RP_RATE_TC"
    if (axi == "Y") {
        rate_tc = "PILOT_Y_RATE_TC"
    }

    return {
        rate_max: "ATC_RATE_" + axi + "_MAX",
        accel_max: "ATC_ACCEL_" + axi + "_MAX",
        rate_tc
    }
}

function update_axis()
{
    const axi = document.querySelector('input[name="axis"]:checked').value

    const param_set_id = {
        R: ["roll_params", "rp_rate_tc"],
        P: ["pitch_params", "rp_rate_tc"],
        Y: ["yaw_params", "yaw_rate_tc"]
    }

    // Hide all
    for (const ids of Object.values(param_set_id)) {
        for (const id of ids) {
            document.getElementById(id).hidden = true
        }
    }

    // Show the selected
    for (const id of param_set_id[axi]) {
        document.getElementById(id).hidden = false
    }

    return get_param_names_for_axi(axi)
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
    if (time_now <= T*0.5) {
        return calc_javp_for_segment_incr_jerk(time_now, tj, Jm, A0, V0, P0);
    }

    // if we got this far then we are doing the negative jerk portion of the trajectory
    // first we need to calculate the initial conditions of the negative trajectory, these are the exit conditions of the positive jerk trajectory
    let [J1, A1, V1, P1] = calc_javp_for_segment_incr_jerk(T*0.5, T*0.5, Jm, A0, V0, P0);

    // calculate the peak jerk requried to achieve the requested exit conditions
    let JM_sec_phase = calc_peak_jerk_required(T*0.5, A1, Af);
    let t_sec_phase = time_now - T*0.5;
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

    const Af = parseFloat(document.getElementById("final_accel").value);

    const Jm = parseFloat(document.getElementById("max_jerk").value);
    const T = parseFloat(document.getElementById("flare_time").value);

    // init a time vector
    const t = linspace(0.0, T, 1000);

    var traj = new Trajectory();
    for (var i = 0; i < t.length; i++) {
        // calculate the variables for the trajectory
        const [Jt, At, Vt, Pt] = arot_s_curve(t[i], T, Jm, A0, V0, P0, Af);
        traj.j.push(Jt);
        traj.a.push(At);
        traj.v.push(Vt);
        traj.p.push(Pt);
    }

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

function run_attitude()
{
    const param_names = update_axis()
    const mode = update_mode(param_names)

    const desired_pos = wrap_PI(radians(parseFloat(document.getElementById("desired_pos").value)))
    const desired_vel = radians(parseFloat(document.getElementById("desired_vel").value))
    const end_time = parseFloat(document.getElementById("end_time").value)
    const max_time = 20

    const dt = 1/400

    const vel_limit = radians(parseFloat(document.getElementById(param_names.rate_max).value))
    const accel_limit = radians(parseFloat(document.getElementById(param_names.accel_max).value) * 0.01)
    const input_tc = parseFloat(document.getElementById("ATC_INPUT_TC").value)
    const rate_tc = parseFloat(document.getElementById(param_names.rate_tc).value)

    const pos_tol = radians(0.1)
    const vel_tol = radians(0.1)

    // Initial state
    let time = [0]
    let pos = [wrap_PI(radians(parseFloat(document.getElementById("initial_pos").value)))]
    let vel = [radians(parseFloat(document.getElementById("initial_vel").value))]
    let accel = [0]

    // Run until current reaches target
    let i = 1
    let done_time
    while(true) {

        let vel_target
        if (mode.use_pos) {

            let desired_vel_plot = 0
            let max_vel_plot = 0
            if (mode.use_vel) {
                desired_vel_plot = desired_vel
                max_vel_plot = vel_limit
            }
            const pos_error = wrap_PI(desired_pos - pos[i-1])
            vel_target = input_shaping_angle(pos_error, input_tc, accel_limit, vel[i-1], desired_vel_plot, max_vel_plot, dt)

        } else if (mode.use_vel) {
            vel_target = input_shaping_vel_plot(vel[i-1], desired_vel, accel_limit, dt, rate_tc)
        }

        if (is_positive(vel_limit)) {
            vel_target = constrain_float(vel_target, -vel_limit, vel_limit)
        }

        // update velocity
        vel[i] = vel_target

        // Integrate to position
        pos[i] = wrap_PI(pos[i-1] + (vel[i-1] + vel_target) * dt * 0.5)

        // Differentiate to accel
        accel[i] = (vel_target - vel[i-1]) / dt

        // update time
        time[i] = i * dt

        // Check if the target has been reached
        if (done_time == null) {
            let done = false
            if (mode.use_pos) {
                done = Math.abs(wrap_PI(desired_pos - pos[i])) < pos_tol

            } else if (mode.use_vel) {
                done = Math.abs(desired_vel - vel[i]) < vel_tol
            }
            if (done) {
                done_time = time[i]
            }

        } else {
            if (time[i] > Math.max(done_time + 0.5, end_time)) {
                // Run for a short time after completion
                break
            }
        }


        if (time[i] >= max_time) {
            // Reached max time
            break
        }
        i++
    }

    // Convert to degrees
    for (let i = 0; i < pos.length; i++) {
        pos[i] = degrees(pos[i])
        vel[i] = degrees(vel[i])
        accel[i] = degrees(accel[i])
    }

    // Update plots
    pos_plot.data[0].x = time
    pos_plot.data[0].y = pos
    pos_plot.layout.shapes[0].y0 = degrees(desired_pos)
    pos_plot.layout.shapes[0].y1 = degrees(desired_pos)
    pos_plot.layout.shapes[0].visible = mode.use_pos
    Plotly.redraw("pos_plot")

    vel_plot.data[0].x = time
    vel_plot.data[0].y = vel
    vel_plot.layout.shapes[0].y0 = degrees(desired_vel)
    vel_plot.layout.shapes[0].y1 = degrees(desired_vel)
    vel_plot.layout.shapes[0].visible = mode.use_vel
    Plotly.redraw("vel_plot")

    accel_plot.data[0].x = time
    accel_plot.data[0].y = accel
    Plotly.redraw("accel_plot")

}