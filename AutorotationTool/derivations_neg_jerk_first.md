
## Developing a Trajectory for the Autorotation Touchdown

The negative jerk phase first is voe the case when the initial velocity $v_0$ is larger than the final velocity $v_2$.

Assuming that the trajectory can be flown across three distinct phases:
- **Phase 1**: A negative jerk phase, in which  $0 <= t <= T_{1}$, where $T1 = 2 t_{j1}$, and $t_{j1}$ is the cosine time period of phase 1.
- **Phase 2**: A positive jerk phase, in which  $T_{1} <= t <= T_{1} + T_{2}$, where $T2 = 2 t_{j2}$, and $t_{j2}$ is the cosine time period of phase 2.
- **Phase 2**: A constant velocity phase, in which the vehicle will touch down at the requested land speed

Prescribe a maximum jerk ($j_{m}$) that is the same in both phases.  Then calculate the time periods $t_{j1}$ and $t_{j2}$ thusly:

$$
T_{1}=2\:t_{j1},\quad T_{2}=2\:t_{j2}
$$

$$
a(0)=a_0,\quad v(0)=v_0,
$$

$$
a(T_{1}+T_{2})=a_2,\quad v(T_{1}+T_{2})=v_2,
$$

while enforcing continuity at $t=T_{1}$ for a smooth trajectory.

---

### Phase 1

Jerk:

$$
J_1(t)=-\frac{j_m}{2}\bigl[1-\cos(\beta_1\,t)\bigr],\quad \beta_1=\frac{\pi}{t_{j1}}.
$$

Because $T_{1}=2\,t_{j1}$, the acceleration and velocity equations at $T_{1}$ simplify to become:

$$
a_1 = a(T_{1}) = a_0 - j_m\,t_{j1}, \tag{1}
$$
$$
v_1=v(T_{1}) = v_0 + 2\,a_0\,t_{j1} - j_m\,t_{j1}^2. \tag{2}
$$

---

### Phase 2

Reverse jerk:

$$
J_2(t)=+\frac{j_m}{2}\bigl[1-\cos(\beta_2\,(t-T_{1}))\bigr],\quad \beta_2=\frac{\pi}{t_{j2}}.
$$

Similarly, because $T_{2}=2\,t_{j2}$, the acceleration and velocity equations at $T_{2}$ simplify to become::

$$
a_2 = a_1 + j_m\,t_{j2}, \tag{3}
$$
$$
v_2 = v_1 + 2\,a_1\,t_{j2} + j_m\,t_{j2}^2. \tag{4}
$$

---

### Enforcing end‑conditions

#### Acceleration Continuity:

Ensure acceleration continuity. by rearranging (3) to obtain an expression for $a_{1}$:

$$
a_1 = a_2 - j_m\,t_{j2}
$$

which is equal to (1):

$$
a_0 - j_m\,t_{j1} = a_2 - j_m\,t_{j2}
$$

rearranges and simplifies to get:

$$
t_{j2} = t_{j1}+\frac{a_2-a_0}{j_m} \tag{5}
$$

#### Velocity Continuity:

Ensuring velocity continuity, rearrange (4) to get an expression for $v_{1}$:

$$
v_1 = v_2 -2\,a_1\,t_{j2} - j_m\,t_{j2}^2.
$$

This is equal to (2):

$$
v_2 -2\,a_1\,t_{j2} - j_m\,t_{j2}^2 = v_0 + 2\,a_0\,t_{j1} - j_m\,t_{j1}^2
$$

$$
v_2 - v_0 - 2\,a_1\,t_{j2} - j_m\,t_{j2}^2 - 2\,a_0\,t_{j1} + j_m\,t_{j1}^2 = 0 \tag{6}
$$

Substitution of (5) into (6):

$$
v_2 - v_0 - 2\,a_1 \left( t_{j1}+\frac{a_2-a_0}{j_m}\right) - j_m \left( t_{j1}+\frac{a_2-a_0}{j_m}\right)^2 - 2\,a_0\,t_{j1} + j_m\,t_{j1}^2 = 0
$$

defining:

$$
\Delta v=v_2-v_0,\quad \Delta a=a_2-a_0,
$$

and substitution to yield:

$$
\Delta v - 2\,a_1 \left( t_{j1}+\frac{\Delta a}{j_m}\right) - j_m \left( t_{j1}+\frac{\Delta a}{j_m}\right)^2 - 2\,a_0\,t_{j1} + j_m\,t_{j1}^2 = 0
$$

$$
\Delta v - 2\,a_1\,t_{j1} - 2\,a_1\,\frac{\Delta a}{j_m} - j_m \left(t_{j1}^2 + 2\,t_{j1}\,\frac{\Delta a}{j_m} + \frac{\Delta a^2}{j_m^2}\right) - 2\,a_0\,t_{j1} + j_m\,t_{j1}^2 = 0
$$

