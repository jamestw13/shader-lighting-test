vec3 directionalLight(vec3 lightColor, float lightIntensity, vec3 normal, vec3 lightPosition, vec3 viewDirection) {
  
  vec3 lightDirection = normalize(lightPosition);
  vec3 lightReflection = reflect(- lightDirection, normal);



  // Shading
  float shading = dot(normal, lightDirection);
  shading = max(shading, 0.0);

// Specular
float specular = - dot(lightReflection, viewDirection);
specular = max( 0.0, specular);
specular = pow(specular, 20.0);
  return vec3(specular);
  // return lightColor * lightIntensity * shading;
}