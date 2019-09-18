mat2 rotate(float a) { 
    float c=cos(a), s=sin(a);
    return mat2(c, -s, s, c);
}

float box(vec3 pos, float size) {
	return max(abs(pos.x), max(abs(pos.y), abs(pos.z))) - size;   
}
float map(vec3 pos) {
    pos.yz *= rotate(iTime*0.3 + pos.x);
    pos.x = mod(pos.x, .8) - 0.4;
    pos.xz *= rotate(iTime*0.5 + pos.y);
      
	return box(pos, 0.25);
}                   

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;
    uv = uv * 2. - 1.;
    uv.x *= iResolution.x/iResolution.y;
	
    float circle = length(uv) - 0.5;
    circle = smoothstep( 0., 0.01, circle);
    
    vec3 eye = vec3(0., 0., -10.);
    vec3 ray = normalize(vec3(uv, 0.) - eye);
    vec3 shade = vec3(0., 0., 0.);
    
    for (int i = 20; i > 0; --i) {
    	float d = map(eye);
        if (d < 0.001) {
            shade = vec3(float(i)/20.);
            break;
        }
        eye += ray * d;
    }
    
    // Output to screen
    fragColor = vec4(shade,1.0);
}