$$
\Delta v - 2\,a_1\,t_{j1} - 2\,a_1\,\frac{\Delta a}{j_m} - j_m\,t_{j1}^2 - 2\,t_{j1}\,\Delta a - \frac{\Delta a^2}{j_m} - 2\,a_0\,t_{j1} + j_m\,t_{j1}^2 = 0
$$

Multiply through by $j_m$ and simplify:

$$
\Delta v \, j_m - 2\,a_1\,j_m\,t_{j1} - 2\,a_1\,\Delta a - j_m^2\,t_{j1}^2 - 2\,j_m\,t_{j1}\,\Delta a - \Delta a^2 - 2\,j_m\,a_0\,t_{j1} + j_m^2\,t_{j1}^2 = 0
$$

$$
\Delta v \, j_m - 2\,a_1\,\Delta a - 2\,a_1\,j_m\,t_{j1} - 2\,j_m\,t_{j1}\,\Delta a - \Delta a^2 - 2\,j_m\,a_0\,t_{j1} = 0
$$

substitute in (1) and expand:
a_1 = a_0 - j_m\,t_{j1}
$$
\Delta v \, j_m - 2\,\Delta a\,(a_0 - j_m\,t_{j1}) - 2\,j_m\,t_{j1}\,(a_0 - j_m\,t_{j1}) - 2\,j_m\,t_{j1}\,\Delta a - \Delta a^2 - 2\,j_m\,a_0\,t_{j1} = 0
$$

$$
\Delta v \, j_m - 2\,\Delta a\,a_0 + 2\,\Delta a\,j_m\,t_{j1} - 2\,j_m\,t_{j1}\,a_0 + 2\,j_m^2\,t_{j1}^2 - 2\,j_m\,t_{j1}\,\Delta a - \Delta a^2 - 2\,j_m\,a_0\,t_{j1} = 0
$$

Multiply by $-1$:

$$
2\,\Delta a\,a_0 - 2\,\Delta a\,j_m\,t_{j1} + 2\,j_m\,t_{j1}\,a_0 - 2\,j_m^2\,t_{j1}^2 + 2\,j_m\,t_{j1}\,\Delta a + \Delta a^2 + 2\,j_m\,a_0\,t_{j1} - \Delta v \, j_m = 0
$$

and Simplify:

$$
-2\,j_m^2\,t_{j1}^2 + 4\,a_0\,j_m\,t_{j1} + 2\,a_0\,\Delta a + \Delta a^2 - \Delta v \, j_m= 0
$$

Noting that $2\,a_0\,\Delta a + \Delta a^2 = a_2^2 - a_0^2$, yielding the quadratic in $t_{j1}$:

$$
- 2\,j_m^2\,t_{j1}^2 + 4\,a_0\,j_m\,t_{j1} + a_2^2 - a_0^2 - j_m \, (v_2 - v_0) = 0
$$

$$
A = - 2\,j_m^2
$$
$$
B = 4\,a_0\,j_m
$$
$$
C = a_2^2 - a_0^2 - j_m \, (v_2 - v_0)
$$

Solve for the positive root to get:

$$
t_{j1} = \frac{-B + \sqrt{B^2 -4AC}}{2A},
$$

$$
t_{j1} = \frac{-4\,a_0\,j_m + \sqrt{16\,a_0^2\,j_m^2 + 8\,j_m^2 (a_2^2 - a_0^2 - j_m \, (v_2 - v_0))}}{- 4\,j_m^2},
$$

$$
t_{j1} = \frac{-4\,a_0\,j_m + \sqrt{16\,a_0^2\,j_m^2 + 8\,j_m^2\,a_2^2 - 8\,j_m^2\,a_0^2 - 8\,j_m^3\,(v_2 - v_0))}}{- 4\,j_m^2},
$$

$$
t_{j1} = \frac{-4\,a_0\,j_m + \sqrt{8\,a_0^2\,j_m^2 + 8\,j_m^2\,a_2^2  - 8\,j_m^3\,(v_2 - v_0))}}{- 4\,j_m^2},
$$

$$
t_{j1} = \frac{-4\,a_0\,j_m + 4 j_m \sqrt{\frac{1}{2}(a_0^2 + a_2^2 - j_m\,(v_2 - v_0))}}{- 4\,j_m^2},
$$

$$
t_{j1} = \frac{a_0 - \sqrt{\frac{1}{2}(a_0^2 + a_2^2 - j_m\,(v_2 - v_0))}}{j_m},
$$

similarly: 

$$
t_{j2} = \frac{a_2 - \sqrt{\frac{1}{2}(a_0^2 + a_2^2 - j_m\,(v_2 - v_0))}}{j_m},
$$



---















