uniform vec3 uColor;

varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/ambientLight.glsl;
#include ../includes/directionalLight.glsl;

void main()
{
    vec3 vNormal = normalize(vNormal);
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 color = uColor;

    // Light
    vec3 light = vec3(0.0);
    
    light += ambientLight(
        vec3(1.0),          // light color
        0.03                // light intensity
        );
    
    light += directionalLight(
        vec3(0.1, 0.1, 1.0),   // light color
        1.0,                   // light intensity
        vNormal,               // Normal
        vec3(0.0, 0.0, 3.0),   // Light position
        viewDirection,         // Fragment position
        20.0                   // Specular intensity
        );
    
    color *= light;

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}