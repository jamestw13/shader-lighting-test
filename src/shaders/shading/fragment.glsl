uniform vec3 uColor;
uniform vec3 uAmbientLightColor;
uniform vec3 uDirectionalLightColor;
uniform vec3 uPointLight1Color;
uniform vec3 uPointLight2Color;
uniform float uAmbientLightIntensity;
uniform float uDirectionalLightIntensity;
uniform float uPointLight1Intensity;
uniform float uPointLight2Intensity;

varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/ambientLight.glsl;
#include ../includes/directionalLight.glsl;
#include ../includes/pointLight.glsl;

void main()
{
    
    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 color = uColor;

    // Light
    vec3 light = vec3(0.0);
    
    light += ambientLight(
        uAmbientLightColor,          // light color
        uAmbientLightIntensity               // light intensity
        );
    
    light += directionalLight(
        uDirectionalLightColor,   // light color
        uDirectionalLightIntensity,                   // light intensity
        normal,               // Normal
        vec3(0.0, 0.0, 3.0),   // Light position
        viewDirection,         // Fragment position
        20.0                   // Specular intensity
        );
    
    light += pointLight(
        uPointLight1Color,   // light color
        uPointLight1Intensity,                   // light intensity
        normal,               // Normal
        vec3(0.0, 2.5, 0.0),   // Light position
        viewDirection,         // Fragment position
        20.0,                  // Specular intensity
        vPosition,
        0.25
        );
    
    light += pointLight(
        uPointLight2Color,   // light color
        uPointLight2Intensity,                   // light intensity
        normal,               // Normal
        vec3(2.0, 2.0, 2.0),   // Light position
        viewDirection,         // Fragment position
        20.0,                  // Specular intensity
        vPosition,
        0.25
        );
    
    color *= light;

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}