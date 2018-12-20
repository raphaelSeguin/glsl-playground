// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 addComplex(vec2 ad1, vec2 ad2) {
    return vec2(ad1.x + ad2.x, ad1.y + ad2.y);
}
vec2 multComplex(vec2 mu1, vec2 mu2) {
    return vec2((mu1.x * mu2.x) - (mu1.y * mu2.y), (mu1.x * mu2.y) + (mu1.y * mu2.x));
}
vec2 focus(vec2 plane, float zoom, vec2 offset) {
    return (plane*2.- vec2(1., 1.))*zoom  + vec2( offset.x, offset.y);
}
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec2 n_mouse = u_mouse/u_resolution;
    
    // Mandelbrot ou Julia ?
    bool mandel = false; 
    
    // *******************
	// CENTRE
	// *******************
    
	//vec2 center = vec2(-0.74245, 0.11265);
    //vec2 center = vec2(0.240,0.500);
 	//vec2 center = vec2( -0.745428, 0.113009);
	//vec2 center = vec2(-0.16245, 1.0401);
	vec2 center = vec2(-1.25066,0.02012);
    
    float zoom = 1./((pow(n_mouse.x,5.) * 100000.)+.5);
    
    st = focus(st, zoom, mandel ? center : vec2(0., 0.));
    
    vec2 movement = vec2(sin(u_time*0.5)*0.05, cos(u_time*0.5)*0.05);
    
    vec2 point = st;
    for (int i = 0; i < 300; i++) {
        point = addComplex(multComplex(point, point), mandel ? st : center + movement);
    }
    
    // *******************
    // COLORATION
    // *******************
    
    //vec3 color = vec3(length(point)); // N&B
    //vec3 color = hsv2rgb(vec3(length(point), 1., 1.)); // HSB
    vec3 color = hsv2rgb(vec3(distance(point, vec2(-0.890,n_mouse.y)), 1., 1.)); // HSB en fonction de mouseY

    gl_FragColor = vec4(color,1.0);
}