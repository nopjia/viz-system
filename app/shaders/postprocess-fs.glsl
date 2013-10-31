#ifdef GL_ES
precision highp float;
#endif

//---------------------------------------------------------
// MACROS
//---------------------------------------------------------

#define EPS       0.0001
#define PI        3.14159265
#define TWOPI     6.28318530
#define HALFPI    1.57079633
#define OVRTHREE  0.57735027
#define HUGEVAL   1e20

#define EQUALS(A,B) ( abs((A)-(B)) < EPS )
#define EQUALSZERO(A) ( ((A)<EPS) && ((A)>-EPS) )


//---------------------------------------------------------
// SHADER VARS
//---------------------------------------------------------

varying vec2 vUv;

uniform sampler2D uDiffuse;
uniform vec2 uHV;
uniform float uTime;
uniform float uUVDistort;
uniform float uUVLoop;
uniform float uFlash;

// http://www.ozone3d.net/blogs/lab/20110427/glsl-random-generator/
float rand(vec2 n) {
    return fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453);
}

#define FILM_SCOUNT     512.0    // 0-4096
#define FILM_SINTENSITY 0.60     // 0-1
#define FILM_NINTENSITY 0.50      // 0-1
vec3 filmPass(vec3 col) {
  float x = vUv.x * vUv.y * uTime * 1000.0;
  x = mod( x, 13.0 ) * mod( x, 123.0 );
  
  float dx = mod( x, 0.01 );
  
  vec3 cResult = col + col * clamp( 0.1 + dx * 100.0, 0.0, 1.0 );
  vec2 sc = vec2( sin( vUv.y * FILM_SCOUNT ), cos( vUv.y * FILM_SCOUNT ) );
  cResult += col * vec3( sc.x, sc.y, sc.x ) * FILM_SINTENSITY;
  cResult = col + clamp( FILM_NINTENSITY, 0.0,1.0 ) * ( cResult - col );
  
  return cResult;
}


#define BLOOM_TH 0.2
// cut off then remap to 1.0
vec3 doThreshold(vec3 col) {   
  return clamp( (col-BLOOM_TH)/(1.0-BLOOM_TH), 0.0, 1.0 );
  //return (col-BLOOM_TH)/(1.0-BLOOM_TH);
}

#define BLOOM_SIZE  5.0
vec3 myBloomEffect(vec2 newUV) {
  vec3 col = vec3(0.0);
  
  for (float y = -BLOOM_SIZE; y <= BLOOM_SIZE; y++)
  for (float x = -BLOOM_SIZE; x <= BLOOM_SIZE; x++) {
    float ux = newUV.x + x*uHV.x;
    float uy = newUV.y + y*uHV.y;
    
    col += doThreshold(texture2D( uDiffuse, vec2(ux,uy) ).rgb);
  }
  
  float area = BLOOM_SIZE*1.5;
  area = area*area;
  col = col/area;
  
  //return col;
  return col + texture2D(uDiffuse,newUV).rgb*0.5;
  //return 1.0 - (1.0-col)*(1.0-texture2D(uDiffuse,vUv).rgb); // screen
  //return col*col + texture2D(uDiffuse,vUv).rgb;
}

#define DISTORT_FREQ 4.0
#define DISTORT_AMP 0.05
#define DISTORT_TIME_MOVE 100.0
vec2 transformUV(vec2 uv) {
  vec2 newUV = vUv;

  // UV DISTORT
  float rand1 = rand(vec2(uTime,vUv.y));
  float amount = DISTORT_AMP * uUVDistort * rand1 * sin( DISTORT_FREQ*TWOPI*vUv.y + DISTORT_TIME_MOVE*uTime );
  newUV.x += amount;

  // UV LOOP
  newUV.y -= uUVLoop;

  // manual texture wrapping
  return fract(newUV);
}

void main() {
  vec4 col = vec4(myBloomEffect(transformUV(vUv)), 1.0);
  col.rgb = filmPass(col.rgb);

  col.rgb += uFlash;
  
  //col = vec4(doThreshold(texture2D(uDiffuse,vUv).rgb), 1.0);
  //col = texture2D(uDiffuse,vUv);
  //col = vec4(vUv.x, vUv.y, 0.0, 1.0);
  
  gl_FragColor = col;
}