PostGIS Minimalist Express viewer for Node
====================

Lightweight PostGIS query viewer built on Node


================
This web application for viewing PostGIS http://postgis.net raster queries, geometry via X3D and other output functions like ST_AsSVG 
utilizing PostGIS 2.0+,
 X3DOM http://www.x3dom.org/
, JQuery http://jquery.com, and Node.JS

Node.JS libraries - https://github.com/brianc/node-postgres-pure
Express - http://expressjs.com/

Requirements
--------------
 1. PostGIS 2.0+ (PostGIS 2.1+ with SFCGAL is preferred).  
    Note: if you are on windows, we do have http://postgis.net/windows_downloads for upcoming PostGIS 2.2
	that have SFCGAL https://github.com/Oslandia/SFCGAL built-in.
 2. Node.JS installed

Installation
-----------
1. Extract
2. edit the Settings.js (connString variable to point to your postgress database)
2. At OS shell prompt cd into the extracted folder
3. Run (only need to do this once)
```
npm install express
npm install pg.js 
```

4. Still in OS shell type: which should launch the web server
node postgis_express.js

5. In a web browser go to:
http://localhost:3030

6. Run the ```
SELECT 1``
example which should out 1

<img src="http://www.postgis.us/images/node_postgis_express.png" /> <br />

Examples
---------
For Plain Text you can output SVG for example or any text query:

#Raster Example
Change to PNG (it usally can handle JPEG also)
```
SELECT ST_AsPNG(
  ST_AsRaster(
    ST_Buffer(
        ST_GeomFromText('LINESTRING(50 50,150 150,150 50)'), 10,'join=bevel'), 
        200,200,ARRAY['8BUI', '8BUI', '8BUI'], ARRAY[118,154,118], ARRAY[0,0,0]));
```

#SVG Example
```
SELECT '<svg width="600" height="600">
 <path fill="none" stroke="red" stroke-width="3" transform="translate(' || 
   (-ST_XMin(geom))::text || ', '  || 
  (ST_YMax(geom))::text || ')" d="' || ST_ASSVG(geom) || '"></path>
  </svg>' As svg
FROM (SELECT 
 'LINESTRING(100 200, 250 220, 300 300, 350 100)'::geometry) As f(geom);
 ```

#X3D Example
Toggle output to X3d and run -- click <b>a</b> if image doesn't come into view
```
SELECT '<shape><appearance>
  <material ambientintensity="0.200" containerfield="material" shininess="0.200" diffusecolor="1 0.5 0.6" />
  </appearance>' 
    || replace(ST_AsX3D('TIN(
    ((0 0 0, 1 0 0, 0 1 0, 0 0 0)),
    ((0 0 0, 1 0 0, 0 0 1, 0 0 0)),
    ((0 0 0, 0 0 1, 0 1 0, 0 0 0)),
    ((0 0 1, 1 0 0, 0 1 0, 0 0 1))
            )'::geometry),  
   '<IndexedTriangleSet', '<IndexedTriangleSet solid="false" ') || '</shape>';
```
